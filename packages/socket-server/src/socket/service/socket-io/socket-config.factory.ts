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
