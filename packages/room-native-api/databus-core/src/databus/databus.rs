use crate::databus::datasheet::Space;
use crate::databus::unit::UnitsDAO;
use std::collections::HashMap;

pub struct DataBus {
  _units_dao: Option<UnitsDAO>,
}

impl DataBus {
  pub fn new() -> DataBus {
    return DataBus {
      _units_dao: Some(UnitsDAO {}),
    };
  }

  /**
   * Get a real-time collaboration database space instance with space_id
   */
  pub fn get_space(&self, space_id: &str) -> Space {
    return Space {
      space_id: space_id.to_string(),
      datasheets: HashMap::new(),
    };
  }

  /**
   * Whether the database (ORM/MySQL/PostgreSQL/SQLite) is connected and ready
   */
  pub fn is_db_connected(&self) -> bool {
    return true;
  }

  pub fn get_units_dao(&self) -> &UnitsDAO {
    return &self._units_dao.as_ref().unwrap();
  }
}
