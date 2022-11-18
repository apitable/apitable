import { TriggerCommands } from '../../../modules/shared/apphook/trigger_commands';
import { StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { Step } from '@apitable/core/src/config/system_config.interface';
// @ts-ignore
import { Guide, isEqualArr, addWizardNumberAndApiRun, getWizardInfo } from 'enterprise';

let curSteps: number[] = [];

store.subscribe(function currentStepInHook() {
  const previousCurrentStep = curSteps;
  const state = store.getState();
  const { curGuideStepIds, config, triggeredGuideInfo, curGuideWizardId } = state.hooks;
  curSteps = curGuideStepIds;
  if (isEqualArr(curSteps, previousCurrentStep) || !config) {
    return;
  }

  // If step is an empty array, then all bootstrapping is complete and all hook data is cleared
  if (curSteps.length === 0) {
    TriggerCommands.clear_guide_all_ui();
    store.dispatch(StoreActions.updateCurrentGuideWizardId(-1));
    store.dispatch(StoreActions.updatePendingGuideWizardsIds([]));
    store.dispatch(StoreActions.updateTriggeredGuideInfo({}));
    return;
  }
  const curWizardInfo = getWizardInfo(config, curGuideWizardId as number);
  const { steps, completeIndex } = curWizardInfo;
  // Rendering pages
  setTimeout(()=>{
    curSteps.forEach(item => {
      const curStepInfo = config && config.guide && config.guide.step[item];
      if(!curStepInfo) return;
      const objectKeys = Object.keys(curStepInfo) || [];
      if(objectKeys.length === 0) {
      // If there are empty objects in the configuration table, end the guide to avoid errors on the page
        store.dispatch(StoreActions.updateCurrentGuideStepIds([]));
        return;
      }
      Guide.showUiFromConfig(curStepInfo as Step);
    });
  }, 500);

  // Put this step into the completed wizards array
  const curTriggerWizardInfo = curGuideWizardId in triggeredGuideInfo ?
    {
      ...triggeredGuideInfo[curGuideWizardId],
      triggeredSteps: [...triggeredGuideInfo[curGuideWizardId].triggeredSteps, curSteps],
    } :
    {
      steps,
      triggeredSteps: [curSteps],
    };
  const newTriggeredGuideInfo = {
    ...triggeredGuideInfo,
    [curGuideWizardId]:curTriggerWizardInfo,
  };
  store.dispatch(StoreActions.updateTriggeredGuideInfo(newTriggeredGuideInfo));

  // Send request

  const curIndex = steps.findIndex(item => isEqualArr(item, curSteps));
  if(completeIndex !== -1 && curIndex === completeIndex){
    // This is deliberately triggered as a macro task, in order to avoid two triggers occurring at the same time
    setTimeout(()=>{
      addWizardNumberAndApiRun(curGuideWizardId);
    }, 100);
  }
});
