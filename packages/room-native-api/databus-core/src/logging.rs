pub fn init(is_dev_mode: bool) {
  tracing_subscriber::fmt()
    .with_max_level(if is_dev_mode {
      tracing::Level::DEBUG
    } else {
      tracing::Level::INFO
    })
    // disable log color in production mode to facilitate log monitoring systems (e.g. ELK)
    .with_ansi(is_dev_mode)
    .with_line_number(true)
    .with_test_writer()
    .init();
}
