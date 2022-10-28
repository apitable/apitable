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
