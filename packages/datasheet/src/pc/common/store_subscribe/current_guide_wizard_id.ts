import { StoreActions } from '@vikadata/core';
import { store } from 'pc/store';
import { getWizardInfo } from 'pc/common/guide/utils';
import { startActions } from 'pc/common/apphook/trigger_commands';
import { batchActions } from 'redux-batched-actions';
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
  // 有manualActions
  if (nextWizardInfo.manualActions) {
    startActions(config, nextWizardInfo.manualActions);
  }
  // 有steps
  if (nextWizardInfo.steps && nextWizardInfo.steps.length > 0) {
    // 更新triggeredGuideInfo
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
