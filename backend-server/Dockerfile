FROM amazoncorretto:8
ARG JAR_PATH
ARG PORT
COPY $JAR_PATH /opt/app.jar
EXPOSE $PORT
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/opt/app.jar"]