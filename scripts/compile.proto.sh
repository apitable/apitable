if [ -n "$TS_PROTO_OUT_PATH" ]; then
  rm -rf $TS_PROTO_OUT_PATH && \
  mkdir -p $TS_PROTO_OUT_PATH && \
  protoc \
  --plugin=/usr/local/bin/protoc-gen-ts_proto \
  --proto_path=$PROTO_PATH \
  --ts_proto_opt=outputEncodeMethods=true,outputJsonMethods=true,outputClientImpl=false,usePrototypeForDefaults=true,addGrpcMetadata=true,lowerCaseServiceMethods=true,returnObservable=true,esModuleInterop=true \
  --ts_proto_out="$TS_PROTO_OUT_PATH" $PROTO_FILE && \
  ls $PROTO_PATH/ | grep -v Dockerfile | xargs -i cp -r $PROTO_PATH/{} $TS_PROTO_OUT_PATH/
fi
if [ -n "$JAVA_PROTO_OUT_PATH" ]; then
  rm -rf $JAVA_PROTO_OUT_PATH && \
  mkdir -p $JAVA_PROTO_OUT_PATH && \
  ls $PROTO_PATH/ | grep -v Dockerfile | xargs -i cp -r $PROTO_PATH/{} $JAVA_PROTO_OUT_PATH/
fi
