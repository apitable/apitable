
import { vika } from 'proto/generated/proto/any';
import * as protobuf from 'protobufjs';
import { Properties } from 'protobufjs';

// reflection
// const root = protobuf.loadSync(path.join(__dirname, '../proto/socket.message.proto')).root;
// const AnyReflection = root.lookupType('UserRoomChangeRo');
// root.lookupType('socket.UserRoomChangeRo').ctor = UserRoomChangeRo;
// const AnyRoot = protobuf.loadSync(path.join(__dirname, '../proto/any.proto')).root;
class Any extends protobuf.Message<vika.grpc.Any> implements vika.grpc.Any {
  type_url?: string;
  value?: Uint8Array;

  constructor(properties?: Properties<vika.grpc.Any>) {
    super(properties);
  }
}

export const pack = (message: any, prefix: string) => {
  const value = Buffer.from(JSON.stringify(message));
  return new Any({
    typeUrl: prefix,
    value: value,
  });
};

export const unpack = (message): any => {
  return JSON.parse(message.value);
};
