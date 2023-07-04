use super::datasheet::types::{DatasheetMeta, Field};
use crate::node::types::NodeInfo;
use crate::types::{HashMap, Json};
use crate::unit::UnitInfo;
use crate::util::JsonExt;
use serde::Serialize;

#[derive(Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct DatasheetPack {
  pub snapshot: DatasheetSnapshot,
  pub datasheet: NodeInfo,

  #[serde(skip_serializing_if = "JsonExt::is_falsy")]
  pub field_permission_map: Option<Json>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub foreign_datasheet_map: Option<HashMap<String, BaseDatasheetPack>>,

  #[serde(skip_serializing_if = "Vec::is_empty")]
  pub units: Vec<UnitInfo>,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct DatasheetSnapshot {
  pub meta: DatasheetMeta,
  pub record_map: RecordMap,
  pub datasheet_id: String,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct BaseDatasheetPack {
  pub snapshot: DatasheetSnapshot,
  pub datasheet: Json,

  #[serde(skip_serializing_if = "JsonExt::is_falsy")]
  pub field_permission_map: Option<Json>,
}

#[napi(object, js_name = "IRecord")]
#[derive(Serialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Record {
  pub id: String,
  pub comment_count: u32,
  #[napi(ts_type = "import('@apitable/core').IRecordCellValue")]
  pub data: Json,
  pub created_at: i64,
  pub updated_at: Option<i64>,
  pub revision_history: Option<Vec<u32>>,
  #[napi(ts_type = "object")]
  pub record_meta: Option<Json>,
}

pub type RecordMap = HashMap<String, Record>;

pub type FieldMap = HashMap<String, Field>;
