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

import { INestApplication } from '@nestjs/common';
import { SocketIoService } from '../service/socket-io/socket-io.service';
import { RedisIoAdapter } from './redis/redis-io.adapter';

export const initRedisIoAdapter = (app: INestApplication): INestApplication => {
  const socketIoService = app.get(SocketIoService);
  // Reduce the number of connections to redis, there is no need to establish a handshake, just establish a connection
  app.useWebSocketAdapter(new RedisIoAdapter(app, socketIoService));
  return app;
};
