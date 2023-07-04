use crate::types::Json;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct NodeInfo {
  pub id: String,
  pub name: String,
  pub description: String,
  pub parent_id: String,
  pub icon: String,
  pub node_shared: bool,
  pub node_permit_set: bool,
  pub node_favorite: bool,
  pub space_id: String,
  pub role: String,
  pub permissions: NodePermissionState,
  pub revision: u32,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub is_ghost_node: Option<bool>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub active_view: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub extra: Option<Json>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct NodePermissionState {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub is_deleted: Option<bool>,

  #[serde(flatten)]
  #[serde(skip_serializing_if = "Option::is_none")]
  pub permissions: Option<Json>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct NodeDetailInfo {
  pub node: NodeInfo,
  pub field_permission_map: Option<Json>,
}
