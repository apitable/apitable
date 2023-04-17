use super::share_setting::NodeShareSettingService;
use crate::repository::Repository;
use crate::shared::errors::AccessDeniedError;
use crate::shared::services::config::ConfigService;
use crate::shared::services::config::PermissionConfigKind;
use crate::shared::services::rest::RestService;
use crate::shared::types::AuthHeader;
use crate::shared::types::FetchDataPackOrigin;
use crate::shared::types::IdPrefix;
use crate::shared::types::NodePermission;
use crate::shared::types::PermissionRole;
use crate::user::services::user::UserService;
use crate::util::JsonExt;
use crate::util::OptionBoolExt;
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait NodePermService: Interface {
  async fn get_node_permission_set_status(&self, node_id: &str) -> anyhow::Result<bool>;

  async fn get_node_permission(
    &self,
    node_id: &str,
    auth: &AuthHeader,
    origin: &FetchDataPackOrigin,
  ) -> anyhow::Result<NodePermission>;
}

#[derive(Component)]
#[shaku(interface = NodePermService)]
pub struct NodePermServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,

  #[shaku(inject)]
  node_share_setting_service: Arc<dyn NodeShareSettingService>,

  #[shaku(inject)]
  config_service: Arc<dyn ConfigService>,

  #[shaku(inject)]
  rest_service: Arc<dyn RestService>,

  #[shaku(inject)]
  user_service: Arc<dyn UserService>,
}

#[async_trait]
impl NodePermService for NodePermServiceImpl {
  async fn get_node_permission_set_status(&self, node_id: &str) -> anyhow::Result<bool> {
    let mut client = self.repo.get_client().await?;
    Ok(
      client
        .query_one(
          format!(
            "\
                SELECT COUNT(1) AS `count` \
                FROM `{prefix}node_permission` \
                WHERE `node_id` = :node_id",
            prefix = self.repo.table_prefix()
          ),
          params! {
            node_id
          },
        )
        .await
        .with_context(|| format!("get node permission set status {node_id}"))?
        .map_or(false, |count: i64| count > 0),
    )
  }

