
import { Player, Selectors, StoreActions, SystemConfig } from '@vikadata/core';
import { store } from 'pc/store';
import { startActions, TriggerCommands } from '../common/apphook/trigger_commands';
import { isEventStateMatch, isRulesPassed, isTimeRulePassed } from './rules';
// const Triggers = SystemConfig.player.trigger;

/**
 * Player 系统初始化，再app初始化的时候执行
 *
 * @export
 */
export function init() {
  // 获取配置文件
  const HooksConfig = window.__initialization_data__.wizards;

  let config;
  /**
   * 这里还是区分下环境吧，本地调试方便从配置表里直接读取信息，如果不区分环境，对调试的影响会比较大
   */
  if (process.env.NODE_ENV === 'development') {
    config = { player: SystemConfig.player, guide: SystemConfig.guide };
  } else if (HooksConfig) {
    config = HooksConfig;
  }

  if (!config) return;

  store.dispatch(StoreActions.updateConfig(config));
  const Events = config.player.events;
  //  绑定trigger表的事件
  const triggers = config.player.trigger;
  // pendingBindEvents = {eventId: triggerId[]} , event与trigger是属于1对多的关系
  const pendingBindEvents: { [key: string]: string[] } = {};
  triggers.forEach(trigger => {
    // 查看是否废弃
    if (trigger.suspended) return;
    const curTriggerId = trigger.id;
    const byEventId = trigger.event[0];
    if (pendingBindEvents.hasOwnProperty(byEventId)) {
      pendingBindEvents[byEventId] = [...pendingBindEvents[byEventId], curTriggerId];
    } else {
      pendingBindEvents[byEventId] = [curTriggerId];
    }
  });
  // 开始绑定
  Object.keys(pendingBindEvents).forEach(eventId => {
    const allTriggerIds = pendingBindEvents[eventId];
    Player.bindTrigger(Events[eventId], args => {
      //  过滤出不符合rule的trigger
      const validTriggers = allTriggerIds.filter(triggerId => {
        const curTrigger = triggers.find(item => item.id === triggerId);
        return curTrigger &&
          isEventStateMatch(args, curTrigger.eventState) &&
          isTimeRulePassed(curTrigger.startTime, curTrigger.endTime) &&
          isRulesPassed(config.player.rule, curTrigger.rules);
      });
      // 遍历多个triggers以及执行对应的actions
      validTriggers.forEach(triggerId => {
        const trigger = triggers.find(item => item.id === triggerId);
        if (!trigger) return;
        const actions = trigger.actions || [];
        startActions(config, actions);
      });
    });
  });

  //  绑定steps里的事件
  const Steps = config.guide.step;
  const pendingBindEventsInSteps: string[] = [];
  Steps && Object.keys(Steps).forEach(stepId => {
    const curStepInfo = Steps[stepId];
    if (!curStepInfo.hasOwnProperty('byEvent')) return;
    const byEventId = curStepInfo.byEvent[0];
    if (pendingBindEventsInSteps.includes(byEventId)) return;
    pendingBindEventsInSteps.push(byEventId);
  });
  pendingBindEventsInSteps.forEach(eventId => {
    Player.bindTrigger(Events[eventId], args => {
      const state = store.getState();
      const hooks = Selectors.hooksSelector(state);
      const { curGuideWizardId, triggeredGuideInfo } = hooks;
      // 当前是否处于某个wizards，判断用户之前是否触发过
      if (curGuideWizardId === -1 || (!triggeredGuideInfo.hasOwnProperty(curGuideWizardId))) return;
      // 当前hooks事件对应的stepId是Number(key),判断本次step之前的step是否已完成
      const curStepInfo = triggeredGuideInfo[curGuideWizardId];
      if ((typeof curStepInfo.steps !== 'object') || curStepInfo.steps.length === curStepInfo.triggeredSteps.length) return;
      const nextStepIds = curStepInfo.steps[curStepInfo.triggeredSteps.length];
      const hasByEvents = nextStepIds.find(stepId => {
        const stepInfo = Steps[stepId];
        return stepInfo && 'byEvent' in stepInfo && stepInfo.byEvent && stepInfo.byEvent[0] === eventId;
      });
      if (!hasByEvents) return;
      TriggerCommands.open_guide_next_step({ clearAllPrevUi: true });
    });
  });
}

