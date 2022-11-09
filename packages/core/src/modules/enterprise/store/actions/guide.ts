import * as actions from '../../../shared/store/action_constants';
import { IWizardsConfig, ITriggeredGuideInfo } from '../../../../store/interfaces';

export function updatePendingGuideWizardsIds(guideWizardIds: number[]) {
  return {
    type: actions.UPDATE_PENDING_GUIDE_WIZARD_IDS,
    payload: guideWizardIds,
  };
}

export function updateCurrentGuideStepIds(steps: number[]) {
  return {
    type: actions.UPDATE_CURRENT_GUIDE_STEP_IDS,
    payload: steps,
  };
}
export function updateCurrentGuideWizardId(id: number) {
  return {
    type: actions.UPDATE_CURRENT_GUIDE_WIZARD_ID,
    payload: id,
  };
}

export function updateTriggeredGuideInfo(triggeredGuideInfo: ITriggeredGuideInfo) {
  return {
    type: actions.UPDATE_TRIGGERED_GUIDE_INFO,
    payload: triggeredGuideInfo,
  };
}
export function updateConfig(config: IWizardsConfig) {
  return {
    type: actions.UPDATE_CONFIG,
    payload: config,
  };
}
export function initHooksData() {
  return {
    type: actions.INIT_HOOKS_DATA,
  };
}

export function clearWizardsData() {
  return {
    type: actions.CLEAR_WIZARDS_DATA,
  };
}