  async fn get_node_permission(
    &self,
    node_id: &str,
    auth: &AuthHeader,
    origin: &FetchDataPackOrigin,
  ) -> anyhow::Result<NodePermission> {
    if origin.internal {
      tracing::info!("On-space access nodeId: {node_id}");
      // On-space form
      if origin.form.is_truthy() {
        let field_permission_map = self
          .rest_service
          .get_field_permission(auth, node_id, origin.share_id.as_deref())
          .await
          .with_context(|| format!("get field permission {node_id}"))?;
        let default_permissions = self
          .config_service
          .default_permission(PermissionConfigKind::Editor)
          .context("get default editor permission")?
          .clone();
        return Ok(NodePermission {
          has_role: true,
          role: PermissionRole::Editor.as_str().to_owned(),
          field_permission_map: Some(field_permission_map),
          permissions: Some(default_permissions),
          ..Default::default()
        });
      }

      let permission @ NodePermission { has_role, .. } = self
        .rest_service
        .get_node_permission(auth, node_id, None)
        .await
        .with_context(|| format!("get node permission {node_id}"))?;

      if origin.main.is_truthy() {
        // Main datasheet must check permission
        tracing::info!("Loading main node permission {node_id}");
        if !has_role || !permission.permissions.prop_is_truthy("readable") {
          return Err(
            AccessDeniedError {
              node_id: node_id.to_owned(),
            }
            .into(),
          );
        }
      }
      return Ok(permission);
    }

    // Off-space access: template or share
    if origin.share_id.is_none() {
      tracing::info!("template access {node_id}");
      let default_permissions = self
        .config_service
        .default_permission(PermissionConfigKind::ReadOnly)
        .context("get default read only permission")?
        .clone();
      return Ok(NodePermission {
        has_role: true,
        role: PermissionRole::TemplateVisitor.as_str().to_owned(),
        permissions: Some(default_permissions),
        ..Default::default()
      });
    }

    let cookie = auth.cookie.as_deref().unwrap_or("");
    let has_login = self
      .user_service
      .session(cookie)
      .await
      .with_context(|| format!("get has_login of user cookie [{cookie}], node {node_id}"))?;
    // Unlogged-in, anonymous user permission
    if !has_login {
      tracing::info!("Share access {node_id}, user state: unlogged-in");

      let field_permission_map = self
        .rest_service
        .get_field_permission(auth, node_id, origin.share_id.as_deref())
        .await
        .with_context(|| format!("get field permission {node_id}"))?;

      if origin.main.is_truthy() {
        // Main datasheet returns read-only permission
        let default_permissions = self
          .config_service
          .default_permission(PermissionConfigKind::ReadOnly)
          .context("get default readonly permission")?
          .clone();
        return Ok(NodePermission {
          has_role: true,
          role: PermissionRole::Anonymous.as_str().to_owned(),
          field_permission_map: Some(field_permission_map),
          permissions: Some(default_permissions),
          ..Default::default()
        });
      }

      // Check if linked datasheet is in sharing
      let props = self
        .node_share_setting_service
        .get_share_props(node_id, origin.share_id.as_ref().unwrap())
        .await
        .with_context(|| format!("get share props {node_id}"))?;
      if props.is_some() {
        let default_permissions = self
          .config_service
          .default_permission(PermissionConfigKind::ReadOnly)
          .context("get default readonly permission")?
          .clone();
        return Ok(NodePermission {
          has_role: true,
          role: PermissionRole::Anonymous.as_str().to_owned(),
          field_permission_map: Some(field_permission_map),
          permissions: Some(default_permissions),
          ..Default::default()
        });
      }

      let default_permissions = self
        .config_service
        .default_permission(PermissionConfigKind::Default)
        .context("get default permission")?
        .clone();
      return Ok(NodePermission {
        has_role: true,
        role: PermissionRole::Anonymous.as_str().to_owned(),
        field_permission_map: Some(field_permission_map),
        permissions: Some(default_permissions),
        ..Default::default()
      });
    }

    tracing::info!("Share access {node_id}, user state: logged-in");
    self.get_node_role(node_id, auth, origin.share_id.as_deref()).await
  }
}

impl NodePermServiceImpl {
  async fn get_node_role(
    &self,
    node_id: &str,
    auth: &AuthHeader,
    share_id: Option<&str>,
  ) -> anyhow::Result<NodePermission> {
    // On-space permission
    let Some(share_id) = share_id else {
      return self.rest_service.get_node_permission(auth, node_id, None).await;
    };

    // Obtain share options. If the node is not in sharing (e.g. linked datasheet of shared datasheet), returns default permission
    let mut share_props = None;
    if !share_id.starts_with(IdPrefix::EmbedLink.as_str()) {
      share_props = self
        .node_share_setting_service
        .get_share_props(node_id, share_id)
        .await
        .with_context(|| format!("get share props {node_id}"))?;
      if share_props.is_none() {
        let field_permission_map = self
          .rest_service
          .get_field_permission(auth, node_id, Some(share_id))
          .await
          .with_context(|| format!("get field permission {node_id}"))?;
        let default_permissions = self
          .config_service
          .default_permission(PermissionConfigKind::Default)
          .context("get default permission")?
          .clone();
        return Ok(NodePermission {
          has_role: false,
          role: PermissionRole::Foreigner.as_str().to_owned(),
          field_permission_map: Some(field_permission_map),
          permissions: Some(default_permissions),
          ..Default::default()
        });
      }
    }

    // Permissions of shared node is based on last modifier of the shared node
    let NodePermission {
      user_id,
      uuid,
      field_permission_map,
      is_deleted,
      permissions,
      ..
    } = self
      .rest_service
      .get_node_permission(auth, node_id, Some(share_id))
      .await
      .with_context(|| format!("get node permission {node_id}"))?;
    // Sharing editable. If the sharer does not have editable permission, return default permission.
    if share_props.prop_is_truthy("canBeEdited") {
      if permissions.prop_is_truthy("editable") || is_deleted.is_truthy() {
        let default_permissions = self
          .config_service
          .default_permission(PermissionConfigKind::Editor)
          .context("get default editor permission")?
          .clone();
        return Ok(NodePermission {
          has_role: true,
          role: PermissionRole::Editor.as_str().to_owned(),
          user_id,
          uuid,
          field_permission_map,
          permissions: Some(default_permissions),
          ..Default::default()
        });
      }

      let default_permissions = self
        .config_service
        .default_permission(PermissionConfigKind::Default)
        .context("get default permission")?
        .clone();
      return Ok(NodePermission {
        has_role: false,
        role: PermissionRole::Foreigner.as_str().to_owned(),
        user_id,
        uuid,
        field_permission_map,
        permissions: Some(default_permissions),
        ..Default::default()
      });
    }

    // Not sharing editable. If the sharer does not have editable permission, return default permission
    if !permissions.prop_is_truthy("readable") {
      let default_permissions = self
        .config_service
        .default_permission(PermissionConfigKind::Default)
        .context("get default permission")?
        .clone();
      return Ok(NodePermission {
        has_role: false,
        role: PermissionRole::Foreigner.as_str().to_owned(),
        user_id,
        uuid,
        field_permission_map,
        permissions: Some(default_permissions),
        ..Default::default()
      });
    }

    let default_permissions = self
      .config_service
      .default_permission(PermissionConfigKind::ReadOnly)
      .context("get default readonly permission")?
      .clone();
    return Ok(NodePermission {
      has_role: true,
      role: PermissionRole::Foreigner.as_str().to_owned(),
      user_id,
      uuid,
      field_permission_map,
      permissions: Some(default_permissions),
      ..Default::default()
    });
  }
}

