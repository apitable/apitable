import produce from 'immer';
import { SystemConfigInterfaceGuide, SystemConfigInterfacePlayer, t, Strings } from '@apitable/core';

interface IWizardsConfig {
  player: SystemConfigInterfacePlayer;
  guide: SystemConfigInterfaceGuide;
}

class WizardBuilder {
  private event: WizardEvent | null = null;
  action: IAction | null = null;

  trigger: IWizardTrigger | null = null;

  private steps: { id: number; item: any }[] = [];

  wizardId: number | null = null;
  wizard: IWizardItem | null = null;

  get getSteps() {
    return this.steps.reduce((acc, cur) => {
      acc[cur.id] = cur.item;
      return acc;
    }, {});
  }

  constructor() {}

  public addEvent(_event: WizardEvent) {
    this.event = _event;
    return this;
  }

  public addAction(action: IAction) {
    this.action = action;
    return this;
  }

  public addWizard(id: number, item: IWizardItem) {
    this.wizardId = id;
    this.wizard = item;
    return this;
  }

  public addTrigger(trigger: IWizardTrigger) {
    this.trigger = trigger;
    return this;
  }

  public addStep(id: number, guide: any) {
    this.steps = [
      ...this.steps,
      {
        id,
        item: guide,
      },
    ];
    return this;
  }
}

const CONST_MODIFYED_WIZARDS = [
  new WizardBuilder()
    .addEvent({
      module: 'guide',
      name: 'use_automation_first_time',
    })
    .addAction({
      id: 'open_guide_wizard(118)',
      description: '打开引导向导 首次Button列',
      command: 'open_guide_wizard',
      commandArgs: '118',
    })
    .addTrigger({
      actions: ['open_guide_wizard(118)'],
      rules: ['device_IS_pc', 'url_EXCLUDES_templateId', 'url_EXCLUDES_shareId'],
      id: 'guide_use_button_column_first_time,[device_IS_pc, url_EXCLUDES_templateId, url_EXCLUDES_shareId],[open_guide_wizard(118)]',
      event: ['guide_use_button_column_first_time'],
    })
    .addStep(181, {
      description: 'ui dialog for use button field first time active create action ',
      next: '好的',
      nextId: 'okay',
      onClose: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
      onSkip: ['clear_guide_all_ui()'],
      onTarget: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
      onNext: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
      uiConfig: '{\n "element": "#CONST_ROBOT_ACTION_CREATE"\n} ',
      uiConfigId: 'player_step_ui_config_button_field_action_create',
      skipId: 'skip',
      uiType: 'popover',
    })
    .addStep(180, {
      description: 'ui dialog for use button field first time active bind datasheeet ',
      nextId: 'next_step',
      next: '下一步',
      onSkip: ['clear_guide_all_ui()'],
      onClose: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
      skip: '跳过',
      skipId: 'skip',
      onTarget: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
      onNext: ['open_guide_next_step({"clearAllPrevUi":true})'],
      uiConfig: '{\n "element": "#AUTOMATION_BOUND_DATASHEET"\n} ',
      uiConfigId: 'player_step_ui_config_button_field_bound_datasheet',
      uiType: 'popover',
    })
    .addStep(178, {
      description: 'ui dialog for use button field first time and active node ',
      next: '下一步',
      nextId: 'next_step',
      onClose: ['open_guide_next_step({"clearAllPrevUi":true})'],
      onSkip: ['clear_guide_all_ui()'],
      onTarget: ['open_guide_next_step({"clearAllPrevUi":true})'],
      onNext: ['open_guide_next_step({"clearAllPrevUi":true})'],
      skip: '跳过',
      skipId: 'skip',
      uiConfig: '{\n "element": ".TREE_NODE_ACTIVE_ONE", "description": "description",  "title": "title"\n} ',
      uiConfigId: 'player_step_ui_config_button_field_node',
      uiType: 'popover',
    })
    .addStep(179, {
      description: 'ui dialog for use button field first time for node actived status ',
      next: '下一步',
      nextId: 'next_step',
      onClose: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
      onSkip: ['clear_guide_all_ui()'],
      onTarget: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
      onNext: ['open_guide_next_step({"clearAllPrevUi":true})'],
      skip: '跳过',
      skipId: 'skip',
      uiConfig: '{\n "element": "#NODE_FORM_ACTIVE"\n} ',
      uiConfigId: 'player_step_ui_config_button_field_node_form_active',
      uiType: 'popover',
    })
    .addWizard(118, {
      description: 'steps for automation button',
      completeIndex: 0,
      player: {
        action: ['rec4kT7UZkdww'],
      },
      repeat: true,
      steps: '[[178], [179], [180], [181]]',
    }),
];

