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
  // 记录超限提醒范围 90%
  recordRemindRange: number;
}

export interface IOssConfig {
  host: string;
  type: string;
}

export interface IActuatorConfig {
  dnsUrl: string;
  rssRatio: number;
  heapRatio: number;
}

export interface IRateLimiter extends IBaseRateLimiter {
  /**
   * 白名单 token->限流配置
   */
  whiteList: Map<string, IBaseRateLimiter>
}

export interface IBaseRateLimiter {
  /**
   * 次数
   */
  points: number;
  /**
   * 计时时间
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
   * 名称
   */
  name: string;
  /**
   * 区域
   */
  region: string;
}
