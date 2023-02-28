use crate::datasheet::database;
use crate::datasheet::entities::record_comment;
use crate::HashMap;
use futures::TryFutureExt;
use sea_orm::entity::prelude::*;
use sea_orm::sea_query::Expr;
use sea_orm::QuerySelect;

pub async fn get_record_comment_map_by_dst_id(dst_id: String) -> Result<HashMap<String, i64>, anyhow::Error> {
  record_comment::Entity::find()
    .select_only()
    .column(record_comment::Column::RecordId)
    .column_as(Expr::asterisk().count(), "count")
    .filter(
      record_comment::Column::DstId
        .eq(dst_id)
        .and(record_comment::Column::IsDeleted.eq(false)),
    )
    .group_by(record_comment::Column::RecordId)
    .into_tuple()
    .all(database::connection())
    .map_ok(|counts| counts.into_iter().collect())
    .err_into()
    .await
}
