pub trait SqlExt: ToOwned {
  /// `num_q`: number of question marks to append.
  fn append_in_condition(self, num_q: usize) -> Self::Owned;
}

impl SqlExt for String {
  fn append_in_condition(mut self, num_q: usize) -> Self::Owned {
    self.reserve(num_q * 2 + " IN ()".len());
    self.push_str(" IN (");
    for _ in 0..num_q {
      self.push_str("?,");
    }
    if num_q > 0 {
      self.pop();
    }
    self.push(')');
    self
  }
}
