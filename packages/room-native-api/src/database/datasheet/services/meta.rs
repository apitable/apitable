use crate::repository::Repository;
use crate::types::Json;
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait DatasheetMetaService: Interface {
  async fn get_meta_data_by_dst_id(&self, dst_id: &str, include_deleted: bool) -> anyhow::Result<Option<Json>>;
}

#[derive(Component)]
#[shaku(interface = DatasheetMetaService)]
pub struct DatasheetMetaServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl DatasheetMetaService for DatasheetMetaServiceImpl {
  async fn get_meta_data_by_dst_id(&self, dst_id: &str, include_deleted: bool) -> anyhow::Result<Option<Json>> {
    let mut client = self.repo.get_client().await?;
    let mut query = format!(
      "
      SELECT `meta_data` \
      FROM `{prefix}datasheet_meta` \
      WHERE `dst_id` = :dst_id",
      prefix = self.repo.table_prefix()
    );
    if !include_deleted {
      query.push_str(" AND is_deleted = 0");
    }
    Ok(
      client
        .query_one(
          query,
          params! {
            dst_id
          },
        )
        .await
        .with_context(|| format!("get datasheet meta data of {dst_id}"))?,
    )
  }
}

#[cfg(test)]
pub mod mock {
  use super::*;
  use crate::types::HashMap;

  #[derive(Component, Default)]
  #[shaku(interface = DatasheetMetaService)]
  pub struct MockDatasheetMetaServiceImpl {
    metas: HashMap<&'static str, Json>,
  }

  impl MockDatasheetMetaServiceImpl {
    pub fn new() -> Self {
      Self::default()
    }

    pub fn with_metas(mut self, metas: HashMap<&'static str, Json>) -> Self {
      self.metas = metas;
      self
    }

    pub fn build(self) -> Box<dyn DatasheetMetaService> {
      Box::new(self)
    }
  }

  #[async_trait]
  impl DatasheetMetaService for MockDatasheetMetaServiceImpl {
    async fn get_meta_data_by_dst_id(&self, dst_id: &str, _include_deleted: bool) -> anyhow::Result<Option<Json>> {
      Ok(self.metas.get(dst_id).cloned())
    }
  }
}
