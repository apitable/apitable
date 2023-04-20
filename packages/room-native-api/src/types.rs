use napi::bindgen_prelude::{FromNapiValue, Object, ToNapiValue};
use seahash::SeaHasher;
use serde::{Deserialize, Serialize};
use std::collections::hash_map;
use std::hash::{BuildHasher, Hash};
use std::ops::{Deref, DerefMut};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct HashMap<K: Hash + Eq, V>(pub std::collections::HashMap<K, V, BuildSeaHasher>);

pub type HashSet<K> = std::collections::HashSet<K, BuildSeaHasher>;

pub type Json = serde_json::Value;

#[derive(Default, Clone, Copy)]
pub struct BuildSeaHasher;

impl BuildHasher for BuildSeaHasher {
  type Hasher = SeaHasher;

  fn build_hasher(&self) -> Self::Hasher {
    SeaHasher::new()
  }
}

impl<K, V> Default for HashMap<K, V>
where
  K: Hash + Eq,
{
  fn default() -> Self {
    Self(Default::default())
  }
}

impl<K, V> Deref for HashMap<K, V>
where
  K: Hash + Eq,
{
  type Target = std::collections::HashMap<K, V, BuildSeaHasher>;

  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

impl<K, V> DerefMut for HashMap<K, V>
where
  K: Hash + Eq,
{
  fn deref_mut(&mut self) -> &mut Self::Target {
    &mut self.0
  }
}

impl<K, V> FromNapiValue for HashMap<K, V>
where
  K: From<String> + Eq + Hash,
  V: FromNapiValue,
{
  unsafe fn from_napi_value(env: napi::sys::napi_env, napi_val: napi::sys::napi_value) -> napi::Result<Self> {
    let obj = unsafe { Object::from_napi_value(env, napi_val)? };
    let mut map = HashMap::default();
    for key in Object::keys(&obj)?.into_iter() {
      if let Some(val) = obj.get(&key)? {
        map.insert(K::from(key), val);
      }
    }

    Ok(map)
  }
}

impl<K, V> ToNapiValue for HashMap<K, V>
where
  K: AsRef<str> + Hash + Eq,
  V: ToNapiValue,
{
  unsafe fn to_napi_value(env: napi::sys::napi_env, val: Self) -> napi::Result<napi::sys::napi_value> {
    ToNapiValue::to_napi_value(env, val.0)
  }
}

impl<K, V> FromIterator<(K, V)> for HashMap<K, V>
where
  K: Eq + Hash,
{
  fn from_iter<T: IntoIterator<Item = (K, V)>>(iter: T) -> Self {
    Self(FromIterator::from_iter(iter))
  }
}

impl<K, V> PartialEq for HashMap<K, V>
where
  K: Eq + Hash,
  V: PartialEq,
{
  fn eq(&self, other: &Self) -> bool {
    self.0.eq(&other.0)
  }
}

impl<K, V> Eq for HashMap<K, V>
where
  K: Eq + Hash,
  V: Eq,
{
}

impl<K, V> HashMap<K, V>
where
  K: Hash + Eq,
{
  pub fn into_iter(self) -> hash_map::IntoIter<K, V> {
    self.0.into_iter()
  }
}

impl<K, V> IntoIterator for HashMap<K, V>
where
  K: Hash + Eq,
{
  type Item = (K, V);
  type IntoIter = hash_map::IntoIter<K, V>;

  fn into_iter(self) -> Self::IntoIter {
    self.0.into_iter()
  }
}

impl<'a, K, V> IntoIterator for &'a HashMap<K, V>
where
  K: Hash + Eq,
{
  type Item = (&'a K, &'a V);
  type IntoIter = hash_map::Iter<'a, K, V>;

  fn into_iter(self) -> Self::IntoIter {
    self.0.iter()
  }
}

impl<'a, K, V> IntoIterator for &'a mut HashMap<K, V>
where
  K: Hash + Eq,
{
  type Item = (&'a K, &'a mut V);
  type IntoIter = hash_map::IterMut<'a, K, V>;

  fn into_iter(self) -> Self::IntoIter {
    self.0.iter_mut()
  }
}

impl<K, V> Extend<(K, V)> for HashMap<K, V>
where
  K: Eq + Hash,
{
  #[inline]
  fn extend<T: IntoIterator<Item = (K, V)>>(&mut self, iter: T) {
    self.0.extend(iter)
  }

  #[inline]
  fn extend_one(&mut self, (k, v): (K, V)) {
    self.0.insert(k, v);
  }

  #[inline]
  fn extend_reserve(&mut self, additional: usize) {
    self.0.extend_reserve(additional);
  }
}
