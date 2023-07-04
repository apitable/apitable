use crate::types::{HashMap, Json};
use crate::util::JsonExt;
use serde::{Deserialize, Serialize};

#[napi(object)]
#[derive(Debug, Clone, Serialize, Default)]
pub struct AuthHeader {
  pub cookie: Option<String>,
  pub token: Option<String>,
  pub internal: Option<bool>,
  pub user_id: Option<String>,
}

#[napi(object)]
#[derive(Debug, Clone, Serialize, Default, PartialEq, Eq, Hash)]
pub struct FetchDataPackOrigin {
  pub internal: bool,
  pub main: Option<bool>,
  pub share_id: Option<String>,
  pub not_dst: Option<bool>,
  pub form: Option<bool>,
}

#[napi(object)]
#[derive(Debug, Clone, Default)]
pub struct FetchDataPackOptions {
  pub record_ids: Option<Vec<String>>,
  pub linked_record_map: Option<HashMap<String, Vec<String>>>,
  pub is_template: Option<bool>,
  /**
   * If true, the returned `resourceIds` will contain foreign datasheet IDs and widget IDs. Otherwise,
   * `resourceIds` will contain the datasheet ID and foreign datasheet IDs.
   */
  pub is_datasheet: Option<bool>,

  // Not yet handled.
  // pub meta: ???
  pub need_extend_main_dst_records: Option<bool>,
}

#[derive(Serialize, Debug, Clone)]
pub struct HttpResponse<T> {
  pub success: bool,
  #[serde(with = "http_serde::status_code")]
  pub code: http::StatusCode,
  pub message: StatusMessage,
  pub data: T,
}

#[allow(unused)]
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum StatusMessage {
  Success,
  ServerError,
}

#[derive(Deserialize, Serialize, Debug, Clone, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct NodePermission {
  pub has_role: bool,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub user_id: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub uuid: Option<String>,

  pub role: String,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub node_favorite: Option<bool>,

  #[serde(skip_serializing_if = "JsonExt::is_falsy")]
  pub field_permission_map: Option<Json>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub is_ghost_node: Option<bool>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub is_deleted: Option<bool>,

  #[serde(flatten)]
  #[serde(skip_serializing_if = "Option::is_none")]
  pub permissions: Option<Json>,
}

#[allow(unused)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PermissionRole {
  Manager,
  Editor,
  Reader,
  Updater,
  TemplateVisitor,
  Owner,
  Anonymous,
  Foreigner,
  ShareReader,
  ShareEditor,
  ShareSave,
}

impl PermissionRole {
  pub fn as_str(&self) -> &'static str {
    match self {
      Self::Manager => "manager",
      Self::Editor => "editor",
      Self::Reader => "reader",
      Self::Updater => "updater",
      Self::TemplateVisitor => "templateVisitor",
      Self::Owner => "manager",
      Self::Anonymous => "reader",
      Self::Foreigner => "reader",
      Self::ShareReader => "shareReader",
      Self::ShareEditor => "shareEditor",
      Self::ShareSave => "shareSave",
    }
  }
}

#[allow(unused)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum IdPrefix {
  Datasheet,
  View,
  Record,
  Field,
  Option,
  Condition,
  /// uploaded attachments
  File,
  Comment,
  WidgetPanel,
  Editor,
  Space,
  DateTimeAlarm,
  EmbedLink,
}

impl IdPrefix {
  pub fn as_str(&self) -> &'static str {
    match self {
      Self::Datasheet => "dst",
      Self::View => "viw",
      Self::Record => "rec",
      Self::Field => "fld",
      Self::Option => "opt",
      Self::Condition => "cdt",
      Self::File => "atc", // uploaded attachments
      Self::Comment => "cmt",
      Self::WidgetPanel => "wpl",
      Self::Editor => "edt",
      Self::Space => "spc",
      Self::DateTimeAlarm => "dta",
      Self::EmbedLink => "emb",
    }
  }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum NodeExtraConstant {
  ShowRecordHistory,
}

impl NodeExtraConstant {
  pub fn as_str(&self) -> &'static str {
    match self {
      Self::ShowRecordHistory => "showRecordHistory",
    }
  }
}

#[derive(Deserialize, Debug, Clone)]
pub struct HttpSuccessResponse<T> {
  pub success: bool,
  pub code: i32,
  #[serde(default)]
  pub message: String,
  pub data: T,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct OssConfig {
  pub host: String,
  pub bucket: String,
}

#[allow(unused)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EnvConfigKind {
  Const,
  Oss,
  ApiLimit,
  Actuator,
}
