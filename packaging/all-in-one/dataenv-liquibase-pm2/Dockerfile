FROM apitable/dataenv-pm2:latest

ARG LIQUIBASE_VERSION=4.8.0
ARG LPM_VERSION=0.1.3
ARG LB_SHA256=7462b6e92f7077e1858865c403d52f0dce1bd66d03b1fae907815c10825feb33

RUN set -eux; \
  microdnf -y update; \
  microdnf -y install findutils unzip; \
  microdnf clean all; \
  \
  CORRETTO_VERSION=1.8.0_362.b08-1; \
  export GNUPGHOME="$(mktemp -d)"; \
  curl -fL -o corretto.key https://yum.corretto.aws/corretto.key; \
  gpg --batch --import corretto.key; \
  gpg --batch --export --armor '6DC3636DAE534049C8B94623A122542AB04F24E3' > corretto.key; \
  rpm --import corretto.key; \
  rm -fr "$GNUPGHOME" corretto.key; \
  curl -fL -o /etc/yum.repos.d/corretto.repo https://yum.corretto.aws/corretto.repo; \
  grep -q '^gpgcheck=1' /etc/yum.repos.d/corretto.repo; \
  echo "priority=9" >> /etc/yum.repos.d/corretto.repo; \
  microdnf -y install "java-1.8.0-amazon-corretto-devel-${CORRETTO_VERSION}"; \
  (find /usr/lib/jvm/java-1.8.0-amazon-corretto -name src.zip -delete || true); \
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
ENV JAVA_HOME=/usr/lib/jvm/java-1.8.0-amazon-corretto
ENV LIQUIBASE_HOME=/liquibase

COPY liquibase.docker.properties /liquibase/
