use crate::repository::Repository;
use anyhow::Context;
use async_trait::async_trait;
use futures::TryStreamExt;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait NodeChildrenService: Interface {
  async fn has_children(&self, node_id: &str) -> anyhow::Result<bool>;

  async fn get_children_ids(&self, node_id: &str) -> anyhow::Result<Vec<String>>;
}

#[derive(Component)]
#[shaku(interface = NodeChildrenService)]
pub struct NodeChildrenServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl NodeChildrenService for NodeChildrenServiceImpl {
  async fn has_children(&self, node_id: &str) -> anyhow::Result<bool> {
    let mut client = self.repo.get_client().await?;

    Ok(
      client
        .query_one(
          format!(
            "\
            SELECT COUNT(1) AS `count` \
            FROM `{prefix}node` \
            WHERE `parent_id` = :node_id AND `is_rubbish` = 0\
            ",
            prefix = self.repo.table_prefix()
          ),
          params! {
            node_id
          },
        )
        .await
        .with_context(|| format!("get has_children {node_id}"))?
        .map_or(false, |count: i64| count > 0),
    )
  }

  async fn get_children_ids(&self, node_id: &str) -> anyhow::Result<Vec<String>> {
    let mut client = self.repo.get_client().await?;
    // todo(itou): replace dynamic sql
    let ids = client
      .query_all(
        format!(
          "\
            WITH RECURSIVE sub_ids (node_id) AS \
            ( \
              SELECT node_id \
              FROM {prefix}node \
              WHERE parent_id = :node_id and is_rubbish = 0 \
              UNION ALL \
              SELECT c.node_id \
              FROM sub_ids AS cp \
              JOIN {prefix}node AS c ON cp.node_id = c.parent_id and c.is_rubbish = 0 \
            ) \
            SELECT distinct node_id nodeId \
            FROM sub_ids\
          ",
          prefix = self.repo.table_prefix()
        ),
        params! {
          node_id,
        },
      )
      .await?
      .try_collect()
      .await
      .with_context(|| format!("get children ids {node_id}"))?;
    Ok(ids)
  }
}
