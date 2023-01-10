FROM apitable/dataenv-pm2:latest

ARG LIQUIBASE_VERSION=4.8.0
ARG LPM_VERSION=0.1.3
ARG LB_SHA256=7462b6e92f7077e1858865c403d52f0dce1bd66d03b1fae907815c10825feb33

RUN set -eux; \
  microdnf -y update; \
  microdnf -y install findutils unzip zip; \
  microdnf clean all; \
  curl -s "https://get.sdkman.io" | bash; \
  set +u; \
  source "/root/.sdkman/bin/sdkman-init.sh"; \
  sdk install java 8.0.342-amzn && sdk use java 8.0.342-amzn; \
  set -u; \
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

ENV JAVA_HOME=/root/.sdkman/candidates/java/current
ENV LIQUIBASE_HOME=/liquibase
ENV PATH=$PATH:/root/.sdkman/candidates/java/current/bin

COPY liquibase.docker.properties /liquibase/
