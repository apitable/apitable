use crate::database::consts::{DATASHEET_FIELD_BACK_REF_PREFIX, DATASHEET_FIELD_REF_PREFIX, REF_STORAGE_EXPIRE_TIME};
use crate::types::HashSet;
use crate::util::IntoMultipleValues;
use anyhow::{anyhow, Context};
use async_trait::async_trait;
use fred::prelude::*;
use std::sync::Arc;

#[async_trait]
pub trait ReferenceManager: Send {
  /// Creates two-way field references.
  ///
  /// Returns original foreign field IDs of all referenced foreign datasheets.
  async fn create_field_reference(
    &mut self,
    main_dst_id: &str,
    main_field_id: &str,
    foreign_dst_id: &str,
    foreign_field_ids: &HashSet<String>,
  ) -> anyhow::Result<HashSet<String>>;
}

pub(super) struct ReferenceManagerImpl {
  client: Arc<RedisClient>,
}

#[async_trait]
impl ReferenceManager for ReferenceManagerImpl {
  async fn create_field_reference(
    &mut self,
    main_dst_id: &str,
    main_field_id: &str,
    foreign_dst_id: &str,
    foreign_field_ids: &HashSet<String>,
  ) -> anyhow::Result<HashSet<String>> {
    tracing::debug!(
      "CreateComputeFieldReference: \
      mainDstId: {main_dst_id}, mainFieldId: {main_field_id}; \
      foreignDstId: {foreign_dst_id}, foreignFieldIds: {foreign_field_ids:?}"
    );
    let ref_key_suffix = format!("{main_dst_id}:{main_field_id}");
    // Build reference value
    let ref_values: HashSet<_> = foreign_field_ids
      .iter()
      .map(|field_id| format!("{foreign_dst_id}:{field_id}"))
      .collect();

    // Maintain backward reference
    for ref_value in &ref_values {
      let back_ref_key = format!("{DATASHEET_FIELD_BACK_REF_PREFIX}{ref_value}");
      let exist: bool = self
        .client
        .sismember(&back_ref_key, &ref_key_suffix)
        .await
        .with_context(|| format!("check if {ref_key_suffix} exists in back ref {back_ref_key} cache"))?;
      // May be referenced in many places, only creation, no replacing
      if !exist {
        tracing::debug!("CreateComputeFieldReference: {ref_key_suffix} not exist in {back_ref_key} back ref");
        self
          .client
          .sadd(&back_ref_key, &ref_key_suffix)
          .await
          .with_context(|| format!("add {ref_key_suffix} to back ref {back_ref_key} in cache"))?;
        self
          .client
          .expire(&back_ref_key, *REF_STORAGE_EXPIRE_TIME)
          .await
          .with_context(|| format!("set expiry of back ref {back_ref_key} in cache"))?;
      }
    }

    // Maintain forward reference relation. Example: LookUp field a in datasheet A references a field b in linked datasheet B, then
    // A-a and B-b forms forward reference, the former depends on the latter.
    let ref_key = format!("{DATASHEET_FIELD_REF_PREFIX}{ref_key_suffix}");
    let members: HashSet<String> = self
      .client
      .smembers(&ref_key)
      .await
      .with_context(|| format!("get existing refs of ref key {ref_key} in cache"))?;
    if !members.is_empty() {
      tracing::debug!("CreateComputeFieldReference: Re {ref_key_suffix} exist");
      // Compute difference, if not empty then invalid references exist, needs to break these backward reference
      let mut diff = members.difference(&ref_values).peekable();
      if diff.peek().is_some() {
        self
          .client
          .del(&ref_key)
          .await
          .with_context(|| format!("delete ref {ref_key} from cache"))?;
        for back_ref_key_suffix in diff {
          let back_ref_key = format!("{DATASHEET_FIELD_BACK_REF_PREFIX}{back_ref_key_suffix}");
          let exist: bool = self
            .client
            .sismember(&back_ref_key, &ref_key_suffix)
            .await
            .with_context(|| format!("check if back ref {back_ref_key} exists in cache"))?;
          if !exist {
            continue;
          }
          let count: usize = self
            .client
            .scard(&back_ref_key)
            .await
            .with_context(|| format!("get number of members of back ref {back_ref_key} in cache"))?;
          if count == 1 {
            self
              .client
              .del(&back_ref_key)
              .await
              .with_context(|| format!("delete back ref {back_ref_key} from cache"))?;
          } else {
            self
              .client
              .srem(&back_ref_key, &ref_key_suffix)
              .await
              .with_context(|| format!("remove member {ref_key_suffix} of back ref {back_ref_key} from cache"))?;
          }
        }
      } else if members.len() == ref_values.len() {
        // Return without further process if identical, or all covering
        return Self::get_ref_field_ids(&ref_key, members);
      }
    }

    tracing::debug!("CreateComputeFieldReference: Create or cover Re: {ref_key_suffix},Values: {ref_values:?}");
    self
      .client
      .sadd(&ref_key, IntoMultipleValues(ref_values.iter()))
      .await
      .with_context(|| format!("add {ref_values:?} to ref {ref_key} in cache"))?;
    self
      .client
      .expire(&ref_key, *REF_STORAGE_EXPIRE_TIME)
      .await
      .with_context(|| format!("set expiry of ref {ref_key} in cache"))?;
    Self::get_ref_field_ids(&ref_key, members)
  }
}

