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

import { isEmpty, isNil } from '@nestjs/common/utils/shared.utils';
import * as os from 'os';
import { GatewayConstants } from '../constants/gateway.constants';
import { SocketConstants } from '../constants/socket-constants';
import { AuthenticatedSocket } from '../interface/socket/authenticated-socket.interface';

/**
 * get the specified value from the cookie string
 *
 * @param cookie
 * @param key
 */
export const getValueFromCookie = (cookie: string, key: string): string => {
  if (cookie.length > 0) {
    const ca = cookie.split(';');
    for (const i of ca) {
      const c = i.trim();
      if (c.includes(key)) {
        return c.slice(key.length + 1, c.length);
      }
    }
    return null;
  }
  return null;
};

export const getRequestLanguage = (headers: any): string => {
  const lang = headers['accept-language'];
  if (isEmpty(lang)) {
    return 'zh-CN';
  }
  return lang.split(',')[0].trim();
};

export const ipAddress = () => {
  // server local address
  const interfaces = os.networkInterfaces();
  let ipAddress = '';
  for (const devName of Object.keys(interfaces)) {
    const iface = interfaces[devName];
    for (const i of Object.keys(iface)) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        ipAddress = alias.address;
      }
    }
  }
  return ipAddress;
};

export const isDev = () => {
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development';
};

/**
 * to judge whether 'room' connection
 *
 * @param socket
 */
export const isRoomConnect = (socket: AuthenticatedSocket): boolean => {
  return !isNil(socket.auth.cookie) && socket.id.includes(GatewayConstants.ROOM_NAMESPACE);
};

/**
 * to judge whether 'java' connection
 *
 * @param socket
 */
export const isBackendServer = (socket: AuthenticatedSocket): boolean => {
  return !isNil(socket.auth.userId) && socket.auth.userId.includes(SocketConstants.JAVA_SERVER_PREFIX);
};

/**
 * to judge whether 'nest-server' connection
 *
 * @param socket
 */
export const isNestServer = (socket: AuthenticatedSocket): boolean => {
  // 'room_' 'nest-server' The prefix of the userId passed to the application startup must be consistent
  return !isNil(socket.auth.userId) && socket.auth.userId.includes('room_');
};

/**
 * randomly get a number in an interval
 *
 * @param minNum
 * @param maxNum
 */
export const randomNum = (minNum, maxNum): number => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

/**
 * NestServer Ip
 */
export const getSocketServerAddr = (serverIp: string) => {
  return 'http://' + serverIp + ':' + GatewayConstants.API_PORT;
};
