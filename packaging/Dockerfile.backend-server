FROM amazoncorretto:17 AS builder

WORKDIR /app
COPY ./backend-server/. .
RUN ./gradlew -v
RUN ./gradlew build -x test


FROM amazoncorretto:17

ARG SEMVER_FULL
ENV SEMVER_FULL=${SEMVER_FULL}

WORKDIR /app

COPY --from=builder /app/application/build/libs/*.jar /app/app.jar
EXPOSE 8081
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "--add-opens=java.base/java.lang=ALL-UNNAMED", "-jar", "/app/app.jar"]
