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

export interface IDatabaseConnection {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface IRedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

export interface ISocketConfig {
  url: string;
  path: string;
  grpcUrl: string
}

export interface IServerConfig {
  url: string;
  transformLimit: number;
  maxViewCount: number;
  maxFieldCount: number;
  maxRecordCount: number;
  // record remind range, default is 90%
  recordRemindRange: number;
}

export interface IOssConfig {
  host: string;
  bucket: string;
  ossSignatureEnabled: boolean;
}

export interface IActuatorConfig {
  dnsUrl: string;
  rssRatio: number;
  heapRatio: number;
}

export interface IRateLimiter extends IBaseRateLimiter {
  /**
   * whiteList, token->rate limit configuration
   */
  whiteList: Map<string, IBaseRateLimiter>
}

export interface IBaseRateLimiter {
  /**
   * count
   */
  points: number;
  /**
   * duration
   */
  duration: number;
}

export interface IQueueConfig {
  limiterMax: number;
  limiterDuration: number;
  removeOnComplete: number;
  removeOnFail: number;
  stackTraceLimit: number;
}

export interface IZipkinConfig {
  endpoint: string;
}

export interface ISentryConfig {
  dsn: string;
}

export interface IGrpcConfig {
  url: string;
}

export interface IRoomConfig {
  db: IDatabaseConnection;
  redis: IRedisConfig;
  socket: ISocketConfig;
  server: IServerConfig;
  oss: IOssConfig;
  actuator: IActuatorConfig;
  limit: IRateLimiter;
  queue: IQueueConfig;
  zipkin: IZipkinConfig;
  sentry: ISentryConfig;
  grpc: IGrpcConfig;
}

export interface IBaseBucketConfig {
  /**
   * name
   */
  name: string;
  /**
   * region
   */
  region: string;
}
