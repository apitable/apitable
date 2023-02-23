use crate::datasheet::database;
use crate::datasheet::entities::record;
use crate::datasheet::services::record_comment;
use crate::HashMap;
use sea_orm::prelude::*;

#[napi(object)]
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Record {
  pub id: String,
  pub comment_count: u32,
  pub data: Json,
  pub created_at: i64,
  pub updated_at: Option<i64>,
  pub revision_history: Option<Vec<u32>>,
  #[napi(ts_type = "object")]
  pub record_meta: Option<Json>,
}

pub async fn get_records(
  dst_id: String,
  record_ids: Option<Vec<String>>,
  is_deleted: bool,
) -> Result<HashMap<String, Record>, anyhow::Error> {
  let mut cond = record::Column::DstId
    .eq(&dst_id)
    .and(record::Column::IsDeleted.eq(is_deleted));
  if let Some(record_ids) = record_ids {
    cond = cond.and(record::Column::RecordId.is_in(record_ids));
  }
  let record_list = record::Entity::find().filter(cond).all(database::connection()).await?;
  let comment_counts = record_comment::get_record_comment_map_by_dst_id(dst_id).await?;
  let mut record_map = HashMap::default();
  for record in record_list {
    let record_id = record.record_id;
    let comment_count = comment_counts.get(&record_id).copied().unwrap_or(0);
    record_map.insert(
      record_id.clone(),
      Record {
        id: record_id,
        data: record.data.unwrap_or_else(|| Json::Object(Default::default())),
        comment_count,
        created_at: record.created_at.timestamp_millis(),
        updated_at: record.updated_at.map(|d| d.timestamp_millis()),
        revision_history: record
          .revision_history
          .map(|s| s.split(',').map(|n| n.parse().unwrap()).collect()),
        record_meta: record.record_meta,
      },
    );
  }
  Ok(record_map)
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::{NaiveDateTime, Utc};
  use maplit::btreemap;
  use pretty_assertions::assert_eq;
  use sea_orm::{DatabaseBackend, IntoMockRow, MockDatabase, MockRow, Transaction, Value};
  use serde_json::json;
  use serial_test::serial;
  use tokio_test::assert_ok;

  fn timestamp(n: i64) -> DateTimeUtc {
    DateTimeUtc::from_utc(NaiveDateTime::from_timestamp_millis(n).unwrap(), Utc)
  }

  fn mock_record_query_results(
    is_deleted: bool,
  ) -> impl IntoIterator<Item = impl IntoIterator<Item = impl IntoMockRow>> {
    [vec![
      record::Model {
        id: 10,
        record_id: "rec1".to_owned(),
        dst_id: "dst1".to_owned(),
        data: Some(json!( { "fld1": 123 } )),
        revision_history: Some("0,3,7,8".to_owned()),
        revision: Some(8),
        record_meta: None,
        is_deleted,
        created_by: Some(1),
        updated_by: Some(1),
        created_at: timestamp(1676945874561),
        updated_at: Some(timestamp(1676945875561)),
      },
      record::Model {
        id: 11,
        record_id: "rec2".to_owned(),
        dst_id: "dst1".to_owned(),
        data: Some(json!({ "fld1": 889 })),
        revision_history: Some("4".to_owned()),
        revision: Some(4),
        record_meta: Some(json!( { "createdAt": 1676945874561i64 } )),
        is_deleted,
        created_by: Some(1),
        updated_by: Some(1),
        created_at: timestamp(1676945874561),
        updated_at: Some(timestamp(1676945875562)),
      },
      record::Model {
        id: 12,
        record_id: "rec3".to_owned(),
        dst_id: "dst1".to_owned(),
        data: None,
        revision_history: None,
        revision: None,
        record_meta: None,
        is_deleted,
        created_by: Some(2),
        updated_by: None,
        created_at: timestamp(1676945874561),
        updated_at: None,
      },
    ]]
  }

  const MOCK_RECORD_WITHOUT_RECORD_IDS_QUERY_SQL: &str = "SELECT \
    `apitable_datasheet_record`.`id`, \
    `apitable_datasheet_record`.`record_id`, \
    `apitable_datasheet_record`.`dst_id`, \
    `apitable_datasheet_record`.`data`, \
    `apitable_datasheet_record`.`revision_history`, \
    `apitable_datasheet_record`.`revision`, \
    `apitable_datasheet_record`.`field_updated_info`, \
    `apitable_datasheet_record`.`is_deleted`, \
    `apitable_datasheet_record`.`created_by`, \
    `apitable_datasheet_record`.`updated_by`, \
    `apitable_datasheet_record`.`created_at`, \
    `apitable_datasheet_record`.`updated_at` \
    FROM `apitable_datasheet_record` \
    WHERE (`apitable_datasheet_record`.`dst_id` = ?) \
    AND (`apitable_datasheet_record`.`is_deleted` = ?)";

  const MOCK_RECORD_COMMENT_QUERY_SQL: &str = "SELECT \
    `apitable_datasheet_record_comment`.`record_id`, \
    COUNT(*) AS `count` \
    FROM `apitable_datasheet_record_comment` \
    WHERE (`apitable_datasheet_record_comment`.`dst_id` = ?) \
    AND (`apitable_datasheet_record_comment`.`is_deleted` = ?) \
    GROUP BY `apitable_datasheet_record_comment`.`record_id`";

  #[tokio::test]
  #[serial]
  async fn get_records_without_record_ids() {
    database::init_table_name_prefix();

    let db = MockDatabase::new(DatabaseBackend::MySql)
      .append_query_results(mock_record_query_results(false))
      .append_query_results([vec![
        btreemap! {
          "0" => Value::String(Some(box "rec1".to_owned())),
          "1" => Value::Unsigned(Some(2)),
        },
        btreemap! {
          "0" => Value::String(Some(box "rec2".to_owned())),
          "1" => Value::Unsigned(Some(1)),
        },
      ]])
      .into_connection();
    database::mock_connection(db).await;
    let record_map = assert_ok!(get_records("dst1".to_owned(), None, false).await);

    assert_eq!(
      record_map,
      [
        (
          "rec1".to_owned(),
          Record {
            id: "rec1".to_owned(),
            comment_count: 2,
            data: json!( { "fld1": 123 } ),
            created_at: 1676945874561,
            updated_at: Some(1676945875561),
            revision_history: Some(vec![0, 3, 7, 8]),
            record_meta: None,
          }
        ),
        (
          "rec2".to_owned(),
          Record {
            id: "rec2".to_owned(),
            comment_count: 1,
            data: json!( { "fld1": 889 } ),
            created_at: 1676945874561,
            updated_at: Some(1676945875562),
            revision_history: Some(vec![4]),
            record_meta: Some(json! { { "createdAt": 1676945874561i64 }}),
          }
        ),
        (
          "rec3".to_owned(),
          Record {
            id: "rec3".to_owned(),
            comment_count: 0,
            data: json!({}),
            created_at: 1676945874561,
            updated_at: None,
            revision_history: None,
            record_meta: None,
          }
        ),
      ]
      .into_iter()
      .collect::<HashMap<_, _>>()
    );

    assert_eq!(
      database::take_connection().into_transaction_log(),
      [
        Transaction::from_sql_and_values(
          DatabaseBackend::MySql,
          MOCK_RECORD_WITHOUT_RECORD_IDS_QUERY_SQL,
          [Value::String(Some(box "dst1".to_owned())), Value::Bool(Some(false))]
        ),
        Transaction::from_sql_and_values(
          DatabaseBackend::MySql,
          MOCK_RECORD_COMMENT_QUERY_SQL,
          [Value::String(Some(box "dst1".to_owned())), Value::Bool(Some(false))]
        )
      ]
    );
  }

  #[tokio::test]
  #[serial]
  async fn get_records_with_record_ids() {
    database::init_table_name_prefix();

    let db = MockDatabase::new(DatabaseBackend::MySql)
      .append_query_results(mock_record_query_results(false))
      .append_query_results::<MockRow, _, _>([vec![]])
      .into_connection();
    database::mock_connection(db).await;
    let record_map = assert_ok!(
      get_records(
        "dst1".to_owned(),
        Some(vec!["rec1".to_owned(), "rec2".to_owned(), "rec3".to_owned(),]),
        false
      )
      .await
    );

    assert_eq!(
      record_map,
      [
        (
          "rec1".to_owned(),
          Record {
            id: "rec1".to_owned(),
            comment_count: 0,
            data: json!( { "fld1": 123 } ),
            created_at: 1676945874561,
            updated_at: Some(1676945875561),
            revision_history: Some(vec![0, 3, 7, 8]),
            record_meta: None,
          }
        ),
        (
          "rec2".to_owned(),
          Record {
            id: "rec2".to_owned(),
            comment_count: 0,
            data: json!( { "fld1": 889 } ),
            created_at: 1676945874561,
            updated_at: Some(1676945875562),
            revision_history: Some(vec![4]),
            record_meta: Some(json! { { "createdAt": 1676945874561i64 }}),
          }
        ),
        (
          "rec3".to_owned(),
          Record {
            id: "rec3".to_owned(),
            comment_count: 0,
            data: json!({}),
            created_at: 1676945874561,
            updated_at: None,
            revision_history: None,
            record_meta: None,
          }
        ),
      ]
      .into_iter()
      .collect::<HashMap<_, _>>()
    );

    assert_eq!(
      database::take_connection().into_transaction_log(),
      [
        Transaction::from_sql_and_values(
          DatabaseBackend::MySql,
          "SELECT `apitable_datasheet_record`.`id`, \
        `apitable_datasheet_record`.`record_id`, \
        `apitable_datasheet_record`.`dst_id`, \
        `apitable_datasheet_record`.`data`, \
        `apitable_datasheet_record`.`revision_history`, \
        `apitable_datasheet_record`.`revision`, \
        `apitable_datasheet_record`.`field_updated_info`, \
        `apitable_datasheet_record`.`is_deleted`, \
        `apitable_datasheet_record`.`created_by`, \
        `apitable_datasheet_record`.`updated_by`, \
        `apitable_datasheet_record`.`created_at`, \
        `apitable_datasheet_record`.`updated_at` \
        FROM `apitable_datasheet_record` \
        WHERE (`apitable_datasheet_record`.`dst_id` = ?) \
        AND (`apitable_datasheet_record`.`is_deleted` = ?) \
        AND (`apitable_datasheet_record`.`record_id` IN (?, ?, ?))",
          [
            Value::String(Some(box "dst1".to_owned())),
            Value::Bool(Some(false)),
            Value::String(Some(box "rec1".to_owned())),
            Value::String(Some(box "rec2".to_owned())),
            Value::String(Some(box "rec3".to_owned()))
          ]
        ),
        Transaction::from_sql_and_values(
          DatabaseBackend::MySql,
          MOCK_RECORD_COMMENT_QUERY_SQL,
          [Value::String(Some(box "dst1".to_owned())), Value::Bool(Some(false))]
        )
      ]
    );
  }

  #[tokio::test]
  #[serial]
  async fn get_records_deleted() {
    database::init_table_name_prefix();

    let db = MockDatabase::new(DatabaseBackend::MySql)
      .append_query_results(mock_record_query_results(true))
      .append_query_results::<MockRow, _, _>([vec![]])
      .into_connection();
    database::mock_connection(db).await;
    let record_map = assert_ok!(get_records("dst1".to_owned(), None, true).await);

    assert_eq!(
      record_map,
      [
        (
          "rec1".to_owned(),
          Record {
            id: "rec1".to_owned(),
            comment_count: 0,
            data: json!( { "fld1": 123 } ),
            created_at: 1676945874561,
            updated_at: Some(1676945875561),
            revision_history: Some(vec![0, 3, 7, 8]),
            record_meta: None,
          }
        ),
        (
          "rec2".to_owned(),
          Record {
            id: "rec2".to_owned(),
            comment_count: 0,
            data: json!( { "fld1": 889 } ),
            created_at: 1676945874561,
            updated_at: Some(1676945875562),
            revision_history: Some(vec![4]),
            record_meta: Some(json! { { "createdAt": 1676945874561i64 }}),
          }
        ),
        (
          "rec3".to_owned(),
          Record {
            id: "rec3".to_owned(),
            comment_count: 0,
            data: json!({}),
            created_at: 1676945874561,
            updated_at: None,
            revision_history: None,
            record_meta: None,
          }
        ),
      ]
      .into_iter()
      .collect::<HashMap<_, _>>()
    );

    assert_eq!(
      database::take_connection().into_transaction_log(),
      [
        Transaction::from_sql_and_values(
          DatabaseBackend::MySql,
          MOCK_RECORD_WITHOUT_RECORD_IDS_QUERY_SQL,
          [Value::String(Some(box "dst1".to_owned())), Value::Bool(Some(true))]
        ),
        Transaction::from_sql_and_values(
          DatabaseBackend::MySql,
          MOCK_RECORD_COMMENT_QUERY_SQL,
          [Value::String(Some(box "dst1".to_owned())), Value::Bool(Some(false))]
        )
      ]
    );
  }
}
