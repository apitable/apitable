/*
 * AppHook Hook Engine
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-07 11:15:05
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-21 18:25:48
 */
import { FilterCommand, TriggerCommand } from './commands';
import { IRule } from './rules';
import { IFilterAction, ITriggerAction } from './actions';
import { IListener, ITrigger, ListenerType as ListenerType, IFilter } from './listeners';
import { AddTriggerEvent, DoTriggerEvent, UseFiltersEvent, AddFilterEvent } from './hook_events';

interface IListenersMap {
  [listenerType: string]: {
    [hook: string]: IListener[];
  };
}

export class AppHook {

  /**
   * the place to store all listeners, including Trigger and Filter, store them by type
   *
   * @type {IListenersMap}
   * @memberof AppHook
   */
  _listeners: IListenersMap = {};

  /**
   * When AddTrigger triggered, the inner event.
   *
   * @type {AddTriggerEvent}
   * @memberof AppHook
   */
  _onAddTrigger: AddTriggerEvent;

  /**
   * When DoTrigger triggered, the inner event.
   *
   * @type {DoTriggerEvent}
   * @memberof AppHook
   */
  _onDoTrigger: DoTriggerEvent;

  /**
   * Use for inner self-inspection, 
   * the event action that can be bound to useFilters
   *
   * @type {UseFiltersEvent}
   * @memberof AppHook
   */
  _onUseFilters: UseFiltersEvent;

  /**
   * When AddFilter triggered, the inner event. 
   *
   * @type {AddFilterEvent}
   * @memberof AppHook
   */
  _onAddFilter: AddFilterEvent;

  /**
   *
   * Add Trigger
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
   * Bind AddTriggerEvent, the method will be called when addTrigger
   *
   * @memberof AppHook
   */
  bindAddTrigger(bind: AddTriggerEvent) {
    this._onAddTrigger = bind;
  }
  /**
   * 
   * bind AddFilterEvent, the method will be called when addFilter
   *
   * @param {AddFilterEvent} bind
   * @memberof AppHook
   */
  bindAddFilter(bind: AddFilterEvent) {
    this._onAddFilter = bind;
  }

  /**
   * Bind DoTriggerEvent, the method will be called when doTrigger
   *
   * @param {DoTriggerEvent} bind
   * @memberof AppHook
   */
  bindDoTrigger(bind: DoTriggerEvent) {
    this._onDoTrigger = bind;
  }

  /**
   * binding the method will be called when applyFilters
   *
   * @param {UseFiltersEvent} bind
   * @memberof AppHook
   */
  bindUseFilters(bind: UseFiltersEvent) {
    this._onUseFilters = bind;
  }

  /**
   *
   * Add filter, filter the default value when event is fired
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
   * add listener to the listeners map
   *
   * @private
   * @param {('Trigger' | 'Filter')} type 
   * @param {string} hook hook name
   * @param {IListener} newListener 
   * @memberof AppHook
   */
  private addListner(type: ListenerType, hook: string, newListener: IListener) {
    // listeners of the type
    let typeListners = this._listeners[type];
    if (typeListners === undefined) {
      typeListners = this._listeners[type] = {};
    }

    let listenerList = typeListners[hook];
    if (listenerList === undefined) {
      listenerList = typeListners[hook] = [newListener];
    } else {
      // order insert, the smaller the number, the more small index.
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
   * remove listener
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
   * active the trigger, map the trigger to the command
   * no need to consider the priority, because the priority is considered when add trigger
   *
   * @param {string} hook
   * @param {object} [hookState={}] hook event state, optional arguments 
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
   * remove triggers
   * 
   * attention: pass the correct trigger reference(ref func pointer)
   * no deep comparison here
   *
   * @param {ITrigger} trigger
   * @returns {boolean}
   * @memberof AppHook
   */
  removeTrigger(trigger: ITrigger): boolean {
    return this.removeListener(ListenerType.Trigger, trigger);
  }

  /**
   * whether has any specified hook name trigger
   *
   * @param {string} hook
   * @returns {boolean}
   * @memberof AppHook
   */
  hasAnyTriggers(hook: string): boolean {
    return this.hasAnyListeners(ListenerType.Trigger, hook);
  }

  /**
   * whether has any specified hook name filter
   *
   * @param {string} hook
   * @returns {boolean}
   * @memberof AppHook
   */
  hasAnyFilters(hook: string): boolean {
    return this.hasAnyListeners(ListenerType.Filter, hook);
  }

  /**
   * whether has any specified hook name listener(filter or trigger)
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
   * remove filter
   * 
   * attention: pass the correct trigger reference(ref func pointer)
   * no deep comparison here
   *
   * @param {IFilter} filter
   * @returns {boolean}
   * @memberof AppHook
   */
  removeFilter(filter: IFilter): boolean {
    return this.removeListener(ListenerType.Filter, filter);
  }

  /**
   * apply filters, trigger the event, and implement multiple filters on the original string
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
