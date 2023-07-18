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

export enum UserRoom {
  PREFIX = 'cache:online:room:',
  // 3 days
  EXPIRE = 259200,
}

export enum SocketCache {
  PREFIX = 'cache:socket:',
  // 30 days
  EXPIRE = 2592000,
}

/**
 * Nest Server Cache Key
 */
export enum NestCacheKeys {
  SOCKET = 'nest:socket:%s',
  RESOURCE_RELATE = 'nest:resource:%s',
}
