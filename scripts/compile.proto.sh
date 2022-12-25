# APITable <https://github.com/apitable/apitable>
# Copyright (C) 2022 APITable Ltd. <https://apitable.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

if [ -n "$TS_PROTO_OUT_PATH" ]; then
  rm -rf $TS_PROTO_OUT_PATH && \
  mkdir -p $TS_PROTO_OUT_PATH && \
  protoc \
  --plugin=/usr/local/bin/protoc-gen-ts_proto \
  --proto_path=$PROTO_PATH \
  --ts_proto_opt=outputEncodeMethods=true,outputJsonMethods=true,outputClientImpl=false,usePrototypeForDefaults=true,addGrpcMetadata=true,lowerCaseServiceMethods=true,returnObservable=true,esModuleInterop=true \
  --ts_proto_out="$TS_PROTO_OUT_PATH" $PROTO_FILE && \
  ls $PROTO_PATH/ | grep -v enterprise | xargs -i cp -r $PROTO_PATH/{} $TS_PROTO_OUT_PATH/
fi
if [ -n "$JAVA_PROTO_OUT_PATH" ]; then
  rm -rf $JAVA_PROTO_OUT_PATH && \
  mkdir -p $JAVA_PROTO_OUT_PATH && \
  ls $PROTO_PATH/ | grep -v Dockerfile | xargs -i cp -r $PROTO_PATH/{} $JAVA_PROTO_OUT_PATH/
fi
