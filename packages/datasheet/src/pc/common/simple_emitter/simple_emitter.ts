export enum EmitterEventName {
  ViewMouseDown,
  ViewClick,
  ViewDoubleClick,
  // 小组件开发者模式
  ToggleWidgetDevMode,
  // panel 是否在移动中
  PanelDragging
}

/**
 * 极简的事件管理器
 * 为了防止滥用，仅实现最基础的事件绑定、触发服务
 * * 不支持一个事件绑定多个回调，防止重复绑定
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
