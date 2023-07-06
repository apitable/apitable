use databus_core::DataBus;

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_new_databus() {
    let data_bus = DataBus::new();
    let space = data_bus.get_space("test_space_id");
    assert_eq!(space.space_id, "test_space_id");
  }

  #[test]
  fn test_get_units_dao() {
    let data_bus = DataBus::new();

    assert_eq!(data_bus.is_db_connected(), true);
    let _units_manager = data_bus.get_units_dao();

    assert_eq!(data_bus.get_units_dao().get_units(), 0);
  }
}
