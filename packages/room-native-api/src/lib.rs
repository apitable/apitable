#![feature(async_closure, result_option_inspect, let_chains, extend_one)]

#[macro_use]
extern crate napi_derive;

use anyhow::{anyhow, Context};
use database::datasheet;
use database::datasheet::services::datasheet::DatasheetService;
use database::datasheet::services::record::DatasheetRecordService;
use database::datasheet::util::collect_datasheet_pack_resource_ids;
use database::resource;
use fred::prelude::*;
use futures::executor::block_on;
use futures::TryFutureExt;
use napi::bindgen_prelude::{Buffer, Object, ToNapiValue};
use napi::{Env, JsObject};
use shaku::HasComponent;
use shared::errors::{AccessDeniedError, NodeNotExistError, RestError};
use shared::services::config::PermissionConfigKind;
use shared::services::redis::{init_redis_client, RedisInitOptions};
use shared::types::*;
use std::ops::ControlFlow;
use std::sync::Arc;
use types::*;
use util::{OptionBoolExt, ResultExt};

/// https://github.com/la10736/rstest/tree/master/rstest_reuse#cavelets
#[cfg(test)]
use rstest_reuse;

#[macro_use]
mod util;
mod database;
mod logging;
mod node;
mod repository;
mod shared;
mod types;
mod unit;
mod user;

shaku::module! {
  RootModule {
    components = [
      datasheet::services::datasheet::DatasheetServiceImpl,
      datasheet::services::revision::DatasheetRevisionServiceImpl,
      datasheet::services::record::DatasheetRecordServiceImpl,
      datasheet::services::record_comment::DatasheetRecordCommentServiceImpl,
      datasheet::services::meta::DatasheetMetaServiceImpl,
      resource::services::meta::ResourceMetaServiceImpl,
      node::services::node::NodeServiceImpl,
      node::services::description::NodeDescServiceImpl,
      node::services::permission::NodePermServiceImpl,
      node::services::share_setting::NodeShareSettingServiceImpl,
      node::services::children::NodeChildrenServiceImpl,
      repository::RepositoryImpl,
      shared::services::config::ConfigServiceImpl,
      shared::services::rest::RestServiceImpl,
      shared::services::redis::RedisServiceImpl,
      user::services::user::UserServiceImpl,
      unit::services::unit::UnitServiceImpl,
    ],
    providers = []
  }
}

#[napi]
pub struct NativeModule {
  module: RootModule,
}

#[napi]
impl NativeModule {
  #[napi(factory)]
  pub fn create(
    is_dev_mode: bool,
    rest_base_url: String,
    oss_config: OssConfig,
    #[napi(ts_arg_type = "Record<string, import('@apitable/core').IPermissions>")] permission_configs: HashMap<
      String,
      Json,
    >,
  ) -> napi::Result<Self> {
    logging::init(is_dev_mode);

    // initialize mysql connection
    let db_conn_url = format!(
      "mysql://{user}:{password}@{host}:{port}/{database}",
      user = url_escape::encode_component(&env_var!(MYSQL_USERNAME default "root")),
      password = url_escape::encode_component(&env_var!(MYSQL_PASSWORD default "qwe123456")),
      host = env_var!(MYSQL_HOST default "localhost"),
      port = env_var!(MYSQL_PORT default "3306"),
      database = env_var!(MYSQL_DATABASE default "vikadata"),
    );

    // initialize redis
    let redis_client = block_on(init_redis_client(RedisInitOptions {
      config: RedisConfig {
        username: env_var!(REDIS_USERNAME),
        password: env_var!(REDIS_PASSWORD),
        server: ServerConfig::Centralized {
          server: (
            env_var!(REDIS_HOST default "localhost"),
            env_var!(REDIS_PORT)
              .map(|port| {
                port
                  .parse()
                  .expect_with(|_| format!("invalid REDIS_PORT: \"{}\"", port))
              })
              .unwrap_or(6379),
          )
            .into(),
        },
        database: env_var!(REDIS_DB).map(|db| db.parse().expect_with(|_| format!("invalid REDIS_DB: \"{}\"", db))),
        ..Default::default()
      },
      ..Default::default()
    }))
    .context("init redis")
    .map_err(Self::wrap_anyhow_error)?;

    // initialize services
    let module = RootModule::builder()
      .with_component_parameters::<repository::RepositoryImpl>(repository::RepositoryInitOptions {
        conn_url: db_conn_url,
        table_prefix: env_var!(DATABASE_TABLE_PREFIX default "apitable_"),
      })
      .with_component_parameters::<shared::services::config::ConfigServiceImpl>(
        shared::services::config::ConfigServiceImplParameters {
          permission_configs: permission_configs
            .into_iter()
            .filter_map(|(key, value)| PermissionConfigKind::from_str(key).map(|key| (key, value)))
            .collect(),
          oss_config,
        },
      )
      .with_component_parameters::<shared::services::rest::RestServiceImpl>(rest_base_url)
      .with_component_parameters::<shared::services::redis::RedisServiceImpl>(redis_client)
      .build();

    let repo: &dyn repository::Repository = module.resolve_ref();
    block_on(repo.init())
      .context("init repository")
      .map_err(Self::wrap_anyhow_error)?;

    Ok(Self { module })
  }

