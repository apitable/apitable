use databus_core::TableBundle;

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_works() {
    let table_bundle0 = TableBundle::new();
    assert_eq!(table_bundle0.get_nodes_count(), 0);
  }
}
