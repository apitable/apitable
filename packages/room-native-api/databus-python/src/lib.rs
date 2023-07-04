use pyo3::prelude::*;
use pyo3::wrap_pyfunction;

/// Formats the sum of two numbers as string.
#[pyfunction]
fn sum_as_string(a: usize, b: usize) -> PyResult<String> {
  Ok((a + b).to_string())
}

/// A Python module implemented in Rust.
#[pymodule(databus)]
fn string_sum(_py: Python, m: &PyModule) -> PyResult<()> {
  m.add_function(wrap_pyfunction!(sum_as_string, m)?)?;

  Ok(())
}
