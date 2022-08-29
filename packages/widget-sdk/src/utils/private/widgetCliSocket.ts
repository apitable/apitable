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

  constructor(origin: string, type: WidgetCliSocketType) {
    this.socket = io(origin, { path: `/${SOCKET_PATH_DEFAULT}` }); // 建立链接
    this.socket.loading = true;
    this.socket.on(SOCKET_PATH_DEFAULT, (res: IWidgetCLiSocketResponse) => {
      this.eventMap.get(res.type)?.forEach((cb: ICallBack) => cb({
        success: true,
        data: res?.data
      }));
    });
    // 连接成功
    this.socket.on('connect', () => {
      this.socket.loading = false;
    });
    // 链接失败
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