  #[napi]
  pub fn destroy(&self) -> napi::Result<()> {
    let repo: Arc<dyn repository::Repository> = self.module.resolve();
    block_on(repo.close())?;
    Ok(())
  }

  /// Load the record map of a datasheet from the database.
  #[napi(ts_return_type = "Promise<import('@apitable/core').IRecordMap> | {}", catch_unwind)]
  pub fn get_records(
    &self,
    env: Env,
    dst_id: String,
    record_ids: Option<Vec<String>>,
    is_deleted: bool,
    with_comment: bool,
  ) -> napi::Result<JsObject> {
    if record_ids.as_ref().map(|record_ids| record_ids.is_empty()).is_truthy() {
      return env.create_object();
    }
    let record_service: Arc<dyn DatasheetRecordService> = self.module.resolve();
    env.spawn_future(
      async move {
        record_service
          .get_records(&dst_id, record_ids, is_deleted, with_comment)
          .await
      }
      .map_err(Self::wrap_anyhow_error),
    )
  }

  /// Load the datasheet pack of a datasheet.
  /// The returned response buffer will be directly returned to the front-end without further serialization.
  /// If this function returns an error, the caller is responsible for converting it to a room-server `ServerException`.
  #[napi(
    ts_return_type = "Promise<DatasheetPackResponse \
      | { error: 'NODE_NOT_EXIST' | 'ACCESS_DENIED', nodeId: string } | { error: 'REST', code: number }>",
    catch_unwind
  )]
  pub fn fetch_datasheet_pack_response(
    &self,
    env: Env,
    source: String,
    dst_id: String,
    auth: AuthHeader,
    origin: FetchDataPackOrigin,
    options: Option<FetchDataPackOptions>,
  ) -> napi::Result<JsObject> {
    let datasheet_service: Arc<dyn DatasheetService> = self.module.resolve();
    env.spawn_future(
      async move {
        let data_pack = match Self::wrap_error(
          datasheet_service
            .fetch_data_pack(&source, &dst_id, auth, origin, options)
            .await,
        ) {
          ControlFlow::Break(r) => return r,
          ControlFlow::Continue(v) => v,
        };
        let resource_ids = collect_datasheet_pack_resource_ids(&data_pack);
        let resp = HttpResponse {
          success: true,
          code: http::StatusCode::OK,
          message: StatusMessage::Success,
          data: data_pack,
        };
        let buf = Buffer::from(serde_json::to_vec(&resp).with_context(|| format!("serialize datapack into json"))?);
        Ok::<_, anyhow::Error>(DatasheetPackResult::Success(DatasheetPackResponse {
          response: buf,
          resource_ids,
        }))
      }
      .map_err(Self::wrap_anyhow_error),
    )
  }

  /// Load the datasheet pack of a datasheet.
  /// Returns a value of type `DatasheetPack` in `room-server` package if succeeded.
  /// If this function returns an error, the caller is responsible for converting it to a room-server `ServerException`.
  #[napi(
    ts_return_type = "Promise<DatasheetPackOutput \
      | { error: 'NODE_NOT_EXIST' | 'ACCESS_DENIED', nodeId: string } | { error: 'REST', code: number }>",
    catch_unwind
  )]
  pub fn fetch_datasheet_pack(
    &self,
    env: Env,
    source: String,
    dst_id: String,
    auth: AuthHeader,
    origin: FetchDataPackOrigin,
    options: Option<FetchDataPackOptions>,
  ) -> napi::Result<JsObject> {
    let datasheet_service: Arc<dyn DatasheetService> = self.module.resolve();
    env.spawn_future(
      async move {
        let data_pack = match Self::wrap_error(
          datasheet_service
            .fetch_data_pack(&source, &dst_id, auth, origin, options)
            .await,
        ) {
          ControlFlow::Break(r) => return r,
          ControlFlow::Continue(v) => v,
        };
        let data_pack =
          Buffer::from(serde_json::to_vec(&data_pack).with_context(|| format!("serialize datapack into json"))?);
        Ok(DatasheetPackResult::Success(DatasheetPackOutput { data_pack }))
      }
      .map_err(Self::wrap_anyhow_error),
    )
  }

  fn wrap_anyhow_error(err: anyhow::Error) -> napi::Error {
    napi::Error::new(napi::Status::GenericFailure, format!("{err:?}"))
  }

  fn wrap_error<T, V>(result: anyhow::Result<T>) -> ControlFlow<anyhow::Result<DatasheetPackResult<V>>, T> {
    result.map_or_else(
      |err| match err.downcast::<AccessDeniedError>() {
        Ok(AccessDeniedError { node_id }) => {
          tracing::error!("access denied {node_id}");
          ControlFlow::Break(Ok(DatasheetPackResult::AccessDenied(node_id)))
        }
        Err(err) => match err.downcast::<NodeNotExistError>() {
          Ok(NodeNotExistError { node_id }) => {
            tracing::error!("node not exist {node_id}");
            ControlFlow::Break(Ok(DatasheetPackResult::NodeNotExist(node_id)))
          }
          Err(err) => match err.downcast::<RestError>() {
            Ok(RestError { status_code }) => ControlFlow::Break(Ok(DatasheetPackResult::RestError(status_code))),
            Err(err) => ControlFlow::Break(Err(anyhow!("{err:?}"))),
          },
        },
      },
      ControlFlow::Continue,
    )
  }
}

