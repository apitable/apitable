import { TriggerCommands } from './../apphook/trigger_commands';
import { StoreActions } from '@vikadata/core';
import { store } from 'pc/store';
import { Guide, isEqualArr, addWizardNumberAndApiRun } from 'pc/common/guide';
import { getWizardInfo } from 'pc/common/guide/utils';
import { Step } from '@vikadata/core/src/config/system_config.interface';
let curSteps: number[] = [];

store.subscribe(function currentStepInHook() {
  const previousCurrentStep = curSteps;
  const state = store.getState();
  const { curGuideStepIds, config, triggeredGuideInfo, curGuideWizardId } = state.hooks;
  curSteps = curGuideStepIds;
  if (isEqualArr(curSteps, previousCurrentStep) || !config) {
    return;
  }

  // step为空数组，则表示完成了所有引导，所有hook数据清空
  if (curSteps.length === 0) {
    TriggerCommands.clear_guide_all_ui();
    store.dispatch(StoreActions.updateCurrentGuideWizardId(-1));
    store.dispatch(StoreActions.updatePendingGuideWizardsIds([]));
    store.dispatch(StoreActions.updateTriggeredGuideInfo({}));
    return;
  }
  const curWizardInfo = getWizardInfo(config, curGuideWizardId as number);
  const { steps, completeIndex } = curWizardInfo;
  // 渲染页面
  setTimeout(()=>{
    curSteps.forEach(item => {
      const curStepInfo = config && config.guide && config.guide.step[item];
      if(!curStepInfo) return;
      const objectKeys = Object.keys(curStepInfo) || [];
      if(objectKeys.length === 0) {
      // 若配置表里是空对象，则结束引导，避免页面报错
        store.dispatch(StoreActions.updateCurrentGuideStepIds([]));
        return;
      }
      Guide.showUiFromConfig(curStepInfo as Step);
    });
  }, 500);

  // 将此step放入已完成的wizards数组里
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

  // 发送请求

  const curIndex = steps.findIndex(item => isEqualArr(item, curSteps));
  if(completeIndex !== -1 && curIndex === completeIndex){
    // 此处特意作为宏任务触发，为了避免两个trigger同时发生的情况
    setTimeout(()=>{
      addWizardNumberAndApiRun(curGuideWizardId);
    }, 100);
  }
});
