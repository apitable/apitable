use fred::prelude::*;
use fred::types::MultipleValues;

pub struct IntoMultipleValues<I>(pub I);

impl<I, T> TryInto<MultipleValues> for IntoMultipleValues<I>
where
  I: IntoIterator<Item = T>,
  T: Into<RedisValue>,
  MultipleValues: FromIterator<T>,
{
  type Error = RedisError;

  fn try_into(self) -> Result<MultipleValues, Self::Error> {
    Ok(FromIterator::from_iter(self.0))
  }
}
