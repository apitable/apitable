use once_cell::sync::Lazy;

pub const DATASHEET_FIELD_REF_PREFIX: &str = "vikadata:nest:fieldRef:";
pub const DATASHEET_FIELD_BACK_REF_PREFIX: &str = "vikadata:nest:fieldReRef:";

pub static REF_STORAGE_EXPIRE_TIME: Lazy<i64> = Lazy::new(|| {
  env_var!(REF_STORAGE_EXPIRE_TIME)
    .and_then(|s| s.parse().ok())
    .unwrap_or(90 * 24 * 3600)
});
