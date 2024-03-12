import { Atom, atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { atomWithImmer } from 'jotai-immer';
import { atomsWithQuery } from 'jotai-tanstack-query';
import { Api, ConfigConstant, FormApi, IServerFormPack } from '@apitable/core';
import { getFormId } from 'pc/components/automation/controller/hooks/get_form_id';
import { INodeSchema, IRobotAction, IRobotContext, IRobotTrigger } from '../../../robot/interface';
import { loadableWithDefault } from '../../../robot/robot_detail/api';

export enum PanelName {
  BasicInfo = 'basic_info',
  Trigger = 'trigger',
  Action = 'action',
}
const automationDrawerVisibleAtom = atomWithImmer<boolean>(false);
export const formListDstIdAtom = atomWithImmer<string>('');

const automationTriggerDatasheetAtom = atomWithImmer<{
  formId: string | undefined;
  id: string | undefined;
}>({
  formId: undefined,
  id: undefined,
});

const automationStateAtom = atomWithImmer<IRobotContext | undefined>(undefined);

export const automationNameAtom = selectAtom(automationStateAtom, (automation) => automation?.robot?.name);

export const automationCacheAtom = atomWithImmer<{
  map?: Map<string, IRobotTrigger | IRobotAction>;
  id?: string;
  panel?: IAutomationPanel;
}>({});
export const automationCurrentTriggerId = atomWithImmer<string | undefined>(undefined);

export const automationSourceAtom = atomWithImmer<'datasheet' | undefined>(undefined);

export interface ILocalAutomation {
  trigger: Map<string, IRobotTrigger>;
  action: Map<string, IRobotAction>;
}
const automationLocalMap = atomWithImmer<Map<string, IRobotTrigger | IRobotAction>>(new Map<string, IRobotTrigger | IRobotAction>());

const automationTriggerAtom: Atom<IRobotTrigger | undefined> = atom(
  (get) => get(automationStateAtom)?.robot?.triggers?.find((item) => item.triggerId === get(automationCurrentTriggerId)),
);

export const automationTriggersAtom = atom((get) =>
  (get(automationStateAtom)?.robot?.triggers ?? []).map((item) => ({ ...item, id: item.triggerId })),
);
export const formIdAtom = atom((get) => getFormId(get(automationTriggerAtom)));

export const automationActionsAtom = atomWithImmer<IRobotAction[]>([]);

const automationHistoryAtom = atomWithImmer<{
  dialogVisible: boolean;
  taskId?: string;
}>({
  dialogVisible: false,
});

export interface IAutomationPanel {
  panelName?: PanelName;
  dataId?: string;
  data?: {
    nodeId: string;
    schema: INodeSchema;
    formData: any;
    mergedUiSchema: INodeSchema;
    title: string;
    description?: string;
    serviceLogo?: string;
  };
}
const automationPanelAtom = atomWithImmer<IAutomationPanel>({
  panelName: PanelName.BasicInfo,
});

const [selectFormMeta] = atomsWithQuery((get) => ({
  queryKey: ['automation_fetchFormPack_formIdMeta', get(automationTriggerDatasheetAtom).formId],
  queryFn: async ({ queryKey: [, id] }) => {
    if (!id) {
      return {};
    }
    return await FormApi.fetchFormPack(String(id!)).then((res) => res?.data?.data ?? {});
  },
}));

const [formListAtom] = atomsWithQuery((get) => ({
  queryKey: ['automation_ConfigConstant.NodeType.FORM', get(formListDstIdAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    if (!id) {
      return [];
    }
    return await Api.getRelateNodeByDstId(String(id!), undefined, ConfigConstant.NodeType.FORM).then((res) => res?.data?.data ?? []);
  },
}));

const [fetchFormMeta] = atomsWithQuery((get) => ({
  queryKey: ['automation_fetchFormPack_formId', get(formIdAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    if (!id) {
      return {};
    }
    return await FormApi.fetchFormPack(String(id!)).then((res) => res?.data?.data ?? ({} as IServerFormPack));
  },
}));

export const loadableFormMeta = loadableWithDefault(fetchFormMeta, undefined);
export const loadableFormList = loadableWithDefault(formListAtom, []);

export const loadableFormItemAtom = loadableWithDefault(selectFormMeta, []);
export {
  automationLocalMap,
  automationStateAtom,
  automationDrawerVisibleAtom,
  automationHistoryAtom,
  automationPanelAtom,
  automationTriggerAtom,
  automationTriggerDatasheetAtom,
};
