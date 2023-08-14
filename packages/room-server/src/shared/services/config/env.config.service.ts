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

import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { EnvConfigKey } from '../../common';
import { IActuatorConfig, IBaseRateLimiter, IOssConfig, IRateLimiter, IServerConfig } from '../../interfaces';
import { ConfigStoreInMemory } from './config.store';

/**
 * environment variables, store them in the memory
 */
@Injectable()
export class EnvConfigService implements OnApplicationShutdown {

  private configStore: ConfigStoreInMemory = new ConfigStoreInMemory();

  constructor() {
    // server constants configuration
    const server: IServerConfig = {
      url: process.env.BACKEND_BASE_URL!,
      transformLimit: parseInt(process.env.SERVER_TRANSFORM_LIMIT!) || 100000,
      maxViewCount: parseInt(process.env.SERVER_MAX_VIEW_COUNT!) || 30,
      maxFieldCount: parseInt(process.env.SERVER_MAX_FIELD_COUNT!) || 200,
      maxRecordCount: parseInt(process.env.SERVER_MAX_RECORD_COUNT!) || 50000,
      recordRemindRange: parseInt(process.env.SERVER_RECORD_REMIND_RANGE!) || 90,
    };
    this.configStore.set(EnvConfigKey.CONST, server);

    // oss constants configuration
    const oss: IOssConfig = {
      host: process.env.OSS_HOST!,
      bucket: process.env.OSS_BUCKET!,
      ossSignatureEnabled: process.env.OSS_SIGNATURE_ENABLED === 'true',
    };
    this.configStore.set(EnvConfigKey.OSS, oss);

    // API limit constants configuration
    const limit: IRateLimiter = {
      points: parseInt(process.env.LIMIT_POINTS!) || 5,
      duration: parseInt(process.env.LIMIT_DURATION!) || 1,
      whiteList: null as any
    };
    const limitWhiteList = process.env.LIMIT_WHITE_LIST && JSON.parse(process.env.LIMIT_WHITE_LIST);
    // const limitWhiteList = envWhiteList || this.configService.get<Map<string, IBaseRateLimiter>>('limit.whiteList', null as any);
    if (limitWhiteList) {
      const limitWhitMap = new Map<string, IBaseRateLimiter>();
      Object.keys(limitWhiteList).forEach(token => {
        limitWhitMap.set(token, limitWhiteList[token]);
      });
      limit.whiteList = limitWhitMap;
    }
    this.configStore.set(EnvConfigKey.API_LIMIT, limit);

    // health check configuration
    const actuator: IActuatorConfig = {
      dnsUrl: process.env.ACTUATOR_DNS_URL!,
      rssRatio: parseInt(process.env.ACTUATOR_RSS_RATIO!) || 90,
      heapRatio: parseInt(process.env.ACTUATOR_HEAP_RATIO!) || 100,
    };
    this.configStore.set(EnvConfigKey.ACTUATOR, actuator);
  }

  onApplicationShutdown(_signal?: string) {
    this.configStore.clear();
  }

  getRoomConfig(key: string): IServerConfig | IOssConfig | IRateLimiter | IActuatorConfig {
    return this.configStore.get(key);
  }
}
