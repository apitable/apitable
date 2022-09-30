import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigKey } from 'common';
import { IActuatorConfig, IBaseRateLimiter, IOssConfig, IRateLimiter, IServerConfig } from 'interfaces';
import { ConfigStoreInMemory } from './config.store';

/**
 * 环境变量方法
 * 将常用的属性保存到内存储存器中
 */
@Injectable()
export class EnvConfigService implements OnApplicationBootstrap, OnApplicationShutdown {

  private configStore: ConfigStoreInMemory = new ConfigStoreInMemory();

  constructor(private configService: ConfigService) {}

  onApplicationBootstrap() {
    // 服务常量配置
    const server: IServerConfig = {
      url: process.env.BACKEND_BASE_URL || this.configService.get<string>('server.url'),
      transformLimit: this.configService.get<number>('server.transformLimit', 100000),
      maxViewCount: this.configService.get<number>('server.maxViewCount', 30),
      maxFieldCount: this.configService.get<number>('server.maxFieldCount', 200),
      maxRecordCount: this.configService.get<number>('server.maxRecordCount', 50000),
      recordRemindRange: this.configService.get<number>('server.recordRemindRange', 90)
    };
    this.configStore.set(EnvConfigKey.CONST, server);

    // oss常量配置
    const oss: IOssConfig = {
      host: process.env.OSS_HOST || this.configService.get<string>('oss.host'),
      bucket: process.env.OSS_BUCKET || this.configService.get<string>('oss.bucket'),
    };
    this.configStore.set(EnvConfigKey.OSS, oss);

    // API 限制常量配置
    const limit: IRateLimiter = {
      points: (process.env.LIMIT_POINTS || this.configService.get<number>('limit.points', 5)) as number,
      duration: (process.env.LIMIT_DURATION || this.configService.get<number>('limit.duration', 1)) as number,
      whiteList: null
    };
    const envWhiteList = process.env.LIMIT_WHITE_LIST && JSON.parse(process.env.LIMIT_WHITE_LIST);
    const limitWhiteList = envWhiteList || this.configService.get<Map<string, IBaseRateLimiter>>('limit.whiteList', null);
    if (limitWhiteList) {
      const limitWhitMap = new Map<string, IBaseRateLimiter>();
      Object.keys(limitWhiteList).forEach(token => {
        limitWhitMap.set(token, limitWhiteList[token]);
      });
      limit.whiteList = limitWhitMap;
    }
    this.configStore.set(EnvConfigKey.API_LIMIT, limit);

    // 健康检查配置
    const actuator: IActuatorConfig = {
      dnsUrl: process.env.ACTUATOR_DNS_URL || this.configService.get<string>('actuator.dnsUrl'),
      rssRatio: (process.env.ACTUATOR_RSS_RATIO || this.configService.get<number>('actuator.rssRatio', 90)) as number,
      heapRatio: (process.env.ACTUATOR_HEAP_RATIO || this.configService.get<number>('actuator.heapRatio', 100)) as number,
    };
    this.configStore.set(EnvConfigKey.ACTUATOR, actuator);
  }

  onApplicationShutdown(signal?: string) {
    this.configStore.clear();
  }

  getRoomConfig(key: string): IServerConfig | IOssConfig | IRateLimiter | IActuatorConfig {
    return this.configStore.get(key);
  }
}
