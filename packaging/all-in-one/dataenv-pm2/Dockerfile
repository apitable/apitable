FROM almalinux/8-minimal:8.7-20221110

COPY conf/yum.repos.d/*.repo /etc/yum.repos.d/

ARG GOSU_VERSION=1.14

ENV GOSU_USER=rabbitmq

RUN set -eux; \
  arch="$(uname -m)"; \
  case "${arch}" in \
  aarch64) pkgArch='arm64' ;; \
  x86_64) pkgArch='amd64' ;; \
  *) echo >&2 "error: unsupported architecture: '${arch}'"; exit 1 ;; \
  esac; \
  \
  key='859BE8D7C586F538430B19C2467B942D3A79BD29'; \
  export GNUPGHOME="$(mktemp -d)"; \
  gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key"; \
  gpg --batch --export --armor "$key" > /etc/pki/rpm-gpg/RPM-GPG-KEY-mysql; \
  rm -rf "$GNUPGHOME"; \
  microdnf -y update; \
  microdnf -y install shadow-utils; \
  groupadd --system --gid 999 "${GOSU_USER}"; \
  useradd --system --uid 999 --gid 999 --create-home "${GOSU_USER}"; \
  rpm -Uvh "https://dl.min.io/server/minio/release/linux-${pkgArch}/archive/minio-20230106181118.0.0.${arch}.rpm"; \
  curl -s -q "https://dl.min.io/client/mc/release/linux-${pkgArch}/mc" -o /usr/local/bin/mc; \
  chmod +x /usr/local/bin/mc; \
  microdnf -y module enable redis:6; \
  microdnf -y install \
  mysql-community-server-minimal \
  openresty \
  rabbitmq-server erlang \
  redis; \
  microdnf -y install tar; \
  microdnf clean all; \
  \
  mkdir -p /data; \
  mkdir -p /etc/mysql/conf.d; \
  chown -R "${GOSU_USER}:${GOSU_USER}" /var/lib/mysql /var/run/mysqld /var/log/mysqld.log; \
  chown -R "${GOSU_USER}:${GOSU_USER}" /var/lib/redis /var/log/redis; \
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

VOLUME /data /var/lib/mysql /var/lib/rabbitmq /var/lib/redis

COPY script/ /usr/local/bin/
COPY ecosystem.config.js /

CMD ["bash", "-c", "init-mysql.sh && pm2-runtime start ecosystem.config.js"]
