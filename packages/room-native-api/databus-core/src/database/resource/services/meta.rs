use crate::repository::Repository;
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait ResourceMetaService: Interface {
  async fn get_revision_by_res_id(&self, res_id: &str) -> anyhow::Result<Option<u64>>;
}

#[derive(Component)]
#[shaku(interface = ResourceMetaService)]
pub struct ResourceMetaServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl ResourceMetaService for ResourceMetaServiceImpl {
  async fn get_revision_by_res_id(&self, res_id: &str) -> anyhow::Result<Option<u64>> {
    let mut client = self.repo.get_client().await?;
    Ok(
      client
        .query_one(
          format!(
            "\
              SELECT `revision` \
              FROM `{prefix}resource_meta` \
              WHERE `resource_id` = :res_id AND `is_deleted` = 0\
            ",
            prefix = self.repo.table_prefix()
          ),
          params! {
            res_id
          },
        )
        .await
        .with_context(|| format!("get revision by resource id {res_id}"))?,
    )
  }
}
