/*
 * Command binding for various event triggers
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-11 21:05:29
 * @Last Modified by:   Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-11 21:05:29
 */
import { StoreActions, IWizardsConfig, Api, ConfigConstant } from '@apitable/core';
import { store } from 'pc/store';
import { batchActions } from 'redux-batched-actions';
import {
  getPrevAndNextStepIdsInCurWizard, getPrevAndNextIdInArr,
  getWizardInfo, addWizardNumberAndApiRun
} from 'pc/common/guide/utils';
import { Guide } from 'pc/common/guide';
import { IOpenGuideNextStepProps, ISkipCurrentWizardProps, ISetWizardCompletedProps } from './interface';
import { openVikaby } from 'pc/common/guide/vikaby';
import { isTimeRulePassed } from 'pc/player/rules';
import { isMobileApp } from 'pc/utils/env';

export const TriggerCommands = {
  open_vikaby: (props) => {
    openVikaby({ ...props });
  },
  open_guide_wizard: (wizardId: number) => {
    const state = store.getState();
    const hooks = state.hooks;
    const config = hooks.config;
    const user = state.user;

    if (!config || !user.info) return;

    const curWizard = getWizardInfo(config, wizardId);

    if (!curWizard || !isTimeRulePassed(curWizard.startTime, curWizard.endTime)) return;
    if ((!curWizard.repeat) && user.info.wizards.hasOwnProperty(wizardId)) return;

    store.dispatch(StoreActions.updateCurrentGuideWizardId(wizardId));
  },
  open_guide_wizards: (wizards: number[]) => {
    const state = store.getState();
    const hooks = state.hooks;
    const config = hooks.config;
    const user = state.user;
    if (!config) return;
    const pendingWizardIds: number[] = [];
    // Filter out unqualified wizards
    wizards.forEach(id => {
      const curWizard = getWizardInfo(config, id);
      if (!curWizard || !isTimeRulePassed(curWizard.startTime, curWizard.endTime)) return;
      if (localStorage.getItem(`${id}`)) return;
      if (isMobileApp() && id === ConfigConstant.WizardIdConstant.AGREE_TERMS_OF_SERVICE) return;
      if (curWizard?.repeat || !user.info?.wizards.hasOwnProperty(id)) {
        pendingWizardIds.push(id);
      }
    });
    if (pendingWizardIds.length === 0) return;
    store.dispatch(batchActions([
      StoreActions.updateCurrentGuideWizardId(pendingWizardIds[0]),
      StoreActions.updatePendingGuideWizardsIds(pendingWizardIds),
    ]));
  },

  // Go to the last step of this wizard
  open_guide_next_step: (props?: IOpenGuideNextStepProps) => {
    if (props?.clearAllPrevUi) {
      TriggerCommands.clear_guide_all_ui();
    }
    const state = store.getState();
    const hooks = state.hooks;
    const { curGuideWizardId, config, curGuideStepIds, pendingGuideWizardIds } = hooks;
    if (!config) return;
    const nextStepIds = getPrevAndNextStepIdsInCurWizard(config, curGuideWizardId, curGuideStepIds)[2];
    const nextWizardId = getPrevAndNextIdInArr(pendingGuideWizardIds, curGuideWizardId)[2];
    if (nextStepIds.length === 0 && nextWizardId !== -1) {
      store.dispatch(StoreActions.updateCurrentGuideWizardId(nextWizardId));
      return;
    }
    store.dispatch(StoreActions.updateCurrentGuideStepIds(nextStepIds));
  },
  // Skip the current wizard and go to the first steps of the next wizard
  skip_current_wizard: (props?: ISkipCurrentWizardProps) => {
    const state = store.getState();
    const hooks = state.hooks;
    const { curGuideWizardId, config, pendingGuideWizardIds } = hooks;
    if (props?.curWizardCompleted) {
      addWizardNumberAndApiRun(curGuideWizardId);
    }
    const nextWizardId = getPrevAndNextIdInArr(pendingGuideWizardIds, curGuideWizardId)[2];
    if (nextWizardId === -1 || !config) {
      store.dispatch(StoreActions.updateCurrentGuideStepIds([]));
      return;
    }
    store.dispatch(StoreActions.updateCurrentGuideWizardId(nextWizardId));
  },

  skip_all_wizards: () => {
    store.dispatch(StoreActions.updateCurrentGuideStepIds([]));
  },
  clear_guide_uis: (arr: string[]) => {
    if (arr.length > 0) {
      arr.forEach(item => {
        Guide.destroyUi(item);
      });
    }
  },
  clear_guide_all_ui: () => {
    TriggerCommands.clear_guide_uis(['notice', 'modal', 'questionnaire', 'popover', 'breath', 'slideout', 'taskList', 'contactUs']);
  },
  set_wizard_completed: (props: ISetWizardCompletedProps) => {
    const { curWizard, wizardId } = props;
    if (curWizard) {
      const state = store.getState();
      const hooks = state.hooks;
      const { curGuideWizardId } = hooks;
      return addWizardNumberAndApiRun(curGuideWizardId);
    }
    if (typeof wizardId === 'number' && wizardId > -1) {
      return addWizardNumberAndApiRun(wizardId);
    }
    return Promise.reject('wizardId is not a number');
  },
  // Refresh page
  page_reload: () => {
    window.location.reload();
  },
  // Open a new window
  window_open_url: (url: string) => {
    window.open(getHrefFromConfigUrl(url));
  },
  // Current page open URL
  window_location_href_to: (url: string) => {
    window.location.href = getHrefFromConfigUrl(url);
  },
  // Mark message as read
  mark_notice_to_read: (idArr: string[], isAll?: boolean) => {
    Api.transferNoticeToRead(idArr, isAll);
  },
};

// Perform url jump processing
export const getHrefFromConfigUrl = (url: string) => {
  if (url.startsWith('/')) {
    const newUrl = new URL(url, window.location.origin);
    return newUrl.href;
  }
  return url;
};
// Execute a single action
const startAction = (config: IWizardsConfig, actionId: string) => {
  const Actions = config.player.action;
  const curAction = Actions.find(item => item.id === actionId);
  if (!curAction) return;
  const commandStr = curAction.command;
  const commandArgsStr = curAction.commandArgs;
  const command = TriggerCommands[commandStr];
  if (!command) return;
  if (commandArgsStr) {
    command(JSON.parse(commandArgsStr));
  } else {
    command();
  }
};

export const startActions = (config: IWizardsConfig, actionIds: string[]) => {
  actionIds?.forEach(actionId => startAction(config, actionId));
};
