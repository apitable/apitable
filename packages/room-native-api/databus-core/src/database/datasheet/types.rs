use crate::database::types::FieldMap;
use crate::types::Json;
use serde::{Deserialize, Serialize};
use serde_repr::{Deserialize_repr, Serialize_repr};

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct DatasheetMeta {
  pub field_map: FieldMap,
  pub views: Vec<Json>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub widget_panels: Option<Vec<WidgetPanel>>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct WidgetPanel {
  pub id: String,
  pub widgets: Vec<WidgetInPanel>,
  /// Don't care about other fields currently, but they must still be serialized.
  #[serde(flatten)]
  pub others: Option<Json>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct WidgetInPanel {
  pub id: String,
  /// Don't care about other fields currently, but they must still be serialized.
  #[serde(flatten)]
  pub others: Option<Json>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Field {
  pub id: String,
  pub name: String,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub desc: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub required: Option<bool>,

  #[serde(rename = "type")]
  pub kind: FieldKind,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub property: Option<Json>,
}

#[derive(Serialize_repr, Deserialize_repr, Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u32)]
pub enum FieldKind {
  NotSupport = 0,
  Text = 1,
  Number = 2,
  SingleSelect = 3,
  MultiSelect = 4,
  DateTime = 5,
  Attachment = 6,
  Link = 7,
  URL = 8,
  Email = 9,
  Phone = 10,
  Checkbox = 11,
  Rating = 12,
  Member = 13,
  LookUp = 14,
  // RollUp = 15,
  Formula = 16,
  Currency = 17,
  Percent = 18,
  SingleText = 19,
  AutoNumber = 20,
  CreatedTime = 21,
  LastModifiedTime = 22,
  CreatedBy = 23,
  LastModifiedBy = 24,
  Cascader = 25,
  /// no permission column
  DeniedField = 999,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UrlFieldProperty {
  #[serde(rename = "isRecogURLFlag")]
  #[serde(skip_serializing_if = "Option::is_none")]
  pub is_recog_url_flag: Option<bool>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MemberFieldProperty {
  /// Optional single or multiple members.
  #[serde(skip_serializing_if = "Option::is_none")]
  pub is_multi: Option<bool>,

  /// Whether to send a message notification after selecting a member
  #[serde(skip_serializing_if = "Option::is_none")]
  pub should_send_msg: Option<bool>,

  pub unit_ids: Vec<String>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CreatedByFieldProperty {
  pub uuids: Vec<Json>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub datasheet_id: Option<String>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LastModifiedByFieldProperty {
  pub uuids: Vec<Json>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub datasheet_id: Option<String>,

  /// dependent field collection type
  #[serde(skip_serializing_if = "Option::is_none")]
  pub collect_type: Option<i32>,

  /// dependent fields
  #[serde(skip_serializing_if = "Option::is_none")]
  pub field_id_collection: Option<Vec<String>>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LookUpFieldProperty {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub datasheet_id: Option<String>,

  pub related_link_field_id: String,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub look_up_target_field_id: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub roll_up_type: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub formatting: Option<Json>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub filter_info: Option<LookUpFilterInfo>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub open_filter: Option<bool>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FormulaFieldProperty {
  /// formula is computed property, it needs to locate the current datasheetId through fieldProperty;
  pub datasheet_id: String,

  pub expression: String,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub formatting: Option<Json>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LookUpFilterInfo {
  pub conjunction: String,
  pub conditions: Vec<Json>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LinkFieldProperty {
  pub foreign_datasheet_id: String,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub brother_field_id: Option<String>,

  /// The limit is only on the optional record corresponding to the viewId. Note: viewId may not exist in the associated table with the modification of the associated table
  #[serde(skip_serializing_if = "Option::is_none")]
  pub limit_to_view: Option<String>,

  /// Whether to limit only one block to be associated. Note: This is a soft limit that only takes effect on the current table interaction, there are actually multiple ways to break the limit.
  #[serde(skip_serializing_if = "Option::is_none")]
  pub limit_single_record: Option<bool>,
}
