use crate::repository::Repository;
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait NodeDescService: Interface {
  async fn get_description(&self, node_id: &str) -> anyhow::Result<Option<String>>;
}

#[derive(Component)]
#[shaku(interface = NodeDescService)]
pub struct NodeDescServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl NodeDescService for NodeDescServiceImpl {
  async fn get_description(&self, node_id: &str) -> anyhow::Result<Option<String>> {
    let mut client = self.repo.get_client().await?;
    Ok(
      client
        .query_one(
          format!(
            "\
              SELECT `description` \
              FROM `{prefix}node_desc` \
              WHERE `node_id` = :node_id\
            ",
            prefix = self.repo.table_prefix()
          ),
          params! {
            node_id
          },
        )
        .await
        .with_context(|| format!("get description of {node_id}"))?,
    )
  }
}
