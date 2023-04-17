#[cfg(test)]
use super::mock::{MockDb, MockSqlLog};
#[cfg(test)]
use anyhow::anyhow;
#[cfg(test)]
use futures::stream::StreamExt;
use futures::stream::TryStreamExt;
use futures::Stream;
use mysql_async::prelude::*;
use mysql_async::{Conn as MysqlConn, Params};
#[cfg(test)]
use std::sync::Arc;
#[cfg(test)]
use tokio::sync::Mutex;

pub struct DbClient {
  pub(super) inner: DbClientInner,
}

pub(super) enum DbClientInner {
  Mysql(MysqlConn),
  #[cfg(test)]
  Mock(Arc<Mutex<MockDb>>),
}

impl DbClient {
  pub async fn query_all<T, S>(
    &mut self,
    sql: S,
    params: Params,
  ) -> anyhow::Result<impl Stream<Item = anyhow::Result<T>> + '_>
  where
    T: Unpin + FromRow + Send + 'static,
    S: Into<String>,
  {
    let sql = sql.into();
    match &mut self.inner {
      #[cfg(not(test))]
      DbClientInner::Mysql(conn) => Ok(sql.with(params).stream(conn).await?.err_into()),
      #[cfg(test)]
      DbClientInner::Mysql(conn) => Ok(sql.with(params).stream(conn).await?.err_into().boxed()),
      #[cfg(test)]
      DbClientInner::Mock(mock) => {
        let mut mock = mock.lock().await;
        let result = if mock.results.is_empty() {
          Err(anyhow!("no mock result set available for query: {sql}"))
        } else {
          Ok(futures::stream::iter(mock.results.remove(0).into_iter().map(|x| Ok(T::from_row(x)))).boxed())
        };
        mock.logs.push(MockSqlLog { sql, params });
        result
      }
    }
  }

  pub async fn query_one<T, S>(&mut self, sql: S, params: Params) -> anyhow::Result<Option<T>>
  where
    T: FromRow + Send + 'static,
    S: Into<String>,
  {
    let mut sql = sql.into();
    sql.push_str(" LIMIT 1");
    match &mut self.inner {
      DbClientInner::Mysql(conn) => Ok(sql.with(params).first(conn).await?),
      #[cfg(test)]
      DbClientInner::Mock(mock) => {
        let mut mock = mock.lock().await;
        let result = if mock.results.is_empty() {
          Err(anyhow!("no mock result set available for query: {sql}"))
        } else {
          let mut result = mock.results.remove(0);
          if result.is_empty() {
            Ok(None)
          } else {
            Ok(Some(T::from_row(result.remove(0))))
          }
        };
        mock.logs.push(MockSqlLog { sql, params });
        result
      }
    }
  }
}
