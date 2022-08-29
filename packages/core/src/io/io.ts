import { Events, Player } from 'player';
import { IWatchResponse, SyncRequestTypes } from 'sync/types';
import { wait } from 'utils/async';

export interface IRegisterOption {
  token: string;
  messageHandler: (message: any) => void;
}

export class IO {
  private abort = false; // 放弃链接
  callbackCache: Map<string, ((arg: any) => any)> = new Map();

  constructor(public roomId: string, public socket: SocketIOClient.Socket) {
  }

  async waitToConnect() {
    this.abort = false;
    while (!this.socket.connected) {
      console.log(`waiting for ${this.roomId} socket connection...`);
      if (this.abort) {
        console.error('连接已经取消: ', this.roomId);
        return false;
      }
      await wait(500);
    }
    return true;
  }

  async watch<T extends IWatchResponse, P>(roomId: string, shareId: string | undefined, params?: P): Promise<T | void> {
    await this.waitToConnect();
    return new Promise<T | void>((resolve, reject) => {
      if (!this.socket.connected) {
        resolve();
        return;
      }
      let retryTimes = 3;

      const emit = (interval) => {
        this.socket.emit(SyncRequestTypes.WATCH_ROOM, { ...params, roomId, shareId }, (msg: T) => {
          interval && clearInterval(interval as any);

          if ('success' in msg && msg.success) {
            console.log('watched in ', roomId, this.socket.id, 'msg:', msg);
            resolve(msg);
          } else {
            Player.doTrigger(Events.app_error_logger, {
              error: new Error(`watchRoom 失败：${msg.message}`),
              metaData: {
                socketConnected: this.socket.connected
              },
            });
            reject(msg);
          }
        });
      };

      const interval = setInterval(() => {
        if (retryTimes < 0) {
          clearInterval(interval);
          reject('与服务器的链接未成功建立，请刷新重试，如有疑问请扫描右方的二维码添加客服，让我们来帮助你解决');
        }
        retryTimes--;
        emit(interval);
      }, 5 * 1000);

      emit(interval);
    });
  }

  request<T, P extends { type: string }>(params: P): Promise<T> {
    if (!this.socket) {
      throw new Error('socket didn\'t prepared');
    }

    // console.log('发送数据:', params);
    return new Promise<any>((resolve, reject) => {
      this.socket.emit(params.type, params, (responseData: T) => {
        resolve(responseData);
      });
    });
  }

  unWatch() {
    this.abort = true;
    return new Promise((resolve, reject) => {
      this.socket.emit(SyncRequestTypes.LEAVE_ROOM, { roomId: this.roomId }, msg => {
        console.log('unwatch: ', this.roomId, 'msg:', msg);
        this.offAll();
        resolve(msg);
      });
    });
  }

  offAll() {
    this.callbackCache.forEach((cb, name) => {
      this.socket.off(name, cb);
    });
    this.callbackCache.clear();
  }

  on<T>(name: string, cb: (arg: T) => void) {
    if (this.callbackCache.has(name)) {
      throw new Error(`请勿重复绑定 socket 事件: ${name}`);
    }
    this.callbackCache.set(name, cb);
    this.socket.on(name, cb);
  }
}
