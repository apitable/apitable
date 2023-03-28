import { IResponse, MessageType } from './interface';
import { Protocol } from './protocol';

export class EventEmitter extends Protocol {
  emit(type: MessageType, data: IResponse, key?: string) {
    const events = this.eventMap.get(type);
    if (!events) {
      return;
    }
    const callbacks = this.getCallbacks(type, key);
    callbacks.forEach(cb => {
      cb(data);
    });
  }
}

export const eventEmitter = process.env.SSR ? null as any : new EventEmitter();
