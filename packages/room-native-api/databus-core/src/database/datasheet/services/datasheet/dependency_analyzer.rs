use super::foreign_datasheet_loader::ForeignDatasheetLoader;
use super::foreign_datasheet_loader::InternalBaseDatasheetPack;
use super::foreign_datasheet_loader::InternalDatasheetMeta;
use super::reference_manager::ReferenceManager;
use crate::database::datasheet::types::{
  CreatedByFieldProperty, Field, FieldKind, FormulaFieldProperty, LinkFieldProperty, LookUpFieldProperty,
  MemberFieldProperty,
};
use crate::database::types::{FieldMap, RecordMap};
use crate::types::HashMap;
use crate::types::HashSet;
use crate::types::Json;
use crate::util::OptionBoolExt;
use anyhow::anyhow;
use anyhow::Context;
use once_cell::sync::Lazy;
use regex::Regex;
#[cfg(test)]
use std::collections::BTreeMap;
use std::sync::Arc;
use std::time::Instant;
use tokio::sync::Mutex;

pub(super) struct DependencyAnalyzer<'a> {
  main_dst_id: String,

  foreign_datasheet_map: HashMap<String, InternalBaseDatasheetPack>,

  /// unit ids contained in Member fields.
  member_field_unit_ids: HashSet<String>,

  /// uuids contained in CreatedBy or LastModifiedBy fields.
  operator_field_uuids: HashSet<String>,

  /// dst id -> (set of ids of fields that have been processed)
  processed_field_ids: HashMap<String, HashSet<String>>,

  /// If new records are loaded into a foreign datasheet after the foreign datasheet is loaded,
  /// the datasheet is marked as dirty, meaning all its records should be analyzed again.
  foreign_datasheet_dirty: HashSet<String>,

  /// datasheet id -> primary field id
  primary_fields: HashMap<String, String>,

  reference_manager: Arc<Mutex<dyn ReferenceManager>>,

  foreign_datasheet_loader: Arc<dyn ForeignDatasheetLoader>,

  main_dst_meta: &'a InternalDatasheetMeta,

  main_dst_record_map: Arc<Mutex<RecordMap>>,

  need_extend_main_dst_records: bool,
}

#[derive(Debug)]
struct DependencyAnalysisWork {
  dst_id: String,
  field_map: Arc<FieldMap>,
  record_map: Arc<Mutex<RecordMap>>,
  to_process_field_ids: HashSet<String>,
  linked_record_map: Option<HashMap<String, HashSet<String>>>,
}

#[derive(Debug, Default)]
struct FieldDependencies {
  /// link field id -> linked datasheet ID
  linked_dst_ids: HashMap<String, String>,
  /// for Lookup field: linked datasheet ID -> (non-empty set of lookuped field IDs)
  lookup_foreign_field_ids: HashMap<String, HashSet<String>>,
}

#[derive(Debug, Clone)]
pub struct DependencyAnalysisResult {
  pub foreign_datasheet_map: HashMap<String, InternalBaseDatasheetPack>,
  pub member_field_unit_ids: HashSet<String>,
  pub operator_field_uuids: HashSet<String>,
}

impl<'a> DependencyAnalyzer<'a> {
  pub(super) fn new(
    main_dst_id: &str,
    reference_manager: Arc<Mutex<dyn ReferenceManager>>,
    foreign_datasheet_loader: Arc<dyn ForeignDatasheetLoader>,
    main_dst_meta: &'a InternalDatasheetMeta,
    main_dst_record_map: Arc<Mutex<RecordMap>>,
    need_extend_main_dst_records: bool,
  ) -> Self {
    Self {
      main_dst_id: main_dst_id.to_owned(),
      foreign_datasheet_map: Default::default(),
      member_field_unit_ids: Default::default(),
      operator_field_uuids: Default::default(),
      processed_field_ids: Default::default(),
      foreign_datasheet_dirty: Default::default(),
      primary_fields: Default::default(),
      reference_manager,
      foreign_datasheet_loader,
      main_dst_meta,
      main_dst_record_map,
      need_extend_main_dst_records,
    }
  }

  pub(super) async fn analyze(
    mut self,
    dst_id: &str,
    to_process_field_ids: HashSet<String>,
    linked_record_map: Option<HashMap<String, HashSet<String>>>,
  ) -> anyhow::Result<DependencyAnalysisResult> {
    let mut work_list = vec![DependencyAnalysisWork {
      dst_id: dst_id.to_owned(),
      field_map: self.main_dst_meta.field_map.clone(),
      record_map: self.main_dst_record_map.clone(),
      to_process_field_ids,
      linked_record_map,
    }];

    while let Some(work) = work_list.pop() {
      let dst_id = work.dst_id.clone();
      let new_works = self
        .process_work(work)
        .await
        .with_context(|| format!("process dependencies of datasheet {dst_id}"))?;
      // NOTE push successive works in reverse order to make sure that traversal order of datasheets
      // is identical to that of DatasheetFieldHandler in room-server.
      work_list.extend(new_works.into_iter().rev());
    }

    Ok(DependencyAnalysisResult {
      foreign_datasheet_map: self.foreign_datasheet_map,
      member_field_unit_ids: self.member_field_unit_ids,
      operator_field_uuids: self.operator_field_uuids,
    })
  }

  async fn process_work(&mut self, work: DependencyAnalysisWork) -> anyhow::Result<Vec<DependencyAnalysisWork>> {
    let DependencyAnalysisWork {
      dst_id,
      field_map,
      record_map,
      to_process_field_ids,
      linked_record_map,
    } = work;

    // If a foreign datasheet is dirty, process its fields again.
    let to_process_field_ids = if self.foreign_datasheet_dirty.remove(&dst_id) {
      to_process_field_ids
    } else {
      // Only process fields that haven't been processed.
      let processed_field_ids = self.processed_field_ids.entry(dst_id.clone()).or_default();
      let diff: HashSet<_> = to_process_field_ids.difference(processed_field_ids).cloned().collect();
      if !diff.is_empty() {
        processed_field_ids.extend(to_process_field_ids);
      }
      diff
    };

    if to_process_field_ids.is_empty() {
      return Ok(vec![]);
    }

    let mut new_works = vec![];

    let FieldDependencies {
      mut linked_dst_ids,
      lookup_foreign_field_ids,
    } = self
      .analyze_field_dependencies(
        &dst_id,
        to_process_field_ids,
        field_map.clone(),
        record_map.clone(),
        &mut new_works,
      )
      .await
      .with_context(|| format!("analyze field dependencies of {dst_id}"))?;

    self
      .load_foreign_datasheet_packs(&dst_id, &mut linked_dst_ids)
      .await
      .with_context(|| format!("load foreign datasheet packs of {dst_id}"))?;

    self
      .load_foreign_record_maps(&dst_id, record_map, &linked_dst_ids, linked_record_map)
      .await
      .with_context(|| format!("load foreign record maps of {dst_id}"))?;

    self
      .process_linked_dst_primary_fields(&dst_id, &linked_dst_ids, &mut new_works)
      .await
      .with_context(|| format!("process primary fields of linked datasheets of {dst_id}"))?;

    self
      .process_lookup_fields(lookup_foreign_field_ids, &mut new_works)
      .await
      .with_context(|| format!("process lookup fields of {dst_id}"))?;

    Ok(new_works)
  }

