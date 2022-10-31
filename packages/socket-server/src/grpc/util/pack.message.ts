import * as protobuf from 'protobufjs';
import { Properties } from 'protobufjs';
import { vika } from 'src/grpc/generated/grpc/proto/any';

class Any extends protobuf.Message<vika.grpc.Any> implements vika.grpc.Any {
  type_url?: string;
  value?: Uint8Array;

  constructor(properties?: Properties<vika.grpc.Any>) {
    super(properties);
  }
}

export const pack = (message: any, prefix: string) => {
  // add the @Retryable annotation to retry to determine the type of pack `message`
  if (message instanceof Any) {
    return message;
  }
  const value = Buffer.from(JSON.stringify(message));
  return new Any({
    typeUrl: prefix,
    value: value,
  });
};

export const unpack = (message): any => {
  if (message) {
    return JSON.parse(message.value);
  }
  return message;
};