#[cfg(test)]
pub mod mock {
  use super::*;
  use crate::types::{HashMap, HashSet};
  use anyhow::anyhow;

  #[derive(Component, Default)]
  #[shaku(interface = NodePermService)]
  pub struct MockNodePermServiceImpl {
    perm_set: HashSet<&'static str>,
    permissions: HashMap<(&'static str, FetchDataPackOrigin), NodePermission>,
  }

  impl MockNodePermServiceImpl {
    pub fn new() -> Self {
      Self::default()
    }

    #[allow(unused)]
    pub fn with_perm_set_status(mut self, perm_set: HashSet<&'static str>) -> Self {
      self.perm_set = perm_set;
      self
    }

    pub fn with_permissions(
      mut self,
      permissions: HashMap<(&'static str, FetchDataPackOrigin), NodePermission>,
    ) -> Self {
      self.permissions = permissions;
      self
    }

    pub fn build(self) -> Box<dyn NodePermService> {
      Box::new(self)
    }
  }

  #[async_trait]
  impl NodePermService for MockNodePermServiceImpl {
    async fn get_node_permission_set_status(&self, node_id: &str) -> anyhow::Result<bool> {
      Ok(self.perm_set.contains(node_id))
    }

    async fn get_node_permission(
      &self,
      node_id: &str,
      _auth: &AuthHeader,
      origin: &FetchDataPackOrigin,
    ) -> anyhow::Result<NodePermission> {
      self
        .permissions
        .get(&(node_id, origin.clone()))
        .cloned()
        .ok_or_else(|| anyhow!("node permission ({node_id}, {origin:?}) not exist"))
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::node::services::children::NodeChildrenServiceImpl;
  use crate::node::services::share_setting::NodeShareSettingServiceImpl;
  use crate::repository::mock::MockRepositoryImpl;
  use crate::repository::RepositoryImpl;
  use crate::shared::services::config::mock::MockConfigServiceImpl;
  use crate::shared::services::config::ConfigServiceImpl;
  use crate::shared::services::rest::mock::MockRestServiceImpl;
  use crate::shared::services::rest::RestServiceImpl;
  use crate::user::services::user::UserServiceImpl;
  use mysql_async::Row;
  use serde_json::json;
  use shaku::{module, HasComponent};
  use tokio_test::assert_ok;

  module! {
    TestModule {
      components = [
        NodePermServiceImpl,
        RepositoryImpl,
        NodeShareSettingServiceImpl,
        ConfigServiceImpl,
        RestServiceImpl,
        NodeChildrenServiceImpl,
        UserServiceImpl,
      ],
      providers = []
    }
  }

  fn init_module<I>(results: I) -> TestModule
  where
    I: IntoIterator<Item = Vec<Row>>,
  {
    TestModule::builder()
      .with_component_override(MockRepositoryImpl::new(results))
      .with_component_override(MockConfigServiceImpl::new())
      .with_component_override(
        MockRestServiceImpl::new()
          .with_node_permissions(hashmap! {
            ("dst1", None) => NodePermission {
              has_role: true,
              user_id: Some("1271".into()),
              uuid: Some("1271".into()),
              role: "manager".into(),
              node_favorite: None,
              field_permission_map: None,
              is_ghost_node: None,
              is_deleted: None,
              permissions: Some(json!({
                "readable": true,
                "editable": true,
                "mock": "manager"
              }))
            },
            ("dst2", None) => NodePermission {
              has_role: true,
              user_id: Some("1271".into()),
              uuid: Some("1271".into()),
              role: "manager".into(),
              node_favorite: None,
              field_permission_map: None,
              is_ghost_node: None,
              is_deleted: None,
              permissions: Some(json!({
                "readable": false,
                "editable": false,
                "mock": "foreigner"
              }))
            },
            ("dst3", None) => NodePermission {
              has_role: false,
              user_id: Some("1271".into()),
              uuid: Some("1271".into()),
              role: "manager".into(),
              node_favorite: None,
              field_permission_map: None,
              is_ghost_node: None,
              is_deleted: None,
              permissions: Some(json!({
                "readable": false,
                "editable": false,
                "mock": "foreigner"
              }))
            },
          })
          .build(),
      )
      .build()
  }

  mod get_node_perm_set_status {
    use super::*;
    use crate::repository::mock::{mock_rows, MockSqlLog};
    use mysql_async::consts::ColumnType;
    use pretty_assertions::assert_eq;

    #[tokio::test]
    async fn r#true() {
      let module = init_module([mock_rows([("a", ColumnType::MYSQL_TYPE_LONG)], [[2i64.into()]])]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm_set = assert_ok!(node_perm_service.get_node_permission_set_status("dst1").await);

      assert!(perm_set);

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT COUNT(1) AS `count` \
            FROM `apitable_node_permission` \
            WHERE `node_id` = :node_id LIMIT 1"
            .into(),
          params: params! {
            "node_id" => "dst1",
          },
        }]
      );
    }