impl ReferenceManagerImpl {
  pub(super) fn new(client: Arc<RedisClient>) -> Self {
    Self { client }
  }

  fn get_ref_field_ids(ref_key: &str, refs: HashSet<String>) -> anyhow::Result<HashSet<String>> {
    refs
      .into_iter()
      .map(|r| {
        r.splitn(2, ':')
          .nth(1)
          .map(ToOwned::to_owned)
          .ok_or_else(|| anyhow!("{r} is an invalid ref, member of ref key {ref_key}"))
      })
      .collect()
  }
}

#[cfg(test)]
pub mod mock {
  use super::*;
  use crate::types::HashMap;
  use std::{
    fmt::{self, Debug, Formatter},
    sync::Arc,
  };
  use tokio::sync::Mutex;

  #[derive(Clone, PartialEq, Eq, Hash)]
  pub struct MockRefKey {
    pub dst_id: String,
    pub field_id: String,
  }

  impl Debug for MockRefKey {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
      write!(f, "{}:{}", self.dst_id, self.field_id)
    }
  }

  impl MockRefKey {
    pub fn new(dst_id: &str, field_id: &str) -> Self {
      Self {
        dst_id: dst_id.to_owned(),
        field_id: field_id.to_owned(),
      }
    }
  }

  pub struct MockReferenceManagerImpl {
    pub refs: HashMap<MockRefKey, HashMap<String, Vec<HashSet<String>>>>,
  }

  impl MockReferenceManagerImpl {
    pub fn new() -> Arc<Mutex<Self>> {
      Arc::new(Mutex::new(MockReferenceManagerImpl {
        refs: Default::default(),
      }))
    }
  }

  #[async_trait]
  impl ReferenceManager for MockReferenceManagerImpl {
    async fn create_field_reference(
      &mut self,
      main_dst_id: &str,
      main_field_id: &str,
      foreign_dst_id: &str,
      foreign_field_ids: &HashSet<String>,
    ) -> anyhow::Result<HashSet<String>> {
      let values = self
        .refs
        .entry(MockRefKey::new(main_dst_id, main_field_id))
        .or_default();
      let old_ref_field_ids = values.values().flatten().flatten().cloned().collect();
      values
        .entry(foreign_dst_id.to_owned())
        .or_default()
        .push(foreign_field_ids.clone());
      Ok(old_ref_field_ids)
    }
  }
}
