FROM almalinux/8-minimal:8.7-20221110

COPY conf/yum.repos.d/*.repo /etc/yum.repos.d/
COPY conf/rpm-gpg/* /etc/pki/rpm-gpg/

ARG GOSU_VERSION=1.14

RUN set -eux; \
  arch="$(uname -m)"; \
  case "${arch}" in \
  aarch64) pkgArch='arm64' ;; \
  x86_64) pkgArch='amd64' ;; \
  *) echo >&2 "error: unsupported architecture: '${arch}'"; exit 1 ;; \
  esac; \
  \
  microdnf -y update; \
  rpm -Uvh "https://dl.min.io/server/minio/release/linux-${pkgArch}/archive/minio-20221202191922.0.0.${arch}.rpm"; \
  microdnf -y module enable redis:6; \
  microdnf -y install \
  mysql-community-server-minimal \
  openresty \
  rabbitmq-server erlang \
  redis; \
  microdnf -y install tar; \
  microdnf clean all; \
  \
  mkdir -p /data/{minio,redis}; \
  chown redis:redis /data/redis; \
  mkdir -p /etc/mysql/conf.d; \
  mkdir -p /var/run/openresty; \
  \
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash; \
  source ~/.nvm/nvm.sh; \
  nvm install 16.15.0 && nvm use 16.15.0 && corepack enable; \
  npm i -g pm2; \
  \
  curl -fL -o /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-${pkgArch}"; \
  chmod +x /usr/local/bin/gosu; \
  gosu --version; \
  gosu nobody true

COPY conf/my.cnf /etc/
COPY conf/nginx.conf /usr/local/openresty/nginx/conf/
COPY conf/nginx.vh.default.conf /etc/nginx/conf.d/default.conf
COPY conf/rabbitmq.conf /etc/rabbitmq/

ENV PATH=$PATH:/root/.nvm/versions/node/v16.15.0/bin:/usr/local/openresty/luajit/bin:/usr/local/openresty/nginx/sbin:/usr/local/openresty/bin

EXPOSE 80 3306 5672 6379 9000

COPY script/ /usr/local/bin/
COPY ecosystem.config.js /

CMD ["bash", "-c", "init-mysql.sh && pm2-runtime start ecosystem.config.js"]
