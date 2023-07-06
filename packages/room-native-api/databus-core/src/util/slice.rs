pub trait SliceExt {
  type Item;

  fn contains_ref<U>(&self, value: &U) -> bool
  where
    Self::Item: PartialEq<U>,
    U: ?Sized;
}

impl<T> SliceExt for [T] {
  type Item = T;

  fn contains_ref<U>(&self, value: &U) -> bool
  where
    Self::Item: PartialEq<U>,
    U: ?Sized,
  {
    self.iter().any(|str| str == value)
  }
}
