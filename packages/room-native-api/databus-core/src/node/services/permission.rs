use super::share_setting::NodeShareSettingService;
use crate::repository::Repository;
use crate::shared::config::ConfigService;
use crate::shared::config::PermissionConfigKind;
use crate::shared::errors::AccessDeniedError;
use crate::shared::rest::RestService;
use crate::shared::types::AuthHeader;
use crate::shared::types::FetchDataPackOrigin;
use crate::shared::types::IdPrefix;
use crate::shared::types::NodePermission;
use crate::shared::types::PermissionRole;
use crate::user::UserService;
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
      tracing::info!(
        "Share access {:?}, node {node_id}, user state: unlogged-in",
        origin.share_id
      );

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

    tracing::info!(
      "Share access {:?}, node {node_id}, user state: logged-in",
      origin.share_id
    );
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
  use crate::node::services::share_setting::NodeShareSettingServiceImpl;
  use crate::repository::mock::{MockRepositoryImpl, MockSqlLog};
  use crate::repository::RepositoryImpl;
  use crate::shared::config::mock::MockConfigServiceImpl;
  use crate::shared::config::ConfigServiceImpl;
  use crate::shared::rest::mock::MockRestServiceImpl;
  use crate::shared::rest::RestServiceImpl;
  use crate::user::UserServiceImpl;
  use crate::{node::services::children::NodeChildrenServiceImpl, repository::mock::mock_rows};
  use mysql_async::Value;
  use mysql_async::{consts::ColumnType, Row};
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
            ("dst1", Some("shr3")) => NodePermission {
              has_role: true,
              user_id: Some("1271".into()),
              uuid: Some("1271".into()),
              role: "manager".into(),
              node_favorite: None,
              field_permission_map: Some(json!({
                "mock": "fld1"
              })),
              is_ghost_node: None,
              is_deleted: None,
              permissions: Some(json!({
                "readable": true,
                "editable": true,
                "mock": "manager"
              }))
            },
            ("dst1", Some("shr4")) => NodePermission {
              has_role: true,
              user_id: Some("1271".into()),
              uuid: Some("1271".into()),
              role: "reader".into(),
              node_favorite: None,
              field_permission_map: Some(json!({
                "mock": "fld2"
              })),
              is_ghost_node: None,
              is_deleted: None,
              permissions: Some(json!({
                "readable": true,
                "editable": false,
                "mock": "reader"
              }))
            },
            ("dst1", Some("shr5")) => NodePermission {
              has_role: true,
              user_id: Some("1271".into()),
              uuid: Some("1271".into()),
              role: "reader".into(),
              node_favorite: None,
              field_permission_map: Some(json!({
                "mock": "fld3"
              })),
              is_ghost_node: None,
              is_deleted: None,
              permissions: Some(json!({
                "readable": false,
                "editable": false,
                "mock": "reader"
              }))
            },
            ("dst1", Some("shr6")) => NodePermission {
              has_role: true,
              user_id: Some("1271".into()),
              uuid: Some("1271".into()),
              role: "reader".into(),
              node_favorite: None,
              field_permission_map: Some(json!({
                "mock": "fld4"
              })),
              is_ghost_node: None,
              is_deleted: None,
              permissions: Some(json!({
                "readable": true,
                "editable": false,
                "mock": "reader"
              }))
            },
          })
          .with_field_permissions(hashmap! {
            ("dst3", None) => json!({
              "fld3w2": {
                "fieldId": "fld3w2",
                "setting": {
                  "formSheetAccessible": false
                },
                "hasRole": true,
                "role": "editor",
                "manageable": true,
                "permission": {
                  "readable": true,
                  "editable": true
                }
              }
            }),
            ("dst1", Some("shr1")) => json!({
              "fld3w2": {
                "fieldId": "fld3w2",
                "setting": {
                  "formSheetAccessible": true
                },
                "hasRole": true,
                "role": "foreigner",
                "manageable": false,
                "permission": {
                  "readable": true,
                  "editable": false
                }
              }
            }),
            ("dst1", Some("shr2")) => json!({
              "fld1w3": {
                "fieldId": "fld1w3",
                "setting": {
                  "formSheetAccessible": true
                },
                "hasRole": true,
                "role": "reader",
                "manageable": false,
                "permission": {
                  "readable": true,
                  "editable": false
                }
              }
            }),
            ("dst1", Some("shr3")) => json!({
              "fld1w5": {
                "fieldId": "fld1w5",
                "setting": {
                  "formSheetAccessible": true
                },
                "hasRole": true,
                "role": "reader",
                "manageable": false,
                "permission": {
                  "readable": true,
                  "editable": false
                }
              }
            }),
          })
          .with_logined(hashset!["u1"])
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

    #[tokio::test]
    async fn internal() {
      let module = init_module([]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst3",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: true,
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
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
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(repo.take_logs().await, []);
    }

    #[tokio::test]
    async fn internal_form() {
      let module = init_module([]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst3",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: true,
              form: Some(true),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "editor".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld3w2": {
              "fieldId": "fld3w2",
              "setting": {
                "formSheetAccessible": false
              },
              "hasRole": true,
              "role": "editor",
              "manageable": true,
              "permission": {
                "readable": true,
                "editable": true
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": true,
            "mock": "editor"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(repo.take_logs().await, []);
    }

    #[tokio::test]
    async fn template() {
      let module = init_module([]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst3",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: false,
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "templateVisitor".into(),
          node_favorite: None,
          field_permission_map: None,
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": false,
            "mock": "readOnly"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(repo.take_logs().await, []);
    }

    #[tokio::test]
    async fn share_main() {
      let module = init_module([]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: false,
              main: Some(true),
              share_id: Some("shr1".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld3w2": {
              "fieldId": "fld3w2",
              "setting": {
                "formSheetAccessible": true
              },
              "hasRole": true,
              "role": "foreigner",
              "manageable": false,
              "permission": {
                "readable": true,
                "editable": false
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": false,
            "mock": "readOnly"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(repo.take_logs().await, []);
    }

    #[tokio::test]
    async fn share_node_shared() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [["dst1".into(), true.into(), json!({ "mock": "shared" }).into()]],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr1".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld3w2": {
              "fieldId": "fld3w2",
              "setting": {
                "formSheetAccessible": true
              },
              "hasRole": true,
              "role": "foreigner",
              "manageable": false,
              "permission": {
                "readable": true,
                "editable": false
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": false,
            "mock": "readOnly"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr1"
          }
        }]
      );
    }

    #[tokio::test]
    async fn share_node_not_shared() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [] as [Vec<Value>; 0],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr2".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld1w3": {
              "fieldId": "fld1w3",
              "setting": {
                "formSheetAccessible": true
              },
              "hasRole": true,
              "role": "reader",
              "manageable": false,
              "permission": {
                "readable": true,
                "editable": false
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": false,
            "editable": false,
            "mock": "default"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr2"
          }
        }]
      );
    }

    #[tokio::test]
    async fn share_node_share_disabled() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [["dst1".into(), false.into(), json!({ "mock": "shared" }).into()]],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr2".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld1w3": {
              "fieldId": "fld1w3",
              "setting": {
                "formSheetAccessible": true
              },
              "hasRole": true,
              "role": "reader",
              "manageable": false,
              "permission": {
                "readable": true,
                "editable": false
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": false,
            "editable": false,
            "mock": "default"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr2"
          }
        }]
      );
    }

    #[tokio::test]
    async fn share_node_unrelated() {
      let module = init_module([
        mock_rows(
          [
            ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
            ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
            ("props", ColumnType::MYSQL_TYPE_JSON),
          ],
          [["dst199".into(), true.into(), json!({ "mock": "shared" }).into()]],
        ),
        mock_rows([("count", ColumnType::MYSQL_TYPE_LONG)], [[2i64.into()]]),
        mock_rows(
          [("node_id", ColumnType::MYSQL_TYPE_VARCHAR)],
          [["dst3".into()], ["dst96".into()]],
        ),
      ]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr2".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld1w3": {
              "fieldId": "fld1w3",
              "setting": {
                "formSheetAccessible": true
              },
              "hasRole": true,
              "role": "reader",
              "manageable": false,
              "permission": {
                "readable": true,
                "editable": false
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": false,
            "editable": false,
            "mock": "default"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [
          MockSqlLog {
            sql: "SELECT `node_id`, `is_enabled`, `props` \
            FROM `apitable_node_share_setting` \
            WHERE `share_id` = :share_id \
            LIMIT 1"
              .into(),
            params: params! {
              "share_id" => "shr2"
            }
          },
          MockSqlLog {
            sql: "SELECT COUNT(1) AS `count` \
            FROM `apitable_node` \
            WHERE `parent_id` = :node_id AND `is_rubbish` = 0 \
            LIMIT 1"
              .into(),
            params: params! {
              "node_id" => "dst199"
            }
          },
          MockSqlLog {
            sql: "\
            WITH RECURSIVE sub_ids (node_id) AS \
            ( \
              SELECT node_id \
              FROM apitable_node \
              WHERE parent_id = :node_id and is_rubbish = 0 \
              UNION ALL \
              SELECT c.node_id \
              FROM sub_ids AS cp \
              JOIN apitable_node AS c ON cp.node_id = c.parent_id and c.is_rubbish = 0 \
            ) \
            SELECT distinct node_id nodeId \
            FROM sub_ids\
            "
            .into(),
            params: params! {
              "node_id" => "dst199"
            }
          },
        ]
      );
    }

    #[tokio::test]
    async fn share_parent_shared() {
      let module = init_module([
        mock_rows(
          [
            ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
            ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
            ("props", ColumnType::MYSQL_TYPE_JSON),
          ],
          [["dst199".into(), true.into(), json!({ "mock": "shared" }).into()]],
        ),
        mock_rows([("count", ColumnType::MYSQL_TYPE_LONG)], [[3i64.into()]]),
        mock_rows(
          [("node_id", ColumnType::MYSQL_TYPE_VARCHAR)],
          [["dst3".into()], ["dst1".into()], ["dst96".into()]],
        ),
      ]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &Default::default(),
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr2".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: true,
          user_id: None,
          uuid: None,
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld1w3": {
              "fieldId": "fld1w3",
              "setting": {
                "formSheetAccessible": true
              },
              "hasRole": true,
              "role": "reader",
              "manageable": false,
              "permission": {
                "readable": true,
                "editable": false
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": false,
            "mock": "readOnly"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [
          MockSqlLog {
            sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
              .into(),
            params: params! {
              "share_id" => "shr2"
            }
          },
          MockSqlLog {
            sql: "SELECT COUNT(1) AS `count` \
            FROM `apitable_node` \
            WHERE `parent_id` = :node_id AND `is_rubbish` = 0 \
            LIMIT 1"
              .into(),
            params: params! {
              "node_id" => "dst199"
            }
          },
          MockSqlLog {
            sql: "\
            WITH RECURSIVE sub_ids (node_id) AS \
            ( \
              SELECT node_id \
              FROM apitable_node \
              WHERE parent_id = :node_id and is_rubbish = 0 \
              UNION ALL \
              SELECT c.node_id \
              FROM sub_ids AS cp \
              JOIN apitable_node AS c ON cp.node_id = c.parent_id and c.is_rubbish = 0 \
            ) \
            SELECT distinct node_id nodeId \
            FROM sub_ids\
            "
            .into(),
            params: params! {
              "node_id" => "dst199"
            }
          },
        ]
      );
    }

    #[tokio::test]
    async fn share_login_not_shared() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [] as [Vec<Value>; 0],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &AuthHeader {
              cookie: Some("u1".into()),
              ..Default::default()
            },
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr3".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: false,
          user_id: None,
          uuid: None,
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "fld1w5": {
              "fieldId": "fld1w5",
              "setting": {
                "formSheetAccessible": true
              },
              "hasRole": true,
              "role": "reader",
              "manageable": false,
              "permission": {
                "readable": true,
                "editable": false
              }
            }
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": false,
            "editable": false,
            "mock": "default"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr3"
          }
        },]
      );
    }

    #[tokio::test]
    async fn share_login_editable() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [[
          "dst1".into(),
          true.into(),
          json!({
            "canBeEdited": true,
            "mock": "shared",
          })
          .into(),
        ]],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &AuthHeader {
              cookie: Some("u1".into()),
              ..Default::default()
            },
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr3".into()),
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
          role: "editor".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "mock": "fld1"
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": true,
            "mock": "editor"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr3"
          }
        },]
      );
    }

    #[tokio::test]
    async fn share_login_uneditable() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [[
          "dst1".into(),
          true.into(),
          json!({
            "canBeEdited": true,
            "mock": "shared",
          })
          .into(),
        ]],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &AuthHeader {
              cookie: Some("u1".into()),
              ..Default::default()
            },
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr4".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: false,
          user_id: Some("1271".into()),
          uuid: Some("1271".into()),
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "mock": "fld2"
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": false,
            "editable": false,
            "mock": "default"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr4"
          }
        },]
      );
    }

    #[tokio::test]
    async fn share_login_parent_shared_unreadable() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [["dst1".into(), true.into(), json!({ "mock": "shared", }).into()]],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &AuthHeader {
              cookie: Some("u1".into()),
              ..Default::default()
            },
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr5".into()),
              ..Default::default()
            }
          )
          .await
      );

      assert_eq!(
        perm,
        NodePermission {
          has_role: false,
          user_id: Some("1271".into()),
          uuid: Some("1271".into()),
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "mock": "fld3"
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": false,
            "editable": false,
            "mock": "default"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr5"
          }
        },]
      );
    }

    #[tokio::test]
    async fn share_login_readable() {
      let module = init_module([mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("is_enabled", ColumnType::MYSQL_TYPE_BIT),
          ("props", ColumnType::MYSQL_TYPE_JSON),
        ],
        [["dst1".into(), true.into(), json!({ "mock": "shared", }).into()]],
      )]);
      let node_perm_service: &dyn NodePermService = module.resolve_ref();

      let perm = assert_ok!(
        node_perm_service
          .get_node_permission(
            "dst1",
            &AuthHeader {
              cookie: Some("u1".into()),
              ..Default::default()
            },
            &FetchDataPackOrigin {
              internal: false,
              share_id: Some("shr6".into()),
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
          role: "reader".into(),
          node_favorite: None,
          field_permission_map: Some(json!({
            "mock": "fld4"
          })),
          is_ghost_node: None,
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": false,
            "mock": "readOnly"
          }))
        }
      );

      let repo: Arc<dyn Repository> = module.resolve();

      assert_eq!(
        repo.take_logs().await,
        [MockSqlLog {
          sql: "SELECT `node_id`, `is_enabled`, `props` \
          FROM `apitable_node_share_setting` \
          WHERE `share_id` = :share_id \
          LIMIT 1"
            .into(),
          params: params! {
            "share_id" => "shr6"
          }
        },]
      );
    }
  }
}
