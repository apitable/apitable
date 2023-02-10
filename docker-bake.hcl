group "default" {
  targets = ["backend-server", "room-server", "web-server", "init-db"]
}

variable "TAG" {
  default = "latest"
}

variable "BUILD_VERSION" {
  default = "development"
}

target "backend-server" {
  context = "."
  dockerfile = "packaging/Dockerfile.backend-server"
  args = {
    BUILD_VERSION = BUILD_VERSION
  }
  tags = ["docker.io/apitable/backend-server:latest", "docker.io/apitable/backend-server:${TAG}"]
}

target "room-server" {
  context = "."
  dockerfile = "packaging/Dockerfile.room-server"
  args = {
    BUILD_VERSION = BUILD_VERSION
  }
  tags = ["docker.io/apitable/room-server:latest", "docker.io/apitable/room-server:${TAG}"]
}

target "web-server" {
  context = "."
  dockerfile = "packaging/Dockerfile.web-server"
  args = {
    SEMVER_FULL = BUILD_VERSION
  }
  tags = ["docker.io/apitable/web-server:latest", "docker.io/apitable/web-server:${TAG}"]
}

target "init-db" {
  context = "./init-db"
  dockerfile = "Dockerfile"
  args = {
    BUILD_VERSION = BUILD_VERSION
  }
  tags = ["docker.io/apitable/init-db:latest", "docker.io/apitable/init-db:${TAG}"]
}

target "all-in-one" {
  context = "./packaging/all-in-one/all-in-one"
  dockerfile = "Dockerfile"
  args = {
    BUILD_VERSION = BUILD_VERSION
    APITABLE_VERSION = TAG
  }
  tags = ["docker.io/apitable/all-in-one:latest", "docker.io/apitable/all-in-one:${TAG}"]
}
