import { atomWithImmer } from 'jotai-immer';
import { INodeSchema, IRobotContext, IRobotTrigger } from '../../robot/interface';

const showAtomDetailModalAtom = atomWithImmer<boolean>(false);
const automationModifiedAtom = atomWithImmer<boolean>(false);

const automationStateAtom = atomWithImmer<IRobotContext | undefined>(undefined);
const automationTriggerAtom = atomWithImmer<IRobotTrigger | undefined>(undefined);
const automationHistoryAtom = atomWithImmer<{
  dialogVisible: boolean;
  taskId?: string;
}>({
  dialogVisible: false,
});

export enum PanelName {
  BasicInfo = 'basic_info',
  Trigger = 'trigger',
  Action = 'action',
}

const automationPanelAtom = atomWithImmer<{
  panelName: PanelName;
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
}>({
  panelName: PanelName.BasicInfo,
});

export { automationStateAtom, showAtomDetailModalAtom, automationHistoryAtom, automationPanelAtom, automationTriggerAtom, automationModifiedAtom };
