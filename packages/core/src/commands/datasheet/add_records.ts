import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { DatasheetActions, ICellValue } from 'model';
import { getNewIds, IDPrefix } from 'utils';
import { IJOTAction } from 'engine';
import { Selectors } from 'store';
import { FieldType, IField, ILinkField, ResourceType } from 'types';
import { Strings, t } from 'i18n';
import { CollaCommandName } from 'commands';
import { ConfigConstant } from 'config';

export interface IAddRecordsOptions {
  cmd: CollaCommandName.AddRecords;
  datasheetId?: string;
  viewId: string;
  index: number;
  count: number;
  groupCellValues?: ICellValue[];
  cellValues?: { [fieldId: string]: ICellValue }[]; // 填新增入单元格中的值，cellValues.length 必须等于 count;
  ignoreFieldPermission?: boolean;
}

export type IAddRecordsResult = string[];

export const addRecords: ICollaCommandDef<IAddRecordsOptions, IAddRecordsResult> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state, ldcMaintainer, memberFieldMaintainer, fieldMapSnapshot, subscribeUsageCheck } = context;
    const { viewId, index, count, groupCellValues, cellValues, ignoreFieldPermission } = options;
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state, datasheetId);
    if (!snapshot) {
      return null;
    }
    if (count <= 0 || isNaN(count)) {
      return null;
    }
    if (cellValues && cellValues.length !== count) {
      throw new Error(t(Strings.error_add_row_failed_wrong_length_of_value));
    }
    const recordIds = Object.keys(snapshot.recordMap);
    if (!state.pageParams.shareId) {
      subscribeUsageCheck('maxRowsPerSheet', recordIds.length);
      subscribeUsageCheck('maxRowsInSpace', state.space.curSpaceInfo?.recordNums);
    }

    const newRecordIds = getNewIds(IDPrefix.Record, count, recordIds.length ? recordIds : snapshot.meta.views[0].rows.map(item => item.recordId));
    const linkFieldIds: IField[] = [];

    const specialActions: IJOTAction[] = [];
    for (const fieldId in snapshot.meta.fieldMap) {
      const field = snapshot.meta.fieldMap[fieldId];
      if (field.type === FieldType.Link && field.property.brotherFieldId) {
        linkFieldIds.push(field);
      }
      if (field.type === FieldType.CreatedBy) {
        const uuids = field.property.uuids;
        const uuid = state.user.info && state.user.info['uuid'];
        if (uuid && !uuids.includes(uuid)) {
          const newField = {
            ...field,
            property: {
              ...field.property,
              uuids: [...uuids, uuid],
            },
          };
          const action = DatasheetActions.setFieldAttr2Action(snapshot, { field: newField });
          action && specialActions.push(action);
        }
      }
    }
    const memberFieldMap: { [key: string]: string[] } = {};
    const fieldMap = snapshot.meta.fieldMap;

    /**
     * 新增一条记录，该记录可能是一条空白记录，也可能存在一些初始化的数据，
     * 初始化的数据的数据来演有三部分：
     * 1. 复制一条记录，目标记录里原本就有的数据
     * 2. 存在筛选项，如果筛选值是一个确定的值，则会带上筛选项
     * 3. 存在分组项，在一个分组中添加记录，会带上该分组的数据
     * 假设添加一条记录，上面三部分都有相应的数据，则权重依次降低，也就是同一个字段，下一级来源的数据会被上一级来源的数据覆盖
     */
    const actions = newRecordIds.reduce<IJOTAction[]>((collected, recordId, i) => {
      const userInfo = state.user.info!;
      const newRecord = DatasheetActions.getDefaultNewRecord(state, snapshot, recordId, viewId, groupCellValues, userInfo);
      if (cellValues) {
        newRecord.data = Object.assign({}, newRecord.data, cellValues[i]);
      }

      /**
       * 新增一条记录，可能因为 筛选、分组、复制一行 的原因代入初始值，
       * 如果其中某一列设置了权限，且当前用户没有编辑权限，在设置数据时需要将相应列的数据过滤掉，
       * 因为所有的数据处理完都会经过这里，所以此处进行统一的过滤
       */
      if (fieldPermissionMap && !ignoreFieldPermission) {
        const _data = {};
        for (const fieldId in newRecord.data) {
          const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
          if (!fieldRole || fieldRole === ConfigConstant.Role.Editor) {
            _data[fieldId] = newRecord.data[fieldId];
          }
        }
        newRecord.data = _data;
      }

      /**
       * 如果添加的记录中，存在成员字段的数据，需要特殊处理。当前的逻辑，成员字段表头中会记录当前这一列存在的所有成员去重后的 unitId,
       * 所以在新增记录并且存在初始化数据，且数据中存在成员字段的内容，需要检查当前新增的 unitId 是否在表头中存在，如果不存在，则需要同步更新成员表头的数据
       */
      if (newRecord.data) {
        const _recordData = {};
        for (const [fieldId, cellValue] of Object.entries(newRecord.data)) {
          if (!fieldMap[fieldId]) {
            // 针对数据异常做的兼容处理，一部分模板中心的表里存在脏数据
            continue;
          }

          // 行记录中会存在已经不存在的列的数据，中间层加强校验之后，这部分数据会导致报错，所以这里只保留 fieldId 还存在的列数据
          _recordData[fieldId] = cellValue;
          fieldMapSnapshot[fieldId] = fieldMap[fieldId];

          if (fieldMap[fieldId].type !== FieldType.Member) {
            continue;
          }

          const unitIds = Array.isArray(cellValue) ? cellValue as string[] : [];

          if (!memberFieldMap[fieldId]) {
            memberFieldMap[fieldId] = [...unitIds];
            continue;
          }

          memberFieldMap[fieldId].push(...unitIds);
        }
        newRecord.data = _recordData;
      }

      const action = DatasheetActions.addRecord2Action(snapshot, {
        viewId,
        record: newRecord,
        index: index + i,
      });

      if (!action) {
        return collected;
      }

      linkFieldIds.forEach((field: ILinkField) => {
        const value = newRecord.data[field.id] as string[] | null;
        const linkedSnapshot = Selectors.getSnapshot(state, field.property.foreignDatasheetId)!;

        // 当关联字段单元格本身就没有值的时候，则什么都不用做
        if (!value) {
          return;
        }
        ldcMaintainer.insert(state, linkedSnapshot, newRecord.id, field, value, null);
      });
      collected.push(...action);

      return collected;
    }, []);
    for (const [fieldId, cellValueForUnitIds] of Object.entries(memberFieldMap)) {
      const field = fieldMap[fieldId];
      const unitIds = field.property.unitIds || [];
      const _unitIds = [...new Set([...unitIds, ...cellValueForUnitIds])];
      if (_unitIds.length === unitIds.length) {
        continue;
      }
      memberFieldMaintainer.insert(fieldId, _unitIds as string[], datasheetId);
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      data: newRecordIds,
      actions: [...actions, ...specialActions],
      fieldMapSnapshot,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IAddRecordsOptions & { cmd: 'AddRecords' }): ICollaCommandExecuteResult<IAddRecordsResult>;
 }
 }

 */
