use super::description::NodeDescService;
use super::permission::NodePermService;
use super::share_setting::NodeShareSettingService;
use crate::database::datasheet::services::revision::DatasheetRevisionService;
use crate::database::resource::services::meta::ResourceMetaService;
use crate::node::types::{NodeDetailInfo, NodeInfo, NodePermissionState};
use crate::repository::Repository;
use crate::shared::types::{AuthHeader, FetchDataPackOrigin, NodeExtraConstant};
use crate::types::Json;
use crate::util::{ContainerExt, JsonExt, OptionBoolExt};
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use serde_json::json;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait NodeService: Interface {
  async fn get_node_detail_info(
    &self,
    node_id: &str,
    auth: &AuthHeader,
    origin: &FetchDataPackOrigin,
  ) -> anyhow::Result<NodeDetailInfo>;
}

#[derive(Component)]
#[shaku(interface = NodeService)]
pub struct NodeServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,

  #[shaku(inject)]
  res_meta_service: Arc<dyn ResourceMetaService>,

  #[shaku(inject)]
  dst_rev_service: Arc<dyn DatasheetRevisionService>,

  #[shaku(inject)]
  node_desc_service: Arc<dyn NodeDescService>,

  #[shaku(inject)]
  node_perm_service: Arc<dyn NodePermService>,

  #[shaku(inject)]
  node_share_setting_service: Arc<dyn NodeShareSettingService>,
}

#[async_trait]
impl NodeService for NodeServiceImpl {
  async fn get_node_detail_info(
    &self,
    node_id: &str,
    auth: &AuthHeader,
    origin: &FetchDataPackOrigin,
  ) -> anyhow::Result<NodeDetailInfo> {
    // Node permission view. If no auth is given, it is template access or share access.
    let permission = self
      .node_perm_service
      .get_node_permission(node_id, auth, origin)
      .await
      .with_context(|| format!("get node permission {node_id}"))?;
    // Node base info
    let node_info = self
      .get_node_info(node_id)
      .await
      .with_context(|| format!("get node info {node_id}"))?;
    // Node description
    let description = self
      .node_desc_service
      .get_description(node_id)
      .await
      .with_context(|| format!("get description {node_id}"))?;
    // Node revision
    let revision = if origin.not_dst.is_truthy() {
      self.res_meta_service.get_revision_by_res_id(node_id).await?
    } else {
      self.dst_rev_service.get_revision_by_dst_id(node_id).await?
    };
    // Obtain node sharing state
    let node_shared = self
      .node_share_setting_service
      .get_share_status_by_node_id(node_id)
      .await
      .with_context(|| format!("get share status {node_id}"))?;
    // Obtain node permissions
    let node_permit_set = self
      .node_perm_service
      .get_node_permission_set_status(node_id)
      .await
      .with_context(|| format!("get node permission set status {node_id}"))?;
    Ok(NodeDetailInfo {
      node: NodeInfo {
        id: node_id.to_owned(),
        name: node_info.as_ref().map_or(String::new(), |info| info.node_name.clone()),
        description: description.unwrap_or_else(|| "{}".to_owned()),
        parent_id: node_info
          .as_ref()
          .and_then(|info| info.parent_id.none_if_empty().cloned())
          .unwrap_or(String::new()),
        icon: node_info
          .as_ref()
          .and_then(|info| info.icon.clone())
          .unwrap_or(String::new()),
        node_shared,
        node_permit_set,
        revision: revision.map_or(0, |rev| rev as u32),
        space_id: node_info.as_ref().map_or(String::new(), |info| info.space_id.clone()),
        role: permission.role,
        node_favorite: permission.node_favorite.is_truthy(),
        extra: Some(format_node_extra(
          node_info.as_ref().and_then(|info| info.extra.clone()),
        )),
        is_ghost_node: permission.is_ghost_node,
        active_view: None,
        permissions: NodePermissionState {
          is_deleted: permission.is_deleted,
          permissions: permission.permissions,
        },
      },
      field_permission_map: permission.field_permission_map,
    })
  }
}

impl NodeServiceImpl {
  async fn get_node_info(&self, node_id: &str) -> anyhow::Result<Option<PartialNodeInfo>> {
    let mut client = self.repo.get_client().await?;
    Ok(
      client
        .query_one(
          format!(
            "\
          SELECT `node_id`, `node_name`, `space_id`, `parent_id`, `icon`, `extra`, `type` \
          FROM `{prefix}node` \
          WHERE `node_id` = :node_id AND `is_rubbish` = 0\
        ",
            prefix = self.repo.table_prefix()
          ),
          params! { node_id },
        )
        .await
        .with_context(|| format!("get node info {node_id}"))?
        .map(
          |(node_id, node_name, space_id, parent_id, icon, extra, ty)| PartialNodeInfo {
            space_id,
            parent_id,
            node_id,
            node_name,
            icon,
            r#type: ty,
            extra,
          },
        ),
    )
  }
}