  async fn analyze_field_dependencies(
    &mut self,
    dst_id: &str,
    field_ids: HashSet<String>,
    field_map: Arc<FieldMap>,
    record_map: Arc<Mutex<RecordMap>>,
    new_works: &mut Vec<DependencyAnalysisWork>,
  ) -> anyhow::Result<FieldDependencies> {
    let mut deps = FieldDependencies::default();

    for field_id in field_ids {
      // Only handle the field if datasheet contains it
      let Some(field) = field_map.get(&field_id) else {
        continue
      };

      let Some(property) = field.property.as_ref() else {
        continue;
      };
      match field.kind {
        FieldKind::Link => {
          let property: LinkFieldProperty = serde_json::from_value(property.clone())
            .with_context(|| format!("convert property of field {field_id} to LinkFieldProperty"))?;
          // main datasheet is self-linking or linked, skip it
          if property.foreign_datasheet_id == self.main_dst_id && !self.need_extend_main_dst_records {
            continue;
          }
          // Store linked datasheet ID corresponding to link field
          deps
            .linked_dst_ids
            .insert(field_id.clone(), property.foreign_datasheet_id);
        }
        FieldKind::LookUp => {
          let property: LookUpFieldProperty = serde_json::from_value(property.clone())
            .with_context(|| format!("convert property of field {field_id} to LookUpFieldProperty"))?;
          // The field is not in datasheet, skip
          let Some(lookuped_field) = field_map.get(&property.related_link_field_id) else {
            continue;
          };

          // Linked field is not link field, skip
          if lookuped_field.kind != FieldKind::Link {
            continue;
          }

          // Get referenced linked datasheet ID
          let Some(lookuped_field_property) = lookuped_field.property.as_ref() else {
            continue;
          };
          let LinkFieldProperty {
            foreign_datasheet_id, ..
          } = serde_json::from_value(lookuped_field_property.clone()).with_context(|| {
            format!(
              "convert property of field {} to LinkFieldProperty lookuped by field {field_id}",
              property.related_link_field_id
            )
          })?;
          let mut foreign_field_ids = hashset![];
          if let Some(field_id) = property.look_up_target_field_id {
            foreign_field_ids.insert(field_id);
          }
          // Parse reference filter condition
          if property.open_filter.is_truthy() {
            if let Some(filter_into) = property.filter_info {
              for condition in filter_into.conditions {
                let Some(Json::String(filter_field_id)) = condition.get("fieldId") else {
                  return Err(anyhow!("fieldId in filterInfo.conditions of {dst_id}:{field_id} is not string"));
                };
                foreign_field_ids.insert(filter_field_id.clone());
              }
            }
          }

          // Create two-way reference relation
          {
            self
              .reference_manager
              .lock()
              .await
              .create_field_reference(dst_id, &field_id, &foreign_datasheet_id, &foreign_field_ids)
              .await
              .with_context(|| {
                format!(
                  "create refs of lookup field: {dst_id}:{field_id} <-> {foreign_datasheet_id}:{foreign_field_ids:?}"
                )
              })?;
          }

          // main datasheet is self-linking or linked, skip
          if foreign_datasheet_id == self.main_dst_id && !self.need_extend_main_dst_records {
            continue;
          }
          // Store linked datasheet ID corresponding to linked field
          deps
            .linked_dst_ids
            .insert(property.related_link_field_id, foreign_datasheet_id.clone());
          // Store corresponding fields in referenced linked datasheet
          deps
            .lookup_foreign_field_ids
            .entry(foreign_datasheet_id)
            .or_default()
            .extend(foreign_field_ids);
        }
        FieldKind::Member => {
          let property: MemberFieldProperty = serde_json::from_value(property.clone())
            .with_context(|| format!("convert property of field {field_id} to MemberFieldProperty"))?;
          self.member_field_unit_ids.extend(property.unit_ids);
        }
        FieldKind::CreatedBy | FieldKind::LastModifiedBy => {
          let property: CreatedByFieldProperty = serde_json::from_value(property.clone())
            .with_context(|| format!("convert property of field {field_id} to CreatedByFieldProperty"))?;
          for uuid in property.uuids {
            if let Json::String(uuid) = uuid {
              self.operator_field_uuids.insert(uuid);
            }
          }
        }
        FieldKind::Formula => {
          self
            .process_formula_field(field_map.clone(), field, Some(record_map.clone()), new_works)
            .await
            .with_context(|| format!("process formula field {field_id}"))?;
        }
        _ => {
          // do nothing
        }
      }
    }

    Ok(deps)
  }

  /// Load foreign datasheet packs without recordMaps.
  async fn load_foreign_datasheet_packs(
    &mut self,
    dst_id: &str,
    linked_dst_ids: &mut HashMap<String, String>,
  ) -> anyhow::Result<()> {
    let mut to_delete_link_field_ids: Vec<String> = vec![];
    for (link_field_id, foreign_dst_id) in &*linked_dst_ids {
      // Avoid redundant loading of a linked datasheet caused by multiple fields linking the same datasheet,
      // and avoid loading metadata of main datasheet.
      if foreign_dst_id == &self.main_dst_id || self.foreign_datasheet_map.contains_key(foreign_dst_id) {
        continue;
      }
      let Some(foreign_datsheet) =
        self.foreign_datasheet_loader.load_foreign_datasheet(foreign_dst_id)
          .await
          .with_context(|| format!("load foreign datasheet pack {foreign_dst_id} of {dst_id}"))?
        else {
          // If linked datasheet is unaccessible, skip loading
          to_delete_link_field_ids.push(link_field_id.clone());
          continue;
        };
      self
        .foreign_datasheet_map
        .insert(foreign_dst_id.to_owned(), foreign_datsheet);
    }
    for link_field_id in to_delete_link_field_ids {
      linked_dst_ids.remove(&link_field_id);
    }
    Ok(())
  }

  async fn load_foreign_record_maps(
    &mut self,
    dst_id: &str,
    record_map: Arc<Mutex<RecordMap>>,
    linked_dst_ids: &HashMap<String, String>,
    linked_record_map: Option<HashMap<String, HashSet<String>>>,
  ) -> anyhow::Result<()> {
    // All linking records in link field of main datasheet are stored in linked_foreign_record_ids
    let linked_foreign_record_ids = match linked_record_map {
      Some(linked_record_map) => linked_record_map,
      None => Self::collect_linked_foreign_record_ids(dst_id, record_map, linked_dst_ids).await,
    };

    #[cfg(test)]
    let linked_foreign_record_ids = linked_foreign_record_ids.into_iter().collect::<BTreeMap<_, _>>();

    // Query linked datasheet data and linked records
    for (foreign_dst_id, foreign_record_ids) in linked_foreign_record_ids {
      if foreign_dst_id == self.main_dst_id {
        // Load more records of main datasheet.
        let mut main_dst_record_map = self.main_dst_record_map.lock().await;
        let existing_record_ids: HashSet<_> = main_dst_record_map.keys().cloned().collect();
        tracing::debug!(
          "Newly loading main datasheet records: {foreign_record_ids:?} - original records: {existing_record_ids:?}"
        );
        let to_load_record_ids: HashSet<_> = foreign_record_ids.difference(&existing_record_ids).cloned().collect();
        if !to_load_record_ids.is_empty() {
          let new_loaded_record_map = self
            .foreign_datasheet_loader
            .fetch_record_map(&foreign_dst_id, to_load_record_ids)
            .await
            .with_context(|| format!("load additional main datasheet record map {foreign_dst_id}"))?;
          main_dst_record_map.extend(new_loaded_record_map);
          self.foreign_datasheet_dirty.insert(foreign_dst_id);
        }
        continue;
      }
      // linked_record_map of robot event, linked datasheet may be unaccessible, skip
      let Some(foreign_datasheet_pack) = self.foreign_datasheet_map.get(&foreign_dst_id) else {
        continue;
      };
      tracing::debug!("Query new record {foreign_dst_id} --- {foreign_record_ids:?}");

      let mut foreign_record_map = foreign_datasheet_pack.snapshot.record_map.lock().await;

      if foreign_record_map.is_empty() {
        *foreign_record_map = self
          .foreign_datasheet_loader
          .fetch_record_map(&foreign_dst_id, foreign_record_ids)
          .await
          .with_context(|| format!("load record map of foreign datasheet {foreign_dst_id}"))?;
      } else {
        let existing_foreign_record_ids: HashSet<_> = foreign_record_map.keys().cloned().collect();
        tracing::debug!(
          "Newly loading records: {foreign_record_ids:?} - original records: {existing_foreign_record_ids:?}"
        );
        let to_load_foreign_record_ids: HashSet<_> = foreign_record_ids
          .difference(&existing_foreign_record_ids)
          .cloned()
          .collect();
        if !to_load_foreign_record_ids.is_empty() {
          let new_loaded_foreign_record_map = self
            .foreign_datasheet_loader
            .fetch_record_map(&foreign_dst_id, to_load_foreign_record_ids)
            .await
            .with_context(|| format!("load additional record map of foreign datasheet {foreign_dst_id}"))?;
          foreign_record_map.extend(new_loaded_foreign_record_map);
          self.foreign_datasheet_dirty.insert(foreign_dst_id);
        }
      }
    }

    Ok(())
  }

