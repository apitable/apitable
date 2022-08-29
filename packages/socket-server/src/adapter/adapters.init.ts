import { INestApplication } from '@nestjs/common';
import { RedisIoAdapter } from './redis/redis-io.adapter';
import { Log4js } from './log4js/log4js';
import { SocketIoService } from '../service/socket-io/socket-io.service';

export const initRedisIoAdapter = (app: INestApplication): INestApplication => {
  const socketIoService = app.get(SocketIoService);
  // 降低redis的连接数，没有必要建立一次握手，就建立一次连接
  app.useWebSocketAdapter(new RedisIoAdapter(app, socketIoService));
  return app;
};

export const initLogger = (app: INestApplication): INestApplication => {
  const log4js = app.get(Log4js);
  // 重新绑定log
  app.useLogger(log4js);
  return app;
};