    #[tokio::test]
    async fn r#false() {
      let module = init_module([mock_rows([("a", ColumnType::MYSQL_TYPE_LONG)], [[0i64.into()]])]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm_set = assert_ok!(node_perm_service.get_node_permission_set_status("dst1").await);

      assert!(!perm_set);

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT COUNT(1) AS `count` \
            FROM `apitable_node_permission` \
            WHERE `node_id` = :node_id \
            LIMIT 1\
            "
          .into(),
          params: params! {
            "node_id" => "dst1"
          }
        }]
      );
    }
  }

  mod get_node_permission {
    use super::*;
    use pretty_assertions::assert_eq;
    use tokio_test::assert_err;

    #[tokio::test]
    async fn internal_main() {
      let module = init_module([]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: true,
              main: Some(true),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: Some("1271".into()),
          uuid: Some("1271".into()),
          role: "manager".into(),
          node_favorite: None,
          field_permission_map: None,
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": true,
            "mock": "manager"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(repo.take_logs().await, []);
    }

    #[tokio::test]
    async fn internal_main_not_readable() {
      let module = init_module([]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let err = assert_err!(
        node_perm_service
          .get_node_permission(
            "dst2",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: true,
              main: Some(true),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(err.to_string(), "access denied: dst2");

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(repo.take_logs().await, []);
    }

    #[tokio::test]
    async fn internal_main_no_role() {
      let module = init_module([]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let err = assert_err!(
        node_perm_service
          .get_node_permission(
            "dst3",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: true,
              main: Some(true),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(err.to_string(), "access denied: dst3");

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(repo.take_logs().await, []);
    }
  }
}
