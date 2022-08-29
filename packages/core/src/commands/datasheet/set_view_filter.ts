import { IJOTAction } from 'engine/ot';
import { DatasheetActions } from 'model';
import { getActiveDatasheetId, getDatasheet } from 'store/selector';
import { IFilterInfo, ResourceType } from 'types';
import { Strings, t } from 'i18n';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

export interface ISetViewFilterOptions {
  cmd: CollaCommandName.SetViewFilter;
  data?: IFilterInfo;
  viewId: string;
}

export const setViewFilter: ICollaCommandDef<ISetViewFilterOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const { data, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);

    if (!state || !datasheet) {
      return null;
    }

    // 判断当前操作的view是否是激活的view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_filter_failed_wrong_target_view));
    }

    const actions: IJOTAction[] = [];
    const setFilterInfoAction = DatasheetActions.setFilterInfo2Action(datasheet.snapshot, { viewId, filterInfo: data });

    // action && collected.push(action);
    setFilterInfoAction && actions.push(setFilterInfoAction);
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
/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: ISetRecordsOptions & { cmd: 'SetRecords' });
 }
 }

 */
