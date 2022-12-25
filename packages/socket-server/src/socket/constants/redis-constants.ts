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

  // socket.io-adapter of key
  public static readonly CHANNEL_PREFIX = 'vika-' + process.env.WEB_SOCKET_CHANNEL_ENV;

  public static readonly VIKA_NEST_LOAD_HEALTH_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':health:%s';
  public static readonly VIKA_NEST_LOAD_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV;
  public static readonly VIKA_NEST_LOAD_UNHEALTH_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':unhealth:%s';

  public static readonly VIKA_NEST_LOAD_HEALTH_KEY_V2 = 'load:nest_v2:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':health';
  public static readonly VIKA_NEST_LOAD_KEY_V2 = 'load:nest_v2:' + process.env.WEB_SOCKET_CHANNEL_ENV;
  public static readonly VIKA_NEST_LOAD_UNHEALTH_KEY_V2 = 'load:nest_v2:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':unhealth';

  public static readonly VIKA_NEST_CHANNEL = 'vikadata:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV;
}
