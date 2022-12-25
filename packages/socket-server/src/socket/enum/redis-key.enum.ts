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

export enum USER_ROOM {
  PREFIX = 'cache:online:room:',
  // 3 days
  EXPIRE = 259200,
}

export enum USER_LANGUAGE {
  PREFIX = 'cache:language:user:',
  // 3 days
  EXPIRE = 259200,
}

export enum CONFIG_CACHE {
  PREFIX = 'cache:config:',
  // 30 days
  EXPIRE = 2592000,
}

export enum SOCKET_CACHE {
  PREFIX = 'cache:socket:',
  // 30 days
  EXPIRE = 2592000,
}

/**
 * Nest Server Cache Key
 *
 * Need to be consistent ('vikadata:' has been used as a global prefix)
 */
export enum NestCacheKeys {
  SOCKET = 'nest:socket:%s',
  RESOURCE_RELATE = 'nest:resource:%s',
}
