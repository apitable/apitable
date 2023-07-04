use crate::database::datasheet::services::meta::DatasheetMetaService;
use crate::database::datasheet::services::record::DatasheetRecordService;
use crate::database::datasheet::types::{DatasheetMeta, WidgetPanel};
use crate::database::types::{BaseDatasheetPack, DatasheetSnapshot, FieldMap, RecordMap};
use crate::node::services::node::NodeService;
use crate::repository::Repository;
use crate::shared::types::{AuthHeader, FetchDataPackOrigin};
use crate::types::{HashSet, Json};
use anyhow::{anyhow, Context};
use async_trait::async_trait;
use mysql_async::params;
use std::sync::Arc;
use tokio::sync::Mutex;

/// Only used for dependency analysis
#[derive(Debug, Clone)]
pub struct InternalDatasheetMeta {
  pub field_map: Arc<FieldMap>,
  pub views: Vec<Json>,
  pub widget_panels: Option<Vec<WidgetPanel>>,
}

/// Only used for dependency analysis. Since tokio `Mutex` is not serde-able, a new type is required
/// to be able to modify `record_map`.
#[derive(Debug, Clone)]
pub struct InternalDatasheetSnapshot {
  pub meta: InternalDatasheetMeta,
  pub record_map: Arc<Mutex<RecordMap>>,
  pub datasheet_id: String,
}

/// Only used for dependency analysis
#[derive(Debug, Clone)]
pub struct InternalBaseDatasheetPack {
  pub snapshot: InternalDatasheetSnapshot,
  pub datasheet: Json,
  pub field_permission_map: Option<Json>,
}

#[cfg(test)]
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ForeignDatasheetLoadLog {
  LoadDatasheet {
    dst_id: String,
  },
  FetchRecords {
    dst_id: String,
    record_ids: HashSet<String>,
  },
}

#[async_trait]
pub trait ForeignDatasheetLoader: Send + Sync {
  /// Loads a foreign datasheet pack without recordMap.
  ///
  /// If the datasheet does not exist or is not unaccessible, `None` is returned.
  async fn load_foreign_datasheet(&self, dst_id: &str) -> anyhow::Result<Option<InternalBaseDatasheetPack>>;

  async fn fetch_record_map(&self, dst_id: &str, record_ids: HashSet<String>) -> anyhow::Result<RecordMap>;
}

pub(super) struct ForeignDatasheetLoaderImpl {
  meta_service: Arc<dyn DatasheetMetaService>,
  node_service: Arc<dyn NodeService>,
  record_service: Arc<dyn DatasheetRecordService>,
  repo: Arc<dyn Repository>,
  auth: AuthHeader,
  origin: FetchDataPackOrigin,
  without_permission: bool,
}

impl ForeignDatasheetLoaderImpl {
  pub(super) fn new(
    meta_service: Arc<dyn DatasheetMetaService>,
    node_service: Arc<dyn NodeService>,
    record_service: Arc<dyn DatasheetRecordService>,
    repo: Arc<dyn Repository>,
    auth: AuthHeader,
    origin: FetchDataPackOrigin,
    without_permission: bool,
  ) -> Self {
    Self {
      meta_service,
      node_service,
      record_service,
      repo,
      auth,
      origin,
      without_permission,
    }
  }
}

#[async_trait]
impl ForeignDatasheetLoader for ForeignDatasheetLoaderImpl {
  async fn load_foreign_datasheet(&self, dst_id: &str) -> anyhow::Result<Option<InternalBaseDatasheetPack>> {
    let meta: DatasheetMeta = match self.meta_service.get_meta_data_by_dst_id(dst_id, false).await {
      Ok(Some(meta)) => serde_json::from_value(meta)
        .map_err(|err| anyhow!("load foreign datasheet {dst_id}: parse meta data error: {err}"))?,
      Ok(None) => return Ok(None),
      Err(err) => {
        tracing::error!("load foreign datasheet {dst_id}: get meta data error: {err}");
        return Ok(None);
      }
    };

    if self.without_permission {
      match self.get_base_info_by_dst_id(dst_id).await {
        Ok(Some(node)) => {
          return Ok(Some(InternalBaseDatasheetPack {
            snapshot: InternalDatasheetSnapshot {
              meta: meta.into(),
              record_map: Default::default(),
              datasheet_id: dst_id.to_owned(),
            },
            datasheet: node,
            field_permission_map: None,
          }))
        }
        Ok(None) => return Ok(None),
        Err(err) => {
          tracing::error!("load foreign datasheet {dst_id}: get base info error: {err}");
          return Ok(None);
        }
      }
    }

    let info = match self
      .node_service
      .get_node_detail_info(dst_id, &self.auth, &self.origin)
      .await
    {
      Ok(info) => info,
      Err(err) => {
        tracing::error!("load foreign datasheet {}: get node detail info error: {}", dst_id, err);
        return Ok(None);
      }
    };

    let node = serde_json::to_value(&info.node)
      .map_err(|err| anyhow!("load foreign datasheet {}: node info to error: {}", dst_id, err))?;

    Ok(Some(InternalBaseDatasheetPack {
      snapshot: InternalDatasheetSnapshot {
        meta: meta.into(),
        record_map: Default::default(),
        datasheet_id: dst_id.to_owned(),
      },
      datasheet: node,
      field_permission_map: info.field_permission_map,
    }))
  }

