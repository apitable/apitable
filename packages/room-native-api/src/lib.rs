#![deny(clippy::all)]
#![feature(async_closure, box_syntax)]

use datasheet::database::InitDbOptions;
use futures::TryFutureExt;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use std::env;

mod datasheet;
mod types;

use types::*;

use napi::{Env, JsObject};

#[macro_use]
extern crate napi_derive;

#[napi(ts_return_type = "Promise<void>")]
pub fn init(env: Env, is_dev_mode: bool) -> napi::Result<()> {
  let opts = InitDbOptions {
    url: format!(
      "mysql://{user}:{password}@{host}:{port}/{database}",
      user = utf8_percent_encode(
        &env::var("MYSQL_USERNAME").unwrap_or("root".to_owned()),
        NON_ALPHANUMERIC
      ),
      password = utf8_percent_encode(
        &env::var("MYSQL_PASSWORD").unwrap_or("qwe123456".to_owned()),
        NON_ALPHANUMERIC
      ),
      host = env::var("MYSQL_HOST").unwrap_or("localhost".to_owned()),
      port = env::var("MYSQL_PORT").unwrap_or("3306".to_owned()),
      database = env::var("MYSQL_DATABASE").unwrap_or("vikadata".to_owned()),
    ),
    is_dev_mode,
  };
  env.spawn_future(datasheet::database::init(opts).err_into()).map(|_| ())
}

#[napi(ts_return_type = "Promise<object>")]
pub fn get_records(
  env: Env,
  dst_id: String,
  record_ids: Option<Vec<String>>,
  is_deleted: bool,
  with_comment: bool,
) -> napi::Result<JsObject> {
  env.spawn_future(datasheet::services::record::get_records(dst_id, record_ids, is_deleted, with_comment).err_into())
}
