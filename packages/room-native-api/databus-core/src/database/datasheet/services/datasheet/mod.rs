use self::foreign_datasheet_loader::InternalDatasheetMeta;
use super::meta::DatasheetMetaService;
use super::record::DatasheetRecordService;
use super::revision::DatasheetRevisionService;
use crate::database::datasheet::services::datasheet::dependency_analyzer::DependencyAnalysisResult;
use crate::database::datasheet::services::datasheet::foreign_datasheet_loader::ForeignDatasheetLoaderImpl;
use crate::database::datasheet::services::datasheet::reference_manager::ReferenceManagerImpl;
use crate::database::datasheet::types::DatasheetMeta;
use crate::database::types::{BaseDatasheetPack, DatasheetPack, DatasheetSnapshot, RecordMap};
use crate::node::services::node::NodeService;
use crate::node::types::NodeDetailInfo;
use crate::repository::Repository;
use crate::shared::errors::NodeNotExistError;
use crate::shared::redis::RedisService;
use crate::shared::types::{AuthHeader, FetchDataPackOptions, FetchDataPackOrigin};
use crate::types::{HashMap, HashSet};
use crate::unit::{UnitInfo, UnitService};
use crate::user::UserService;
use crate::util::OptionBoolExt;
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;
use std::time::Instant;
use tokio::sync::Mutex;

mod dependency_analyzer;
mod foreign_datasheet_loader;
mod reference_manager;

#[async_trait]
pub trait DatasheetService: Interface {
  async fn fetch_data_pack(
    &self,
    source: &str,
    dst_id: &str,
    auth: AuthHeader,
    origin: FetchDataPackOrigin,
    options: Option<FetchDataPackOptions>,
  ) -> anyhow::Result<DatasheetPack>;

  async fn get_revision_by_dst_id(&self, dst_id: &str) -> anyhow::Result<Option<u64>>;

  async fn get_space_id_by_dst_id(&self, dst_id: &str) -> anyhow::Result<Option<String>>;
}

#[derive(Component)]
#[shaku(interface = DatasheetService)]
pub struct DatasheetServiceImpl {
  #[shaku(inject)]
  meta_service: Arc<dyn DatasheetMetaService>,

  #[shaku(inject)]
  record_service: Arc<dyn DatasheetRecordService>,

  #[shaku(inject)]
  node_service: Arc<dyn NodeService>,

  #[shaku(inject)]
  revision_service: Arc<dyn DatasheetRevisionService>,

  #[shaku(inject)]
  user_service: Arc<dyn UserService>,

  #[shaku(inject)]
  unit_service: Arc<dyn UnitService>,

