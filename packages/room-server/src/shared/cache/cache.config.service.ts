import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { IBaseBucketConfig } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { S3StoreFactory } from 'shared/cache/s3.store';
import { MinioStoreFactory } from './minio.store';
import { DEFAULT_X_MAX_AGE } from '../common';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {
  }

  createCacheOptions(): Promise<CacheModuleOptions> | CacheModuleOptions {
    const s3Options = this.getS3Options();
    if (s3Options != null) {
      return s3Options;
    }
    // compatible with privatization(minio)
    const minioOptions = this.getMinioOptions();
    if (minioOptions != null) {
      return minioOptions;
    }
    // use cache as default
    return {
      // time to live, units are in seconds
      ttl: 10,
    };
  }

  private getS3Options(): CacheModuleOptions {
    const cacheType = process.env.OSS_CACHE_TYPE || this.configService.get<IBaseBucketConfig>('oss.cacheType', null);
    if (!cacheType || cacheType !== 's3') {
      return null;
    }
    const s3 = this.configService.get<IBaseBucketConfig>('oss.s3', null);
    if (!s3) {
      return null;
    }
    const bucketConfig = this.configService.get<IBaseBucketConfig>('oss.s3.bucket.cache', null);
    const region = bucketConfig?.region || null;
    const bucket = bucketConfig?.name || null;
    if (region && bucket) {
      return {
        // s3 setting, 1 day by default
        ttl: DEFAULT_X_MAX_AGE,
        store: new S3StoreFactory(),
        region,
        bucket
      };
    }
    return null;
  }

  private getMinioOptions(): CacheModuleOptions {
    const cacheType = process.env.OSS_CACHE_TYPE || this.configService.get<IBaseBucketConfig>('oss.cacheType', null);
    if (!cacheType || cacheType !== 'minio') {
      return null;
    }
    const minioConfig = this.configService.get<IBaseBucketConfig>('oss.minio', null);
    if (!minioConfig) {
      return null;
    }
    const { endPoint, port, useSSL, accessKey, secretKey } = minioConfig;
    if (endPoint && accessKey && secretKey && secretKey) {
      const bucketConfig = this.configService.get<IBaseBucketConfig>('oss.minio.bucket.cache', null);
      const bucket = bucketConfig?.name || null;
      if (bucket) {
        return {
          // s3 setting, 1 day by default
          ttl: DEFAULT_X_MAX_AGE,
          store: new MinioStoreFactory(),
          bucket,
          endPoint, port, useSSL, accessKey, secretKey
        };
      }
    }
    return null;
  }
}
