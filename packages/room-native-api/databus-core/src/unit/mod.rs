// pub mod entities;
mod types;

pub use types::*;

use crate::repository::Repository;
use crate::shared::config::ConfigService;
use crate::types::HashSet;
use crate::util::sql::SqlExt;
use anyhow::Context;
use async_trait::async_trait;
use futures::TryStreamExt;
use mysql_async::{Params, Value};
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait UnitService: Interface {
  async fn get_unit_info_by_unit_ids(&self, space_id: &str, unit_ids: HashSet<String>)
    -> anyhow::Result<Vec<UnitInfo>>;
}

#[derive(Component)]
#[shaku(interface = UnitService)]
pub struct UnitServiceImpl {
  #[shaku(inject)]
  config_service: Arc<dyn ConfigService>,

  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl UnitService for UnitServiceImpl {
  async fn get_unit_info_by_unit_ids(
    &self,
    space_id: &str,
    unit_ids: HashSet<String>,
  ) -> anyhow::Result<Vec<UnitInfo>> {
    if unit_ids.is_empty() {
      return Ok(vec![]);
    }

    let mut client = self.repo.get_client().await?;

    let mut units: Vec<UnitInfo> = client
      .query_all(
        format!(
          // TODO remove dummy original_unit_id column after mysql_common allows default value for missing columns.
          "\
          SELECT \
            vu.id unit_id, \
            vu.unit_type type, \
            COALESCE(vut.team_name, vum.member_name, vur.role_name) name, \
            u.uuid uuid, \
            u.uuid user_id, \
            u.avatar avatar, \
            vum.is_active is_active, \
            vu.is_deleted is_deleted, \
            u.nick_name nick_name, \
            u.color avatar_color, \
            IFNULL(vum.is_social_name_modified, 2) > 0 AS is_member_name_modified, \
            NULL AS is_nick_name_modified, \
            vu.unit_id original_unit_id \
          FROM {prefix}unit vu \
          LEFT JOIN {prefix}unit_team vut ON vu.unit_ref_id = vut.id \
          LEFT JOIN {prefix}unit_member vum ON vu.unit_ref_id = vum.id \
          LEFT JOIN {prefix}unit_role vur ON vu.unit_ref_id = vur.id \
          LEFT JOIN {prefix}user u ON vum.user_id = u.id \
          WHERE vu.space_id = ? AND vu.id\
          ",
          prefix = self.repo.table_prefix()
        )
        .append_in_condition(unit_ids.len()),
        {
          let mut values: Vec<Value> = vec![space_id.into()];
          values.extend(unit_ids.into_iter().map(Value::from));
          Params::Positional(values)
        },
      )
      .await?
      .try_collect()
      .await
      .with_context(|| format!("get unit info by unit ids, space id {space_id}"))?;

    let oss = self.config_service.oss_config();
    for unit in &mut units {
      if let Some(avatar) = &unit.avatar && !avatar.starts_with("http") {
        unit.avatar = Some(format!("{}/{avatar}", oss.host));
      }
      unit.is_member_name_modified = unit.is_member_name_modified.or(Some(false));
    }
    Ok(units)
  }
}

#[cfg(test)]
pub mod mock {
  use super::*;
  use crate::types::HashMap;

  #[derive(Component, Default)]
  #[shaku(interface = UnitService)]
  pub struct MockUnitServiceImpl {
    units: HashMap<&'static str, UnitInfo>,
  }

  impl MockUnitServiceImpl {
    pub fn new() -> Self {
      Self::default()
    }

    pub fn with_units(mut self, units: HashMap<&'static str, UnitInfo>) -> Self {
      self.units = units;
      self
    }

    pub fn build(self) -> Box<dyn UnitService> {
      Box::new(self)
    }
  }