  async fn process_linked_dst_primary_fields(
    &mut self,
    dst_id: &str,
    linked_dst_ids: &HashMap<String, String>,
    new_works: &mut Vec<DependencyAnalysisWork>,
  ) -> anyhow::Result<()> {
    for (field_id, foreign_dst_id) in linked_dst_ids {
      // exists, skip
      if let Some(primary_field_id) = self.primary_fields.get(foreign_dst_id) {
        // Create two-way reference
        self
          .reference_manager
          .lock()
          .await
          .create_field_reference(dst_id, field_id, foreign_dst_id, &hashset![primary_field_id.clone()])
          .await
          .with_context(|| {
            format!("create refs of link field: {dst_id}:{field_id} <-> {foreign_dst_id}:{{{primary_field_id}}}")
          })?;
        continue;
      }

      // Get view and field data of linked datasheet
      let foreign_dst_meta = if foreign_dst_id == &self.main_dst_id {
        self.main_dst_meta
      } else {
        &self.foreign_datasheet_map.get(foreign_dst_id).ok_or_else(|| {
        anyhow!(
          "foreign datasheet {foreign_dst_id} of source datasheet {dst_id} not found during analyzing main datasheet {}",
          self.main_dst_id
        )
      })?.snapshot.meta
      };
      let foreign_first_view = foreign_dst_meta
        .views
        .get(0)
        .ok_or_else(|| anyhow!("no view for foreign datasheet {foreign_dst_id}"))?;
      let Some(foreign_primary_field_id) =
        foreign_first_view.pointer("/columns/0/fieldId")
          .and_then(|field_id| field_id.as_str())
        else {
          return Err(anyhow!("datasheet {foreign_dst_id} has no views[0].columns[0].fieldId"));
        };
      let Some(foreign_primary_field) = foreign_dst_meta.field_map.get(foreign_primary_field_id) else {
        return Err(anyhow!("datasheet {foreign_dst_id} has no field {foreign_primary_field_id}"));
      };
      self
        .primary_fields
        .insert(foreign_dst_id.clone(), foreign_primary_field_id.to_owned());
      // Create two-way reference
      self
        .reference_manager
        .lock()
        .await
        .create_field_reference(
          dst_id,
          field_id,
          foreign_dst_id,
          &hashset![foreign_primary_field_id.to_owned()],
        )
        .await
        .with_context(|| {
          format!("create refs of link field: {dst_id}:{field_id} <-> {foreign_dst_id}:{{{foreign_primary_field_id}}}")
        })?;
      // Only handle formula field
      if foreign_primary_field.kind == FieldKind::Formula {
        // Process primary field of linked datasheet, which is a formula field
        self
          .process_formula_field(
            foreign_dst_meta.field_map.clone(),
            foreign_primary_field,
            None,
            new_works,
          )
          .await
          .with_context(|| {
            format!("process primary formula field of foreign datasheet {foreign_dst_id} linked by {dst_id}:{field_id}")
          })?;
      }
    }
    Ok(())
  }

  async fn process_lookup_fields(
    &mut self,
    lookup_foreign_field_ids: HashMap<String, HashSet<String>>,
    new_works: &mut Vec<DependencyAnalysisWork>,
  ) -> anyhow::Result<()> {
    #[cfg(test)]
    let lookup_foreign_field_ids = lookup_foreign_field_ids.into_iter().collect::<BTreeMap<_, _>>();
    for (foreign_dst_id, field_ids) in lookup_foreign_field_ids {
      if foreign_dst_id == self.main_dst_id {
        new_works.push(DependencyAnalysisWork {
          dst_id: foreign_dst_id,
          field_map: self.main_dst_meta.field_map.clone(),
          record_map: self.main_dst_record_map.clone(),
          to_process_field_ids: field_ids,
          linked_record_map: None,
        });
        continue;
      }
      // Linked datasheet must exist, or skip
      let Some(foreign_dst) = self.foreign_datasheet_map.get(&foreign_dst_id) else {
        continue;
      };
      new_works.push(DependencyAnalysisWork {
        dst_id: foreign_dst_id,
        field_map: foreign_dst.snapshot.meta.field_map.clone(),
        record_map: foreign_dst.snapshot.record_map.clone(),
        to_process_field_ids: field_ids,
        linked_record_map: None,
      });
    }
    Ok(())
  }

