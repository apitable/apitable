pub trait OptionExt<T> {
  fn expect_with<F, S>(self, msg_fn: F) -> T
  where
    F: FnOnce() -> S,
    S: AsRef<str>;
}

impl<T> OptionExt<T> for Option<T> {
  fn expect_with<F, S>(self, msg_fn: F) -> T
  where
    F: FnOnce() -> S,
    S: AsRef<str>,
  {
    match self {
      Some(v) => v,
      None => None::<T>.expect(msg_fn().as_ref()),
    }
  }
}

pub trait OptionBoolExt {
  fn is_truthy(self) -> bool;
}

impl OptionBoolExt for Option<bool> {
  fn is_truthy(self) -> bool {
    self.unwrap_or(false)
  }
}
