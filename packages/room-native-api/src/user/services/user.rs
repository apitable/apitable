use crate::repository::Repository;
use crate::shared::services::config::ConfigService;
use crate::shared::services::rest::RestService;
use crate::types::HashSet;
use crate::unit::types::UnitInfo;
use crate::util::sql::SqlExt;
use anyhow::Context;
use async_trait::async_trait;
use futures::TryStreamExt;
use mysql_async::{Params, Value};
use shaku::{Component, Interface};
use std::sync::Arc;

#[async_trait]
pub trait UserService: Interface {
  async fn session(&self, cookie: &str) -> anyhow::Result<bool>;

  async fn get_user_info_by_uuids(&self, space_id: &str, uuids: HashSet<String>) -> anyhow::Result<Vec<UnitInfo>>;
}

#[derive(Component)]
#[shaku(interface = UserService)]
pub struct UserServiceImpl {
  #[shaku(inject)]
  rest_service: Arc<dyn RestService>,

  #[shaku(inject)]
  config_service: Arc<dyn ConfigService>,

  #[shaku(inject)]
  repo: Arc<dyn Repository>,
}

#[async_trait]
impl UserService for UserServiceImpl {
  async fn session(&self, cookie: &str) -> anyhow::Result<bool> {
    self.rest_service.has_login(cookie).await
  }

  async fn get_user_info_by_uuids(&self, space_id: &str, uuids: HashSet<String>) -> anyhow::Result<Vec<UnitInfo>> {
    if uuids.is_empty() {
      return Ok(vec![]);
    }

    let space_id = space_id.to_owned();
    let mut client = self.repo.get_client().await?;

    let mut users: Vec<UnitInfo> = client
      .query_all(
        format!(
          "\
          SELECT \
            vu.uuid user_id, \
            vu.uuid uuid, \
            vu.color avatar_color, \
            vu.nick_name nick_name, \
            vui.id unit_id, \
            vui.is_deleted is_deleted, \
            vui.unit_type type, \
            IFNULL(vum.member_name,vu.nick_name) name, \
            vu.avatar avatar, \
            vum.is_active is_active, \
            IFNULL(vu.is_social_name_modified, 2) > 0  AS is_nick_name_modified, \
            IFNULL(vum.is_social_name_modified, 2) > 0 AS is_member_name_modified, \
            vui.unit_id original_unit_id \
          FROM {prefix}user vu \
          LEFT JOIN {prefix}unit_member vum ON vum.user_id = vu.id AND vum.space_id = ? \
          LEFT JOIN {prefix}unit vui ON vui.unit_ref_id = vum.id \
          WHERE uuid",
          prefix = self.repo.table_prefix()
        )
        .append_in_condition(uuids.len()),
        {
          let mut values: Vec<Value> = vec![space_id.into()];
          values.extend(uuids.into_iter().map(Value::from));
          Params::Positional(values)
        },
      )
      .await?
      .try_collect()
      .await
      .with_context(|| "get user info by uuids")?;

    let oss = self.config_service.oss_config();
    for user in &mut users {
      if let Some(avatar) = &user.avatar && !avatar.starts_with("http") {
        user.avatar = Some(format!("{}/{avatar}", oss.host));
      }
      user.is_member_name_modified = user.is_member_name_modified.or(Some(false));
      user.is_nick_name_modified = user.is_nick_name_modified.or(Some(false));
    }
    Ok(users)
  }
}

#[cfg(test)]
pub mod mock {
  use super::*;
  use crate::types::HashMap;

  #[derive(Component, Default)]
  #[shaku(interface = UserService)]
  pub struct MockUserServiceImpl {
    users: HashMap<&'static str, UnitInfo>,
    logined: HashSet<&'static str>,
  }

  impl MockUserServiceImpl {
    pub fn new() -> Self {
      Self::default()
    }

    pub fn with_users(mut self, users: HashMap<&'static str, UnitInfo>) -> Self {
      self.users = users;
      self
    }

    #[allow(unused)]
    pub fn with_logined(mut self, logined: HashSet<&'static str>) -> Self {
      self.logined = logined;
      self
    }

    pub fn build(self) -> Box<dyn UserService> {
      Box::new(self)
    }
  }

  #[async_trait]
  impl UserService for MockUserServiceImpl {
    async fn session(&self, cookie: &str) -> anyhow::Result<bool> {
      Ok(self.logined.contains(cookie))
    }

