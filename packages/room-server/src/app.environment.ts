export const environment = process.env.NODE_ENV || 'development';
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'production');
export const enableSwagger = Object.is(process.env.ENABLE_SWAGGER, 'true');
export const serviceDomain = process.env.SERVER_DOMAIN;
export const currentAppInstanceId = process.env.NODE_APP_INSTANCE || 0;
// whether or not enable cache for Fusion API
export const isApiCacheEnabled = Object.is(process.env.API_CACHEABLE, 'true');

// whether or not enable scheduler. (only for one instance, should use zookeeper if there are multiple instances)
export const enableScheduler = Object.is(process.env.ENABLE_SCHED, 'true');

// whether or not enable queue worker. (individual instances in worker queue mode to handle messages)
export const enableQueueWorker = Object.is(process.env.ENABLE_QUEUE_WORKER, 'true');

export default {
  isDevMode,
  isProdMode,
  serviceDomain,
  environment,
};

