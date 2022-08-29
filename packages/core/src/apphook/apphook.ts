/*
 * AppHook Hook引擎
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-07 11:15:05
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-21 18:25:48
 */
import { FilterCommand, TriggerCommand } from './commands';
import { IRule } from './rules';
import { IFilterAction, ITriggerAction } from './actions';
import { IListener, ITrigger, ListenrType as ListenerType, IFilter } from './listeners';
import { AddTriggerEvent, DoTriggerEvent, UseFiltersEvent, AddFilterEvent } from './hook_events';

interface IListenersMap {
  [listenerType: string]: {
    [hook: string]: IListener[];
  };
}

export class AppHook {

  /**
   * 存放所有的监听器，包括Trigger、Filter，按其分类存放
   *
   * @type {IListenersMap}
   * @memberof AppHook
   */
  _listeners: IListenersMap = {};

  /**
   * 当AddTrigger时触发的[内部事件]
   *
   * @type {AddTriggerEvent}
   * @memberof AppHook
   */
  _onAddTrigger: AddTriggerEvent;

  /**
   * 当DoTrigger时触发的内部事件
   *
   * @type {DoTriggerEvent}
   * @memberof AppHook
   */
  _onDoTrigger: DoTriggerEvent;

  /**
   * 用于内部自省，useFilters可绑定的事件行为
   *
   * @type {UseFiltersEvent}
   * @memberof AppHook
   */
  _onUseFilters: UseFiltersEvent;

  /**
   * addFilter时触发的事件
   *
   * @type {AddFilterEvent}
   * @memberof AppHook
   */
  _onAddFilter: AddFilterEvent;

  /**
   *
   * 添加触发器
   *
   * @param {string} hook
   * @param {TriggerCommand} command
   * @param {*} commandArg
   * @param {(IRule | undefined)} rule
   * @param {number} [priority=0]
   * @param {boolean} [isCatch=false]
   * @returns {ITrigger}
   * @memberof AppHook
   */
  addTrigger(hook: string,
    command: TriggerCommand,
    commandArg: any,
    rule: IRule | undefined,
    priority = 0,
    isCatch = false): ITrigger {

    if (this._onAddTrigger != null) {
      this._onAddTrigger(hook, command, commandArg, rule, priority, isCatch);
    }

    const action: ITriggerAction = {
      command,
      args: commandArg,
    };

    const trigger: ITrigger = {
      type: ListenerType.Filter,
      priority,
      hook,
      action,
      rule,
      isCatch,
    };

    this.addListner(ListenerType.Trigger, hook, trigger);
    return trigger;
  }

  /**
   * 绑定AddTriggerEvent，当要添加触发器时激活
   *
   * @memberof AppHook
   */
  bindAddTrigger(bind: AddTriggerEvent) {
    this._onAddTrigger = bind;
  }
  /**
   * 当AddTrigger时触发的方法
   *
   * @param {AddFilterEvent} bind
   * @memberof AppHook
   */
  bindAddFilter(bind: AddFilterEvent) {
    this._onAddFilter = bind;
  }

  /**
   * 当dotrigger时触发的方法
   *
   * @param {DoTriggerEvent} bind
   * @memberof AppHook
   */
  bindDoTrigger(bind: DoTriggerEvent) {
    this._onDoTrigger = bind;
  }

  /**
   * 当ApplyFiters时触发的方法
   *
   * @param {UseFiltersEvent} bind
   * @memberof AppHook
   */
  bindUseFilters(bind: UseFiltersEvent) {
    this._onUseFilters = bind;
  }

  /**
   *
   * 添加过滤器，对事件发生时传入的默认值进行过滤
   *
   * @param {string} hook
   * @param {FilterCommand} command
   * @param {*} commandArg
   * @param {(IRule | undefined)} rule
   * @param {number} [priority=0]
   * @param {boolean} [isCatch=false]
   * @returns {IFilter}
   * @memberof AppHook
   */
  addFilter(hook: string,
    command: FilterCommand,
    commandArg: any,
    rule: IRule | undefined,
    priority = 0,
    isCatch = false): IFilter {

    if (this._onAddFilter != null) {
      this._onAddFilter(hook, command, commandArg, rule, priority, isCatch);
    }

    const action: IFilterAction = {
      command,
      args: commandArg,
    };

    const filter: IFilter = {
      type: ListenerType.Filter,
      priority,
      hook,
      action,
      rule,
      isCatch,
    };

    this.addListner(ListenerType.Filter, hook, filter);

    return filter;
  }

