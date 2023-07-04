/**
 * DAO(Data Access Objects) Manager
 *
 * DAO is a class that provides an abstract interface to some type of database or other persistence mechanism.
 * All DB(MySQL, PostgreSQL, MongoDB, etc.) operations should be implemented in DAOs.
 *
 * For example,  
 * `ChangesetsDAO` is a DAO for `changesets` table.
 * `Changeset` is a PO(persistent object) for `changesets` table.
 *  Space, Datasheet, Views are all BOs (Business Objects).
 */
pub trait BaseDAO {}

pub trait BasePO {}
