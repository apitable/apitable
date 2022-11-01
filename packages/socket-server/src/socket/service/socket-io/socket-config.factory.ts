import { RedisConstants } from '../../constants/redis-constants';
import { SocketConstants } from '../../constants/socket-constants';

export const socketConfig = {
  provide: RedisConstants.REDIS_CONFIG,
  useFactory: () => {
    return {
      key: RedisConstants.CHANNEL_PREFIX,
      host: RedisConstants.HOST,
      port: RedisConstants.PORT,
      auth_pass: RedisConstants.PASSWORD,
      requestsTimeout: SocketConstants.SOCKET_REQUEST_TIMEOUT,
    };
  },
};
