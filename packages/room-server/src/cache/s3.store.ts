import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CacheStore, CacheStoreFactory, CacheStoreSetOptions, LiteralObject } from '@nestjs/common';
import { BaseOssStore } from 'cache/base.oss.store';

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
      const cb = (err, result) => (err ? reject(err) : resolve(result));
      const params = {
        Bucket: this.options.bucket, // The name of the bucket. For example, 'sample_bucket_101'.
        Key: this.getFileNameByKey(key), // The name of the object. For example, 'sample_upload.txt'.
      };
      this.s3Client.send(new GetObjectCommand(params), this.handleResponse(cb));
    });
  }

  set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> | void {
    return new Promise((resolve, reject) => {
      const cb = (err, result) => (err ? reject(err) : resolve(result));
      const stream = JSON.stringify(value);
      // 计算缓存过期时间
      const ttl: any = options.ttl || 0;
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

  protected handleResponse(cb): any {
    return (err, result) => {
      if (err) {
        if (err.name == 'NoSuchKey') {
          return cb && cb(null, result);
        }
        return cb && cb(err);
      }
      if (!this.isResponseValid(result)) {
        return cb && cb(null, null);
      }
      const chunks = [];
      result.Body.on('data', (chunk) => chunks.push(chunk));
      result.Body.on('error', (err) => cb(err));
      result.Body.on('end', () => {
        if (this.options.parse) {
          const content = Buffer.concat(chunks).toString('utf8');
          try {
            const data = JSON.parse(content);
            return cb && cb(null, data);
          } catch (e) {
            return cb && cb(e);
          }
        }
        return cb && cb(null, result);
      });
    };
  }

  getTtlFromResponse(response) {
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
