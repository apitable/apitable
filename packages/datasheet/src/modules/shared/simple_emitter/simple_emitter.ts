export enum EmitterEventName {
  ViewMouseDown,
  ViewClick,
  ViewDoubleClick,
  // Widgets Developer Mode
  ToggleWidgetDevMode,
  // panel Is it on the move
  PanelDragging
}

/**
 * Minimalist event manager
 * To prevent abuse, only the most basic event binding and triggering services are implemented
 * * Does not support binding multiple callbacks to one event to prevent double binding
 */
export class SimpleEmitter {
  private callbacks: { [key: number]: (...args: any) => void } = {};

  bind(name: EmitterEventName, cb: (...args: any) => void) {
    this.callbacks[name] = cb;
  }

  unbind(name: EmitterEventName) {
    delete this.callbacks[name];
  }

  emit(name: EmitterEventName, ...args: any[]) {
    const cb = this.callbacks[name];
    cb && cb.apply(null, args);
  }

  destroy() {
    this.callbacks = {};
  }
}
