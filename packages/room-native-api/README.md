
# Room Native API

This module rewrites some hot functions in `room-server` in Rust in order to prevent them from blocking the event queue.

## Cross Compilation Notes

Cross compile `room-native-api` to `arm64` linux, based on `debian` docker image, with `Node.js v16.15.0` pre-installed.

```shell
# Install Rust toolchain (nightly)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y

# Install arm64 target for Rust
rustup target add aarch64-unknown-linux-gnu

# Install zig for linking
wget -qO- https://ziglang.org/download/0.10.1/zig-linux-x86_64-0.10.1.tar.xz | tar -xJf -C /opt -
export PATH=$PATH:"/opt/$(echo zig-*)"

# Add arm64 toolchain
dpkg --add-architecture arm64
apt-get update
apt-get install -y crossbuild-essential-arm64

# Start cross building
yarn install
yarn build --target aarch64-unknown-linux-gnu --zig-link-only
```