fn format_node_extra(extra: Option<Json>) -> Json {
  if let Some(Json::Object(mut extra)) = extra {
    if let Some(show_record_history) = extra.get(NodeExtraConstant::ShowRecordHistory.as_str()) {
      extra.insert(
        NodeExtraConstant::ShowRecordHistory.as_str().to_owned(),
        show_record_history.is_truthy().into(),
      );
      return extra.into();
    }
    // Default to show both
    extra.insert(NodeExtraConstant::ShowRecordHistory.as_str().to_owned(), true.into());
    return extra.into();
  }
  json!({
    "showRecordHistory": true
  })
}

#[derive(Debug, Clone)]
pub struct PartialNodeInfo {
  pub space_id: String,
  pub parent_id: String,
  pub node_id: String,
  pub node_name: String,
  pub icon: Option<String>,
  pub r#type: u8,
  pub extra: Option<Json>,
}

#[cfg(test)]
pub mod mock {
  use anyhow::anyhow;

  use super::*;
  use crate::types::HashMap;

  #[derive(Component, Default)]
  #[shaku(interface = NodeService)]
  pub struct MockNodeServiceImpl {
    node_details: HashMap<(&'static str, FetchDataPackOrigin), NodeDetailInfo>,
  }

  impl MockNodeServiceImpl {
    pub fn new() -> Self {
      Self::default()
    }

    pub fn with_node_details(
      mut self,
      node_details: HashMap<(&'static str, FetchDataPackOrigin), NodeDetailInfo>,
    ) -> Self {
      self.node_details = node_details;
      self
    }

    pub fn build(self) -> Box<dyn NodeService> {
      Box::new(self)
    }
  }

