use futures::TryFutureExt;
use once_cell::sync::OnceCell as SyncOnceCell;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use tokio::sync::OnceCell as AsyncOnceCell;

static mut DB_CONN: AsyncOnceCell<DatabaseConnection> = AsyncOnceCell::const_new();

#[derive(Debug, Clone)]
pub struct InitDbOptions {
  pub url: String,
  pub is_dev_mode: bool,
}

pub async fn init(options: InitDbOptions) -> Result<(), anyhow::Error> {
  init_table_name_prefix();

  tracing_subscriber::fmt()
    .with_max_level(if options.is_dev_mode {
      tracing::Level::DEBUG
    } else {
      tracing::Level::INFO
    })
    .with_test_writer()
    .init();

  unsafe {
    DB_CONN.get_or_try_init(async || {
      let mut opts = ConnectOptions::new(options.url);
      opts.sqlx_logging_level(tracing::log::LevelFilter::Debug);
      Database::connect(opts).await
    })
  }
  .err_into()
  .map_ok(|_| ())
  .await
}

pub fn connection() -> &'static DatabaseConnection {
  unsafe { DB_CONN.get() }.unwrap()
}

static TABLE_NAME_PREFIX: SyncOnceCell<String> = SyncOnceCell::new();

pub fn prefix(table_name: &str) -> String {
  format!("{}{}", unsafe { TABLE_NAME_PREFIX.get_unchecked() }, table_name)
}

pub(super) fn init_table_name_prefix() {
  TABLE_NAME_PREFIX.get_or_init(|| std::env::var("DATABASE_TABLE_PREFIX").unwrap_or_else(|_| "apitable_".to_owned()));
}

#[cfg(test)]
pub async fn mock_connection(db: DatabaseConnection) {
  unsafe {
    if DB_CONN.initialized() {
      DB_CONN.take();
    }
    DB_CONN.set(db).unwrap();
  }
}

#[cfg(test)]
pub fn take_connection() -> DatabaseConnection {
  unsafe { DB_CONN.take() }.unwrap()
}
