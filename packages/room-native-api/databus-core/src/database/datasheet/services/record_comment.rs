use crate::repository::Repository;
use crate::types::HashMap;
use anyhow::Context;
use async_trait::async_trait;
use futures::TryStreamExt;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait DatasheetRecordCommentService: Interface {
  async fn get_record_comment_map_by_dst_id(&self, dst_id: &str) -> anyhow::Result<HashMap<String, i64>>;
}

#[derive(Component)]
#[shaku(interface = DatasheetRecordCommentService)]
pub struct DatasheetRecordCommentServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl DatasheetRecordCommentService for DatasheetRecordCommentServiceImpl {
  async fn get_record_comment_map_by_dst_id(&self, dst_id: &str) -> anyhow::Result<HashMap<String, i64>> {
    let mut client = self.repo.get_client().await?;
    let result = client
      .query_all(
        format!(
          "\
            SELECT `record_id`, COUNT(*) AS `count` \
            FROM `{}datasheet_record_comment` \
            WHERE `dst_id` = :dst_id AND `is_deleted` = 0 \
            GROUP BY `record_id`",
          self.repo.table_prefix()
        ),
        params! {
          dst_id,
        },
      )
      .await
      .with_context(|| format!("get record comments of {dst_id}"))?
      .try_collect::<HashMap<String, i64>>()
      .await
      .with_context(|| format!("collect record comments of {dst_id}"))?;
    Ok(result)
  }
}
