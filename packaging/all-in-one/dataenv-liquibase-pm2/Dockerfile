FROM apitable/dataenv-pm2:latest

ARG LIQUIBASE_VERSION=4.21.1
ARG LPM_VERSION=0.2.3
ARG LB_SHA256=c04542865e5ece8b7b1ee9bd6beaefc5315e350620288d6ac1a2d32c3b1f7d8b

RUN set -euxo pipefail; \
  microdnf -y update; \
  microdnf -y install findutils unzip; \
  microdnf clean all; \
  \
  CORRETTO_VERSION=17.0.9.8-1; \
  GNUPGHOME="$(mktemp -d)"; \
  export GNUPGHOME; \
  curl -fL -o corretto.key https://yum.corretto.aws/corretto.key; \
  gpg --batch --import corretto.key; \
  gpg --batch --export --armor '6DC3636DAE534049C8B94623A122542AB04F24E3' > corretto.key; \
  rpm --import corretto.key; \
  rm -fr "$GNUPGHOME" corretto.key; \
  curl -fL -o /etc/yum.repos.d/corretto.repo https://yum.corretto.aws/corretto.repo; \
  grep -q '^gpgcheck=1' /etc/yum.repos.d/corretto.repo; \
  echo "priority=9" >> /etc/yum.repos.d/corretto.repo; \
  microdnf -y install "java-17-amazon-corretto-devel-${CORRETTO_VERSION}"; \
  (find /usr/lib/jvm/java-17-amazon-corretto -name src.zip -delete || true); \
  \
  mkdir -p /liquibase/bin; \
  cd /liquibase; \
  curl -LO "https://github.com/liquibase/liquibase/releases/download/v${LIQUIBASE_VERSION}/liquibase-${LIQUIBASE_VERSION}.tar.gz"; \
  echo "$LB_SHA256  liquibase-${LIQUIBASE_VERSION}.tar.gz" | sha256sum -c -; \
  tar -xzf liquibase-${LIQUIBASE_VERSION}.tar.gz; \
  rm -f liquibase-${LIQUIBASE_VERSION}.tar.gz; \
  curl -LO "https://github.com/liquibase/liquibase-package-manager/releases/download/v${LPM_VERSION}/lpm-${LPM_VERSION}-linux.zip"; \
  unzip lpm-${LPM_VERSION}-linux.zip -d bin/; \
  rm -f lpm-${LPM_VERSION}-linux.zip; \
  ln -s /liquibase/liquibase /usr/local/bin/; \
  ln -s /liquibase/bin/lpm /usr/local/bin/; \
  export LIQUIBASE_HOME=/liquibase; \
  lpm update; \
  lpm add mysql --global

ENV LANG C.UTF-8
ENV JAVA_HOME=/usr/lib/jvm/java-17-amazon-corretto
ENV LIQUIBASE_HOME=/liquibase

COPY liquibase.docker.properties /liquibase/
