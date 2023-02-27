use seahash::SeaHasher;
use std::hash;

pub type HashMap<K, V> = std::collections::HashMap<K, V, BuildSeaHasher>;

#[derive(Default)]
pub struct BuildSeaHasher;

impl hash::BuildHasher for BuildSeaHasher {
  type Hasher = SeaHasher;

  fn build_hasher(&self) -> Self::Hasher {
    SeaHasher::new()
  }
}
