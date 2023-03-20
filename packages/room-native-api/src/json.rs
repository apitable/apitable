use sea_orm::prelude::*;
use serde_json::Number;

/// Fixes napi-rs JSON number serialization bug.
pub fn fix_json(mut value: Json) -> Json {
  fn recur(value: &mut Json) {
    match value {
      Json::Array(arr) => {
        for item in arr {
          recur(item)
        }
      }
      Json::Object(obj) => {
        for (_, value) in obj {
          recur(value)
        }
      }
      Json::Number(num) => {
        if let Some(n) = num.as_u64() {
          if n > u32::MAX as u64 {
            if let Some(n) = Number::from_f64(n as f64) {
              *num = n;
            } else {
              panic!("number {n} is not finite");
            }
          }
        }
      }
      _ => {}
    }
  }
  recur(&mut value);
  value
}
