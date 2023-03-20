use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name_expr = r#"crate::datasheet::database::prefix("datasheet_record")"#)]
pub struct Model {
  #[sea_orm(primary_key, auto_increment = false)]
  pub id: i64,
  pub record_id: String,
  pub dst_id: String,
  pub data: Option<Json>,
  pub revision_history: Option<String>,
  pub revision: Option<u64>,
  #[sea_orm(column_name = "field_updated_info")]
  pub record_meta: Option<Json>,
  pub is_deleted: bool,
  pub created_by: Option<i64>,
  pub updated_by: Option<i64>,
  pub created_at: DateTimeUtc,
  pub updated_at: Option<DateTimeUtc>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
