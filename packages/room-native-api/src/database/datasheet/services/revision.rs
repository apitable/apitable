use crate::repository::Repository;
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

/// NOTE Separate this service from DatasheetService to avoid circular dependency.
#[async_trait]
pub trait DatasheetRevisionService: Interface {
  async fn get_revision_by_dst_id(&self, dst_id: &str) -> anyhow::Result<Option<u64>>;
}

#[derive(Component)]
#[shaku(interface = DatasheetRevisionService)]
pub struct DatasheetRevisionServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl DatasheetRevisionService for DatasheetRevisionServiceImpl {
  async fn get_revision_by_dst_id(&self, dst_id: &str) -> anyhow::Result<Option<u64>> {
    let mut client = self.repo.get_client().await?;
    Ok(
      client
        .query_one(
          format!(
            "\
              SELECT `revision` \
              FROM `{prefix}datasheet` \
              WHERE `dst_id` = :dst_id AND `is_deleted` = 0\
            ",
            prefix = self.repo.table_prefix()
          ),
          params! {
            dst_id
          },
        )
        .await
        .with_context(|| format!("get revision by dst id {dst_id}"))?,
    )
  }
}
