import { ICollaCommandDef, ExecuteResult, ILinkedActions } from 'command_manager';
import { IJOTAction } from 'engine';
import { IGridViewProperty, Selectors } from 'store';
import { FieldType, IField } from 'types/field_types';
import { getNewIds, IDPrefix } from 'utils';
import { createNewBrotherField, createNewField, IInternalFix } from '../common/field';
import { CollaCommandName, fixOneWayLinkDstId } from '..';
import { Field, CreatedByField, getMaxFieldCountPerSheet, DatasheetActions } from 'model';
import { Strings, t } from 'i18n';
import { getDatasheet } from 'store/selector';
import { ResourceType } from 'types';
import { ISetRecordOptions, setRecords } from './set_records';

export interface IAddFieldOptions {
  viewId?: string;
  index: number;
  data: Omit<IField, 'id'> & { id?: string };
  // 触发新增列操作的 fieldId
  fieldId?: string;
  // 相对 fieldId 位置的偏移
  offset?: number;
  // 是否隐藏这个新创建的字段
  hiddenColumn?:boolean
}

export interface IAddFieldsOptions {
  cmd: CollaCommandName.AddFields;
  data: IAddFieldOptions[];
  datasheetId?: string;
  copyCell?: boolean;
  fieldId?: string;
  internalFix?: IInternalFix;
}

type IAddFieldResult = string;
export const addFields: ICollaCommandDef<IAddFieldsOptions, IAddFieldResult> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const activeDatasheetId = Selectors.getActiveDatasheetId(state)!;
    const { data, copyCell, internalFix, fieldId, datasheetId = activeDatasheetId } = options;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    const recordMap = snapshot!.recordMap;

    const maxFieldCountPerSheet = getMaxFieldCountPerSheet();

    if (!snapshot || data.length === 0) {
      return null;
    }
    const isOverLimit = data.length + snapshot.meta.views[0].columns.length > maxFieldCountPerSheet;
    if (isOverLimit) {
      throw new Error(t(Strings.columns_count_limit_tips, {
        column_limit: maxFieldCountPerSheet,
      }));
    }
    const newFieldIds = getNewIds(IDPrefix.Field, data.length, Object.keys(snapshot.meta.fieldMap));
    const frozenCountMap = new Map();

    let newFieldId = '';
    const linkedActions: ILinkedActions[] = [];
    const actions = data.reduce<IJOTAction[]>((collected, fieldOption, index) => {
      newFieldId = newFieldIds[index];
      const { index: columnIndex, viewId } = fieldOption;
      const view = snapshot.meta.views.find(view => view.id === viewId);
      const frozenColumnCount = (view as IGridViewProperty)?.frozenColumnCount;

      // 针对关联字段的特殊处理
      // 当新增的关联字段所关联的表无法在 state 中查询到的时候，此时无法建立一个关联关系。
      // 这里我们将这个字段直接转换为文本字段。
      if (
        fieldOption.data.type === FieldType.Link &&
        !Selectors.getDatasheet(state, fieldOption.data.property.foreignDatasheetId)
      ) {
        fieldOption = {
          ...fieldOption,
          data: {
            ...fieldOption.data,
            type: FieldType.Text,
            property: null,
          },
        };
      }

      const field: IField = {
        ...fieldOption.data,
        id: fieldOption.data.id ? fieldOption.data.id : newFieldId,
        property: fieldOption.data.property,
      };

      // 计算字段都需要通过field property 确定自己所在的 datasheet，在这里我们给他强行指定为当前 command 的 datasheetId
      if (Field.bindContext(field, state).isComputed) {
        field.property = {
          ...field.property,
          datasheetId,
        };
      }

      if (field.type === FieldType.Link) {
        field.property = { ...field.property, brotherFieldId: undefined };
        const linkedAction = createNewBrotherField(state, field);
        linkedAction && linkedActions.push(linkedAction);
      }

      // AutoNumber 需要记录当前的视图索引
      if (field.type === FieldType.AutoNumber) {
        const datasheet = getDatasheet(state);
        const viewIdx = snapshot.meta.views.findIndex(item => item.id === datasheet?.activeView) || 0;
        field.property = { ...field.property, viewIdx };
      }

      if (field.type === FieldType.CreatedBy || field.type === FieldType.LastModifiedBy) {
        const uuids = (Field.bindContext(field, state) as CreatedByField).getUuidsByRecordMap(recordMap);
        field.property = { ...field.property, uuids };
      }

      const selfCreateNewField = internalFix?.selfCreateNewField ?? true;
      // 特殊修复单向关联，如果为False本表不创建新字段
      if (selfCreateNewField) {
        const action = createNewField(snapshot, field, fieldOption);

        collected.push(...action);
      }

      if (copyCell) {
        const recordData = Object.keys(recordMap).reduce<ISetRecordOptions[]>((data, recordId) => {
          if (!fieldId) return data;
          const value = recordMap[recordId].data[fieldId];

          if (!value) return data;
          data.push({
            recordId,
            fieldId: newFieldId,
            field,
            value,
          });

          return data;
        }, []);

        const ret = setRecords.execute(context, {
          cmd: CollaCommandName.SetRecords,
          data: recordData,
          internalFix: internalFix,
        });

        if (ret && ret.result === ExecuteResult.Success) {
          collected.push(...ret.actions);
        }
      }

      if (internalFix?.changeOneWayLinkDstId && linkedActions.length) {
        const fixOneWayLinkData = {
          oldBrotherFieldId: snapshot.meta.fieldMap[fieldId!].property.brotherFieldId,
          newBrotherFieldId: linkedActions[0].actions[0]['li']['fieldId']
        };
        linkedActions[0].actions[linkedActions[0].actions.length - 1]['oi'].property.brotherFieldId = fieldId;
        // 修复单向关联列DstId
        const result = fixOneWayLinkDstId.execute(context, {
          cmd: CollaCommandName.FixOneWayLinkDstId,
          data: [fixOneWayLinkData],
          datasheetId: datasheetId,
          fieldId: fieldId!,
        });

        if (result && result.result === ExecuteResult.Success) {
          collected.push(...result.actions);
        }
      }

      if (frozenColumnCount && columnIndex < frozenColumnCount) {
        const count = (frozenCountMap.get(viewId) || frozenColumnCount) + 1;
        const action = DatasheetActions.setFrozenColumnCount2Action(snapshot, { viewId: viewId!, count: count });

        if (action) {
          frozenCountMap.set(viewId, frozenColumnCount + 1);
          collected.push(action);
        }
      }

      return collected;
    }, []);

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      data: newFieldId,
      actions,
      datasheetId,
      linkedActions,
    };
  },
};

/*

declare module 'command_manager/command_manager' {
  interface CollaCommandManager {
    execute(options: IAddFieldsOptions & { cmd: 'AddFields' });
  }
}

*/
