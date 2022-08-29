import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { CollaCommandName } from 'commands';
import { ConfigConstant } from 'config';
import { IJOTAction } from 'engine/ot';
import { isEmpty, isEqual, isNumber, isString } from 'lodash';
import { DatasheetActions, Field, handleEmptyCellValue, ICellValue } from 'model';
import { IRecordAlarm, Selectors } from 'store';
import { ResourceType, WithOptional } from 'types';
import { FieldType, IField, IUnitIds } from 'types/field_types';
import { getNewId, IDPrefix, num2number, str2number } from 'utils';
import { IInternalFix } from '../common/field';

export interface ISetRecordOptions {
  recordId: string;
  fieldId: string;
  field?: IField; // 可选，传入 field 信息。适用于在还没有应用到 snapshot 的 field 上 addRecords
  value: ICellValue;
}

export interface ISetRecordsOptions {
  cmd: CollaCommandName.SetRecords;
  datasheetId?: string;
  alarm?: WithOptional<IRecordAlarm, 'id'>;
  data: ISetRecordOptions[];
  mirrorId?: string;
  internalFix?: IInternalFix;
}

function collectMemberProperty(datasheetId: string, actions: IJOTAction[], context: ICollaCommandExecuteContext) {
  const { model: state, memberFieldMaintainer } = context;
  const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
  const isAddFieldAction = actions.map(item => item.p[3]).some(fieldId => !fieldMap[fieldId]);
  if (isAddFieldAction) {
    return actions;
  }
  const memberFieldIds: string[] = [];
  const unitIdsMap: Map<string, IUnitIds> = new Map();

  // 检查当前的 OP 里是否存在对成员字段的修改，如果有，
  // 将 OI（写入）的数据收集起来放入 operateRecordIds ，也把相关的 fieldId 收集起来放入 memberFieldIds
  actions.forEach(item => {
    const fieldId = item.p[3] as string;
    const field = fieldMap[fieldId];

    if (field.type !== FieldType.Member) {
      return;
    }

    memberFieldIds.push(fieldId);

    // op 中存在 oi 和 od ，如果只有 od 就是删除数据，没有必要在收集
    if ('oi' in item) {
      const existValue = unitIdsMap.get(fieldId) || [];
      unitIdsMap.set(fieldId, [...new Set([...existValue, ...item['oi']])]);
    }
  });

  // 将根据 fieldId 收集到的数据，放入相应的 field 的 property 中
  memberFieldIds.forEach(fieldId => {
    const collectUnitIds = unitIdsMap.get(fieldId) || [];
    const field = fieldMap[fieldId];
    // 成员的 unitIds 都是动态计算的，在看板中会导致看板的位置发生变化，因此在数据的收集中，现将 property 中存储的 unitIds 和 收集到的单元格的所有数据合并，去重，
    // 这样能保证 unitIds 中的已有的数据顺序不发生变化，再以该结果和收集到的数据做「交集」 处理，取出相同的部分（i.e. 也就是从单元格手机的数据，但是保证了原来的 unitIds 的数据顺序）
    const unDuplicateArray = [...new Set([...field.property.unitIds, ...collectUnitIds])];
    const newProperty = unDuplicateArray.filter(item => item);
    memberFieldMaintainer.insert(fieldId, newProperty as string[], datasheetId);
  });
  return actions;
}

export const setRecords: ICollaCommandDef<ISetRecordsOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state, ldcMaintainer, fieldMapSnapshot } = context;
    const { data: _data, internalFix, alarm } = options;
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const mirrorId = options.mirrorId;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);

    if (!snapshot) {
      return null;
    }

    const data = _data.filter(item => {
      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, item.fieldId);
      if (fieldRole && fieldRole !== ConfigConstant.Role.Editor) {
        return false;
      }
      return true;
    });

    if (isEmpty(data)) {
      return null;
    }

    const fieldMap = snapshot.meta.fieldMap;
    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { recordId, fieldId, field: fieldProp } = recordOption;
      const field = fieldMap[fieldId] || fieldProp;
      let value = recordOption.value;

      // field 不存在，数据不生效
      if (!field || !Field.bindContext(field, state).recordEditable(datasheetId, mirrorId) && !internalFix?.anonymouFix) {
        return collected;
      }

      // 数字/货币/百分比 字段需要特殊处理，字符串转数字，数字有效位数等
      if (field.type === FieldType.Number || field.type === FieldType.Currency || field.type === FieldType.Percent) {
        if (isString(value)) {
          value = str2number(value);
        } else if (isNumber(value)) {
          value = num2number(value);
        } else {
          value = null;
        }
      }

      // 线上会有一部分数据存在问题，自表关联的情况也会存在 brotherFieldId ，导致多余的 action 存在
      if (field.type === FieldType.Link && field.property.brotherFieldId && field.property.foreignDatasheetId !== datasheetId) {
        /**
         * 关联字段单元格数据一致性维护：
         * 保证相互关联的两个不同 datasheet 中的 brotherField 中单元格数据的相互关联一致性。
         * 即：当在一个 datasheet 的关联字段单元格中增加一条关联记录。则被关联的 datasheet 兄弟字段中，要创建一条对应的关联关系。
         *    删除一个记录的时候也是同理。
         */
        const oldValue = Selectors.getCellValue(state, snapshot, recordId, fieldId) as string[] | null;
        const linkedSnapshot = Selectors.getSnapshot(state, field.property.foreignDatasheetId)!;
        ldcMaintainer.insert(
          state,
          linkedSnapshot,
          recordId,
          field,
          value as string[] | null,
          oldValue,
        );
      }

      // 如果 val.value 为空数组则转为 null
      value = handleEmptyCellValue(value, Field.bindContext(field, state).basicValueType);
      fieldMapSnapshot[field.id] = field;
      const action = DatasheetActions.setRecord2Action(snapshot, { recordId, fieldId, value });
      action && collected.push(action);

      if (field.type === FieldType.DateTime) {
        const cacheAlarm = Selectors.getDateTimeCellAlarm(snapshot, recordId, field.id);
        /**
         * 移除闹钟
         * 1. 删除日期单元格数据
         * 2. 日期单元格有数据直接移除闹钟
         */
        if ((value === null && cacheAlarm) || (Boolean(value) && cacheAlarm && !alarm)) {
          const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId,
            alarm: null,
          });
          if (alarmActions) {
            collected.push(...alarmActions);
          }
        } else if (Boolean(value) && !cacheAlarm && Boolean(alarm)) { // 新增闹钟
          const newAlarmId = getNewId(IDPrefix.DateTimeAlarm);
          const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId,
            alarm: {
              ...alarm!,
              id: newAlarmId,
            },
          });
          if (alarmActions) {
            collected.push(...alarmActions);
          }
        } else if (Boolean(value) && !isEqual(cacheAlarm, alarm)) { // 修改闹钟
          const alarmActions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
            recordId,
            fieldId,
            alarm: {
              ...cacheAlarm!,
              ...alarm!,
            },
          });
          if (alarmActions) {
            collected.push(...alarmActions);
          }
        }
      }

      return collected;
    }, []);

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions: collectMemberProperty(datasheetId, actions, context),
      fieldMapSnapshot
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