  /**
   * 添加监听器到数据集合中
   *
   * @private
   * @param {('Trigger' | 'Filter')} type 监听器类型
   * @param {string} hook名称
   * @param {IListener} newListener 新创建的监听器
   * @memberof AppHook
   */
  private addListner(type: ListenerType, hook: string, newListener: IListener) {
    // 对应listener type的监听器
    let typeListners = this._listeners[type];
    if (typeListners === undefined) {
      typeListners = this._listeners[type] = {};
    }

    let listenerList = typeListners[hook];
    if (listenerList === undefined) {
      listenerList = typeListners[hook] = [newListener];
    } else {
      // 排序插入, 数字越小越靠前
      for (let i = 0; i <= listenerList.length; i++) {
        const loopListener = listenerList[i];

        if (i === listenerList.length) { // number biggest
          listenerList.push(newListener);
          break;
        }

        if (newListener.priority <= loopListener.priority) {
          listenerList.splice(i, 0, newListener);
          break;
        }
      }
    }
  }

  /**
   * 移除监听器
   *
   * @private
   * @param {ListenerType} type
   * @param {IListener} listener
   * @returns {boolean}
   * @memberof AppHook
   */
  private removeListener(type: ListenerType, listener: IListener): boolean {
    const typeListners = this._listeners[type];
    if (typeListners === undefined) {
      return false;
    }

    const listenerList = typeListners[listener.hook];
    if (listenerList === undefined) {
      return false;
    } 
    for (let i = 0; i < listenerList.length; i++) {
      const l = listenerList[i];
      if (l === listener) {
        listenerList.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  /**
   * 激活事件，逐个执行对应的action行为
   * 无需考虑排序问题，在addTrigger时已按顺序插入
   *
   * @param {string} hook
   * @param {object} [hookState={}] 事件状态，选填参数
   * @memberof AppHook
   */
  doTriggers(hook: string, hookState?: any) {
    if (this._onDoTrigger != null) {
      this._onDoTrigger(hook, hookState);
    }
    const triggerMap = this._listeners[ListenerType.Trigger];
    if (triggerMap === undefined) {
      return;
    }
    const triggerList = triggerMap[hook];
    if (triggerList === undefined) {
      return;
    }
    for (let i = 0; i < triggerList.length; i++) {
      const trigger = triggerList[i] as ITrigger;
      if (trigger.isCatch === undefined || trigger.isCatch === false) {
        trigger.action.command(hookState, trigger.action.args);
      } else {
        try {
          trigger.action.command(hookState, trigger.action.args);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  /**
   *
   * 移除触发器
   * 注意，要传入正确的触发器的引用指针(Ref)，这里不做Deep Comparison
   *
   * @param {ITrigger} trigger
   * @returns {boolean}
   * @memberof AppHook
   */
  removeTrigger(trigger: ITrigger): boolean {
    return this.removeListener(ListenerType.Trigger, trigger);
  }

  /**
   * 是否存在指定事件的任意触发器
   *
   * @param {string} hook
   * @returns {boolean}
   * @memberof AppHook
   */
  hasAnyTriggers(hook: string): boolean {
    return this.hasAnyListeners(ListenerType.Trigger, hook);
  }

  /**
   * 是否存在指定事件的任意过滤器
   *
   * @param {string} hook
   * @returns {boolean}
   * @memberof AppHook
   */
  hasAnyFilters(hook: string): boolean {
    return this.hasAnyListeners(ListenerType.Filter, hook);
  }

  /**
   * 通用函数，是否存在监听器
   *
   * @private
   * @param {ListenerType} type
   * @param {string} hook
   * @returns {boolean}
   * @memberof AppHook
   */
  private hasAnyListeners(type: ListenerType, hook: string): boolean {
    const typeListeners = this._listeners[type];
    if (typeListeners === undefined) {
      return false;
    }
    const hookListeners = typeListeners[hook];
    if (hookListeners === undefined) {
      return false;
    }
    if (hookListeners.length === 0) {
      return false;
    }
    return true;
  }
  /**
   * 移除过滤器
   * 注意，要传入正确的触发器的引用指针(Ref)，这里不做Deep Comparison
   *
   * @param {IFilter} filter
   * @returns {boolean}
   * @memberof AppHook
   */
  removeFilter(filter: IFilter): boolean {
    return this.removeListener(ListenerType.Filter, filter);
  }

  /**
   * 应用过滤器，激发事件，并实现对原字符串的多重过滤
   *
   * @param {string} hook
   * @param {*} defaultValue
   * @param {*} [hookState]
   * @returns {*}
   * @memberof AppHook
   */
  applyFilters(hook: string, defaultValue: any, hookState?: any): any {
    if (this._onUseFilters != null) {
      this._onUseFilters(hook, defaultValue, hookState);
    }

    const filterMap = this._listeners[ListenerType.Filter];
    if (filterMap === undefined) {
      return defaultValue;
    }
    const filterList = filterMap[hook];
    if (filterList === undefined) {
      return defaultValue;
    }
    let filterdValue = defaultValue;
    for (let i = 0; i < filterList.length; i++) {
      const filter = filterList[i] as IFilter;
      if (filter.isCatch === undefined || filter.isCatch === false) {
        filterdValue = filter.action.command(filterdValue, hookState, filter.action.args);
      } else {
        try {
          filterdValue = filter.action.command(filterdValue, hookState, filter.action.args);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return filterdValue;
  }

}
