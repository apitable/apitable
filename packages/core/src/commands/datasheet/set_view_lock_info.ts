import { IJOTAction } from 'engine/ot';
import { DatasheetActions } from 'model';
import { getActiveDatasheetId, getDatasheet } from '../../store/selectors';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { IViewLockInfo } from 'store';

export interface ISetViewLockInfo {
  cmd: CollaCommandName.SetViewLockInfo;
  data: null | IViewLockInfo;
  viewId: string;
}

export const setViewLockInfo: ICollaCommandDef<ISetViewLockInfo> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const { data, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);

    if (!state || !datasheet) {
      return null;
    }

    const actions: IJOTAction[] = [];
    const setViewLockAction = DatasheetActions.setViewLockInfo2Action(datasheet.snapshot, { viewId, viewLockInfo: data });

    setViewLockAction && actions.push(setViewLockAction);
    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