  #[async_trait]
  impl NodeService for MockNodeServiceImpl {
    async fn get_node_detail_info(
      &self,
      node_id: &str,
      _auth: &AuthHeader,
      origin: &FetchDataPackOrigin,
    ) -> anyhow::Result<NodeDetailInfo> {
      self
        .node_details
        .get(&(node_id, origin.clone()))
        .cloned()
        .ok_or_else(|| anyhow!("node detail ({node_id}, {origin:?}) not exist"))
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::database::datasheet::services::revision::DatasheetRevisionServiceImpl;
  use crate::database::resource::services::meta::ResourceMetaServiceImpl;
  use crate::node::services::children::NodeChildrenServiceImpl;
  use crate::node::services::description::NodeDescServiceImpl;
  use crate::node::services::permission::mock::MockNodePermServiceImpl;
  use crate::node::services::share_setting::NodeShareSettingServiceImpl;
  use crate::repository::mock::{mock_rows, MockRepositoryImpl, MockSqlLog};
  use crate::repository::RepositoryImpl;
  use crate::shared::types::NodePermission;
  use mysql_async::consts::ColumnType;
  use mysql_async::{Row, Value};
  use pretty_assertions::assert_eq;
  use serde_json::json;
  use shaku::{module, HasComponent};
  use tokio_test::assert_ok;

  module! {
    TestModule {
      components = [
        NodeServiceImpl,
        RepositoryImpl,
        ResourceMetaServiceImpl,
        DatasheetRevisionServiceImpl,
        NodeDescServiceImpl,
        MockNodePermServiceImpl,
        NodeShareSettingServiceImpl,
        NodeChildrenServiceImpl,
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
      .with_component_override(
        MockNodePermServiceImpl::new()
          .with_permissions(hashmap! {
            ("dst1", FetchDataPackOrigin {
              internal: true,
              main: Some(true),
              ..Default::default()
            }) => NodePermission {
              has_role: true,
              user_id: Some("17".into()),
              uuid: Some("17".into()),
              role: "editor".into(),
              node_favorite: None,
              field_permission_map: None,
              is_ghost_node: Some(false),
              is_deleted: None,
              permissions: Some(json!({
                "readable": true,
                "editable": true,
                "mock": "editor"
              })),
            },
            ("dst2", FetchDataPackOrigin {
              internal: true,
              main: Some(true),
              ..Default::default()
            }) => NodePermission {
              has_role: true,
              user_id: Some("17".into()),
              uuid: Some("17".into()),
              role: "reader".into(),
              node_favorite: Some(true),
              field_permission_map: Some(json!({
                "fld1": {
                  "fieldId": "fld1",
                  "setting": {
                    "formSheetAccessible": false
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
              is_deleted: Some(false),
              permissions: Some(json!({
                "readable": true,
                "editable": false,
                "mock": "reader"
              })),
            },
          })
          .build(),
      )
      .build()
  }

  fn mock_internal_main_sql_logs(dst_id: &str) -> Vec<MockSqlLog> {
    vec![
      MockSqlLog {
        sql: "SELECT \
            `node_id`, \
            `node_name`, \
            `space_id`, \
            `parent_id`, \
            `icon`, \
            `extra`, \
            `type` \
            FROM `apitable_node` \
            WHERE `node_id` = :node_id AND `is_rubbish` = 0 \
            LIMIT 1"
          .into(),
        params: params! {
          "node_id" => dst_id,
        },
      },
      MockSqlLog {
        sql: "SELECT `description` \
            FROM `apitable_node_desc` \
            WHERE `node_id` = :node_id \
            LIMIT 1"
          .into(),
        params: params! {
          "node_id" => dst_id,
        },
      },
      MockSqlLog {
        sql: "SELECT `revision` \
            FROM `apitable_datasheet` \
            WHERE `dst_id` = :dst_id AND `is_deleted` = 0 \
            LIMIT 1"
          .into(),
        params: params! {
          "dst_id" => dst_id,
        },
      },
      MockSqlLog {
        sql: "SELECT `is_enabled` \
            FROM `apitable_node_share_setting` \
            WHERE `node_id` = :node_id \
            LIMIT 1"
          .into(),
        params: params! {
          "node_id" => dst_id,
        },
      },
    ]
  }

  #[tokio::test]
  async fn internal_main_editor() {
    let module = init_module([
      mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("node_name", ColumnType::MYSQL_TYPE_VARCHAR),
          ("space_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("parent_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("icon", ColumnType::MYSQL_TYPE_VARCHAR),
          ("extra", ColumnType::MYSQL_TYPE_JSON),
          ("type", ColumnType::MYSQL_TYPE_TINY),
        ],
        [[
          "dst1".into(),
          "Dst 1".into(),
          "spc1".into(),
          "fod1j".into(),
          Value::NULL,
          Value::NULL,
          0u8.into(),
        ]],
      ),
      mock_rows([("description", ColumnType::MYSQL_TYPE_VARCHAR)], [["desc 1".into()]]),
      mock_rows([("revision", ColumnType::MYSQL_TYPE_LONG)], [[13u64.into()]]),
      mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_BIT)], [[true.into()]]),
    ]);
    let node_service: &dyn NodeService = module.resolve_ref();

    let detail = assert_ok!(
      node_service
        .get_node_detail_info(
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
      detail,
      NodeDetailInfo {
        node: NodeInfo {
          id: "dst1".into(),
          name: "Dst 1".into(),
          description: "desc 1".into(),
          parent_id: "fod1j".into(),
          icon: "".into(),
          node_shared: true,
          node_permit_set: false,
          node_favorite: false,
          space_id: "spc1".into(),
          role: "editor".into(),
          permissions: NodePermissionState {
            is_deleted: None,
            permissions: Some(json!({
              "readable": true,
              "editable": true,
              "mock": "editor",
            }))
          },
          revision: 13,
          is_ghost_node: Some(false),
          active_view: None,
          extra: Some(json!({
            "showRecordHistory": true
          }))
        },
        field_permission_map: None,
      }
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(repo.take_logs().await, mock_internal_main_sql_logs("dst1"));
  }

  #[tokio::test]
  async fn internal_main_reader() {
    let module = init_module([
      mock_rows(
        [
          ("node_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("node_name", ColumnType::MYSQL_TYPE_VARCHAR),
          ("space_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("parent_id", ColumnType::MYSQL_TYPE_VARCHAR),
          ("icon", ColumnType::MYSQL_TYPE_VARCHAR),
          ("extra", ColumnType::MYSQL_TYPE_JSON),
          ("type", ColumnType::MYSQL_TYPE_TINY),
        ],
        [[
          "dst2".into(),
          "Dst 2".into(),
          "spc1".into(),
          "fod1j".into(),
          "smiling_face_with_3_hearts".into(),
          json!({ "showRecordHistory": false }).into(),
          0u8.into(),
        ]],
      ),
      mock_rows([("description", ColumnType::MYSQL_TYPE_VARCHAR)], [] as [Vec<Value>; 0]),
      mock_rows([("revision", ColumnType::MYSQL_TYPE_LONG)], [] as [Vec<Value>; 0]),
      mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_BIT)], [[false.into()]]),
    ]);
    let node_service: &dyn NodeService = module.resolve_ref();

    let detail = assert_ok!(
      node_service
        .get_node_detail_info(
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

    assert_eq!(
      detail,
      NodeDetailInfo {
        node: NodeInfo {
          id: "dst2".into(),
          name: "Dst 2".into(),
          description: "{}".into(),
          parent_id: "fod1j".into(),
          icon: "smiling_face_with_3_hearts".into(),
          node_shared: false,
          node_permit_set: false,
          node_favorite: true,
          space_id: "spc1".into(),
          role: "reader".into(),
          permissions: NodePermissionState {
            is_deleted: Some(false),
            permissions: Some(json!({
              "readable": true,
              "editable": false,
              "mock": "reader",
            }))
          },
          revision: 0,
          is_ghost_node: None,
          active_view: None,
          extra: Some(json!({
            "showRecordHistory": false
          }))
        },
        field_permission_map: Some(json!({
          "fld1": {
            "fieldId": "fld1",
            "setting": {
              "formSheetAccessible": false
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
      }
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(repo.take_logs().await, mock_internal_main_sql_logs("dst2"));
  }
}
