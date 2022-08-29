export enum ModalConfirmKey {
  FixConsistency = 'fixConsistency',
}

export interface IModalConfirmArgs {
  key: ModalConfirmKey;
  metaData: any;
}

export enum WizardIdConstant {
  Questionnaire = 1,
  Guide = 2,
  Notice = 6,
  RePlayGanttVideo = 34,
}

export interface IOpenGuideNextStepProps {
  clearAllPrevUi?: boolean;
}

export interface ISkipCurrentWizardProps {
  curWizardCompleted?: boolean;
}
export interface ISetWizardCompletedProps {
  curWizard?: boolean;
  wizardId?: number;
}