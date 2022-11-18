import { StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { startActions } from 'modules/shared/apphook/trigger_commands';
import { batchActions } from 'redux-batched-actions';
// @ts-ignore
import { getWizardInfo } from 'enterprise';

let curId = -1;

store.subscribe(function currentGuideWizardIdInHook() {
  const previousCurWizardId = curId;
  const state = store.getState();
  const { curGuideWizardId, config, triggeredGuideInfo } = state.hooks;
  const user = state.user;
  curId = curGuideWizardId;

  if (curId === previousCurWizardId || !config || !user || !user.info) return;
  const nextWizardInfo = getWizardInfo(config, curId as number);
  if (!nextWizardInfo) return;
 
  if (nextWizardInfo.manualActions) {
    startActions(config, nextWizardInfo.manualActions);
  }

  if (nextWizardInfo.steps && nextWizardInfo.steps.length > 0) {
  
    const newTriggeredGuideInfo = {
      ...triggeredGuideInfo,
      [curId]: {
        steps: nextWizardInfo.steps,
        triggeredSteps: [],
      },
    };

    store.dispatch(batchActions([
      StoreActions.updateTriggeredGuideInfo(newTriggeredGuideInfo),
      StoreActions.updateCurrentGuideStepIds(nextWizardInfo.steps[0]),
    ]));
  }

});
