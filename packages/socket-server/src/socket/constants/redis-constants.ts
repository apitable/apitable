export class RedisConstants {
  public static readonly PORT: number = parseInt(process.env.REDIS_PORT, 10) || 6379;
  public static readonly HOST: string = process.env.REDIS_HOST || '127.0.0.1';
  public static readonly REDIS_DB: number = process.env.REDIS_DB != null ? parseInt(process.env.REDIS_DB, 10) : 3;
  public static readonly CONNECT_TIMEOUT = 15000;
  public static readonly RE_CONNECT_MAX_TIMES = 10;
  public static readonly PASSWORD = process.env.REDIS_PASSWORD || '';
  public static readonly REDIS_CLIENT = 'REDIS_COMMON_CLIENT';
  public static readonly REDIS_PUBLISHER_CLIENT = 'REDIS_PUBLISHER_CLIENT';
  public static readonly REDIS_SUBSCRIBER_CLIENT = 'REDIS_SUBSCRIBER_CLIENT';
  public static readonly REDIS_PREFIX = 'vikadata:';
  // redis config factory
  public static readonly REDIS_CONFIG = 'REDIS_CONFIG';

  // socket.io-adapter的key
  public static readonly CHANNEL_PREFIX = 'vika-' + process.env.WEB_SOCKET_CHANNEL_ENV;

  public static readonly VIKA_NEST_LOAD_HEALTH_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':health:%s';
  public static readonly VIKA_NEST_LOAD_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV;
  public static readonly VIKA_NEST_LOAD_UNHEALTH_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':unhealth:%s';

  public static readonly VIKA_NEST_LOAD_HEALTH_KEY_V2 = 'load:nest_v2:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':health';
  public static readonly VIKA_NEST_LOAD_KEY_V2 = 'load:nest_v2:' + process.env.WEB_SOCKET_CHANNEL_ENV;
  public static readonly VIKA_NEST_LOAD_UNHEALTH_KEY_V2 = 'load:nest_v2:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':unhealth';

  public static readonly VIKA_NEST_CHANNEL = 'vikadata:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV;
}