interface IUIConfig {
  element?: string;
  description?: string;
  title?: string;
  placement: 'bottomLeft' | string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const uiConfig: IUIConfig = {
  element: '#NODE_FORM_ACTIVE',
  title: t(Strings.export),
  placement: 'bottomLeft',
  description: t(Strings.export),
};

interface IGuideItem {
  description?: string;
  next?: string;
  nextId?: string;
  skip?: string;
  skipId: string;
  onClose?: string[];
  onNext?: string[];
  onSkip?: string[];
  uiConfig?: string;
  uiConfigId?: string;
  onTarget: string[];
  uiType: 'popover' | string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stepId = 179;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stepItem: IGuideItem = {
  description: 'ui dialog for use button field first time for node actived status ',
  next: '下一步',
  nextId: 'next_step',
  onClose: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
  onSkip: ['clear_guide_all_ui()'],
  onTarget: ['set_wizard_completed({"curWizard": true})', 'open_guide_next_step({"clearAllPrevUi":true})'],
  onNext: ['open_guide_next_step({"clearAllPrevUi":true})'],
  skip: '跳过',
  skipId: 'skip',
  uiConfig: '{\n "element": "#NODE_FORM_ACTIVE"\n} ',
  uiConfigId: 'player_step_ui_config_button_field_node_form_active',
  uiType: 'popover',
};

// const 118  =
interface IWizardItem {
  description?: string;
  completeIndex?: number;
  steps: string;
  repeat: boolean;
  player: {
    action: string[];
  };
}

export interface IAction {
  id: string;
  description: string;
  command: string;
  commandArgs: string;
}

export interface IWizardTrigger {
  actions: string[];
  rules: string[];
  id: string;
  event: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const action: IWizardTrigger = {
  actions: ['open_guide_wizard(118)'],
  rules: ['device_IS_pc', 'url_EXCLUDES_templateId', 'url_EXCLUDES_shareId'],
  id: 'guide_use_button_column_first_time,[device_IS_pc, url_EXCLUDES_templateId, url_EXCLUDES_shareId],[open_guide_wizard(118)]',
  event: ['guide_use_button_column_first_time'],
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface WizardEvent {
  module: string;
  name: string;
}

export interface IRobotItem {
  actions: string[];
  rules: string[];
  id: string;
  event: string[];
}

export const transpile = (item: IWizardsConfig, wizardBuilder: WizardBuilder) => {
  return produce(item, (draft) => {
    draft.guide.step = { ...draft.guide.step, ...wizardBuilder.getSteps };
    if (wizardBuilder.wizard) {
      draft.guide.wizard = { ...draft.guide.wizard, [String(wizardBuilder.wizardId)]: wizardBuilder.wizard };
    }
    if (wizardBuilder.action) {
      draft.player.action = [...draft.player.action, wizardBuilder.action];
    }
    if (wizardBuilder.trigger) {
      draft.player.trigger = draft.player.trigger.concat(wizardBuilder.trigger);
    }
  });
};
export function modifyWizardConfig(item: IWizardsConfig): IWizardsConfig {
  return CONST_MODIFYED_WIZARDS.reduce((acc, cur) => transpile(acc, cur), item);
}
