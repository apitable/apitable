import { MouseEvent } from 'react';

function eventManager() {
  const map = new Map();

  return {
    off: (id) => {
      map.delete(id);
    },
    on: (id, handler) => {
      map.set(id, handler);
    },
    emit: (id, configs?: { e: MouseEvent<HTMLElement>, extraInfo?: any }) => {
      const handler = map.get(id);
      if (handler) {
        handler(configs);
      }
    }
  };
}

export const manager = eventManager();