import { RedisConstants } from 'src/constants/redis-constants';
import { SocketConstants } from 'src/constants/socket-constants';

export const socketConfig = {
  provide: RedisConstants.REDIS_CONFIG,
  useFactory: () => {
    return {
      key: RedisConstants.CHANNEL_PREFIX,
      host: RedisConstants.HOST,
      port: RedisConstants.PORT,
      // eslint-disable-next-line @typescript-eslint/camelcase
      auth_pass: RedisConstants.PASSWORD,
      requestsTimeout: SocketConstants.SOCKET_REQUEST_TIMEOUT,
    };
  },
};