  #[shaku(inject)]
  redis_service: Arc<dyn RedisService>,

  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl DatasheetService for DatasheetServiceImpl {
  async fn fetch_data_pack(
    &self,
    source: &str,
    dst_id: &str,
    auth: AuthHeader,
    origin: FetchDataPackOrigin,
    mut options: Option<FetchDataPackOptions>,
  ) -> anyhow::Result<DatasheetPack> {
    let start = Instant::now();
    tracing::info!(
      "Start loading {source} data {dst_id}, origin: {}",
      serde_json::to_string(&origin).unwrap()
    );

    let meta = self
      .meta_service
      .get_meta_data_by_dst_id(dst_id, false)
      .await
      .with_context(|| format!("get meta data for fetch_data_pack {dst_id}"))?;
    let Some(meta) = meta else {
      return Err(NodeNotExistError { node_id: dst_id.to_owned() }.into());
    };
    let meta: DatasheetMeta = serde_json::from_value(meta)
      .with_context(|| format!("convert meta to DatasheetMeta for fetch_data_pack {dst_id}"))?;
    let meta = meta.into();

    let NodeDetailInfo {
      node,
      field_permission_map,
    } = self
      .node_service
      .get_node_detail_info(dst_id, &auth, &origin)
      .await
      .with_context(|| format!("get node detail info for fetch_data_pack {dst_id}"))?;
    let record_map = Arc::new(Mutex::new(
      self
        .record_service
        .get_records(
          dst_id,
          options
            .as_mut()
            .and_then(|options| options.record_ids.as_mut().map(std::mem::take)),
          false,
          true,
        )
        .await
        .with_context(|| format!("get record map for fetch_data_pack {dst_id}"))?,
    ));
    let is_template = options.as_ref().and_then(|options| options.is_template).is_truthy();
    let need_extend_main_dst_records = options
      .as_ref()
      .and_then(|options| options.need_extend_main_dst_records)
      .is_truthy();
    let dependency_result = self
      .analyze_dependencies(
        dst_id,
        &meta,
        record_map.clone(),
        options
          .and_then(|options| if is_template { None } else { options.linked_record_map })
          .map(|linked_record_map| {
            linked_record_map
              .into_iter()
              .map(|(dst_id, record_ids)| (dst_id, record_ids.into_iter().collect()))
              .collect()
          }),
        false,
        if is_template { Default::default() } else { auth },
        origin,
        need_extend_main_dst_records,
      )
      .await
      .with_context(|| format!("analyze dependencies for fetch_data_pack {dst_id}"))?;
    let duration = start.elapsed().as_millis();
    tracing::info!("Finished loading {source} data {dst_id}, duration: {duration}ms");
    Ok(DatasheetPack {
      snapshot: DatasheetSnapshot {
        meta: meta.into(),
        record_map: Arc::try_unwrap(record_map).unwrap().into_inner(),
        datasheet_id: dst_id.to_owned(),
      },
      datasheet: node,
      field_permission_map: if is_template { None } else { field_permission_map },
      foreign_datasheet_map: Some(dependency_result.foreign_datasheet_map),
      units: dependency_result.units,
    })
  }

  async fn get_revision_by_dst_id(&self, dst_id: &str) -> anyhow::Result<Option<u64>> {
    self.revision_service.get_revision_by_dst_id(dst_id).await
  }

  async fn get_space_id_by_dst_id(&self, dst_id: &str) -> anyhow::Result<Option<String>> {
    let mut client = self.repo.get_client().await?;
    Ok(
      client
        .query_one(
          format!(
            "\
              SELECT `space_id` \
              FROM `{prefix}datasheet` \
              WHERE `dst_id` = :dst_id AND `is_deleted` = 0\
            ",
            prefix = self.repo.table_prefix()
          ),
          params! {
            dst_id
          },
        )
        .await?
        .with_context(|| format!("get space id by dst id {dst_id}"))?,
    )
  }
}

#[derive(Debug, Clone)]
pub(super) struct DependencyAnalysisOutput {
  pub foreign_datasheet_map: HashMap<String, BaseDatasheetPack>,
  pub units: Vec<UnitInfo>,
}

impl DatasheetServiceImpl {
  /// `main_record_map` may be modified if `need_extend_main_dst_records` is true.
  async fn analyze_dependencies(
    &self,
    main_dst_id: &str,
    main_meta: &InternalDatasheetMeta,
    main_record_map: Arc<Mutex<RecordMap>>,
    linked_record_map: Option<HashMap<String, HashSet<String>>>,
    without_permission: bool,
    auth: AuthHeader,
    mut origin: FetchDataPackOrigin,
    need_extend_main_dst_records: bool,
  ) -> anyhow::Result<DependencyAnalysisOutput> {
    let start = Instant::now();
    tracing::info!("Start analyzing dependencies of {main_dst_id}");

    let ref_man = Arc::new(Mutex::new(ReferenceManagerImpl::new(
      self.redis_service.get_connection().await?,
    )));
    origin.main = Some(false);
    let frn_dst_loader = Arc::new(ForeignDatasheetLoaderImpl::new(
      self.meta_service.clone(),
      self.node_service.clone(),
      self.record_service.clone(),
      self.repo.clone(),
      auth,
      origin,
      without_permission,
    ));
    let analyzer = dependency_analyzer::DependencyAnalyzer::new(
      main_dst_id,
      ref_man,
      frn_dst_loader,
      main_meta,
      main_record_map.clone(),
      need_extend_main_dst_records,
    );

    // Process all fields of the datasheet
    let DependencyAnalysisResult {
      foreign_datasheet_map,
      member_field_unit_ids,
      operator_field_uuids,
    } = analyzer
      .analyze(
        main_dst_id,
        main_meta.field_map.keys().cloned().collect(),
        linked_record_map,
      )
      .await?;

    let mut units: Vec<UnitInfo>;
    if !member_field_unit_ids.is_empty() || !operator_field_uuids.is_empty() {
      // Get the space ID which the datasheet belongs to
      let space_id = self.get_space_id_by_dst_id(main_dst_id).await?;
      let Some(space_id) = space_id else {
        return Err(NodeNotExistError {
          node_id: main_dst_id.to_owned(),
        }.into());
      };

      // Batch query member info
      units = self
        .unit_service
        .get_unit_info_by_unit_ids(&space_id, member_field_unit_ids)
        .await?;
      units.extend(
        self
          .user_service
          .get_user_info_by_uuids(&space_id, operator_field_uuids)
          .await?,
      );
    } else {
      units = vec![];
    }

    let foreign_datasheet_map = foreign_datasheet_map
      .into_iter()
      .map(|(dst_id, dst_pack)| (dst_id, dst_pack.into()))
      .collect::<HashMap<_, BaseDatasheetPack>>();

    let duration = start.elapsed().as_millis();
    let mut num_records: HashMap<_, _> = foreign_datasheet_map
      .iter()
      .map(|(id, dst)| (id.as_str(), dst.snapshot.record_map.len()))
      .collect();
    num_records.insert(main_dst_id, main_record_map.lock().await.len());
    tracing::info!(
      "Finished analyzing dependencies of {main_dst_id}, duration {duration}ms. \
      Loaded datasheets and number of records: {num_records:?}"
    );

    Ok(DependencyAnalysisOutput {
      foreign_datasheet_map,
      units,
    })
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::database::consts::REF_STORAGE_EXPIRE_TIME;
  use crate::database::datasheet::services::meta::mock::MockDatasheetMetaServiceImpl;
  use crate::database::datasheet::services::record::mock::MockDatasheetRecordServiceImpl;
  use crate::database::datasheet::services::revision::DatasheetRevisionServiceImpl;
  use crate::database::datasheet::types::{Field, FieldKind};
  use crate::database::types::Record;
  use crate::node::services::node::mock::MockNodeServiceImpl;
  use crate::node::types::{NodeInfo, NodePermissionState};
  use crate::repository::mock::{mock_rows, MockRepositoryImpl, MockSqlLog};
  use crate::repository::RepositoryImpl;
  use crate::shared::redis::mock::{MockRedis, MockValue};
  use crate::shared::redis::{init_redis_client, RedisInitOptions, RedisServiceImpl};
  use crate::types::Json;
  use crate::unit::mock::MockUnitServiceImpl;
  use crate::user::mock::MockUserServiceImpl;
  use crate::util::SliceExt;
  use fred::mocks::MockCommand;
  use fred::prelude::*;
  use mysql_async::consts::ColumnType;
  use mysql_async::Row;
  use mysql_common::value::Value;
  use pretty_assertions::assert_eq;
  use serde_json::json;
  use shaku::{module, HasComponent};
  use tokio_test::assert_ok;

  module! {
    TestModule {
      components = [
        DatasheetServiceImpl,
        RepositoryImpl,
        MockDatasheetMetaServiceImpl,
        MockDatasheetRecordServiceImpl,
        DatasheetRevisionServiceImpl,
        MockNodeServiceImpl,
        MockUnitServiceImpl,
        MockUserServiceImpl,
        RedisServiceImpl,
      ],
      providers = []
    }
  }

  async fn init_module<I>(results: I, mock_redis: Arc<MockRedis>) -> TestModule
  where
    I: IntoIterator<Item = Vec<Row>>,
  {
    let redis_client = assert_ok!(
      init_redis_client(RedisInitOptions {
        config: RedisConfig {
          mocks: mock_redis,
          ..Default::default()
        },
        ..Default::default()
      })
      .await
    );

    TestModule::builder()
      .with_component_override(MockRepositoryImpl::new(results))
      .with_component_override(
        MockDatasheetMetaServiceImpl::new()
          .with_metas(hashmap! {
            "dst1" => serde_json::to_value(mock_dst1_meta()).unwrap(),
            "dst11" => serde_json::to_value(mock_dst11_meta()).unwrap(),
            "dst12" => serde_json::to_value(mock_dst12_meta()).unwrap(),
            "dst13" => serde_json::to_value(mock_dst13_meta()).unwrap(),
          })
          .build(),
      )
      .with_component_override(
        MockNodeServiceImpl::new()
          .with_node_details(hashmap! {
            ("dst1", FetchDataPackOrigin {
              internal: true,
              main: Some(true),
              ..Default::default()
            }) => mock_dst1_detail_info(),
            ("dst11", FetchDataPackOrigin {
              internal: true,
              main: Some(true),
              ..Default::default()
            }) => mock_dst11_detail_info(),
            ("dst12", FetchDataPackOrigin {
              internal: true,
              main: Some(false),
              ..Default::default()
            }) => mock_dst12_detail_info(),
            ("dst13", FetchDataPackOrigin {
              internal: true,
              main: Some(false),
              ..Default::default()
            }) => mock_dst13_detail_info(),
            ("dst11", FetchDataPackOrigin {
              internal: false,
              main: Some(true),
              share_id: Some("shr1".into()),
              ..Default::default()
            }) => mock_dst11_detail_info(),
            ("dst12", FetchDataPackOrigin {
              internal: false,
              main: Some(false),
              share_id: Some("shr1".into()),
              ..Default::default()
            }) => mock_dst12_detail_info(),
            ("dst13", FetchDataPackOrigin {
              internal: false,
              main: Some(false),
              share_id: Some("shr1".into()),
              ..Default::default()
            }) => mock_dst13_detail_info(),
            ("dst1", FetchDataPackOrigin {
              internal: false,
              main: Some(true),
              ..Default::default()
            }) => mock_dst1_detail_info(),
          })
          .build(),
      )
      .with_component_override(
        MockDatasheetRecordServiceImpl::new()
          .with_records(hashmap! {
            "dst1".into() => mock_dst1_record_map(None),
            "dst11".into() => mock_dst11_record_map(None),
            "dst12".into() => mock_dst12_record_map(None),
            "dst13".into() => mock_dst13_record_map(None),
          })
          .build(),
      )
      .with_component_override(MockUnitServiceImpl::new().with_units(mock_unit_infos()).build())
      .with_component_override(MockUserServiceImpl::new().with_users(mock_user_infos()).build())
      .with_component_parameters::<RedisServiceImpl>(redis_client)
      .build()
  }

  fn mock_unit_infos() -> HashMap<&'static str, UnitInfo> {
    hashmap! {
      "u1" => UnitInfo {
        unit_id: Some(123),
        r#type: Some(0),
        name: Some("Unit 1".into()),
        uuid: Some("uuuu1".into()),
        user_id: Some("7197".into()),
        avatar: Some("https://abc.com/abc1.png".into()),
        is_active: Some(1),
        is_deleted: None,
        nick_name: Some("Unit 1 nick".into()),
        avatar_color: Some(1),
        is_member_name_modified: Some(true),
        is_nick_name_modified: None,
        original_unit_id: Some("uu1".into()),
      },
      "u2" => UnitInfo {
        unit_id: Some(124),
        r#type: Some(0),
        name: Some("Unit 2".into()),
        uuid: Some("uuuu2".into()),
        user_id: Some("7250".into()),
        avatar: Some("https://abc.com/abc2.png".into()),
        is_active: Some(1),
        is_deleted: None,
        nick_name: Some("Unit 2 nick".into()),
        avatar_color: Some(2),
        is_member_name_modified: Some(false),
        is_nick_name_modified: None,
        original_unit_id: Some("uu2".into()),
      },
      "u3" => UnitInfo {
        unit_id: Some(125),
        r#type: Some(0),
        name: Some("Unit 3".into()),
        uuid: Some("uuuu3".into()),
        user_id: Some("1744".into()),
        avatar: Some("https://abc.com/abc5.png".into()),
        is_active: Some(1),
        is_deleted: Some(0),
        nick_name: Some("Unit 3 nick".into()),
        avatar_color: Some(3),
        is_member_name_modified: Some(false),
        is_nick_name_modified: None,
        original_unit_id: Some("uu3".into()),
      },
    }
  }