  #[async_trait]
  impl UnitService for MockUnitServiceImpl {
    async fn get_unit_info_by_unit_ids(
      &self,
      _space_id: &str,
      unit_ids: HashSet<String>,
    ) -> anyhow::Result<Vec<UnitInfo>> {
      Ok(
        unit_ids
          .iter()
          .filter_map(|unit_id| self.units.get(unit_id.as_str()))
          .cloned()
          .collect(),
      )
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::repository::mock::{mock_rows, MockRepositoryImpl, MockSqlLog};
  use crate::repository::RepositoryImpl;
  use crate::shared::config::mock::MockConfigServiceImpl;
  use mysql_async::consts::ColumnType;
  use mysql_async::Row;
  use pretty_assertions::assert_eq;
  use shaku::{module, HasComponent};
  use tokio_test::assert_ok;

  module! {
    TestModule {
      components = [UnitServiceImpl, MockConfigServiceImpl, RepositoryImpl],
      providers = []
    }
  }

  fn init_module<I>(results: I) -> TestModule
  where
    I: IntoIterator<Item = Vec<Row>>,
  {
    TestModule::builder()
      .with_component_override(MockRepositoryImpl::new(results))
      .with_component_override(MockConfigServiceImpl::new())
      .build()
  }

  // TODO remove dummy original_unit_id column after mysql_common allows default value for missing columns.
  const MOCK_UNIT_INFO_QUERY_SQL: &str = "\
    SELECT \
      vu.id unit_id, \
      vu.unit_type type, \
      COALESCE(vut.team_name, vum.member_name, vur.role_name) name, \
      u.uuid uuid, \
      u.uuid user_id, \
      u.avatar avatar, \
      vum.is_active is_active, \
      vu.is_deleted is_deleted, \
      u.nick_name nick_name, \
      u.color avatar_color, \
      IFNULL(vum.is_social_name_modified, 2) > 0 AS is_member_name_modified, \
      NULL AS is_nick_name_modified, \
      vu.unit_id original_unit_id \
    FROM apitable_unit vu \
    LEFT JOIN apitable_unit_team vut ON vu.unit_ref_id = vut.id \
    LEFT JOIN apitable_unit_member vum ON vu.unit_ref_id = vum.id \
    LEFT JOIN apitable_unit_role vur ON vu.unit_ref_id = vur.id \
    LEFT JOIN apitable_user u ON vum.user_id = u.id \
    WHERE vu.space_id = ? AND vu.id IN (?)\
    ";

  fn mock_columns() -> Vec<(&'static str, ColumnType)> {
    vec![
      ("unit_id", ColumnType::MYSQL_TYPE_LONG),
      ("type", ColumnType::MYSQL_TYPE_TINY),
      ("name", ColumnType::MYSQL_TYPE_VARCHAR),
      ("uuid", ColumnType::MYSQL_TYPE_VARCHAR),
      ("user_id", ColumnType::MYSQL_TYPE_VARCHAR),
      ("avatar", ColumnType::MYSQL_TYPE_VARCHAR),
      ("is_active", ColumnType::MYSQL_TYPE_BIT),
      ("is_deleted", ColumnType::MYSQL_TYPE_BIT),
      ("nick_name", ColumnType::MYSQL_TYPE_INT24),
      ("avatar_color", ColumnType::MYSQL_TYPE_TINY),
      ("is_member_name_modified", ColumnType::MYSQL_TYPE_BIT),
      ("is_nick_name_modified", ColumnType::MYSQL_TYPE_BIT),
      ("original_unit_id", ColumnType::MYSQL_TYPE_VARCHAR),
    ]
  }

  #[tokio::test]
  async fn get_one_unit_info() {
    let module = init_module([mock_rows(
      mock_columns(),
      [[
        4675354i64.into(),
        1u8.into(),
        "mock user".into(),
        "1749124".into(),
        "1749124".into(),
        "https://example.com/avatar.png".into(),
        true.into(),
        Value::NULL,
        "MockUser".into(),
        Value::NULL,
        false.into(),
        Value::NULL,
        "abcdef".into(),
      ]],
    )]);
    let unit_service: &dyn UnitService = module.resolve_ref();

    let unit_info = assert_ok!(
      unit_service
        .get_unit_info_by_unit_ids("spc1", hashset!("4675354".to_owned()))
        .await
    );

    assert_eq!(
      unit_info,
      vec![UnitInfo {
        unit_id: Some(4675354),
        r#type: Some(1),
        name: Some("mock user".into()),
        uuid: Some("1749124".into()),
        user_id: Some("1749124".into()),
        avatar: Some("https://example.com/avatar.png".to_owned()),
        is_active: Some(1),
        is_deleted: None,
        nick_name: Some("MockUser".to_owned()),
        avatar_color: None,
        is_member_name_modified: Some(false),
        is_nick_name_modified: None,
        original_unit_id: Some("abcdef".into()),
      }]
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_UNIT_INFO_QUERY_SQL.into(),
        params: Params::Positional(vec!["spc1".into(), "4675354".into()])
      }]
    );
  }

  #[tokio::test]
  async fn unit_info_avatar_no_host() {
    let module = init_module([mock_rows(
      mock_columns(),
      [[
        4675354i64.into(),
        Value::NULL,
        "mock user".into(),
        "1749124".into(),
        "1749124".into(),
        "avatar.png".into(),
        true.into(),
        false.into(),
        "MockUser".into(),
        3i32.into(),
        true.into(),
        Value::NULL,
        "abcdef".into(),
      ]],
    )]);
    let unit_service: &dyn UnitService = module.resolve_ref();

    let unit_info = assert_ok!(
      unit_service
        .get_unit_info_by_unit_ids("spc1", hashset!("4675354".to_owned()))
        .await
    );

    assert_eq!(
      unit_info,
      vec![UnitInfo {
        unit_id: Some(4675354),
        r#type: None,
        name: Some("mock user".into()),
        uuid: Some("1749124".into()),
        user_id: Some("1749124".into()),
        avatar: Some("https://mock.com/avatar.png".to_owned()),
        is_active: Some(1),
        is_deleted: Some(0),
        nick_name: Some("MockUser".to_owned()),
        avatar_color: Some(3),
        is_member_name_modified: Some(true),
        is_nick_name_modified: None,
        original_unit_id: Some("abcdef".into()),
      }]
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_UNIT_INFO_QUERY_SQL.into(),
        params: Params::Positional(vec!["spc1".into(), "4675354".into()])
      }]
    );
  }
}