  async fn process_formula_field(
    &self,
    field_map: Arc<FieldMap>,
    field: &Field,
    record_map: Option<Arc<Mutex<RecordMap>>>,
    new_works: &mut Vec<DependencyAnalysisWork>,
  ) -> anyhow::Result<()> {
    let Some(property) = field.property.as_ref() else {
      return Ok(());
    };
    // Get formula expression and the datasheet which the formula field belongs to
    let FormulaFieldProperty {
      expression,
      datasheet_id,
      ..
    } = serde_json::from_value(property.clone())
      .with_context(|| format!("convert property of field {} to FormulaFieldProperty", field.id))?;
    // If formula references fields
    static FIELD_ID_RE: Lazy<Regex> = Lazy::new(|| Regex::new(r#"\bfld\w{10}\b"#).unwrap());
    let formula_ref_field_ids: HashSet<_> = FIELD_ID_RE
      .find_iter(&expression)
      .map(|mat| mat.as_str().to_owned())
      .collect();
    if formula_ref_field_ids.is_empty() {
      return Ok(());
    }
    // Create two-way reference relation
    {
      self
        .reference_manager
        .lock()
        .await
        .create_field_reference(&datasheet_id, &field.id, &datasheet_id, &formula_ref_field_ids)
        .await
        .with_context(|| {
          format!(
            "create refs of formula field: {datasheet_id}:{} <-> {formula_ref_field_ids:?}",
            field.id
          )
        })?;
    }
    // Get corresponding record data of current datasheet
    let record_map = record_map
      .or_else(|| {
        self
          .foreign_datasheet_map
          .get(&datasheet_id)
          .map(|dst| dst.snapshot.record_map.clone())
      })
      .unwrap_or_default();
    // process recursively
    new_works.push(DependencyAnalysisWork {
      dst_id: datasheet_id,
      field_map,
      record_map,
      to_process_field_ids: formula_ref_field_ids,
      linked_record_map: None,
    });

    Ok(())
  }

  async fn collect_linked_foreign_record_ids(
    dst_id: &str,
    record_map: Arc<Mutex<RecordMap>>,
    linked_dst_ids: &HashMap<String, String>,
  ) -> HashMap<String, HashSet<String>> {
    let record_map = record_map.lock().await;
    if record_map.is_empty() || linked_dst_ids.is_empty() {
      return Default::default();
    }

    let start = Instant::now();
    tracing::info!("Start traverse main datasheet {dst_id} records");

    let mut linked_foreign_record_ids = HashMap::<String, HashSet<String>>::default();
    for record in record_map.values() {
      // Only process records with link fields
      let Json::Object(record_data) = &record.data else {
        continue;
      };

      // Process cell data of link field, get linking records from cell data
      // get linked field IDs
      for (link_field_id, foreign_dst_id) in linked_dst_ids {
        let Some(Json::Array(linked_record_ids)) = record_data.get(link_field_id) else {
          continue
        };
        if linked_record_ids.is_empty() {
          continue;
        }
        // filter out invalid cell values of linked fields
        let mut linked_record_ids = linked_record_ids
          .iter()
          .filter_map(|record_id| record_id.as_str().map(ToOwned::to_owned))
          .peekable();
        // This makes sure that all record ID sets in linked_foreign_record_ids are non empty.
        if linked_record_ids.peek().is_some() {
          // Store linked datasheet and corresponding record IDs
          linked_foreign_record_ids
            .entry(foreign_dst_id.clone())
            .or_default()
            .extend(linked_record_ids);
        }
      }
    }
    let duration = start.elapsed().as_millis();
    tracing::info!("Finished traversing main datasheet {dst_id} records, duration: {duration}ms");

    linked_foreign_record_ids
  }
}

#[cfg(test)]
mod tests {
  use super::super::foreign_datasheet_loader::mock::MockForeignDatasheetLoaderImpl;
  use super::super::foreign_datasheet_loader::ForeignDatasheetLoadLog;
  use super::super::reference_manager::mock::{MockRefKey, MockReferenceManagerImpl};
  use super::*;
  use crate::database::datasheet::types::DatasheetMeta;
  use crate::database::types::{BaseDatasheetPack, DatasheetSnapshot, Record};
  use pretty_assertions::assert_eq;
  use serde_json::json;

  fn new_field(id: &str, kind: FieldKind, property: Json) -> Field {
    Field {
      id: id.into(),
      name: id.to_uppercase(),
      desc: None,
      required: None,
      kind,
      property: Some(property),
    }
  }

  fn new_record(id: &str, data: Json) -> Record {
    Record {
      id: id.into(),
      comment_count: 0,
      data,
      created_at: 19999999,
      updated_at: None,
      revision_history: None,
      record_meta: None,
    }
  }

  #[tokio::test]
  async fn single_datasheet_collect_users() {
    let ref_man = MockReferenceManagerImpl::new();
    let dst_loader = MockForeignDatasheetLoaderImpl::new(Default::default());

    let meta = InternalDatasheetMeta {
      field_map: Arc::new(hashmap! {
        "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
        "fld1w2".into() => new_field(
          "fld1w2",
          FieldKind::Member,
          json!({
            "isMulti": true,
            "shouldSendMsg": false,
            "unitIds": ["u1", "u2", "u3"]
          }
        )),
        "fld1w3".into() => new_field(
          "fld1w3",
          FieldKind::CreatedBy,
          json!({
            "uuids": ["11", "12", "13", null, "15"],
            "datasheetId": "dst1"
          }
        )),
        "fld1w4".into() => new_field(
          "fld1w4",
          FieldKind::LastModifiedBy,
          json!({
            "uuids": ["15", "18", "12", {}, "16"],
            "datasheetId": "dst1",
            "collectType": 1,
            "fieldIdCollection": []
          }
        )),
      }),
      views: vec![json!({
        "columns": [{ "fieldId": "fld1w1" }]
      })],
      widget_panels: None,
    };
    let record_map = Arc::new(Mutex::new(hashmap! {}));

    let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

    let DependencyAnalysisResult {
      foreign_datasheet_map,
      member_field_unit_ids,
      operator_field_uuids,
    } = analyzer
      .analyze("dst1", meta.field_map.keys().cloned().collect(), None)
      .await
      .unwrap();

    assert_eq!(
      foreign_datasheet_map
        .into_iter()
        .map(|(id, dst)| (id, dst.into()))
        .collect::<HashMap<_, BaseDatasheetPack>>(),
      hashmap!()
    );

    assert_eq!(
      member_field_unit_ids,
      hashset!["u1".to_owned(), "u2".into(), "u3".into()]
    );
    assert_eq!(
      operator_field_uuids,
      hashset![
        "11".to_owned(),
        "12".into(),
        "13".into(),
        "15".into(),
        "16".into(),
        "18".into()
      ]
    );

    assert_eq!(Arc::try_unwrap(dst_loader).unwrap().into_logs(), vec![]);

    assert_eq!(ref_man.lock().await.refs, hashmap! {});
  }

  mod self_linking {
    use super::*;
    use pretty_assertions::assert_eq;

    fn mock_dst2_dst_pack(record_ids: Option<HashSet<&str>>) -> BaseDatasheetPack {
      BaseDatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld2w1".into() => new_field("fld2w1", FieldKind::Formula, json!({
                "datasheetId": "dst2",
                "expression": "+{fld2w40000000}",
              })),
              "fld2w2".into() => new_field("fld2w2", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
                "brotherFieldId": "fld1w2",
              })),
              "fld2w3".into() => new_field("fld2w3", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
                "brotherFieldId": "fld1w3",
              })),
              "fld2w40000000".into() => new_field("fld2w40000000", FieldKind::Link, json!({
                "foreignDatasheetId": "dst2",
              })),
              "fld2w5".into() => new_field(
                "fld2w5",
                FieldKind::Member,
                json!({
                  "isMulti": true,
                  "shouldSendMsg": false,
                  "unitIds": ["u1", "u2", "u3"]
                }
              )),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld2w1" },
                { "fieldId": "fld2w2" },
                { "fieldId": "fld2w3" },
                { "fieldId": "fld2w40000000" },
                { "fieldId": "fld2w5" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {
            "rec2w1" => new_record("rec2w1", json!({
              "fld2w40000000": ["rec2w5"]
            })),
            "rec2w2" => new_record("rec2w2", json!({})),
            "rec2w3" => new_record("rec2w3", json!({
              "fld2w40000000": ["rec2w5", "rec2w4"]
            })),
            "rec2w4" => new_record("rec2w4", json!({
              "fld2w40000000": ["rec2w6"],
            })),
            "rec2w5" => new_record("rec2w5", json!({})),
            "rec2w6" => new_record("rec2w6", json!({})),
            "rec2w7" => new_record("rec2w7", json!({
              "fld2w40000000": ["rec2w1"]
            })),
          }
          .into_iter()
          .filter(|(id, _)| record_ids.as_ref().map_or(true, |record_ids| record_ids.contains(id)))
          .map(|(id, record)| (id.to_owned(), record))
          .collect(),
          datasheet_id: "dst2".into(),
        },
        datasheet: json!({}),
        field_permission_map: Some(json!({})),
      }
    }

    fn mock_dst1_field_map() -> Arc<FieldMap> {
      Arc::new(hashmap! {
        "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
        "fld1w2".into() => new_field(
          "fld1w2",
          FieldKind::Link,
          json!({
            "foreignDatasheetId": "dst2",
            "brotherFieldId": "fld2w2",
          }
        )),
        "fld1w3".into() => new_field(
          "fld1w3",
          FieldKind::Link,
          json!({
            "foreignDatasheetId": "dst2",
            "brotherFieldId": "fld2w3",
          }
        )),
        "fld1w4".into() => new_field(
          "fld1w4",
          FieldKind::Link,
          json!({
            "foreignDatasheetId": "dst1",
          }
        )),
      })
    }

    /// Two link fields in one datasheet link the same datasheet, primary field of foreign datasheet is
    /// a formula field, which depends on a self-linking field, causing more foreign records being loaded.
    #[tokio::test]
    async fn two_link_fields_in_one_datasheet_link_same_datasheet_transitive_records() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst2".into() => mock_dst2_dst_pack(None)
      });

      let field_map = mock_dst1_field_map();
      let meta = InternalDatasheetMeta {
        field_map: field_map.clone(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w2": ["rec2w1", "rec2w2"],
          "fld1w4": ["rec1w2"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w3": ["rec2w1", "rec2w3"]
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst2".into() => mock_dst2_dst_pack(Some(hashset!["rec2w1", "rec2w2", "rec2w3", "rec2w4", "rec2w5"]))
        }
      );

      assert_eq!(member_field_unit_ids, hashset![]);
      assert_eq!(operator_field_uuids, hashset![]);

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst2".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst2".into(),
            record_ids: hashset!["rec2w1".into(), "rec2w2".into(), "rec2w3".into()]
          },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst2".into(),
            record_ids: hashset!["rec2w4".into(), "rec2w5".into()]
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst1", "fld1w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst2", "fld2w1") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w40000000".into()]],
          },
          MockRefKey::new("dst2", "fld2w40000000") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
        }
      );
    }

    /// Two link fields in one datasheet link the same datasheet, primary field of foreign datasheet is
    /// a formula field, which depends on a self-linking field, not causing more foreign records being loaded.
    #[tokio::test]
    async fn two_link_fields_in_one_datasheet_link_same_datasheet_no_transitive_records() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst2".into() => mock_dst2_dst_pack(None)
      });

      let field_map = mock_dst1_field_map();
      let meta = InternalDatasheetMeta {
        field_map: field_map.clone(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w4": ["rec1w2"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w3": ["rec2w1", "rec2w7", "rec2w5"]
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst2".into() => mock_dst2_dst_pack(Some(hashset!["rec2w1", "rec2w5", "rec2w7"]))
        }
      );

      assert_eq!(member_field_unit_ids, hashset![]);
      assert_eq!(operator_field_uuids, hashset![]);

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst2".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst2".into(),
            record_ids: hashset!["rec2w1".into(), "rec2w5".into(), "rec2w7".into()]
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst1", "fld1w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst2", "fld2w1") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w40000000".into()]],
          },
          MockRefKey::new("dst2", "fld2w40000000") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
        }
      );
    }

    fn mock_dst3_dst_pack(record_ids: Option<HashSet<&str>>) -> BaseDatasheetPack {
      BaseDatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld3w1".into() => new_field("fld3w1", FieldKind::Formula, json!({
                "datasheetId": "dst3",
                "expression": "{fld3w20000000} + {fld3w40000000}",
              })),
              "fld3w20000000".into() => new_field("fld3w20000000", FieldKind::LookUp, json!({
                "datasheetId": "dst3",
                "relatedLinkFieldId": "fld3w3",
                "lookUpTargetFieldId": "fld3w5",
              })),
              "fld3w3".into() => new_field("fld3w3", FieldKind::Link, json!({
                "foreignDatasheetId": "dst3",
              })),
              "fld3w40000000".into() => new_field("fld3w40000000", FieldKind::Member, json!({
                "isMulti": true,
                "shouldSendMsg": false,
                "unitIds": ["u1", "u2", "u3"]
              })),
              "fld3w5".into() => new_field("fld3w5", FieldKind::Formula, json!({
                "datasheetId": "dst3",
                "expression": "{fld3w60000000}",
              })),
              "fld3w60000000".into() => new_field("fld3w60000000", FieldKind::CreatedBy, json!({
                "uuids": ["11", "12", "13", "15"],
                "datasheetId": "dst3"
              })),
              "fld3w7".into() => new_field("fld3w7", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
                "brotherFieldId": "fld1w2",
              })),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld3w1" },
                { "fieldId": "fld3w20000000" },
                { "fieldId": "fld3w3" },
                { "fieldId": "fld3w40000000" },
                { "fieldId": "fld3w5" },
                { "fieldId": "fld3w7" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {
            "rec3w1" => new_record("rec3w1", json!({
              "fld3w3": ["rec3w5"]
            })),
            "rec3w2" => new_record("rec3w2", json!({})),
            "rec3w3" => new_record("rec3w3", json!({
              "fld3w3": ["rec3w5", "rec3w4"]
            })),
            "rec3w4" => new_record("rec3w4", json!({
              "fld3w3": ["rec3w6"],
            })),
            "rec3w5" => new_record("rec3w5", json!({
              "fld3w3": ["rec3w5","rec3w2"],
            })),
            "rec3w6" => new_record("rec3w6", json!({})),
            "rec3w7" => new_record("rec3w7", json!({})),
          }
          .into_iter()
          .filter(|(id, _)| record_ids.as_ref().map_or(true, |record_ids| record_ids.contains(id)))
          .map(|(id, record)| (id.to_owned(), record))
          .collect(),
          datasheet_id: "dst3".into(),
        },
        datasheet: json!({}),
        field_permission_map: Some(json!({})),
      }
    }

    fn mock_lookup_self_dst1_field_map() -> Arc<FieldMap> {
      Arc::new(hashmap! {
        "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
        "fld1w2".into() => new_field(
          "fld1w2",
          FieldKind::Link,
          json!({
            "foreignDatasheetId": "dst3",
            "brotherFieldId": "fld3w7",
          }
        )),
      })
    }

    #[tokio::test]
    async fn lookup_relates_same_datasheet_self_linking_field_transitive_records() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst3".into() => mock_dst3_dst_pack(None)
      });

      let field_map = mock_lookup_self_dst1_field_map();
      let meta = InternalDatasheetMeta {
        field_map: field_map.clone(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w2": ["rec3w2"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w2": ["rec3w1", "rec3w3"]
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst3".into() => mock_dst3_dst_pack(Some(hashset!["rec3w1", "rec3w2", "rec3w3", "rec3w4", "rec3w5"]))
        }
      );

      assert_eq!(
        member_field_unit_ids,
        hashset!["u1".to_owned(), "u2".into(), "u3".into()]
      );
      assert_eq!(
        operator_field_uuids,
        hashset!["11".to_owned(), "12".into(), "13".into(), "15".into(),]
      );

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst3".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst3".into(),
            record_ids: hashset!["rec3w1".into(), "rec3w2".into(), "rec3w3".into()]
          },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst3".into(),
            record_ids: hashset!["rec3w4".into(), "rec3w5".into()]
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w1".into()]],
          },
          MockRefKey::new("dst3", "fld3w1") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w20000000".into(), "fld3w40000000".into()]],
          },
          MockRefKey::new("dst3", "fld3w20000000") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w5".into()]],
          },
          MockRefKey::new("dst3", "fld3w3") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w1".into()]],
          },
          MockRefKey::new("dst3", "fld3w5") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w60000000".into()]],
          },
        }
      );
    }

    #[tokio::test]
    async fn lookup_relates_same_datasheet_self_linking_field_no_transitive_records() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst3".into() => mock_dst3_dst_pack(None)
      });

      let field_map = mock_lookup_self_dst1_field_map();
      let meta = InternalDatasheetMeta {
        field_map: field_map.clone(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w2": ["rec3w1"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w2": ["rec3w5", "rec3w2"]
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst3".into() => mock_dst3_dst_pack(Some(hashset!["rec3w1", "rec3w2", "rec3w5"]))
        }
      );

      assert_eq!(
        member_field_unit_ids,
        hashset!["u1".to_owned(), "u2".into(), "u3".into()]
      );
      assert_eq!(
        operator_field_uuids,
        hashset!["11".to_owned(), "12".into(), "13".into(), "15".into(),]
      );

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst3".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst3".into(),
            record_ids: hashset!["rec3w1".into(), "rec3w2".into(), "rec3w5".into()]
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w1".into()]],
          },
          MockRefKey::new("dst3", "fld3w1") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w20000000".into(), "fld3w40000000".into()]],
          },
          MockRefKey::new("dst3", "fld3w20000000") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w5".into()]],
          },
          MockRefKey::new("dst3", "fld3w3") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w1".into()]],
          },
          MockRefKey::new("dst3", "fld3w5") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w60000000".into()]],
          },
        }
      );
    }

    fn mock_dst4_dst_pack(record_ids: Option<HashSet<&str>>) -> BaseDatasheetPack {
      BaseDatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld4w1".into() => new_field("fld4w1", FieldKind::Text, json!({})),
              "fld4w2".into() => new_field("fld4w2", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
                "brotherFieldId": "fld1w2",
              })),
              "fld4w3".into() => new_field("fld4w3", FieldKind::Link, json!({
                "foreignDatasheetId": "dst4",
              })),
              "fld4w4".into() => new_field("fld4w4", FieldKind::Member, json!({
                "isMulti": true,
                "shouldSendMsg": false,
                "unitIds": ["u1", "u2"]
              })),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld4w1" },
                { "fieldId": "fld4w2" },
                { "fieldId": "fld4w3" },
                { "fieldId": "fld4w4" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {
            "rec4w1" => new_record("rec4w1", json!({
              "fld4w3": ["rec4w5"]
            })),
            "rec4w2" => new_record("rec4w2", json!({})),
            "rec4w3" => new_record("rec4w3", json!({
              "fld4w3": ["rec4w5", "rec4w4"]
            })),
            "rec4w4" => new_record("rec4w4", json!({
              "fld4w3": ["rec4w6"],
            })),
            "rec4w5" => new_record("rec4w5", json!({
              "fld4w3": ["rec4w5","rec4w2"],
            })),
            "rec4w6" => new_record("rec4w6", json!({})),
            "rec4w7" => new_record("rec4w7", json!({})),
          }
          .into_iter()
          .filter(|(id, _)| record_ids.as_ref().map_or(true, |record_ids| record_ids.contains(id)))
          .map(|(id, record)| (id.to_owned(), record))
          .collect(),
          datasheet_id: "dst4".into(),
        },
        datasheet: json!({}),
        field_permission_map: Some(json!({})),
      }
    }

    fn mock_lookup_foreign_dst1_field_map() -> Arc<FieldMap> {
      Arc::new(hashmap! {
        "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
        "fld1w2".into() => new_field("fld1w2", FieldKind::Link, json!({
          "foreignDatasheetId": "dst4",
          "brotherFieldId": "fld4w2",
        })),
        "fld1w3".into() => new_field("fld1w3", FieldKind::LookUp, json!({
          "datasheetId": "dst1",
          "relatedLinkFieldId": "fld1w2",
          "lookUpTargetFieldId": "fld4w3",
          "openFilter": true,
          "filterInfo": {
            "conjunction": "and",
            "conditions": [{ "fieldId": "fld4w4" }]
          }
        })),
      })
    }

    #[tokio::test]
    async fn lookup_relates_foreign_datasheet_self_linking_field_transitive_records() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst4".into() => mock_dst4_dst_pack(None)
      });

      let field_map = mock_lookup_foreign_dst1_field_map();
      let meta = InternalDatasheetMeta {
        field_map: field_map.clone(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w2": ["rec4w2"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w2": ["rec4w1", "rec4w3"]
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst4".into() => mock_dst4_dst_pack(Some(hashset!["rec4w1", "rec4w2", "rec4w3", "rec4w4", "rec4w5"]))
        }
      );

      assert_eq!(member_field_unit_ids, hashset!["u1".to_owned(), "u2".into()]);
      assert_eq!(operator_field_uuids, hashset![]);

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst4".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst4".into(),
            record_ids: hashset!["rec4w1".into(), "rec4w2".into(), "rec4w3".into()]
          },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst4".into(),
            record_ids: hashset!["rec4w4".into(), "rec4w5".into()]
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst4".into() => vec![hashset!["fld4w1".into()]],
          },
          MockRefKey::new("dst1", "fld1w3") => hashmap! {
            "dst4".into() => vec![hashset!["fld4w3".into(), "fld4w4".into()]],
          },
          MockRefKey::new("dst4", "fld4w3") => hashmap! {
            "dst4".into() => vec![hashset!["fld4w1".into()]],
          },
        }
      );
    }

    #[tokio::test]
    async fn lookup_relates_foreign_datasheet_self_linking_field_no_transitive_records() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst4".into() => mock_dst4_dst_pack(None)
      });

      let field_map = mock_lookup_foreign_dst1_field_map();
      let meta = InternalDatasheetMeta {
        field_map: field_map.clone(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w2": ["rec4w2"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w2": ["rec4w1", "rec4w5"]
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst4".into() => mock_dst4_dst_pack(Some(hashset!["rec4w1", "rec4w2", "rec4w5"]))
        }
      );

      assert_eq!(member_field_unit_ids, hashset!["u1".to_owned(), "u2".into()]);
      assert_eq!(operator_field_uuids, hashset![]);

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst4".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst4".into(),
            record_ids: hashset!["rec4w1".into(), "rec4w2".into(), "rec4w5".into()]
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst4".into() => vec![hashset!["fld4w1".into()]],
          },
          MockRefKey::new("dst1", "fld1w3") => hashmap! {
            "dst4".into() => vec![hashset!["fld4w3".into(), "fld4w4".into()]],
          },
          MockRefKey::new("dst4", "fld4w3") => hashmap! {
            "dst4".into() => vec![hashset!["fld4w1".into()]],
          },
        }
      );
    }
  }

  mod lookup {
    use super::*;
    use pretty_assertions::assert_eq;

    #[tokio::test]
    async fn lookup_related_field_invalid() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {});

      let field_map = Arc::new(hashmap! {
        "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
        "fld1w2".into() => new_field("fld1w2", FieldKind::LookUp, json!({
          "datasheetId": "dst1",
          "relatedLinkFieldId": "fld1w999999999",
          "lookUpTargetFieldId": "fld4w3",
        })),
        "fld1w3".into() => new_field("fld1w3", FieldKind::LookUp, json!({
          "datasheetId": "dst1",
          "relatedLinkFieldId": "fld1w1",
          "lookUpTargetFieldId": "fld6w3",
        })),
        "fld1w4".into() => new_field("fld1w4", FieldKind::Link, json!({
          "foreignDatasheetId": "dst4",
          "brotherFieldId": "fld4w99",
        })),
        "fld1w5".into() => new_field("fld1w5", FieldKind::LookUp, json!({
          "datasheetId": "dst1",
          "relatedLinkFieldId": "fld1w4",
          "lookUpTargetFieldId": "fld4w3",
          "openFilter": true,
          "filterInfo": {
            "conjunction": "and",
            "conditions": [{ "fieldId": "fld4w4" }]
          }
        })),
      });
      let meta = InternalDatasheetMeta {
        field_map,
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w4": ["rec4w2"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w4": ["rec4w1", "rec4w5"]
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", meta.field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {}
      );

      assert_eq!(member_field_unit_ids, hashset![]);
      assert_eq!(operator_field_uuids, hashset![]);

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst4".into() },]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w5") => hashmap! {
            "dst4".into() => vec![hashset!["fld4w3".into(), "fld4w4".into()]],
          },
        }
      );
    }
  }

  mod dirty {
    use super::*;
    use pretty_assertions::assert_eq;

    fn mock_dst2_dst_pack(record_ids: Option<HashSet<&str>>) -> BaseDatasheetPack {
      BaseDatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld2w1".into() => new_field("fld2w1", FieldKind::Text, json!({
              })),
              "fld2w2".into() => new_field("fld2w2", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
                "brotherFieldId": "fld1w2",
              })),
              "fld2w3".into() => new_field("fld2w3", FieldKind::Formula, json!({
                "datasheetId": "dst2",
                "expression": "+{fld2w40000000}",
              })),
              "fld2w40000000".into() => new_field("fld2w40000000", FieldKind::Link, json!({
                "foreignDatasheetId": "dst2",
              })),
              "fld2w5".into() => new_field(
                "fld2w5",
                FieldKind::Member,
                json!({
                  "isMulti": true,
                  "shouldSendMsg": false,
                  "unitIds": ["u1", "u2", "u3"]
                }
              )),
              "fld2w6".into() => new_field(
                "fld2w6",
                FieldKind::Member,
                json!({
                  "isMulti": true,
                  "shouldSendMsg": false,
                  "unitIds": ["u9", "u4", "u3"]
                }
              )),
              "fld2w7".into() => new_field("fld2w7", FieldKind::Link, json!({
                "foreignDatasheetId": "dst3",
                "brotherFieldId": "fld3w3",
              })),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld2w1" },
                { "fieldId": "fld2w2" },
                { "fieldId": "fld2w3" },
                { "fieldId": "fld2w40000000" },
                { "fieldId": "fld2w5" },
                { "fieldId": "fld2w6" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {
            "rec2w1" => new_record("rec2w1", json!({
              "fld2w2": ["rec1w2"],
              "fld2w40000000": ["rec2w5"],
            })),
            "rec2w2" => new_record("rec2w2", json!({
              "fld2w2": ["rec1w1"],
              "fld2w7": ["rec3w1"]
            })),
            "rec2w3" => new_record("rec2w3", json!({
              "fld2w2": ["rec1w2"],
              "fld2w40000000": ["rec2w5", "rec2w4"]
            })),
            "rec2w4" => new_record("rec2w4", json!({
              "fld2w40000000": ["rec2w6"],
            })),
            "rec2w5" => new_record("rec2w5", json!({
              "fld2w40000000": ["rec2w2"],
            })),
            "rec2w6" => new_record("rec2w6", json!({
              "fld2w40000000": ["rec2w8"],
            })),
            "rec2w7" => new_record("rec2w7", json!({
              "fld2w40000000": ["rec2w1"]
            })),
            "rec2w8" => new_record("rec2w7", json!({})),
            "rec2w10" => new_record("rec2w10", json!({
              "fld2w2": ["rec1w10"],
              "fld2w40000000": ["rec2w12"]
            })),
            "rec2w11" => new_record("rec2w11", json!({
              "fld2w2": ["rec1w10"],
              "fld2w7": ["rec3w10"]
            })),
            "rec2w12" => new_record("rec2w12", json!({
              "fld2w2": ["rec1w11"],
              "fld2w40000000": ["rec2w11"]
            })),
          }
          .into_iter()
          .filter(|(id, _)| record_ids.as_ref().map_or(true, |record_ids| record_ids.contains(id)))
          .map(|(id, record)| (id.to_owned(), record))
          .collect(),
          datasheet_id: "dst2".into(),
        },
        datasheet: json!({}),
        field_permission_map: Some(json!({})),
      }
    }

    fn mock_dst3_dst_pack(record_ids: Option<HashSet<&str>>) -> BaseDatasheetPack {
      BaseDatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld3w1".into() => new_field("fld3w1", FieldKind::Text, json!({})),
              "fld3w2".into() => new_field("fld3w2", FieldKind::LookUp, json!({
                "datasheetId": "dst3",
                "relatedLinkFieldId": "fld3w3",
                "lookUpTargetFieldId": "fld2w40000000",
                "openFilter": false,
                "filterInfo": {
                  "conjunction": "and",
                  "conditions": [{ "fieldId": "fld2w6" }]
                }
              })),
              "fld3w3".into() => new_field("fld3w3", FieldKind::Link, json!({
                "foreignDatasheetId": "dst2",
                "brotherFieldId": "fld2w7",
              })),
              "fld3w4".into() => new_field("fld3w4", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
                "brotherFieldId": "fld1w4",
              })),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld3w1" },
                { "fieldId": "fld3w2" },
                { "fieldId": "fld3w3" },
                { "fieldId": "fld3w4" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {
            "rec3w1" => new_record("rec3w1", json!({
              "fld3w3": ["rec2w2"],
              "fld3w4": ["rec1w2"],
            })),
            "rec3w2" => new_record("rec3w2", json!({})),
            "rec3w3" => new_record("rec3w3", json!({})),
            "rec3w10" => new_record("rec3w10", json!({
              "fld3w3": ["rec2w11"],
              "fld3w4": ["rec1w11"],
            })),
          }
          .into_iter()
          .filter(|(id, _)| record_ids.as_ref().map_or(true, |record_ids| record_ids.contains(id)))
          .map(|(id, record)| (id.to_owned(), record))
          .collect(),
          datasheet_id: "dst3".into(),
        },
        datasheet: json!({}),
        field_permission_map: Some(json!({})),
      }
    }

    fn mock_dst1_field_map() -> Arc<FieldMap> {
      Arc::new(hashmap! {
        "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
        "fld1w2".into() => new_field("fld1w2", FieldKind::Link, json!({
          "foreignDatasheetId": "dst2",
          "brotherFieldId": "fld2w2",
        })),
        "fld1w3".into() => new_field("fld1w3", FieldKind::LookUp, json!({
          "datasheetId": "dst1",
          "relatedLinkFieldId": "fld1w2",
          "lookUpTargetFieldId": "fld2w3",
          "openFilter": true,
          "filterInfo": {
            "conjunction": "and",
            "conditions": [{ "fieldId": "fld2w5" }]
          }
        })),
        "fld1w4".into() => new_field("fld1w4", FieldKind::Link, json!({
          "foreignDatasheetId": "dst3",
          "brotherFieldId": "fld3w4",
        })),
        "fld1w5".into() => new_field("fld1w5", FieldKind::LookUp, json!({
          "datasheetId": "dst1",
          "relatedLinkFieldId": "fld1w4",
          "lookUpTargetFieldId": "fld3w2",
        })),
      })
    }

    #[tokio::test]
    async fn reprocess_dirty_fields() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst2".into() => mock_dst2_dst_pack(None),
        "dst3".into() => mock_dst3_dst_pack(None),
      });

      let meta = InternalDatasheetMeta {
        field_map: mock_dst1_field_map(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w1".into() => new_record("rec1w1", json!({
          "fld1w2": ["rec2w2"]
        })),
        "rec1w2".into() => new_record("rec1w2", json!({
          "fld1w2": ["rec2w1", "rec2w3"],
          "fld1w4": ["rec3w1"],
        })),
        "rec1w3".into() => new_record("rec1w3", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", meta.field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst2".into() => mock_dst2_dst_pack(Some(
            hashset!["rec2w1", "rec2w2", "rec2w3", "rec2w4", "rec2w5", "rec2w6"])),
          "dst3".into() => mock_dst3_dst_pack(Some(hashset!["rec3w1"])),
        }
      );

      assert_eq!(
        member_field_unit_ids,
        hashset!["u1".to_owned(), "u2".into(), "u3".into()]
      );
      assert_eq!(operator_field_uuids, hashset![]);

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst3".into() },
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst2".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst2".into(),
            record_ids: hashset!["rec2w1".into(), "rec2w2".into(), "rec2w3".into()]
          },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst3".into(),
            record_ids: hashset!["rec3w1".into()],
          },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst2".into(),
            record_ids: hashset!["rec2w4".into(), "rec2w5".into()],
          },
          // TODO redundant records are loaded due to the record processing algorithm, improve the
          // algorithm to avoid this problem in the future.
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst2".into(),
            record_ids: hashset!["rec2w6".into()],
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst1", "fld1w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w3".into(), "fld2w5".into()]],
          },
          MockRefKey::new("dst1", "fld1w4") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w1".into()]],
          },
          MockRefKey::new("dst2", "fld2w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w40000000".into()]],
          },
          MockRefKey::new("dst1", "fld1w5") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w2".into()]],
          },
          // fld2w7 is not processed, so no reference is created.
          // MockRefKey::new("dst2", "fld2w7") => hashmap! {
          //   "dst3".into() => vec![hashset!["fld3w1".into()]],
          // },
          MockRefKey::new("dst2", "fld2w40000000") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()], hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst3", "fld3w2") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w40000000".into()]],
          },
          MockRefKey::new("dst3", "fld3w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
        }
      );
    }

    #[tokio::test]
    async fn reprocess_nondirty_fields() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst2".into() => mock_dst2_dst_pack(None),
        "dst3".into() => mock_dst3_dst_pack(None),
      });

      let meta = InternalDatasheetMeta {
        field_map: mock_dst1_field_map(),
        views: vec![json!({
          "columns": [{ "fieldId": "fld1w1" }]
        })],
        widget_panels: None,
      };
      let record_map = Arc::new(Mutex::new(hashmap! {
        "rec1w10".into() => new_record("rec1w10", json!({
          "fld1w2": ["rec2w10", "rec2w11"]
        })),
        "rec1w11".into() => new_record("rec1w11", json!({
          "fld1w2": ["rec2w12"],
          "fld1w4": ["rec3w10"],
        })),
        "rec1w12".into() => new_record("rec1w12", json!({})),
      }));
      let analyzer = DependencyAnalyzer::new("dst1", ref_man.clone(), dst_loader.clone(), &meta, record_map, false);

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids,
        operator_field_uuids,
      } = analyzer
        .analyze("dst1", meta.field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst2".into() => mock_dst2_dst_pack(Some(
            hashset!["rec2w10", "rec2w11", "rec2w12"])),
          "dst3".into() => mock_dst3_dst_pack(Some(hashset!["rec3w10"])),
        }
      );

      assert_eq!(
        member_field_unit_ids,
        hashset!["u1".to_owned(), "u2".into(), "u3".into()]
      );
      assert_eq!(operator_field_uuids, hashset![]);

      assert_eq!(
        Arc::try_unwrap(dst_loader).unwrap().into_logs(),
        vec![
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst3".into() },
          ForeignDatasheetLoadLog::LoadDatasheet { dst_id: "dst2".into() },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst2".into(),
            record_ids: hashset!["rec2w10".into(), "rec2w11".into(), "rec2w12".into()]
          },
          ForeignDatasheetLoadLog::FetchRecords {
            dst_id: "dst3".into(),
            record_ids: hashset!["rec3w10".into()],
          },
        ]
      );

      assert_eq!(
        ref_man.lock().await.refs,
        hashmap! {
          MockRefKey::new("dst1", "fld1w2") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst1", "fld1w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w3".into(), "fld2w5".into()]],
          },
          MockRefKey::new("dst1", "fld1w4") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w1".into()]],
          },
          MockRefKey::new("dst2", "fld2w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w40000000".into()]],
          },
          MockRefKey::new("dst1", "fld1w5") => hashmap! {
            "dst3".into() => vec![hashset!["fld3w2".into()]],
          },
          // fld2w7 is not processed, so no reference is created.
          // MockRefKey::new("dst2", "fld2w7") => hashmap! {
          //   "dst3".into() => vec![hashset!["fld3w1".into()]],
          // },
          MockRefKey::new("dst2", "fld2w40000000") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
          MockRefKey::new("dst3", "fld3w2") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w40000000".into()]],
          },
          MockRefKey::new("dst3", "fld3w3") => hashmap! {
            "dst2".into() => vec![hashset!["fld2w1".into()]],
          },
        }
      );
    }
  }

  mod extend_records {
    use super::*;
    use crate::database::datasheet::services::datasheet::foreign_datasheet_loader::InternalDatasheetSnapshot;
    use pretty_assertions::assert_eq;

    fn mock_dst1_dst_pack(record_ids: Option<HashSet<&str>>) -> BaseDatasheetPack {
      BaseDatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
              "fld1w2".into() => new_field("fld1w2", FieldKind::Link, json!({
                "foreignDatasheetId": "dst2",
                "brotherFieldId": "fld2w2",
              })),
              "fld1w3".into() => new_field("fld1w3", FieldKind::LookUp, json!({
                "datasheetId": "dst1",
                "relatedLinkFieldId": "fld1w2",
                "lookUpTargetFieldId": "fld2w3",
              })),
              "fld1w4".into() => new_field("fld1w4", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
              })),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld1w1" },
                { "fieldId": "fld1w2" },
                { "fieldId": "fld1w3" },
                { "fieldId": "fld1w4" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {
            "rec1w1" => new_record("rec1w1", json!({
              "fld1w1": [{ "type": 1, "text": "a" }],
              "fld1w2": ["rec2w1"]
            })),
            "rec1w2" => new_record("rec1w2", json!({
              "fld1w1": [{ "type": 1, "text": "b" }],
              "fld1w2": ["rec2w1"]
            })),
            "rec1w3" => new_record("rec1w3", json!({})),
            "rec1w4" => new_record("rec1w4", json!({
              "fld1w4": ["rec1w5"],
            })),
            "rec1w5" => new_record("rec1w5", json!({
              "fld1w4": ["rec1w6"],
            })),
            "rec1w6" => new_record("rec1w6", json!({})),
          }
          .into_iter()
          .filter(|(id, _)| record_ids.as_ref().map_or(true, |record_ids| record_ids.contains(id)))
          .map(|(id, record)| (id.to_owned(), record))
          .collect(),
          datasheet_id: "dst2".into(),
        },
        datasheet: json!({}),
        field_permission_map: Some(json!({})),
      }
    }

    fn mock_dst2_dst_pack(record_ids: Option<HashSet<&str>>) -> BaseDatasheetPack {
      BaseDatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld2w1".into() => new_field("fld2w1", FieldKind::Text, json!({})),
              "fld2w2".into() => new_field("fld2w2", FieldKind::Link, json!({
                "foreignDatasheetId": "dst1",
                "brotherFieldId": "fld1w2",
              })),
              "fld2w3".into() => new_field("fld2w3", FieldKind::LookUp, json!({
                "datasheetId": "dst2",
                "relatedLinkFieldId": "fld2w2",
                "lookUpTargetFieldId": "fld1w1",
              })),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld2w1" },
                { "fieldId": "fld2w2" },
                { "fieldId": "fld2w3" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {
            "rec2w1" => new_record("rec2w1", json!({
              "fld2w1": [{ "type": 1, "text": "AA" }],
              "fld2w2": ["rec1w1", "rec1w2"],
            })),
          }
          .into_iter()
          .filter(|(id, _)| record_ids.as_ref().map_or(true, |record_ids| record_ids.contains(id)))
          .map(|(id, record)| (id.to_owned(), record))
          .collect(),
          datasheet_id: "dst2".into(),
        },
        datasheet: json!({}),
        field_permission_map: Some(json!({})),
      }
    }

    #[tokio::test]
    async fn extend_records_by_foreign_lookup_back_reference() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst1".into() => mock_dst1_dst_pack(None),
        "dst2".into() => mock_dst2_dst_pack(None),
      });

      let dst1_snapshot: InternalDatasheetSnapshot = mock_dst1_dst_pack(None).snapshot.into();
      dst1_snapshot
        .record_map
        .lock()
        .await
        .retain(|record_id, _| hashset!["rec1w1"].contains(record_id.as_str()));
      let analyzer = DependencyAnalyzer::new(
        "dst1",
        ref_man.clone(),
        dst_loader.clone(),
        &dst1_snapshot.meta,
        dst1_snapshot.record_map.clone(),
        true,
      );

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids: _,
        operator_field_uuids: _,
      } = analyzer
        .analyze("dst1", dst1_snapshot.meta.field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {
          "dst2".into() => mock_dst2_dst_pack(None),
        }
      );

      assert_eq!(
        *dst1_snapshot.record_map.lock().await,
        mock_dst1_dst_pack(Some(hashset!["rec1w1", "rec1w2"]))
          .snapshot
          .record_map
      )
    }

    #[tokio::test]
    async fn extend_records_by_self_linking() {
      let ref_man = MockReferenceManagerImpl::new();
      let dst_loader = MockForeignDatasheetLoaderImpl::new(hashmap! {
        "dst1".into() => mock_dst1_dst_pack(None),
      });

      let dst1_snapshot: InternalDatasheetSnapshot = mock_dst1_dst_pack(None).snapshot.into();
      dst1_snapshot
        .record_map
        .lock()
        .await
        .retain(|record_id, _| hashset!["rec1w4"].contains(record_id.as_str()));
      let analyzer = DependencyAnalyzer::new(
        "dst1",
        ref_man.clone(),
        dst_loader.clone(),
        &dst1_snapshot.meta,
        dst1_snapshot.record_map.clone(),
        true,
      );

      let DependencyAnalysisResult {
        foreign_datasheet_map,
        member_field_unit_ids: _,
        operator_field_uuids: _,
      } = analyzer
        .analyze("dst1", dst1_snapshot.meta.field_map.keys().cloned().collect(), None)
        .await
        .unwrap();

      assert_eq!(
        foreign_datasheet_map
          .into_iter()
          .map(|(id, dst)| (id, dst.into()))
          .collect::<HashMap<_, BaseDatasheetPack>>(),
        hashmap! {}
      );

      assert_eq!(
        *dst1_snapshot.record_map.lock().await,
        mock_dst1_dst_pack(Some(hashset!["rec1w4", "rec1w5"]))
          .snapshot
          .record_map
      )
    }
  }
}
