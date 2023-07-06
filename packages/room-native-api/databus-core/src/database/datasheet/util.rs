use super::types::DatasheetMeta;
use crate::database::types::DatasheetPack;
use crate::types::HashSet;

/// Collect all resource IDs contained in the data pack for real-time collaboration.
pub fn collect_datasheet_pack_resource_ids(data_pack: &DatasheetPack, is_datasheet: bool) -> Vec<String> {
  let mut resource_ids: HashSet<_> = if let Some(foreign_datasheet_map) = &data_pack.foreign_datasheet_map {
    foreign_datasheet_map.keys().cloned().collect()
  } else {
    HashSet::default()
  };
  // collect resource ids in widget panels
  let DatasheetMeta { widget_panels, .. } = &data_pack.snapshot.meta;
  if is_datasheet {
    if let Some(widget_panels) = widget_panels {
      for panel in widget_panels {
        resource_ids.extend(panel.widgets.iter().map(|widget| widget.id.clone()));
      }
    }
  } else {
    resource_ids.insert(data_pack.datasheet.id.clone());
  }
  resource_ids.into_iter().collect()
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::database::datasheet::types::{Field, FieldKind, WidgetInPanel, WidgetPanel};
  use crate::database::types::{BaseDatasheetPack, DatasheetSnapshot};
  use crate::node::types::{NodeInfo, NodePermissionState};
  use crate::types::Json;
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

  fn mock_node_info(dst_id: &str) -> NodeInfo {
    NodeInfo {
      id: dst_id.into(),
      name: dst_id.to_uppercase(),
      description: "{}".into(),
      parent_id: "fod888".into(),
      icon: "tick_100".into(),
      node_shared: false,
      node_permit_set: false,
      node_favorite: false,
      space_id: "spc1".into(),
      role: "editor".into(),
      permissions: NodePermissionState {
        is_deleted: None,
        permissions: Some(json!({
          "readable": true,
          "editable": true,
          "mock": "editor",
        })),
      },
      revision: 107,
      is_ghost_node: None,
      active_view: None,
      extra: Some(json!({
        "showRecordHistory": true
      })),
    }
  }

  #[test]
  fn single_datasheet() {
    let resource_ids = collect_datasheet_pack_resource_ids(
      &DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld1w1" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {},
          datasheet_id: "dst1".into(),
        },
        datasheet: mock_node_info("dst1"),
        field_permission_map: None,
        foreign_datasheet_map: None,
        units: vec![],
      },
      true,
    );

    assert_eq!(resource_ids, Vec::<String>::new());
  }

  #[test]
  fn multiple_datasheets() {
    let mut resource_ids = collect_datasheet_pack_resource_ids(
      &DatasheetPack {
        snapshot: DatasheetSnapshot {
          meta: DatasheetMeta {
            field_map: hashmap! {
              "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
            },
            views: vec![json!({
              "columns": [
                { "fieldId": "fld1w1" },
              ]
            })],
            widget_panels: None,
          },
          record_map: hashmap! {},
          datasheet_id: "dst1".into(),
        },
        datasheet: mock_node_info("dst1"),
        field_permission_map: None,
        foreign_datasheet_map: Some(hashmap! {
          "dst2".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: DatasheetMeta {
                field_map: hashmap! {
                  "fld2w1".into() => new_field("fld2w1", FieldKind::Text, json!({})),
                },
                views: vec![json!({
                  "columns": [
                    { "fieldId": "fld2w1" },
                  ]
                })],
                widget_panels: Some(vec![
                  WidgetPanel {
                    id: "wpl4".into(),
                    widgets: vec![
                      WidgetInPanel {
                        id: "wdt8".into(),
                        others: Some(json!({ "height": 10.0, "y": 10.0 }))
                      }
                    ],
                    others: Some(json!({
                      "name": "wp 4",
                    })),
                  }
                ]),
              },
              record_map: hashmap! {},
              datasheet_id: "dst2".into(),
            },
            datasheet: serde_json::to_value(mock_node_info("dst2")).unwrap(),
            field_permission_map: None,
          },
          "dst3".into() => BaseDatasheetPack {
            snapshot: DatasheetSnapshot {
              meta: DatasheetMeta {
                field_map: hashmap! {
                  "fld3w1".into() => new_field("fld3w1", FieldKind::Text, json!({})),
                },
                views: vec![json!({
                  "columns": [
                    { "fieldId": "fld3w1" },
                  ]
                })],
                widget_panels: Some(vec![
                  WidgetPanel {
                    id: "wpl5".into(),
                    widgets: vec![
                      WidgetInPanel {
                        id: "wdt8".into(),
                        others: Some(json!({ "height": 10.0, "y": 10.0 }))
                      }
                    ],
                    others: Some(json!({
                      "name": "wp 5",
                    })),
                  }
                ]),
              },
              record_map: hashmap! {},
              datasheet_id: "dst3".into(),
            },
            datasheet: serde_json::to_value(mock_node_info("dst3")).unwrap(),
            field_permission_map: None,
          },
        }),
        units: vec![],
      },
      true,
    );

    resource_ids.sort();
    assert_eq!(resource_ids, vec!["dst2".to_owned(), "dst3".into()]);
  }

  fn multiple_datasheets_and_widgets_fixture() -> DatasheetPack {
    DatasheetPack {
      snapshot: DatasheetSnapshot {
        meta: DatasheetMeta {
          field_map: hashmap! {
            "fld1w1".into() => new_field("fld1w1", FieldKind::Text, json!({})),
          },
          views: vec![json!({
            "columns": [
              { "fieldId": "fld1w1" },
            ]
          })],
          widget_panels: Some(vec![WidgetPanel {
            id: "wpl1".into(),
            widgets: vec![
              WidgetInPanel {
                id: "wdt1".into(),
                others: Some(json!({
                  "height": 10.0,
                })),
              },
              WidgetInPanel {
                id: "wdt2".into(),
                others: Some(json!({
                  "height": 10.0,
                  "y": 10.0,
                })),
              },
            ],
            others: Some(json!({
              "name": "WPL 1",
            })),
          }]),
        },
        record_map: hashmap! {},
        datasheet_id: "dst1".into(),
      },
      datasheet: mock_node_info("dst1"),
      field_permission_map: None,
      foreign_datasheet_map: Some(hashmap! {
        "dst2".into() => BaseDatasheetPack {
          snapshot: DatasheetSnapshot {
            meta: DatasheetMeta {
              field_map: hashmap! {
                "fld2w1".into() => new_field("fld2w1", FieldKind::Text, json!({})),
              },
              views: vec![json!({
                "columns": [
                  { "fieldId": "fld2w1" },
                ]
              })],
              widget_panels: Some(vec![
                WidgetPanel {
                  id: "wpl4".into(),
                  widgets: vec![
                    WidgetInPanel {
                      id: "wdt8".into(),
                      others: Some(json!({ "height": 10.0, "y": 10.0 }))
                    }
                  ],
                  others: Some(json!({
                    "name": "wp 4",
                  }))
                }
              ]),
            },
            record_map: hashmap! {},
            datasheet_id: "dst2".into(),
          },
          datasheet: serde_json::to_value(mock_node_info("dst2")).unwrap(),
          field_permission_map: None,
        },
        "dst3".into() => BaseDatasheetPack {
          snapshot: DatasheetSnapshot {
            meta: DatasheetMeta {
              field_map: hashmap! {
                "fld3w1".into() => new_field("fld3w1", FieldKind::Text, json!({})),
              },
              views: vec![json!({
                "columns": [
                  { "fieldId": "fld3w1" },
                ]
              })],
              widget_panels: Some(vec![
                WidgetPanel {
                  id: "wpl5".into(),
                  widgets: vec![
                    WidgetInPanel {
                      id: "wdt8".into(),
                      others: Some(json!({ "height": 10.0, "y": 10.0 }))
                    }
                  ],
                  others: Some(json!({
                    "name": "wp 5",
                  }))
                }
              ]),
            },
            record_map: hashmap! {},
            datasheet_id: "dst3".into(),
          },
          datasheet: serde_json::to_value(mock_node_info("dst3")).unwrap(),
          field_permission_map: None,
        },
      }),
      units: vec![],
    }
  }

  #[test]
  fn multiple_datasheets_and_widgets() {
    let mut resource_ids = collect_datasheet_pack_resource_ids(&multiple_datasheets_and_widgets_fixture(), true);

    resource_ids.sort();
    assert_eq!(
      resource_ids,
      vec!["dst2".to_owned(), "dst3".into(), "wdt1".into(), "wdt2".into()]
    );
  }

  #[test]
  fn multiple_datasheets_and_widgets_not_datasheet() {
    let mut resource_ids = collect_datasheet_pack_resource_ids(&multiple_datasheets_and_widgets_fixture(), false);

    resource_ids.sort();
    assert_eq!(resource_ids, vec!["dst1".to_owned(), "dst2".into(), "dst3".into()],);
  }
}
