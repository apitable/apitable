
import { Player, Selectors, StoreActions, SystemConfig } from '@apitable/core';
import { store } from 'pc/store';
import { startActions, TriggerCommands } from '../common/apphook/trigger_commands';
import { isEventStateMatch, isRulesPassed, isTimeRulePassed } from './rules';
// const Triggers = SystemConfig.player.trigger;

/**
 * Execute at app initialization time
 *
 * @export
 */
export function init() {
  // Get configuration file
  const HooksConfig = window.__initialization_data__.wizards;

  let config;
  /**
   * Here it is better to distinguish the environment, local debugging is convenient to read the information directly from the configuration table, 
   * if not distinguish the environment, the impact on debugging will be greater
   */
  if (process.env.NODE_ENV === 'development') {
    config = { player: SystemConfig.player, guide: SystemConfig.guide };
  } else if (HooksConfig) {
    config = HooksConfig;
  }

  if (!config) return;

  store.dispatch(StoreActions.updateConfig(config));
  const Events = config.player.events;
  // Binding events to the trigger datasheet
  const triggers = config.player.trigger;
  // pendingBindEvents = {eventId: triggerId[]}, event and trigger are in a one-to-many relationship
  const pendingBindEvents: { [key: string]: string[] } = {};
  triggers.forEach(trigger => {
    // Whether to abandon
    if (trigger.suspended) return;
    const curTriggerId = trigger.id;
    const byEventId = trigger.event[0];
    if (pendingBindEvents.hasOwnProperty(byEventId)) {
      pendingBindEvents[byEventId] = [...pendingBindEvents[byEventId], curTriggerId];
    } else {
      pendingBindEvents[byEventId] = [curTriggerId];
    }
  });
  // Start binding
  Object.keys(pendingBindEvents).forEach(eventId => {
    const allTriggerIds = pendingBindEvents[eventId];
    Player.bindTrigger(Events[eventId], args => {
      // Filter out triggers that don't match rule
      const validTriggers = allTriggerIds.filter(triggerId => {
        const curTrigger = triggers.find(item => item.id === triggerId);
        return curTrigger &&
          isEventStateMatch(args, curTrigger.eventState) &&
          isTimeRulePassed(curTrigger.startTime, curTrigger.endTime) &&
          isRulesPassed(config.player.rule, curTrigger.rules);
      });
      // Iterate through multiple triggers and execute the corresponding actions
      validTriggers.forEach(triggerId => {
        const trigger = triggers.find(item => item.id === triggerId);
        if (!trigger) return;
        const actions = trigger.actions || [];
        startActions(config, actions);
      });
    });
  });

  // Bind events in steps
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
      // Whether the user is currently in certain wizards, determine whether the user has previously triggered
      if (curGuideWizardId === -1 || (!triggeredGuideInfo.hasOwnProperty(curGuideWizardId))) return;
      // The corresponding stepId of the current hooks event is Number(key), which determines whether the step before this one has been completed.
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

