use super::children::NodeChildrenService;
use crate::repository::Repository;
use crate::types::Json;
use crate::util::{OptionBoolExt, SliceExt};
use anyhow::Context;
use async_trait::async_trait;
use mysql_async::params;
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait NodeShareSettingService: Interface {
  async fn get_share_status_by_node_id(&self, node_id: &str) -> anyhow::Result<bool>;

  async fn get_share_props(&self, node_id: &str, share_id: &str) -> anyhow::Result<Option<Json>>;
}

#[derive(Component)]
#[shaku(interface = NodeShareSettingService)]
pub struct NodeShareSettingServiceImpl {
  #[shaku(inject)]
  repo: Arc<dyn Repository>,

  #[shaku(inject)]
  children_service: Arc<dyn NodeChildrenService>,
}

#[async_trait]
impl NodeShareSettingService for NodeShareSettingServiceImpl {
  async fn get_share_status_by_node_id(&self, node_id: &str) -> anyhow::Result<bool> {
    let mut client = self.repo.get_client().await?;

    Ok(
      client
        .query_one(
          format!(
            "\
            SELECT `is_enabled` \
            FROM `{prefix}node_share_setting` \
            WHERE `node_id` = :node_id\
            ",
            prefix = self.repo.table_prefix()
          ),
          params! { node_id },
        )
        .await
        .with_context(|| format!("get share status {node_id}"))?
        .is_truthy(),
    )
  }

  async fn get_share_props(&self, node_id: &str, share_id: &str) -> anyhow::Result<Option<Json>> {
    let mut client = self.repo.get_client().await?;
    let share_setting = client
      .query_one(
        format!(
          "\
            SELECT `node_id`, `is_enabled`, `props` \
            FROM `{prefix}node_share_setting` \
            WHERE `share_id` = :share_id",
          prefix = self.repo.table_prefix()
        ),
        params! {
          share_id,
        },
      )
      .await
      .with_context(|| format!("get share setting of node {node_id}, share {share_id}"))?;
    let Some((share_node_id, is_enabled, props)) : Option<(String, Option<bool>, Option<Json>)> = share_setting else {
      return Ok(None);
    };
    if !is_enabled.is_truthy() {
      return Ok(None);
    }
    // Check if the node enables sharing
    if share_node_id == node_id {
      return Ok(props);
    }
    // Check if the node has children nodes
    let has_children = self
      .children_service
      .has_children(&share_node_id)
      .await
      .with_context(|| format!("get share has_children of node {}, share {share_id}", share_node_id))?;
    if has_children {
      // Children nodes exist
      let children_nodes = self
        .children_service
        .get_children_ids(&share_node_id)
        .await
        .with_context(|| format!("get share children ids {}, share {share_id}", share_node_id))?;
      if children_nodes.contains_ref(node_id) {
        return Ok(props);
      }
    }
    Ok(None)
  }
}
