pub trait ResultExt<T, E> {
  fn expect_with<F, S>(self, msg_fn: F) -> T
  where
    F: FnOnce(&E) -> S,
    S: AsRef<str>,
    E: std::fmt::Debug;

  fn err_into<E1>(self) -> Result<T, E1>
  where
    E: Into<E1>;
}

impl<T, E> ResultExt<T, E> for Result<T, E> {
  fn expect_with<F, S>(self, msg_fn: F) -> T
  where
    F: FnOnce(&E) -> S,
    S: AsRef<str>,
    E: std::fmt::Debug,
  {
    match self {
      Ok(v) => v,
      Err(err) => {
        let msg = msg_fn(&err);
        Err(err).expect(msg.as_ref())
      }
    }
  }

  fn err_into<E1>(self) -> Result<T, E1>
  where
    E: Into<E1>,
  {
    self.map_err(|err| err.into())
  }
}
