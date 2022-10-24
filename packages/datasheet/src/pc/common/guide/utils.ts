import { IWizardsConfig, Api, StoreActions, t, Strings, IUser } from '@apitable/core';
import { store } from 'pc/store';
import { difference } from 'lodash';
import { Message } from 'pc/components/common';

export const isEqualArr = (arr1: number[], arr2: number[]) => {
  const differenceArr = difference(arr1, arr2);
  return differenceArr.length ===0 && arr1.length === arr2.length;
};

export const getPrevAndNextIdInArr = (arr: any[], curId: number | number[]) => {
  const isArray = typeof curId === 'object';
  const initValue = isArray ? [] : -1;

  const curInx = arr.findIndex(item => {
    return isArray ? isEqualArr(item, curId as number[]) : item === curId;
  });
  if(curInx === -1) return [initValue, curId, initValue];

  const prevId = arr[curInx - 1] || initValue;
  const nextId = curInx === arr.length -1 ? initValue : arr[curInx + 1];
  return [prevId, curId, nextId];
};

export const getPrevAndNextStepIdsInCurWizard = (config: IWizardsConfig, curWizardId: number, curStepIds: number[]) => {
  const curWizardInfo = getWizardInfo(config, curWizardId);
  if(!curWizardInfo) return [[], curStepIds, []];
  return getPrevAndNextIdInArr([...curWizardInfo.steps], curStepIds);
};

export const getWizardInfo = (config: IWizardsConfig, wizardId: number) => {
  const wizardInfoConfig = config.guide.wizard[wizardId];
  if(wizardInfoConfig && wizardInfoConfig.hasOwnProperty('steps')){
    const stepsConfig = wizardInfoConfig.steps;
    const steps = typeof stepsConfig === 'string' ? JSON.parse(stepsConfig || '[]') : stepsConfig;
    return {
      ...wizardInfoConfig,
      steps,
    };
  }
  return { ...wizardInfoConfig };
};
export const getWizardFreeVCount = (config: IWizardsConfig, wizardId: number) => {
  const wizardInfo = getWizardInfo(config, wizardId);
  return wizardInfo.freeVCount || 0;
};
export const addWizardNumberAndApiRun = (wizardId: number) => {
  const state = store.getState();
  const hooks = state.hooks;
  const user = state.user;
  const curWizards = user.info ? { ...user.info.wizards } : {};
  return Api.triggerWizard(wizardId).then(res=>{
    if(res.data.success){
      store.dispatch(StoreActions.addWizardNumber(wizardId));
      if(!hooks.config || !user.info) return;
      const wizardInfo = getWizardInfo(hooks.config, wizardId);
      if(wizardInfo && !curWizards.hasOwnProperty(wizardId) && wizardInfo.successMsg ){
        Message.success({ content: t(Strings[wizardInfo.successMsg]) });
      }
    }else{
      Message.error({ content: res.data.message });
    }
  });
};

export const getWizardRunCount = (user: IUser, wizardId: number) => {
  const curWizards = user.info ? { ...user.info.wizards } : {};
  if (!curWizards.hasOwnProperty(wizardId)) return 0;
  return curWizards[wizardId];
};