  async fn fetch_record_map(&self, dst_id: &str, record_ids: HashSet<String>) -> anyhow::Result<RecordMap> {
    Ok(
      self
        .record_service
        .get_records(dst_id, Some(record_ids.into_iter().collect()), false, true)
        .await
        .with_context(|| format!("fetch record map of {dst_id}"))?,
    )
  }
}

impl ForeignDatasheetLoaderImpl {
  async fn get_base_info_by_dst_id(&self, dst_id: &str) -> anyhow::Result<Option<Json>> {
    let mut client = self.repo.get_client().await?;

    Ok(
      client
        .query_one(
          format!(
            "\
              SELECT `dst_id`, `dst_name`, `revision` \
              FROM `{prefix}datasheet` \
              WHERE `dst_id` = :dst_id and `is_deleted` = 0\
            ",
            prefix = self.repo.table_prefix()
          ),
          params! {
            dst_id,
          },
        )
        .await
        .with_context(|| format!("get base info of dst {dst_id}"))?,
    )
  }
}

impl Into<BaseDatasheetPack> for InternalBaseDatasheetPack {
  fn into(self) -> BaseDatasheetPack {
    BaseDatasheetPack {
      snapshot: self.snapshot.into(),
      datasheet: self.datasheet,
      field_permission_map: self.field_permission_map,
    }
  }
}

impl Into<DatasheetSnapshot> for InternalDatasheetSnapshot {
  fn into(self) -> DatasheetSnapshot {
    DatasheetSnapshot {
      meta: self.meta.into(),
      record_map: Arc::try_unwrap(self.record_map).unwrap().into_inner(),
      datasheet_id: self.datasheet_id,
    }
  }
}

impl From<DatasheetSnapshot> for InternalDatasheetSnapshot {
  fn from(value: DatasheetSnapshot) -> Self {
    Self {
      meta: value.meta.into(),
      record_map: Arc::new(Mutex::new(value.record_map)),
      datasheet_id: value.datasheet_id,
    }
  }
}

impl Into<DatasheetMeta> for InternalDatasheetMeta {
  fn into(self) -> DatasheetMeta {
    DatasheetMeta {
      field_map: Arc::try_unwrap(self.field_map).unwrap(),
      views: self.views,
      widget_panels: self.widget_panels,
    }
  }
}

impl From<DatasheetMeta> for InternalDatasheetMeta {
  fn from(value: DatasheetMeta) -> Self {
    Self {
      field_map: Arc::new(value.field_map),
      views: value.views,
      widget_panels: value.widget_panels,
    }
  }
}

#[cfg(test)]
pub mod mock {
  use super::*;
  use crate::HashMap;

  #[derive(Debug)]
  pub struct MockForeignDatasheetLoaderImpl {
    datasheets: HashMap<String, BaseDatasheetPack>,
    logs: Mutex<Vec<ForeignDatasheetLoadLog>>,
  }

  impl MockForeignDatasheetLoaderImpl {
    pub fn new(datasheets: HashMap<String, BaseDatasheetPack>) -> Arc<Self> {
      Arc::new(Self {
        datasheets,
        logs: Default::default(),
      })
    }

    pub fn into_logs(self) -> Vec<ForeignDatasheetLoadLog> {
      self.logs.into_inner()
    }
  }

  #[async_trait]
  impl ForeignDatasheetLoader for MockForeignDatasheetLoaderImpl {
    async fn load_foreign_datasheet(&self, dst_id: &str) -> anyhow::Result<Option<InternalBaseDatasheetPack>> {
      self
        .logs
        .lock()
        .await
        .push(ForeignDatasheetLoadLog::LoadDatasheet { dst_id: dst_id.into() });
      Ok(self.datasheets.get(dst_id).map(|dst_pack| InternalBaseDatasheetPack {
        snapshot: InternalDatasheetSnapshot {
          meta: InternalDatasheetMeta {
            field_map: Arc::new(dst_pack.snapshot.meta.field_map.clone()),
            views: dst_pack.snapshot.meta.views.clone(),
            widget_panels: dst_pack.snapshot.meta.widget_panels.clone(),
          },
          record_map: Default::default(),
          datasheet_id: dst_pack.snapshot.datasheet_id.clone(),
        },
        datasheet: dst_pack.datasheet.clone(),
        field_permission_map: dst_pack.field_permission_map.clone(),
      }))
    }

    async fn fetch_record_map(&self, dst_id: &str, record_ids: HashSet<String>) -> anyhow::Result<RecordMap> {
      self.logs.lock().await.push(ForeignDatasheetLoadLog::FetchRecords {
        dst_id: dst_id.into(),
        record_ids: record_ids.clone(),
      });
      Ok(self.datasheets.get(dst_id).map_or(Default::default(), |dst_pack| {
        dst_pack
          .snapshot
          .record_map
          .iter()
          .filter(|(id, _)| record_ids.contains(*id))
          .map(|(id, record)| (id.clone(), record.clone()))
          .collect()
      }))
    }
  }
}
