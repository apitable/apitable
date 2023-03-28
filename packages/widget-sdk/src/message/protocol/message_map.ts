import { Timeout } from 'ahooks/lib/useRequest/src/types';

type ResolveType = <T>(value: IResultParams<T>) => void;
type RejectType = (reason?: any) => void;

interface IResultParams<T> {
  success: boolean;
  data: T;
}

interface IMessageReturnProps {
  id: string;
  success: boolean;
  resolve?: ResolveType;
  reject?: RejectType;
  msg?: string;
  timer?: Timeout;
}

class MessageMap {
  private map: Map<string, IMessageReturnProps> = new Map();
  private timer: number;

  constructor(timer = 30) {
    this.timer = timer;
  }

  /**
   * Message callback to queue operations.
   */
  public push(id: string, resolve?: ResolveType, reject?: RejectType, allowTimeout: boolean = false) {
    const messageData: IMessageReturnProps = { 
      id, 
      success: true, 
      resolve, 
      reject 
    };
    if (!allowTimeout) {
      messageData.timer = setTimeout(() => {
        this.put(id);
        reject?.({ 
          id, 
          success: false, 
          msg: 'Message Event Timeout'
        });
      }, this.timer * 1000);
    }
    this.map.set(id, messageData);
  }

  /**
   * The message calls back the queueing operation and
   * triggers the event related to the completion of the operation.
   */
  public pop<T>(id: string, params: IResultParams<T>) {
    const messageData = this.put(id);
    messageData?.resolve?.(params);
  }

  /**
   * Clear message memory.
   */
  public clear() {
    this.map.forEach(p => p.timer && clearTimeout(p.timer));
    this.map = new Map();
  }

  /**
   * Take out the information corresponding to the specified ID.
   */
  private put(id: string) {
    const messageData = this.map.get(id);
    if (!messageData) return;
    this.map.delete(id);
    messageData.timer && clearTimeout(messageData.timer);
    return messageData;
  }
}

export const messageMap = new MessageMap();