import { IJOTAction } from 'engine/ot';
import { DatasheetActions } from 'model';
import { getActiveDatasheetId, getCurrentView, getDatasheet, getFieldPermissionMap, getFieldRoleByFieldId } from 'store/selector';
import { IGridViewProperty, Role } from 'store/interface';
import { IGroupInfo, ResourceType } from 'types';
import { Strings, t } from 'i18n';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

export interface ISetGroupOptions {
  cmd: CollaCommandName.SetGroup;
  data?: IGroupInfo;
  viewId: string;
}

export const setGroup: ICollaCommandDef<ISetGroupOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const { data, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);
    const fieldIds = (getCurrentView(state, datasheetId)! as IGridViewProperty).columns.map(item => item.fieldId);
    const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);

    if (!state || !datasheet) {
      return null;
    }

    // 判断当前操作的view是否是激活的view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_group_failed_wrong_target_view));
    }

    const checkMissGroupField = () => {
      return data && data.filter(item => {
        // 由于权限原因导致的数据缺失是可预期的，不做处理
        if (getFieldRoleByFieldId(fieldPermissionMap, item.fieldId) === Role.None) {
          return false;
        }
        return !fieldIds.includes(item.fieldId);
      }).length;
    };

    // 检查分组使用的字段是否存在于当前视图
    if (checkMissGroupField()) {
      throw new Error(t(Strings.error_group_failed_the_column_not_exist));
    }

    const actions: IJOTAction[] = [];
    const setSortInfoAction = DatasheetActions.setGroupInfoField2Action(datasheet.snapshot, { viewId, groupInfo: data });
    setSortInfoAction && actions.push(setSortInfoAction);

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
