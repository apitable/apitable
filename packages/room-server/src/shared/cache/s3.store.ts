/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CacheStore, CacheStoreFactory, CacheStoreSetOptions, LiteralObject } from '@nestjs/common';
import { BaseOssStore } from 'shared/cache/base.oss.store';

export class S3StoreFactory implements CacheStoreFactory {
  create(args: LiteralObject): CacheStore {
    return new S3Store(args);
  }
}

export class S3Store extends BaseOssStore implements CacheStore {
  private readonly s3Client: S3Client;

  constructor(args: LiteralObject) {
    super(args);
    if (args.s3Client) {
      this.s3Client = args.s3Client;
    } else {
      this.s3Client = new S3Client({ region: this.options.region });
    }
  }

  get<T>(key: string): Promise<T | undefined> | T | undefined {
    return new Promise((resolve, reject) => {
      const cb = (err: any, result?: T) => (err ? reject(err) : resolve(result));
      const params = {
        Bucket: this.options.bucket, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: this.getFileNameByKey(key), // The name of the object. For example, 'sample_upload.txt'.
      };
      this.s3Client.send(new GetObjectCommand(params), this.handleResponse(cb));
    });
  }

  set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> | void {
    return new Promise((resolve, reject) => {
      const cb = (err: Error | null, result: any) => (err ? reject(err) : resolve(result));
      const stream = JSON.stringify(value);
      // calculate the expireSecond of the cache
      const ttl: any = options?.ttl || 0;
      const date = new Date();
      date.setTime(1000 * ttl + date.getTime());
      const params = {
        Bucket: this.options.bucket, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: this.getFileNameByKey(key), // The name of the object. For example, 'sample_upload.txt'.
        Body: stream, // The content of the object. For example, 'Hello world!".
        Expires: date,
        CacheControl: `max-age=${ttl}`
      };
      this.s3Client.send(new PutObjectCommand(params), this.handleResponse(cb));
    });
  }

  protected handleResponse(cb: (err: Error | null, result?: any) => void) {
    return (err: Error | null, result: any) => {
      if (err) {
        if (err.name == 'NoSuchKey') {
          return cb && cb(null, result);
        }
        return cb && cb(err);
      }
      if (!this.isResponseValid(result)) {
        return cb && cb(null, undefined);
      }
      const chunks: Buffer[] = [];
      result.Body.on('data', (chunk: Buffer) => chunks.push(chunk));
      result.Body.on('error', (err: Error) => cb(err));
      result.Body.on('end', () => {
        if (this.options.parse) {
          const content = Buffer.concat(chunks).toString('utf8');
          try {
            const data = JSON.parse(content);
            return cb && cb(null, data);
          } catch (e) {
            return cb && cb(e as Error);
          }
        }
        return cb && cb(null, result);
      });
    };
  }

  getTtlFromResponse(response: any) {
    const cacheControl = response.CacheControl;
    const cacheControls = cacheControl.split(', ');
    for (const value of cacheControls) {
      if (value.startsWith('max-age')) {
        return parseInt(value.split('=')[1], 10);
      }
    }
    return null;
  }

  isResponseValid(response: any): boolean {
    const ttl = this.getTtlFromResponse(response);
    if (!ttl) return false;
    if (response.Expires) {
      if (Date.now() - response.Expires.getTime() > ttl * 1000) {
        return false;
      }
    }
    return true;
  }
}
