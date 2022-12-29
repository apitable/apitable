// import pako from 'pako';
// import { Buffer } from 'buffer';

/**
 * JSON conversion, performance is much faster than lodash cloneDeep.
 * Note that circular references will throw Error
 */
export function fastCloneDeep<T>(obj: T): T {
  if (obj == null) {
    return obj;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

// /**
//  * @param gzipBase64Str must be base64 encoded
//  */
// export function unBase64Gzip<T = any>(gzipBase64Str: string): T {
//   return JSON.parse(pako.ungzip(Buffer.from(gzipBase64Str, 'base64'), { to: 'string' }));
// }

// export function gzipBase64(data: {}): string {
//   return Buffer.from(pako.gzip(JSON.stringify(data), { level: 9 })).toString('base64');
// }
