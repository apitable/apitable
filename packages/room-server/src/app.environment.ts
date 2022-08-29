export const environment = process.env.NODE_ENV || 'development';
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'production');

export const serviceDomain = process.env.SERVER_DOMAIN;
export const currentAppInstanceId = process.env.NODE_APP_INSTANCE || 0;
// api 是否缓存
export const isApiCacheEnabled = Object.is(process.env.API_CACHEABLE, 'true');

// 是否运行 scheduler (初版环境同时只能有一个 instance，多 instance 版本需要引入 zookeeper 做协调)
export const enableScheduler = Object.is(process.env.ENABLE_SCHED, 'true');

// 是否运行 (rabbit mq) queue worker (分配独立的 instances 以 worker 方式运行处理队列消息)
export const enableQueueWorker = Object.is(process.env.ENABLE_QUEUE_WORKER, 'true');

export default {
  isDevMode,
  isProdMode,
  serviceDomain,
  environment,
};

