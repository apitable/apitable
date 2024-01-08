/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// @ts-ignore
import { IWizardsConfig, Player, SystemConfig } from '@apitable/core';
import { modifyWizardConfig } from 'pc/common/wizard';
import { startActions, TriggerCommands } from '../apphook/trigger_commands';
import { isEventStateMatch, isRulesPassed, isTimeRulePassed } from './rules';
// @ts-ignore
import { getPlayerHooks, updatePlayerConfig } from 'enterprise/guide/utils';

// const Triggers = SystemConfig.player.trigger;

/**
 * Execute at app initialization time
 *
 * @export
 */
export function init() {
  // console.log('init', updatePlayerConfig, getPlayerHooks);
  // Get configuration file
  const HooksConfig = window.__initialization_data__.wizards;

  let config: IWizardsConfig | undefined;
  /**
   * Here it is better to distinguish the environment, local debugging is convenient to read the information directly from the configuration table,
   * if not distinguish the environment, the impact on debugging will be greater
   */
  if (process.env.NODE_ENV === 'development') {
    config = modifyWizardConfig({ player: SystemConfig.player, guide: SystemConfig.guide });
  } else if (HooksConfig) {
    config = modifyWizardConfig(HooksConfig);
  }

  if (!config) return;

  updatePlayerConfig?.(config);
  const Events = config.player.events;
  // Binding events to the trigger datasheet
  const triggers = config.player.trigger;
  // pendingBindEvents = {eventId: triggerId[]}, event and trigger are in a one-to-many relationship
  const pendingBindEvents: { [key: string]: string[] } = {};
  triggers.forEach((trigger: any) => {
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
  Object.keys(pendingBindEvents).forEach((eventId) => {
    const allTriggerIds = pendingBindEvents[eventId];
    Player.bindTrigger(Events[eventId], (args) => {
      // Filter out triggers that don't match rule
      const validTriggers = allTriggerIds.filter((triggerId) => {
        const curTrigger = triggers.find((item: any) => item.id === triggerId);
        if (!curTrigger) return;
        const eventMatch = isEventStateMatch(args, curTrigger.eventState);
        const timeRulePassed = isTimeRulePassed((curTrigger as any).startTime, (curTrigger as any).endTime);
        const rulesPassed = isRulesPassed(config?.player.rule, curTrigger.rules);

        if (
          triggerId ===
          'workbench_shown,[device_IS_pc, url_EXCLUDES_templateId, url_EXCLUDES_shareId, edition_IS_aitable],[open_guide_wizards([105, 115, 104])]'
        ) {
          console.log({
            eventMatch,
            timeRulePassed,
            rulesPassed,
          });
        }

        return eventMatch && timeRulePassed && rulesPassed;
      });
      // Iterate through multiple triggers and execute the corresponding actions
      validTriggers.forEach((triggerId) => {
        const trigger = triggers.find((item: any) => item.id === triggerId);
        if (!trigger) return;
        const actions = trigger.actions || [];
        startActions(config!, actions);
      });
    });
  });

  // Bind events in steps
  const Steps = config.guide.step;
  const pendingBindEventsInSteps: string[] = [];
  Steps &&
    Object.keys(Steps).forEach((stepId) => {
      const curStepInfo = Steps[stepId];
      if (!curStepInfo.hasOwnProperty('byEvent')) return;
      const byEventId = curStepInfo.byEvent![0];
      if (pendingBindEventsInSteps.includes(byEventId)) return;
      pendingBindEventsInSteps.push(byEventId);
    });
  pendingBindEventsInSteps.forEach((eventId) => {
    Player.bindTrigger(Events[eventId], () => {
      const hooks = getPlayerHooks?.() || {};
      const { curGuideWizardId, triggeredGuideInfo } = hooks;
      // Whether the user is currently in certain wizards, determine whether the user has previously triggered
      if (!triggeredGuideInfo || curGuideWizardId === -1 || !triggeredGuideInfo.hasOwnProperty(curGuideWizardId)) return;
      // The corresponding stepId of the current hooks event is Number(key), which determines whether the step before this one has been completed.
      const curStepInfo = triggeredGuideInfo[curGuideWizardId];
      if (typeof curStepInfo.steps !== 'object' || curStepInfo.steps.length === curStepInfo.triggeredSteps.length) return;
      const nextStepIds = curStepInfo.steps[curStepInfo.triggeredSteps.length];
      const hasByEvents = nextStepIds.find((stepId) => {
        const stepInfo = Steps[stepId];
        return stepInfo && 'byEvent' in stepInfo && stepInfo.byEvent && stepInfo.byEvent[0] === eventId;
      });
      if (!hasByEvents) return;
      TriggerCommands.open_guide_next_step?.({ clearAllPrevUi: true });
    });
  });
}
