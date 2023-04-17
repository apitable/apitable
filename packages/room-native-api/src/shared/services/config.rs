use crate::shared::types::OssConfig;
use crate::types::{HashMap, Json};
use async_trait::async_trait;
use shaku::{Component, Interface};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PermissionConfigKind {
  Default,
  Manager,
  Editor,
  ReadOnly,
}

impl PermissionConfigKind {
  pub fn from_str<S>(str: S) -> Option<Self>
  where
    S: AsRef<str>,
  {
    match str.as_ref() {
      "DEFAULT_PERMISSION" => Some(Self::Default),
      "DEFAULT_MANAGER_PERMISSION" => Some(Self::Manager),
      "DEFAULT_EDITOR_PERMISSION" => Some(Self::Editor),
      "DEFAULT_READ_ONLY_PERMISSION" => Some(Self::ReadOnly),
      _ => None,
    }
  }
}

#[async_trait]
pub trait ConfigService: Interface {
  fn default_permission(&self, kind: PermissionConfigKind) -> anyhow::Result<&Json>;

  fn oss_config(&self) -> &OssConfig;
}

#[derive(Component)]
#[shaku(interface = ConfigService)]
pub struct ConfigServiceImpl {
  permission_configs: HashMap<PermissionConfigKind, Json>,
  oss_config: OssConfig,
}

#[async_trait]
impl ConfigService for ConfigServiceImpl {
  fn default_permission(&self, kind: PermissionConfigKind) -> anyhow::Result<&Json> {
    Ok(self.permission_configs.get(&kind).unwrap())
  }

  fn oss_config(&self) -> &OssConfig {
    &self.oss_config
  }
}

#[cfg(test)]
pub mod mock {
  use super::*;
  use serde_json::json;
  use shaku::Component;

  #[derive(Component)]
  #[shaku(interface = ConfigService)]
  pub struct MockConfigServiceImpl {
    oss_config: OssConfig,
    permissions: Vec<Json>,
  }

  impl MockConfigServiceImpl {
    pub fn new() -> Box<dyn ConfigService> {
      Box::new(Self {
        oss_config: OssConfig {
          host: "https://mock.com".to_owned(),
          bucket: "apitable".to_owned(),
        },
        permissions: vec![
          json!({
            "editable": false,
            "readable": false,
            "mock": "default"
          }),
          json!({
            "editable": true,
            "readable": true,
            "mock": "manager"
          }),
          json!({
            "editable": true,
            "readable": true,
            "mock": "editor"
          }),
          json!({
            "editable": false,
            "readable": true,
            "mock": "readOnly"
          }),
        ],
      })
    }
  }

  #[async_trait]
  impl ConfigService for MockConfigServiceImpl {
    fn default_permission(&self, kind: PermissionConfigKind) -> anyhow::Result<&Json> {
      Ok(&self.permissions[kind as usize])
    }

    fn oss_config(&self) -> &OssConfig {
      &self.oss_config
    }
  }
}
