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

import io from 'socket.io-client';

const SOCKET_PATH_DEFAULT = 'widget-cli:sockjs-node';

export enum WidgetCliSocketType {
  LiveReload = 'liveReload'
}

type IWidgetCLiSocketResponseData = null;

type ICallBack = (data?: { success: boolean; error?: any; data?: IWidgetCLiSocketResponseData }) => void;

interface IWidgetCliSocket {
  socket: SocketIOClient.Socket & { loading?: boolean };
  eventMap: Map<WidgetCliSocketType, ICallBack[]>;
  on: (type: WidgetCliSocketType, cb: ICallBack) => void;
  destroy: (type?: WidgetCliSocketType, cb?: ICallBack) => void;
}

interface IWidgetCLiSocketResponse {
  success: boolean;
  type: WidgetCliSocketType;
  data?: IWidgetCLiSocketResponseData;
}

class WidgetCliSocket implements IWidgetCliSocket {
  socket: SocketIOClient.Socket & { loading?: boolean };
  eventMap: Map<WidgetCliSocketType, ICallBack[]> = new Map();

  constructor(origin: string, _type: WidgetCliSocketType) {
    this.socket = io(origin, { path: `/${SOCKET_PATH_DEFAULT}` }); // Establishing links
    this.socket.loading = true;
    this.socket.on(SOCKET_PATH_DEFAULT, (res: IWidgetCLiSocketResponse) => {
      this.eventMap.get(res.type)?.forEach((cb: ICallBack) => cb({
        success: true,
        data: res?.data
      }));
    });
    // connection successful
    this.socket.on('connect', () => {
      this.socket.loading = false;
    });
    // connection failure
    this.socket.on('disconnect', () => {
      [...this.eventMap.values()].flat(1).forEach((cb: ICallBack) => cb({
        success: false,
        error: 'disconnect'
      }));
    });
  }

  on(type: WidgetCliSocketType, cb: ICallBack) {
    this.eventMap.has(type) ? this.eventMap.get(type)?.push?.(cb) : this.eventMap.set(type, [cb]);
  }

  destroy(type?: WidgetCliSocketType, cb?: ICallBack) {
    if (!type) {
      this.socket.disconnect();
    } else {
      const events = this.eventMap.get(type) || [];
      events.forEach((v: ICallBack, index: number) => {
        v === cb && events.splice(index, 1);
      });
    }
    widgetCliSOcket = undefined;
  }
}

let widgetCliSOcket: IWidgetCliSocket | undefined;

export const initWidgetCliSocket = (origin: string, type: WidgetCliSocketType) => {
  if (!widgetCliSOcket) {
    widgetCliSOcket = new WidgetCliSocket(origin, type);
  }
  return widgetCliSOcket;
};