  fn mock_user_infos() -> HashMap<&'static str, UnitInfo> {
    hashmap! {
      "7197" => UnitInfo {
        unit_id: Some(123),
        r#type: None,
        name: Some("Unit 1".into()),
        uuid: Some("uuuu1".into()),
        user_id: Some("7197".into()),
        avatar: Some("https://abc.com/abc1.png".into()),
        is_active: Some(1),
        is_deleted: None,
        nick_name: Some("Unit 1 nick".into()),
        avatar_color: Some(1),
        is_member_name_modified: Some(true),
        is_nick_name_modified: Some(true),
        original_unit_id: Some("uuuu11".into()),
      },
      "1120" => UnitInfo {
        unit_id: None,
        r#type: Some(0),
        name: Some("User 1120".into()),
        uuid: Some("uuuu57".into()),
        user_id: Some("1120".into()),
        avatar: Some("https://abc.com/791j.png".into()),
        is_active: Some(1),
        is_deleted: Some(0),
        nick_name: Some("nick nick".into()),
        avatar_color: Some(3),
        is_member_name_modified: Some(false),
        is_nick_name_modified: Some(false),
        original_unit_id: Some("uuuu12".into()),
      },
    }
  }

  fn mock_dst1_detail_info() -> NodeDetailInfo {
    NodeDetailInfo {
      node: NodeInfo {
        id: "dst1".into(),
        name: "Dst 1".into(),
        description: "{}".into(),
        parent_id: "fod888".into(),
        icon: "tick_100".into(),
        node_shared: false,
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
          })),
        },
        revision: 107,
        is_ghost_node: None,
        active_view: None,
        extra: Some(json!({
          "showRecordHistory": true
        })),
      },
      field_permission_map: None,
    }
  }

  fn mock_dst1_meta() -> DatasheetMeta {
    DatasheetMeta {
      field_map: hashmap! {
        "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
        "fld1w2".into() => new_field("fld1w2", FieldKind::Formula, json!({
          "datasheetId": "dst1",
          "expression": "{fld1w30000000}+{fld1w50000000}",
        })),
        "fld1w30000000".into() => new_field("fld1w30000000", FieldKind::Member, json!({
          "isMulti": true,
          "shouldSendMsg": false,
          "unitIds": ["u1", "u2"]
        })),
        "fld1w4".into() => new_field("fld1w4", FieldKind::Link, json!({
          "foreignDatasheetId": "dst1"
        })),
        "fld1w50000000".into() => new_field("fld1w50000000", FieldKind::CreatedBy, json!({
          "uuids": ["7197"],
          "datasheetId": "dst1"
        })),
      },
      views: vec![json!({
        "columns": [
          { "fieldId": "fld1w1" },
          { "fieldId": "fld1w2" },
          { "fieldId": "fld1w3" },
          { "fieldId": "fld1w4" },
        ]
      })],
      widget_panels: None,
    }
  }

  fn mock_dst1_record_map(record_ids: Option<Vec<&'static str>>) -> RecordMap {
    let records = hashmap! {
      "rec1w1".into() => new_record("rec1w1", json!({
        "fld1w4": ["rec1w5"],
      })),
      "rec1w2".into() => new_record("rec1w2", json!({})),
      "rec1w3".into() => new_record("rec1w3", json!({
        "fld1w4": ["rec1w6", "rec1w4"],
      })),
      "rec1w4".into() => new_record("rec1w4", json!({
        "fld1w4": ["rec1w1"]
      })),
      "rec1w5".into() => new_record("rec1w5", json!({})),
      "rec1w6".into() => new_record("rec1w6", json!({})),
    };
    if let Some(record_ids) = record_ids {
      records
        .into_iter()
        .filter(|(id, _)| record_ids.contains_ref(id))
        .collect()
    } else {
      records
    }
  }

  fn mock_dst11_meta() -> DatasheetMeta {
    DatasheetMeta {
      field_map: hashmap! {
        "fld11w1".into() => new_field("fld11w1", FieldKind::Text, json!({})),
        "fld11w2".into() => new_field("fld11w2", FieldKind::Link, json!({
          "foreignDatasheetId": "dst12",
          "brotherFieldId": "fld12w2",
        })),
        "fld11w3".into() => new_field("fld11w3", FieldKind::LookUp, json!({
          "datasheetId": "dst11",
          "relatedLinkFieldId": "fld11w2",
          "lookUpTargetFieldId": "fld12w3",
          "openFilter": true,
          "filterInfo": {
            "conjunction": "and",
            "conditions": [{ "fieldId": "fld12w5" }]
          }
        })),
        "fld11w4".into() => new_field("fld11w4", FieldKind::Link, json!({
          "foreignDatasheetId": "dst13",
          "brotherFieldId": "fld13w4",
        })),
        "fld11w5".into() => new_field("fld11w5", FieldKind::LookUp, json!({
          "datasheetId": "dst11",
          "relatedLinkFieldId": "fld11w4",
          "lookUpTargetFieldId": "fld13w2",
        })),
      },
      views: vec![json!({
        "columns": [
          { "fieldId": "fld11w1" },
          { "fieldId": "fld11w2" },
          { "fieldId": "fld11w3" },
          { "fieldId": "fld11w4" },
          { "fieldId": "fld11w5" },
        ]
      })],
      widget_panels: None,
    }
  }

  fn mock_dst11_detail_info() -> NodeDetailInfo {
    NodeDetailInfo {
      node: NodeInfo {
        id: "dst11".into(),
        name: "Dst 11".into(),
        description: "desc 11".into(),
        parent_id: "fod888".into(),
        icon: "cross".into(),
        node_shared: false,
        node_permit_set: false,
        node_favorite: false,
        space_id: "spc1".into(),
        role: "reader".into(),
        permissions: NodePermissionState {
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": false,
            "mock": "reader",
          })),
        },
        revision: 7,
        is_ghost_node: Some(false),
        active_view: None,
        extra: Some(json!({
          "showRecordHistory": false
        })),
      },
      field_permission_map: None,
    }
  }

  fn mock_dst11_record_map(record_ids: Option<Vec<&'static str>>) -> RecordMap {
    let records = hashmap! {
      "rec11w1".into() => new_record("rec11w1", json!({
        "fld11w2": ["rec12w2"]
      })),
      "rec11w2".into() => new_record("rec11w2", json!({
        "fld11w2": ["rec12w1", "rec12w3"],
        "fld11w4": ["rec13w1"],
      })),
      "rec11w3".into() => new_record("rec11w3", json!({})),
      "rec11w10".into() => new_record("rec11w10", json!({
        "fld11w2": ["rec12w10", "rec12w11"]
      })),
      "rec11w11".into() => new_record("rec11w11", json!({
        "fld11w2": ["rec12w12"],
        "fld11w4": ["rec13w10"],
      })),
      "rec11w12".into() => new_record("rec11w12", json!({})),
    };
    if let Some(record_ids) = record_ids {
      records
        .into_iter()
        .filter(|(id, _)| record_ids.contains_ref(id))
        .collect()
    } else {
      records
    }
  }

  fn mock_dst12_meta() -> DatasheetMeta {
    DatasheetMeta {
      field_map: hashmap! {
        "fld12w1".into() => new_field("fld12w1", FieldKind::Text, json!({
        })),
        "fld12w2".into() => new_field("fld12w2", FieldKind::Link, json!({
          "foreignDatasheetId": "dst11",
          "brotherFieldId": "fld11w2",
        })),
        "fld12w3".into() => new_field("fld12w3", FieldKind::Formula, json!({
          "datasheetId": "dst12",
          "expression": "+{fld12w4000000}",
        })),
        "fld12w4000000".into() => new_field("fld12w4000000", FieldKind::Link, json!({
          "foreignDatasheetId": "dst12",
        })),
        "fld12w5".into() => new_field(
          "fld12w5",
          FieldKind::Member,
          json!({
            "isMulti": true,
            "shouldSendMsg": false,
            "unitIds": ["u2", "u3"]
          }
        )),
        "fld12w6".into() => new_field(
          "fld12w6",
          FieldKind::Member,
          json!({
            "isMulti": true,
            "shouldSendMsg": false,
            "unitIds": ["u1", "u3"],
          }
        )),
        "fld12w7".into() => new_field("fld12w7", FieldKind::Link, json!({
          "foreignDatasheetId": "dst13",
          "brotherFieldId": "fld13w3",
        })),
      },
      views: vec![json!({
        "columns": [
          { "fieldId": "fld12w1" },
          { "fieldId": "fld12w2" },
          { "fieldId": "fld12w3" },
          { "fieldId": "fld12w4000000" },
          { "fieldId": "fld12w5" },
          { "fieldId": "fld12w6" },
          { "fieldId": "fld12w7" },
        ]
      })],
      widget_panels: None,
    }
  }

  fn mock_dst12_detail_info() -> NodeDetailInfo {
    NodeDetailInfo {
      node: NodeInfo {
        id: "dst12".into(),
        name: "Dst 12".into(),
        description: "{}".into(),
        parent_id: "fod714".into(),
        icon: "cross".into(),
        node_shared: true,
        node_permit_set: false,
        node_favorite: true,
        space_id: "spc1".into(),
        role: "manager".into(),
        permissions: NodePermissionState {
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": true,
            "mock": "manager",
          })),
        },
        revision: 14179,
        is_ghost_node: Some(false),
        active_view: None,
        extra: Some(json!({
          "showRecordHistory": true
        })),
      },
      field_permission_map: None,
    }
  }

  fn mock_dst12_record_map(record_ids: Option<Vec<&'static str>>) -> RecordMap {
    let records = hashmap! {
      "rec12w1".into() => new_record("rec12w1", json!({
        "fld12w2": ["rec11w2"],
        "fld12w4000000": ["rec12w5"],
      })),
      "rec12w2".into() => new_record("rec12w2", json!({
        "fld12w2": ["rec11w1"],
        "fld12w7": ["rec13w1"]
      })),
      "rec12w3".into() => new_record("rec12w3", json!({
        "fld12w2": ["rec11w2"],
        "fld12w4000000": ["rec12w5", "rec12w4"]
      })),
      "rec12w4".into() => new_record("rec12w4", json!({
        "fld12w4000000": ["rec12w6"],
      })),
      "rec12w5".into() => new_record("rec12w5", json!({
        "fld12w4000000": ["rec12w2"],
      })),
      "rec12w6".into() => new_record("rec12w6", json!({
        "fld12w4000000": ["rec12w8"],
      })),
      "rec12w7".into() => new_record("rec12w7", json!({
        "fld12w4000000": ["rec12w1"]
      })),
      "rec12w8".into() => new_record("rec12w7", json!({})),
      "rec12w10".into() => new_record("rec12w10", json!({
        "fld12w2": ["rec11w10"],
        "fld12w4000000": ["rec12w12"]
      })),
      "rec12w11".into() => new_record("rec12w11", json!({
        "fld12w2": ["rec11w10"],
        "fld12w7": ["rec13w10"]
      })),
      "rec12w12".into() => new_record("rec12w12", json!({
        "fld12w2": ["rec11w11"],
        "fld12w4000000": ["rec12w11"]
      })),
    };
    if let Some(record_ids) = record_ids {
      records
        .into_iter()
        .filter(|(id, _)| record_ids.contains_ref(id))
        .collect()
    } else {
      records
    }
  }

  fn mock_dst13_meta() -> DatasheetMeta {
    DatasheetMeta {
      field_map: hashmap! {
        "fld13w1".into() => new_field("fld13w1", FieldKind::Text, json!({})),
        "fld13w2".into() => new_field("fld13w2", FieldKind::LookUp, json!({
          "datasheetId": "dst13",
          "relatedLinkFieldId": "fld13w3",
          "lookUpTargetFieldId": "fld12w4000000",
          "openFilter": false,
          "filterInfo": {
            "conjunction": "and",
            "conditions": [{ "fieldId": "fld12w6" }]
          }
        })),
        "fld13w3".into() => new_field("fld13w3", FieldKind::Link, json!({
          "foreignDatasheetId": "dst12",
          "brotherFieldId": "fld12w7",
        })),
        "fld13w4".into() => new_field("fld13w4", FieldKind::Link, json!({
          "foreignDatasheetId": "dst11",
          "brotherFieldId": "fld11w4",
        })),
      },
      views: vec![json!({
        "columns": [
          { "fieldId": "fld13w1" },
          { "fieldId": "fld13w2" },
          { "fieldId": "fld13w3" },
          { "fieldId": "fld13w4" },
        ]
      })],
      widget_panels: None,
    }
  }

  fn mock_dst13_detail_info() -> NodeDetailInfo {
    NodeDetailInfo {
      node: NodeInfo {
        id: "dst13".into(),
        name: "Dst 13".into(),
        description: "{}".into(),
        parent_id: "fod7777".into(),
        icon: "jaugt".into(),
        node_shared: false,
        node_permit_set: true,
        node_favorite: true,
        space_id: "spc1".into(),
        role: "manager".into(),
        permissions: NodePermissionState {
          is_deleted: None,
          permissions: Some(json!({
            "readable": true,
            "editable": true,
            "mock": "manager",
          })),
        },
        revision: 2873,
        is_ghost_node: None,
        active_view: None,
        extra: Some(json!({
          "showRecordHistory": true
        })),
      },
      field_permission_map: None,
    }
  }

  fn mock_dst13_record_map(record_ids: Option<Vec<&'static str>>) -> RecordMap {
    let records = hashmap! {
      "rec13w1".into() => new_record("rec13w1", json!({
        "fld13w3": ["rec12w2"],
        "fld13w4": ["rec11w2"],
      })),
      "rec13w2".into() => new_record("rec13w2", json!({})),
      "rec13w3".into() => new_record("rec13w3", json!({})),
      "rec13w10".into() => new_record("rec13w10", json!({
        "fld13w3": ["rec12w11"],
        "fld13w4": ["rec11w11"],
      })),
    };
    if let Some(record_ids) = record_ids {
      records
        .into_iter()
        .filter(|(id, _)| record_ids.contains_ref(id))
        .collect()
    } else {
      records
    }
  }

  fn new_field(id: &str, kind: FieldKind, property: Json) -> Field {
    Field {
      id: id.into(),
      name: id.to_uppercase(),
      desc: None,
      required: None,
      kind,
      property: Some(property),
    }
  }

  fn new_record(id: &str, data: Json) -> Record {
    Record {
      id: id.into(),
      comment_count: 0,
      data,
      created_at: 19999999,
      updated_at: None,
      revision_history: None,
      record_meta: None,
    }
  }

  fn mock_cmd(cmd: &str, args: Vec<RedisValue>) -> MockCommand {
    MockCommand {
      cmd: cmd.into(),
      subcommand: None,
      args,
    }
  }

  const MOCK_SPACE_ID_QUERY_SQL: &str = "\
    SELECT `space_id` \
    FROM `apitable_datasheet` \
    WHERE `dst_id` = :dst_id AND `is_deleted` = 0 \
    LIMIT 1";

  #[tokio::test]
  async fn single_datasheet_self_linking() {
    let mock_redis = Arc::new(MockRedis::new());
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "main datasheet",
          "dst1",
          Default::default(),
          FetchDataPackOrigin {
            internal: true,
            main: Some(true),
            ..Default::default()
          },
          Default::default()
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst1_meta(),
          record_map: mock_dst1_record_map(None),
          datasheet_id: "dst1".into()
        },
        datasheet: mock_dst1_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {}),
        units: vec![
          mock_unit_infos()["u1"].clone(),
          mock_unit_infos()["u2"].clone(),
          mock_user_infos()["7197"].clone(),
        ]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst1"
        }
      }]
    );

    assert_eq!(
      mock_redis.take_logs(),
      vec![
        mock_cmd(
          "SISMEMBER",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w30000000".into()),
            RedisValue::String("dst1:fld1w2".into()),
          ]
        ),
        mock_cmd(
          "SADD",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w30000000".into()),
            RedisValue::String("dst1:fld1w2".into()),
          ]
        ),
        mock_cmd(
          "EXPIRE",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w30000000".into()),
            RedisValue::Integer(*REF_STORAGE_EXPIRE_TIME),
          ]
        ),
        mock_cmd(
          "SISMEMBER",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w50000000".into()),
            RedisValue::String("dst1:fld1w2".into()),
          ]
        ),
        mock_cmd(
          "SADD",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w50000000".into()),
            RedisValue::String("dst1:fld1w2".into()),
          ]
        ),
        mock_cmd(
          "EXPIRE",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w50000000".into()),
            RedisValue::Integer(*REF_STORAGE_EXPIRE_TIME),
          ]
        ),
        mock_cmd(
          "SMEMBERS",
          vec![RedisValue::Bytes("vikadata:nest:fieldRef:dst1:fld1w2".into()),]
        ),
        mock_cmd(
          "SADD",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldRef:dst1:fld1w2".into()),
            RedisValue::String("dst1:fld1w30000000".into()),
            RedisValue::String("dst1:fld1w50000000".into()),
          ]
        ),
        mock_cmd(
          "EXPIRE",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldRef:dst1:fld1w2".into()),
            RedisValue::Integer(*REF_STORAGE_EXPIRE_TIME),
          ]
        ),
      ]
    );

    assert_eq!(
      mock_redis.take_store(),
      hashmap! {
        "vikadata:nest:fieldRef:dst1:fld1w2".into() =>
          MockValue::Set(hashset!["dst1:fld1w30000000".into(), "dst1:fld1w50000000".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w30000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w50000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
      }
    );
  }

  #[tokio::test]
  async fn single_datasheet_self_linking_override_old_references() {
    let mock_redis = Arc::new(MockRedis::new().with_store(hashmap! {
      "vikadata:nest:fieldRef:dst1:fld1w2".into() =>
        MockValue::Set(hashset!["dst1:fld1w20000000".into(), "dst1:fld1w30000000".into()]),
      "vikadata:nest:fieldReRef:dst1:fld1w30000000".into() =>
        MockValue::Set(hashset!["dst1:fld1w2".into()]),
      "vikadata:nest:fieldReRef:dst1:fld1w20000000".into() =>
        MockValue::Set(hashset!["dst1:fld1w2".into()]),
    }));
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "main datasheet",
          "dst1",
          Default::default(),
          FetchDataPackOrigin {
            internal: true,
            main: Some(true),
            ..Default::default()
          },
          Default::default()
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst1_meta(),
          record_map: mock_dst1_record_map(None),
          datasheet_id: "dst1".into()
        },
        datasheet: mock_dst1_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {}),
        units: vec![
          mock_unit_infos()["u1"].clone(),
          mock_unit_infos()["u2"].clone(),
          mock_user_infos()["7197"].clone(),
        ]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst1"
        },
      }],
    );

    assert_eq!(
      mock_redis.take_logs(),
      vec![
        mock_cmd(
          "SISMEMBER",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w30000000".into()),
            "dst1:fld1w2".into(),
          ]
        ),
        mock_cmd(
          "SISMEMBER",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w50000000".into()),
            "dst1:fld1w2".into(),
          ]
        ),
        mock_cmd(
          "SADD",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w50000000".into()),
            "dst1:fld1w2".into(),
          ]
        ),
        mock_cmd(
          "EXPIRE",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w50000000".into()),
            (*REF_STORAGE_EXPIRE_TIME).into(),
          ]
        ),
        mock_cmd(
          "SMEMBERS",
          vec![RedisValue::Bytes("vikadata:nest:fieldRef:dst1:fld1w2".into()),]
        ),
        mock_cmd(
          "DEL",
          vec![RedisValue::Bytes("vikadata:nest:fieldRef:dst1:fld1w2".into()),]
        ),
        mock_cmd(
          "SISMEMBER",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w20000000".into()),
            "dst1:fld1w2".into(),
          ]
        ),
        mock_cmd(
          "SCARD",
          vec![RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w20000000".into()),]
        ),
        mock_cmd(
          "DEL",
          vec![RedisValue::Bytes("vikadata:nest:fieldReRef:dst1:fld1w20000000".into()),]
        ),
        mock_cmd(
          "SADD",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldRef:dst1:fld1w2".into()),
            "dst1:fld1w30000000".into(),
            "dst1:fld1w50000000".into(),
          ]
        ),
        mock_cmd(
          "EXPIRE",
          vec![
            RedisValue::Bytes("vikadata:nest:fieldRef:dst1:fld1w2".into()),
            (*REF_STORAGE_EXPIRE_TIME).into(),
          ]
        ),
      ]
    );

    assert_eq!(
      mock_redis.take_store(),
      hashmap! {
        "vikadata:nest:fieldRef:dst1:fld1w2".into() => MockValue::Set(hashset!["dst1:fld1w30000000".into(), "dst1:fld1w50000000".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w30000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w50000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
      }
    );
  }

  #[tokio::test]
  async fn single_datasheet_self_linking_partial_records() {
    let mock_redis = Arc::new(MockRedis::new());
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "main datasheet",
          "dst1",
          Default::default(),
          FetchDataPackOrigin {
            internal: true,
            main: Some(true),
            ..Default::default()
          },
          Some(FetchDataPackOptions {
            record_ids: Some(vec!["rec1w1".into(), "rec1w2".into(), "rec1w3".into()]),
            ..Default::default()
          })
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst1_meta(),
          record_map: mock_dst1_record_map(Some(vec!["rec1w1", "rec1w2", "rec1w3"])),
          datasheet_id: "dst1".into()
        },
        datasheet: mock_dst1_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {}),
        units: vec![
          mock_unit_infos()["u1"].clone(),
          mock_unit_infos()["u2"].clone(),
          mock_user_infos()["7197"].clone(),
        ]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst1"
        },
      }]
    );

    assert_eq!(
      mock_redis.take_store(),
      hashmap! {
        "vikadata:nest:fieldRef:dst1:fld1w2".into() => MockValue::Set(hashset!["dst1:fld1w30000000".into(), "dst1:fld1w50000000".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w30000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w50000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
      }
    );
  }

  #[tokio::test]
  async fn reprocess_dirty_fields() {
    let mock_redis = Arc::new(MockRedis::new());
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "main datasheet",
          "dst11",
          Default::default(),
          FetchDataPackOrigin {
            internal: true,
            main: Some(true),
            ..Default::default()
          },
          Some(FetchDataPackOptions {
            record_ids: Some(vec!["rec11w1".into(), "rec11w2".into(), "rec11w3".into()]),
            ..Default::default()
          }),
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst11_meta(),
          record_map: mock_dst11_record_map(Some(vec!["rec11w1", "rec11w2", "rec11w3"])),
          datasheet_id: "dst11".into()
        },
        datasheet: mock_dst11_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {
          "dst12".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst12_meta(),
              record_map: mock_dst12_record_map(
                Some(vec!["rec12w1", "rec12w2", "rec12w3", "rec12w4", "rec12w5", "rec12w6"])),
              datasheet_id: "dst12".into(),
            },
            datasheet: serde_json::to_value(mock_dst12_detail_info().node).unwrap(),
            field_permission_map: None,
          },
          "dst13".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst13_meta(),
              record_map: mock_dst13_record_map(Some(vec!["rec13w1"])),
              datasheet_id: "dst13".into(),
            },
            datasheet: serde_json::to_value(mock_dst13_detail_info().node).unwrap(),
            field_permission_map: None,
          },
        }),
        units: vec![mock_unit_infos()["u3"].clone(), mock_unit_infos()["u2"].clone(),]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst11",
        }
      }]
    );

    let mut redis_store = mock_redis.take_store().into_iter().collect::<Vec<_>>();
    redis_store.sort_by(|(key1, _), (key2, _)| key1.cmp(key2));
    assert_eq!(
      redis_store,
      vec![
        (
          "vikadata:nest:fieldReRef:dst12:fld12w1".into(),
          MockValue::Set(hashset![
            "dst11:fld11w2".into(),
            "dst12:fld12w4000000".into(),
            "dst13:fld13w3".into(),
          ])
        ),
        (
          "vikadata:nest:fieldReRef:dst12:fld12w3".into(),
          MockValue::Set(hashset!["dst11:fld11w3".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst12:fld12w4000000".into(),
          MockValue::Set(hashset!["dst12:fld12w3".into(), "dst13:fld13w2".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst12:fld12w5".into(),
          MockValue::Set(hashset!["dst11:fld11w3".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst13:fld13w1".into(),
          MockValue::Set(hashset!["dst11:fld11w4".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst13:fld13w2".into(),
          MockValue::Set(hashset!["dst11:fld11w5".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w2".into(),
          MockValue::Set(hashset!["dst12:fld12w1".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w3".into(),
          MockValue::Set(hashset!["dst12:fld12w3".into(), "dst12:fld12w5".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w4".into(),
          MockValue::Set(hashset!["dst13:fld13w1".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w5".into(),
          MockValue::Set(hashset!["dst13:fld13w2".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst12:fld12w3".into(),
          MockValue::Set(hashset!["dst12:fld12w4000000".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst12:fld12w4000000".into(),
          MockValue::Set(hashset!["dst12:fld12w1".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst13:fld13w2".into(),
          MockValue::Set(hashset!["dst12:fld12w4000000".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst13:fld13w3".into(),
          MockValue::Set(hashset!["dst12:fld12w1".into()])
        ),
      ]
    );
  }

  #[tokio::test]
  async fn reprocess_nondirty_fields() {
    let mock_redis = Arc::new(MockRedis::new());
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "main datasheet",
          "dst11",
          Default::default(),
          FetchDataPackOrigin {
            internal: true,
            main: Some(true),
            ..Default::default()
          },
          Some(FetchDataPackOptions {
            record_ids: Some(vec!["rec11w10".into(), "rec11w11".into(), "rec11w12".into()]),
            ..Default::default()
          }),
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst11_meta(),
          record_map: mock_dst11_record_map(Some(vec!["rec11w10", "rec11w11", "rec11w12"])),
          datasheet_id: "dst11".into()
        },
        datasheet: mock_dst11_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {
          "dst12".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst12_meta(),
              record_map: mock_dst12_record_map(Some(vec!["rec12w10", "rec12w11", "rec12w12"])),
              datasheet_id: "dst12".into(),
            },
            datasheet: serde_json::to_value(mock_dst12_detail_info().node).unwrap(),
            field_permission_map: None,
          },
          "dst13".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst13_meta(),
              record_map: mock_dst13_record_map(Some(vec!["rec13w10"])),
              datasheet_id: "dst13".into(),
            },
            datasheet: serde_json::to_value(mock_dst13_detail_info().node).unwrap(),
            field_permission_map: None,
          },
        }),
        units: vec![mock_unit_infos()["u3"].clone(), mock_unit_infos()["u2"].clone(),]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst11"
        }
      }]
    );

    let mut redis_store = mock_redis.take_store().into_iter().collect::<Vec<_>>();
    redis_store.sort_by(|(key1, _), (key2, _)| key1.cmp(key2));
    assert_eq!(
      redis_store,
      vec![
        (
          "vikadata:nest:fieldReRef:dst12:fld12w1".into(),
          MockValue::Set(hashset![
            "dst11:fld11w2".into(),
            "dst12:fld12w4000000".into(),
            "dst13:fld13w3".into(),
          ])
        ),
        (
          "vikadata:nest:fieldReRef:dst12:fld12w3".into(),
          MockValue::Set(hashset!["dst11:fld11w3".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst12:fld12w4000000".into(),
          MockValue::Set(hashset!["dst12:fld12w3".into(), "dst13:fld13w2".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst12:fld12w5".into(),
          MockValue::Set(hashset!["dst11:fld11w3".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst13:fld13w1".into(),
          MockValue::Set(hashset!["dst11:fld11w4".into()])
        ),
        (
          "vikadata:nest:fieldReRef:dst13:fld13w2".into(),
          MockValue::Set(hashset!["dst11:fld11w5".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w2".into(),
          MockValue::Set(hashset!["dst12:fld12w1".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w3".into(),
          MockValue::Set(hashset!["dst12:fld12w3".into(), "dst12:fld12w5".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w4".into(),
          MockValue::Set(hashset!["dst13:fld13w1".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst11:fld11w5".into(),
          MockValue::Set(hashset!["dst13:fld13w2".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst12:fld12w3".into(),
          MockValue::Set(hashset!["dst12:fld12w4000000".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst12:fld12w4000000".into(),
          MockValue::Set(hashset!["dst12:fld12w1".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst13:fld13w2".into(),
          MockValue::Set(hashset!["dst12:fld12w4000000".into()])
        ),
        (
          "vikadata:nest:fieldRef:dst13:fld13w3".into(),
          MockValue::Set(hashset!["dst12:fld12w1".into()])
        ),
      ]
    );
  }

  #[tokio::test]
  async fn share_linked_datasheets() {
    let mock_redis = Arc::new(MockRedis::new());
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "shared datasheet",
          "dst11",
          Default::default(),
          FetchDataPackOrigin {
            internal: false,
            main: Some(true),
            share_id: Some("shr1".into()),
            ..Default::default()
          },
          Some(FetchDataPackOptions {
            record_ids: Some(vec!["rec11w10".into(), "rec11w11".into(), "rec11w12".into()]),
            ..Default::default()
          }),
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst11_meta(),
          record_map: mock_dst11_record_map(Some(vec!["rec11w10", "rec11w11", "rec11w12"])),
          datasheet_id: "dst11".into()
        },
        datasheet: mock_dst11_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {
          "dst12".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst12_meta(),
              record_map: mock_dst12_record_map(Some(vec!["rec12w10", "rec12w11", "rec12w12"])),
              datasheet_id: "dst12".into(),
            },
            datasheet: serde_json::to_value(mock_dst12_detail_info().node).unwrap(),
            field_permission_map: None,
          },
          "dst13".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst13_meta(),
              record_map: mock_dst13_record_map(Some(vec!["rec13w10"])),
              datasheet_id: "dst13".into(),
            },
            datasheet: serde_json::to_value(mock_dst13_detail_info().node).unwrap(),
            field_permission_map: None,
          },
        }),
        units: vec![mock_unit_infos()["u3"].clone(), mock_unit_infos()["u2"].clone(),]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst11"
        }
      }]
    );
  }

  #[tokio::test]
  async fn template_self_linking() {
    let mock_redis = Arc::new(MockRedis::new());
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "main datasheet",
          "dst1",
          Default::default(),
          FetchDataPackOrigin {
            internal: false,
            main: Some(true),
            ..Default::default()
          },
          Default::default()
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst1_meta(),
          record_map: mock_dst1_record_map(None),
          datasheet_id: "dst1".into()
        },
        datasheet: mock_dst1_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {}),
        units: vec![
          mock_unit_infos()["u1"].clone(),
          mock_unit_infos()["u2"].clone(),
          mock_user_infos()["7197"].clone(),
        ]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst1"
        }
      }]
    );

    assert_eq!(
      mock_redis.take_store(),
      hashmap! {
        "vikadata:nest:fieldRef:dst1:fld1w2".into() =>
          MockValue::Set(hashset!["dst1:fld1w30000000".into(), "dst1:fld1w50000000".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w30000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
        "vikadata:nest:fieldReRef:dst1:fld1w50000000".into() => MockValue::Set(hashset!["dst1:fld1w2".into()]),
      }
    );
  }

  #[tokio::test]
  async fn specify_linked_record_map() {
    let mock_redis = Arc::new(MockRedis::new());
    let module = init_module(
      [
        mock_rows([("space_id", ColumnType::MYSQL_TYPE_VARCHAR)], [["spc1".into()]]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([], [] as [Vec<Value>; 0]),
        mock_rows([("is_enabled", ColumnType::MYSQL_TYPE_VARCHAR)], [[false.into()]]),
      ],
      mock_redis.clone(),
    )
    .await;
    let datasheet_service: &dyn DatasheetService = module.resolve_ref();

    let data_pack = assert_ok!(
      datasheet_service
        .fetch_data_pack(
          "main datasheet",
          "dst11",
          Default::default(),
          FetchDataPackOrigin {
            internal: true,
            main: Some(true),
            ..Default::default()
          },
          Some(FetchDataPackOptions {
            record_ids: Some(vec!["rec11w10".into(), "rec11w11".into(), "rec11w12".into()]),
            linked_record_map: Some(hashmap! {
              "dst12".into() => vec!["rec12w11".into()],
            }),
            ..Default::default()
          }),
        )
        .await
    );

    assert_eq!(
      data_pack,
      DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: mock_dst11_meta(),
          record_map: mock_dst11_record_map(Some(vec!["rec11w10", "rec11w11", "rec11w12"])),
          datasheet_id: "dst11".into()
        },
        datasheet: mock_dst11_detail_info().node,
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {
          "dst12".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst12_meta(),
              record_map: mock_dst12_record_map(Some(vec!["rec12w11"])),
              datasheet_id: "dst12".into(),
            },
            datasheet: serde_json::to_value(mock_dst12_detail_info().node).unwrap(),
            field_permission_map: None,
          },
          "dst13".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: mock_dst13_meta(),
              record_map: mock_dst13_record_map(Some(vec![])),
              datasheet_id: "dst13".into(),
            },
            datasheet: serde_json::to_value(mock_dst13_detail_info().node).unwrap(),
            field_permission_map: None,
          },
        }),
        units: vec![mock_unit_infos()["u3"].clone(), mock_unit_infos()["u2"].clone(),]
      },
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_SPACE_ID_QUERY_SQL.into(),
        params: params! {
          "dst_id" => "dst11"
        }
      }]
    );
  }
}
