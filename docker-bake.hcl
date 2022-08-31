
variable "TAG" {
    default = "latest"
}

variable "EDITION" {
    default = "apitable"
}

target "init-db" {
    dockerfile = "Dockerfile.init-db"
    context = "backend-server"
    tags = ["ghcr.io/vikadata/${EDITION}/init-db:${TAG}"]
}

target "backend-server" {
    dockerfile = "Dockerfile"
    context = "backend-server"
    tags = ["ghcr.io/vikadata/${EDITION}/backend-server:${TAG}"]
}

target "web-server" {
    dockerfile = "Dockerfile.next"
    tags = ["ghcr.io/vikadata/${EDITION}/web-server:${TAG}"]
}

target "room-server" {
    dockerfile = "Dockerfile"
    tags = ["ghcr.io/vikadata/${EDITION}/room-server:${TAG}"]
}

target "socket-server" {
    dockerfile = "packages/socket-server/Dockerfile"
    tags = ["ghcr.io/vikadata/${EDITION}/socket-server:${TAG}"]
}