    async fn get_user_info_by_uuids(&self, _space_id: &str, uuids: HashSet<String>) -> anyhow::Result<Vec<UnitInfo>> {
      Ok(
        uuids
          .iter()
          .filter_map(|uuid| self.users.get(uuid.as_str()))
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
  use crate::shared::services::config::mock::MockConfigServiceImpl;
  use crate::shared::services::rest::mock::MockRestServiceImpl;
  use crate::shared::services::rest::RestServiceImpl;
  use mysql_async::consts::ColumnType;
  use mysql_async::Row;
  use pretty_assertions::assert_eq;
  use shaku::{module, HasComponent};
  use tokio_test::assert_ok;

  module! {
    TestModule {
      components = [UserServiceImpl, MockConfigServiceImpl, RestServiceImpl, RepositoryImpl],
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
      .with_component_override(MockRestServiceImpl::new().build())
      .build()
  }

  const MOCK_USER_INFO_QUERY_SQL: &str = "\
    SELECT \
      vu.uuid user_id, \
      vu.uuid uuid, \
      vu.color avatar_color, \
      vu.nick_name nick_name, \
      vui.id unit_id, \
      vui.is_deleted is_deleted, \
      vui.unit_type type, \
      IFNULL(vum.member_name,vu.nick_name) name, \
      vu.avatar avatar, \
      vum.is_active is_active, \
      IFNULL(vu.is_social_name_modified, 2) > 0  AS is_nick_name_modified, \
      IFNULL(vum.is_social_name_modified, 2) > 0 AS is_member_name_modified, \
      vui.unit_id original_unit_id \
    FROM apitable_user vu \
    LEFT JOIN apitable_unit_member vum ON vum.user_id = vu.id AND vum.space_id = ? \
    LEFT JOIN apitable_unit vui ON vui.unit_ref_id = vum.id \
    WHERE uuid IN (?)";

  fn mock_columns() -> Vec<(&'static str, ColumnType)> {
    vec![
      ("user_id", ColumnType::MYSQL_TYPE_VARCHAR),
      ("uuid", ColumnType::MYSQL_TYPE_VARCHAR),
      ("avatar_color", ColumnType::MYSQL_TYPE_TINY),
      ("nick_name", ColumnType::MYSQL_TYPE_INT24),
      ("unit_id", ColumnType::MYSQL_TYPE_LONG),
      ("is_deleted", ColumnType::MYSQL_TYPE_BIT),
      ("type", ColumnType::MYSQL_TYPE_TINY),
      ("name", ColumnType::MYSQL_TYPE_VARCHAR),
      ("avatar", ColumnType::MYSQL_TYPE_VARCHAR),
      ("is_active", ColumnType::MYSQL_TYPE_BIT),
      ("is_nick_name_modified", ColumnType::MYSQL_TYPE_BIT),
      ("is_member_name_modified", ColumnType::MYSQL_TYPE_BIT),
      ("original_unit_id", ColumnType::MYSQL_TYPE_VARCHAR),
    ]
  }

  #[tokio::test]
  async fn get_one_user_info() {
    let module = init_module([mock_rows(
      mock_columns(),
      [[
        "1749124".into(),
        "1749124".into(),
        Value::NULL,
        "MockUser".into(),
        4675354i64.into(),
        Value::NULL,
        0u8.into(),
        "mock user".into(),
        "https://example.com/avatar.png".into(),
        true.into(),
        true.into(),
        Value::NULL,
        "abcdef".into(),
      ]],
    )]);
    let user_service: &dyn UserService = module.resolve_ref();

    let user_info = assert_ok!(
      user_service
        .get_user_info_by_uuids("spc1", hashset!("1749124".to_owned()))
        .await
    );

    assert_eq!(
      user_info,
      vec![UnitInfo {
        unit_id: Some(4675354),
        r#type: Some(0),
        name: Some("mock user".into()),
        uuid: Some("1749124".into()),
        user_id: Some("1749124".into()),
        avatar: Some("https://example.com/avatar.png".to_owned()),
        is_active: Some(1),
        is_deleted: None,
        nick_name: Some("MockUser".to_owned()),
        avatar_color: None,
        is_member_name_modified: Some(false),
        is_nick_name_modified: Some(true),
        original_unit_id: Some("abcdef".into()),
      }]
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_USER_INFO_QUERY_SQL.into(),
        params: Params::Positional(vec!["spc1".into(), "1749124".into()]),
      }]
    );
  }

  #[tokio::test]
  async fn user_info_avatar_no_host() {
    let module = init_module([mock_rows(
      mock_columns(),
      [[
        "1749124".into(),
        "1749124".into(),
        3i32.into(),
        "MockUser".into(),
        4675354i64.into(),
        false.into(),
        1u8.into(),
        "mock user".into(),
        "avatar.png".into(),
        true.into(),
        Value::NULL,
        true.into(),
        Value::NULL,
      ]],
    )]);
    let user_service: &dyn UserService = module.resolve_ref();

    let user_info = assert_ok!(
      user_service
        .get_user_info_by_uuids("spc1", hashset!("1749124".to_owned()))
        .await
    );

    assert_eq!(
      user_info,
      vec![UnitInfo {
        unit_id: Some(4675354),
        r#type: Some(1),
        name: Some("mock user".into()),
        uuid: Some("1749124".to_owned()),
        user_id: Some("1749124".to_owned()),
        avatar: Some("https://mock.com/avatar.png".to_owned()),
        is_active: Some(1),
        is_deleted: Some(0),
        nick_name: Some("MockUser".to_owned()),
        avatar_color: Some(3),
        is_member_name_modified: Some(true),
        is_nick_name_modified: Some(false),
        original_unit_id: None,
      }]
    );

    let repo: Arc<dyn Repository> = module.resolve();

    assert_eq!(
      repo.take_logs().await,
      [MockSqlLog {
        sql: MOCK_USER_INFO_QUERY_SQL.into(),
        params: Params::Positional(vec!["spc1".into(), "1749124".into()])
      }]
    );
  }
}
