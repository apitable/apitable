import { isEmpty, isNil } from '@nestjs/common/utils/shared.utils';
import { Logger } from '@nestjs/common';
import * as os from 'os';
import { AuthenticatedSocket } from '../interface/socket/authenticated-socket.interface';
import { GatewayConstants } from '../constants/gateway.constants';
import { SocketConstants } from '../constants/socket-constants';

/**
 * 从cookie字符串里面获取指定的值
 * @param cookie
 * @param key
 * @return
 * @author Shawn Deng
 * @date 2020/5/14 3:04 下午
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
  } else {
    return lang.split(',')[0].trim();
  }
};

export const logger = (context: string): Logger => {
  return new Logger(context);
};

export const ipAddress = () => {
  // 服务器本机地址
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
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
    return true;
  }
  return false;
};

/**
 * 判断是否是 room 连接
 * @param socket
 */
export const isRoomConnect = (socket: AuthenticatedSocket): boolean => {
  if (!isNil(socket.auth.cookie) && socket.id.includes(GatewayConstants.ROOM_NAMESPACE)) {
    return true;
  } else {
    return false;
  }
};

/**
 *
 * 是否是java的连接
 *
 * @param socket
 * @return
 * @author Zoe Zheng
 * @date 2020/6/24 9:07 下午
 */
export const isBackendServer = (socket: AuthenticatedSocket): boolean => {
  if (!isNil(socket.auth.userId) && socket.auth.userId.includes(SocketConstants.JAVA_SERVER_PREFIX)) {
    return true;
  }
  return false;
};

/**
 *
 * 判断是否是 nest-server 的连接
 *
 * @param socket
 * @return
 * @author Zoe Zheng
 * @date 2020/6/24 9:07 下午
 */
export const isNestServer = (socket: AuthenticatedSocket): boolean => {
  // 'room_' nest-server 应用启动传参 userId 的前缀，需保持一致
  if (!isNil(socket.auth.userId) && socket.auth.userId.includes('room_')) {
    return true;
  }
  return false;
};

/**
 *
 * @param minNum
 * @param maxNum
 * @return
 * @author Zoe Zheng
 * @date 2020/7/18 11:03 上午
 */
export const randomNum = (minNum, maxNum): number => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

/**
 * NestServer 的Ip
 * @param serverIp NestServer 的连接信息
 * @return
 * @author Zoe Zheng
 * @date 2020/7/20 5:44 下午
 */
export const getSocketServerAddr = (serverIp: string) => {
  return 'http://' + serverIp + ':' + GatewayConstants.API_PORT;
};