#[napi(object)]
pub struct DatasheetPackResponse {
  /// The response buffer is JSON-encoded, which will be directly returned to the front-end without further serialization.
  pub response: Buffer,
  /// Used for real-time collaboration management.
  pub resource_ids: Vec<String>,
}

#[napi(object)]
pub struct DatasheetPackOutput {
  /// The data pack buffer is JSON-encoded object of type `DatasheetPack` in `room-server` package.
  pub data_pack: Buffer,
}

pub enum DatasheetPackResult<T> {
  Success(T),
  AccessDenied(String),
  NodeNotExist(String),
  RestError(u16),
}

impl<T> DatasheetPackResult<T> {
  pub fn try_map<F, U, E>(self, f: F) -> Result<DatasheetPackResult<U>, E>
  where
    F: FnOnce(T) -> Result<U, E>,
  {
    Ok(match self {
      Self::Success(v) => DatasheetPackResult::Success(f(v)?),
      Self::AccessDenied(e) => DatasheetPackResult::AccessDenied(e),
      Self::NodeNotExist(e) => DatasheetPackResult::NodeNotExist(e),
      Self::RestError(e) => DatasheetPackResult::RestError(e),
    })
  }
}

impl<T> ToNapiValue for DatasheetPackResult<T>
where
  T: ToNapiValue,
{
  unsafe fn to_napi_value(raw_env: napi::sys::napi_env, val: Self) -> napi::Result<napi::sys::napi_value> {
    if let Self::Success(resp) = val {
      return ToNapiValue::to_napi_value(raw_env, resp);
    }

    let env = Env::from(raw_env);
    let mut obj = env.create_object()?;
    match val {
      Self::AccessDenied(node_id) => {
        obj.set("error", "ACCESS_DENIED")?;
        obj.set("nodeId", node_id)?;
      }
      Self::NodeNotExist(node_id) => {
        obj.set("error", "NODE_NOT_EXIST")?;
        obj.set("nodeId", node_id)?;
      }
      Self::RestError(code) => {
        obj.set("error", "REST")?;
        obj.set("code", code)?;
      }
      Self::Success(_) => unreachable!(),
    }
    unsafe { Object::to_napi_value(raw_env, obj) }
  }
}
