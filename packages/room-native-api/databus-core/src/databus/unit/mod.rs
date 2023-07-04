use crate::databus::{BaseDAO, BasePO};

pub struct UnitsDAO {}

impl UnitsDAO {
  pub fn get_units(&self) -> u64 {
    return 0;
  }
}

impl BaseDAO for UnitsDAO {}
pub struct Unit {}

impl BasePO for Unit {}
