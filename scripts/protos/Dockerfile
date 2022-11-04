FROM apitable/devenv:latest

RUN yarn global add @types/google-protobuf
# proto-tc
RUN yarn global add ts-proto --prefix /usr/local
# protoc
RUN apk -U --no-cache add protobuf protobuf-dev

ENV TS_PROTO_OUT_PATH build
ENV JAVA_PROTO_OUT_PATH build
ENV PROTO_FILE *.proto
ENV PROTO_PATH protos




