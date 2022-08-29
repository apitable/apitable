/*
 * Player 用户系统, 包括新手引导、事件系统绑定、小红点、通知等与用户体验密切相关的管理器
 * 提供初始化函数，能再启动期间执行初始化（init）函数，对player配置表进行读取解释
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-10 14:16:06
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-21 17:58:29
 */
import {
  AppHook, TriggerCommand, FilterCommand,
  // ITrigger,
} from '../apphook';
// eve引擎在这里声明，并成为全局单例
const apphook = new AppHook();

export interface IEvent {
  module: string;
  name: string;
}

/**
 * 配置的时候，module和name分开配，便于产品策划识别事件和更好的可读性
 * 系统真实使用的时候，将module和name进行拼接： modulexxx_namexxx
 *
 * @param {IEvent} event
 * @returns
 */
export function _getEventName(event: IEvent) {
  return event?.module + '_' + event?.name;
}

/**
 * 绑定事件.
 * 为什么这里用bindTrigger，而不用addTrigger呢？
 * addTrigger，是可以add的，就是可以绑定非常多个的动作，适用于第三方插件奔放地开发；
 * 而在我们的自己程序代码里，我们不推崇使用add，这样我们自己的代码难维护，统一放到了event_bindings.ts文件了
 *
 * @export
 * @param {IEvent} event
 * @param {TriggerCommand} command
 * @param {number} [priority=0]
 * @returns
 */
export function bindTrigger(event: IEvent, command: TriggerCommand, priority = 0, force = false) {
  const eventStr = _getEventName(event);

  if (!force && apphook.hasAnyTriggers(eventStr)) {
    console.error(`Event ${eventStr} has triggers, cannot bind anymore`);
    return undefined;
  }

  return apphook.addTrigger(_getEventName(event), command, [], undefined, priority);
}

/**
 * 执行事件
 *
 * @export
 * @param {IEvent} event
 * @param {*} [eventState]
 */
export function doTrigger(event: IEvent, eventState?: any) {
  const eventStr = _getEventName(event);

  // console.debug('[DO_EVENT] ' + eventStr + ' ' + eventState);
  apphook.doTriggers(eventStr, eventState);
}

/**
 * 应用过滤器
 *
 * @export
 * @param {IEvent} event
 * @param {*} defaultValue
 * @param {*} [eventState]
 * @returns
 */
export function applyFilters(event: IEvent, defaultValue: any, eventState?: any) {
  const eventStr = _getEventName(event);
  return apphook.applyFilters(eventStr, defaultValue, eventState);
}

export function bindFilter(
  event: IEvent, command: FilterCommand, commandArg: any,
  priority = 0, force = false,
) {
  const eventStr = _getEventName(event);
  if (!force && apphook.hasAnyFilters(eventStr)) {
    console.error(`Event ${eventStr} has triggers, cannot bind anymore`);
    return;
  }
  apphook.addFilter(eventStr, command, commandArg, undefined, priority);
}

/**
 * 直接获得eve事件引擎
 *
 * @export
 * @returns
 */
export function getAppHook() {
  return apphook;
}
