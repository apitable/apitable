use thiserror::Error;

#[derive(Debug, Error, Clone)]
#[error("access denied: {node_id}")]
pub struct AccessDeniedError {
  pub node_id: String,
}

#[derive(Debug, Error, Clone)]
#[error("server error")]
pub struct ServerError;

#[derive(Debug, Error, Clone)]
#[error("node not exist: {node_id}")]
pub struct NodeNotExistError {
  pub node_id: String,
}

#[derive(Debug, Error, Clone)]
#[error("rest request error, status code: {status_code}")]
pub struct RestError {
  pub status_code: u16,
}
