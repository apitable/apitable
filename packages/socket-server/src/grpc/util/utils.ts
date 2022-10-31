import { Metadata, MetadataValue } from '@grpc/grpc-js';
import { TRACE_ID } from 'src/socket/constants/socket-constants';

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const sleep: Function = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms));

export function generateRandomString(length = 20): string {
  let randomString = '';
  const size = chars.length;
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * size);
    randomString += chars[randomNumber];
  }
  return randomString;
}

export function initGlobalGrpcMetadata(extMeta?: { [key: string]: MetadataValue }) {
  const grpcMeta = new Metadata();
  // initialize trace id
  grpcMeta.set(TRACE_ID, generateRandomString());
  if (extMeta) {
    Object.entries(extMeta).forEach(([k, v]) => {
      grpcMeta.set(k, v);
    });
  }
  return grpcMeta;
}