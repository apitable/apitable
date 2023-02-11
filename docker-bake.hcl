group "default" {
  targets = ["backend-server", "room-server", "web-server", "init-db", "openresty"]
}

variable "SEMVER_FULL" {
  default = "v0.0.0-alpha"
}

variable "IMAGE_TAG" {
  default = "latest"
}

target "backend-server" {
  context = "."
  dockerfile = "packaging/Dockerfile.backend-server"
  args = {
    SEMVER_FULL = SEMVER_FULL
  }
  tags = ["docker.io/apitable/backend-server:latest", "docker.io/apitable/backend-server:${IMAGE_TAG}"]
}

target "room-server" {
  context = "."
  dockerfile = "packaging/Dockerfile.room-server"
  args = {
    SEMVER_FULL = SEMVER_FULL
  }
  tags = ["docker.io/apitable/room-server:latest", "docker.io/apitable/room-server:${IMAGE_TAG}"]
}

target "web-server" {
  context = "."
  dockerfile = "packaging/Dockerfile.web-server"
  args = {
    SEMVER_FULL = SEMVER_FULL
  }
  tags = ["docker.io/apitable/web-server:latest", "docker.io/apitable/web-server:${IMAGE_TAG}"]
}

target "init-db" {
  context = "./init-db"
  dockerfile = "Dockerfile"
  args = {
    SEMVER_FULL = SEMVER_FULL
  }
  tags = ["docker.io/apitable/init-db:latest", "docker.io/apitable/init-db:${IMAGE_TAG}"]
}

target "openresty" {
  context = "./gateway"
  dockerfile = "packaging/Dockerfile.openresty"
  args = {
    SEMVER_FULL = SEMVER_FULL
  }
  tags = ["docker.io/apitable/openresty:latest", "docker.io/apitable/openresty:${IMAGE_TAG}"]
}

target "all-in-one" {
  context = "./packaging/all-in-one/all-in-one"
  dockerfile = "Dockerfile"
  args = {
    SEMVER_FULL = SEMVER_FULL
    IMAGE_TAG = IMAGE_TAG
  }
  tags = ["docker.io/apitable/all-in-one:latest", "docker.io/apitable/all-in-one:${IMAGE_TAG}"]
}
