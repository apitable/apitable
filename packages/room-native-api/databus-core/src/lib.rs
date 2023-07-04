#![feature(async_closure, result_option_inspect, let_chains, extend_one)]

pub mod databus;
pub mod tablebundle;

use database::datasheet;
use database::resource;
use types::*;

pub use crate::databus::DataBus;
pub use database::datasheet::util::collect_datasheet_pack_resource_ids;
pub use tablebundle::TableBundle;

/// https://github.com/la10736/rstest/tree/master/rstest_reuse#cavelets
#[cfg(test)]
use rstest_reuse;

#[macro_use]
extern crate napi_derive;

#[macro_use]
pub mod util;
pub mod database;
pub mod logging;
mod node;
pub mod repository;
pub mod shared;
pub mod types;
mod unit;
mod user;

shaku::module! {
  pub RootModule {
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
      shared::config::ConfigServiceImpl,
      shared::rest::RestServiceImpl,
      shared::redis::RedisServiceImpl,
      user::UserServiceImpl,
      unit::UnitServiceImpl,
    ],
    providers = []
  }
}
