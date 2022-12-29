import { INestApplication } from '@nestjs/common';
import { SocketIoService } from '../service/socket-io/socket-io.service';
import { RedisIoAdapter } from './redis/redis-io.adapter';

export const initRedisIoAdapter = (app: INestApplication): INestApplication => {
  const socketIoService = app.get(SocketIoService);
  // Reduce the number of connections to redis, there is no need to establish a handshake, just establish a connection
  app.useWebSocketAdapter(new RedisIoAdapter(app, socketIoService));
  return app;
};
