import { Metadata } from '@grpc/grpc-js';

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const sleep: Function = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms));

export function generateRandomString(length= 20): string {
  let randomString = '';
  const size = chars.length;
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * size);
    randomString += chars[randomNumber];
  }
  return randomString;
}

export function getGlobalGrpcMetadata() {
  const grpcMeta = new Metadata();
  // 暂时添加自定义CTraceId
  grpcMeta.set('X-C-TraceId', generateRandomString());
  return grpcMeta;
}