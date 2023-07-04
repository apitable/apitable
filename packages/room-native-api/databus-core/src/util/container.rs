pub trait ContainerExt {
  fn into_none_if_empty(self) -> Option<Self>
  where
    Self: Sized;

  fn none_if_empty(&self) -> Option<&Self>;
}

impl ContainerExt for String {
  fn into_none_if_empty(self) -> Option<Self> {
    if self.is_empty() {
      None
    } else {
      Some(self)
    }
  }

  fn none_if_empty(&self) -> Option<&Self> {
    if self.is_empty() {
      None
    } else {
      Some(self)
    }
  }
}
