import { IJOTAction, IOperation, jot, IAnyAction } from 'engine/ot';
import { xor, cloneDeep } from 'lodash';
import { FieldType, IField, ILinkField, ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { IRecordMap, IReduxState, ISnapshot } from 'store';
import { fastCloneDeep, getNewId, getUniqName, IDPrefix, ActionType, parseAction } from 'utils';
import { getField, getSnapshot, getDatasheet } from 'store/selector';
import { DatasheetActions } from 'model/datasheet';
import { createNewField, setField } from 'commands/common/field';
import { TextField } from 'model/field/text_field';
import { Events, Player } from 'player';
import { Field } from 'model';

export interface IRollback {
  // 注意 operations 此 operation 顺序是反序，新的在前面，旧的在后面
  operations: IOperation[];
}

export interface IRollbackOptions {
  cmd: CollaCommandName.Rollback;
  datasheetId: string;
  data: IRollback;
}

export const getRollbackActions = (operations: IOperation[], state: IReduxState, snapshot: ISnapshot) => {
  return operations.reduce((collect, op) => {
    const needIgnoreActionFlag = { field: {}, record: {}};
    // 先恢复列相关的操作，确保后续检查设置单元格值的action能得到正确的校验结果
    const updateFieldActions: IAnyAction[] = [];
    const addFieldActions: IAnyAction[] = [];
    const otherActions: IAnyAction[] = [];
    op.actions.forEach((action) => {
      const { type } = parseAction(action as IAnyAction);
      if ([ActionType.UpdateField, ActionType.DelField].includes(type)) {
        updateFieldActions.push(action);
      } else if (type === ActionType.AddField) {
        addFieldActions.push(action);
      } else {
        otherActions.push(action);
      }
    });
    const sortedActions = [...updateFieldActions, ...otherActions, ...addFieldActions];
    sortedActions.forEach(item => {
      const action = item as IAnyAction;
      if (['comments', 'commentCount'].includes(action.p[2])) {
        return;
      }
      const res = parseAction(action);
      // 原字段为link，恢复的时候则会插入link字段，若已找不到对应的关联表，则忽略恢复此数据
      if ([ActionType.UpdateField, ActionType.DelField].includes(res.type)) {
        const oldField = action.od;
        if (oldField.type === FieldType.Link && oldField.property.foreignDatasheetId) {
          const foreDatasheet = getDatasheet(state, oldField.property.foreignDatasheetId);
          if (!foreDatasheet) {
            needIgnoreActionFlag.field[oldField.id] = true;
            return;
          }
        }
      }
      // 删除column时，如果已经标记需要忽略对应的字段，则不恢复数据
      if (res.type === ActionType.DelColumn) {
        if (needIgnoreActionFlag.field[res.context.fieldId!]) {
          return;
        }
      }

      // 设置单元格值，但是字段和要设置值的类型不匹配需忽略
      if (res.type === ActionType.UpdateRecord) {
        const fieldId = res.context.fieldId!;
        const recordId = res.context.recordId!;
        if (needIgnoreActionFlag.field[fieldId] || needIgnoreActionFlag.record[recordId]) {
          return;
        }
        const oldData = action.od;
        const field = snapshot.meta.fieldMap[fieldId];
        if (!field) {
          return;
        }
        const validError = Field.bindContext(field, state).validateCellValue(oldData).error;
        if (validError && !validError.message.endsWith('is required')) {
          return;
        }
      }
      try {
        const invertActions = jot.invert([action as unknown as IJOTAction]) as IJOTAction[];
        jot.apply(snapshot, invertActions);
        collect.push(...invertActions);
      } catch (error) {
        Player.doTrigger(Events.app_error_logger, {
          error: new Error(`时光机回滚错误：${error}`),
          metaData: {
            actions: [action],
            snapshot,
          },
        });
      }
      return true;
    });
    return collect;
  }, [] as IJOTAction[]);
};

export const rollback: ICollaCommandDef<IRollbackOptions> = {

  undoable: false,

  execute: (context, options) => {
    const { model: state } = context;
    const { datasheetId, data } = options;
    const { operations } = data;
    const preDatasheet = getDatasheet(state, datasheetId);
    if (!preDatasheet) {
      return null;
    }
    /* 1. [apply], 依次将 逆转actions 并应用到一份克隆的 snapshot 上，获得最初版的回滚快照 */
    const preSnapshot = preDatasheet.snapshot;
    const postSnapshot = fastCloneDeep(preSnapshot);
    const actions = getRollbackActions(operations, state, postSnapshot);

    console.log(postSnapshot, preSnapshot);
    if (!actions.length) {
      return null;
    }

    // 将 actions 收集起来
    const linkedActions: ILinkedActions[] = [];

    function setLinkedActions(datasheetId: string, actions: IJOTAction[]) {
      if (!actions.length) {
        return;
      }

      const la = linkedActions.find(la => la.datasheetId === datasheetId);
      if (la) {
        la.actions.push(...actions);
      } else {
        linkedActions.push({
          datasheetId,
          actions,
        });
      }
    }

    /* 2. [diff], apply 过后的 snapshot 与之前的 snapshot 作对比，取出变化的 link 字段，并生成对关联表的字段变更 */
    const { deletedLinkFields, newLinkFields, normalLinkFields } = getLinkFieldChange(preSnapshot.meta.fieldMap, postSnapshot.meta.fieldMap);

    console.log({ deletedLinkFields, newLinkFields, normalLinkFields });
    /* 3. [patch], 所有关联字段重新建立好双向关联，并对数据进行关联对齐 */
    deletedLinkFields.forEach(sourceField => {
      const foreignDatasheetId = sourceField.property.foreignDatasheetId;
      const foreignSnapshot = getSnapshot(state, foreignDatasheetId)!;
      const foreignField = getField(state, sourceField.property.brotherFieldId!, foreignDatasheetId);
      const actions = setField(context, foreignSnapshot, foreignField, {
        id: foreignField.id,
        name: foreignField.name,
        type: FieldType.Text,
        property: TextField.defaultProperty(),
      }).actions;
      setLinkedActions(foreignDatasheetId, actions);
    });

    const newForeignField = newLinkFields.map(sourceField => {
      const foreignDatasheetId = sourceField.property.foreignDatasheetId;
      let brotherFieldId = sourceField.property.brotherFieldId!;
      const foreignSnapshot = getSnapshot(state, foreignDatasheetId)!;
      if(!foreignSnapshot){
        // 单向关联
        return;
      }
      const foreignField = getField(state, brotherFieldId, foreignDatasheetId);

      const foreignFieldIds = Object.keys(foreignSnapshot.meta.fieldMap);

      /**
       * newLinkFields 对应的 brotherFieldId 还在关联表中存在, 并且关联字段不为纯文本，则需要修改 brotherFieldId 创建新的关联字段
       * 否则将关联表的字段类型设置为神奇关联类型。
       */
      if (foreignField && foreignField.type !== FieldType.Text) {
        brotherFieldId = getNewId(IDPrefix.Field, foreignFieldIds);
        /** 深度克隆一份避免下面的 DatasheetActions.setFieldAttr2Action 方法得到的ac oi和od 为相同的值。
         * 从而避免中间层做OT转换的时候会出现od时，找不到关联表fieldMap对应的值
         */
        sourceField = cloneDeep(sourceField);
        sourceField.property.brotherFieldId = brotherFieldId;

        const ac = DatasheetActions.setFieldAttr2Action(postSnapshot, {
          field: sourceField
        });
        if (ac) {
          actions.push(ac);
          jot.apply(postSnapshot, [ac]);
        }
        const newField: ILinkField = {
          id: brotherFieldId,
          type: FieldType.Link,
          name: getUniqName(preDatasheet.name, foreignFieldIds.map(id => foreignSnapshot.meta.fieldMap[id].name)),
          property: {
            foreignDatasheetId: datasheetId,
            brotherFieldId: sourceField.id,
          }
        };

        const newFieldActions = createNewField(foreignSnapshot, newField);

        setLinkedActions(foreignDatasheetId, newFieldActions);
        return newField;
      }

      const modifiedField: ILinkField = {
        ...foreignField,
        type: FieldType.Link,
        property: {
          foreignDatasheetId: datasheetId,
          brotherFieldId: sourceField.id,
        }
      };

      const { actions: modifiedFieldActions } = setField(context, foreignSnapshot, foreignField, modifiedField);
      setLinkedActions(foreignDatasheetId, modifiedFieldActions);
      return sourceField;
    });

    newLinkFields.forEach((sourceField, index) => {
      console.log('newLinkFields: ', sourceField);
      if(!newForeignField[index]){
        // 单向关联
        return;
      }
      const result = patchFieldValues(state, postSnapshot, sourceField, newForeignField[index]);
      actions.push(...result.sourceActions);
      setLinkedActions(sourceField.property.foreignDatasheetId, result.foreignActions);
    });

    normalLinkFields.forEach(sourceField => {
      const result = patchFieldValues(state, postSnapshot, sourceField);
      actions.push(...result.sourceActions);
      setLinkedActions(sourceField.property.foreignDatasheetId, result.foreignActions);
    });

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
    };
  },
};

/**
 * 获得新增的和删除的关联字段数组
 * @param preFieldMap 回滚前的 fieldMap
 * @param postFieldMap 回滚后的 fieldMap
 * @return deletedLinkFields 回滚后被删除的关联字段
 * @return newLinkFields 回滚后新增的
 * @return normalLinkFields 回滚还存在的关联字段
 */
function getLinkFieldChange(preFieldMap: Record<string, IField>, postFieldMap: Record<string, IField>) {
  let deletedLinkFields: ILinkField[] = [];
  let newLinkFields: ILinkField[] = [];
  let normalLinkFields: ILinkField[] = [];
  /**
   * 三种情况被视为 deletedLinkFields，preFieldMap 拿到一个字段后在 postFieldMap 里用 fieldId 匹配
   * pre 是 linkField，post 里匹配不到这个 field
   * pre 是 linkField，post 里被转换了不是 link 字段
   * pre 是 linkField，post 里被转换成了另一个 link 字段，或者兄弟字段不一致，（此时 post 里的link 字段视为新增）
   *
   * 三种种情况被视为 newLinkFields
   * post 是 linkField， pre 中不存在这个 field
   * post 是 linkField， pre 不是 linkField
   * pre 是 linkField，post 里被转换成了另一个 link 字段，或者兄弟字段不一致，（同上面第三条）
   *
   * 一种情况被视为 normalLinkFields
   * pre 和 post 中都存在，并且关联的表和兄弟字段都没变
   */
  Object.values(preFieldMap).forEach(preField => {
    const postField = postFieldMap[preField.id];
    // post 是 linkField, pre 不是 linkField 需要往newLinkFields push 一条记录；
    if (postField && postField.type === FieldType.Link) {
      if (preField && preField.type !== FieldType.Link) {
        newLinkFields.push(postField);
        return;
      }
    }
    // pre 不是 linkField 先过滤掉
    if (preField.type !== FieldType.Link) {
      return;
    }

    // post 里匹配不到这个 field
    if (!postField) {
      deletedLinkFields.push(preField);
      return;
    }

    // post 里被转换了不是 link 字段
    if (postField.type !== FieldType.Link) {
      deletedLinkFields.push(preField);
      return;
    }

    // post 里关联的不是同一个表
    if (preField.property.foreignDatasheetId !== postField.property.foreignDatasheetId) {
      deletedLinkFields.push(preField);
      newLinkFields.push(postField);
      return;
    }

    // post 里关联的是同一个表，但是兄弟字段不是同一个
    if (preField.property.brotherFieldId !== postField.property.brotherFieldId) {
      deletedLinkFields.push(preField);
      newLinkFields.push(postField);
      return;
    }

    // pre 和 post 中都存在，并且关联的表和兄弟字段都没变
    normalLinkFields.push(postField);
  });

  // post 是 linkField， pre 中不存在这个 field
  const newInPostFields = Object.values(postFieldMap).filter(postField => !preFieldMap[postField.id] && postField.type === FieldType.Link);
  newLinkFields.push(...newInPostFields as ILinkField[]);

  // 过滤掉 brotherFieldId 为空的 field，也就是自表关联的 field
  deletedLinkFields = deletedLinkFields.filter(field => field.property.brotherFieldId);
  newLinkFields = newLinkFields.filter(field => field.property.brotherFieldId);
  normalLinkFields = normalLinkFields.filter(field => field.property.brotherFieldId);

  return { deletedLinkFields, newLinkFields, normalLinkFields };
}

// 提供 sourceLinkField, 将关联表对应的 field 中的 cellValue 对齐双向关联
function patchFieldValues(
  state: IReduxState,
  sourceSnapshot: ISnapshot,
  sourceField: IField,
  // 关联表新增的 field 不在snapshot 中，需要补充传入
  isolateForeignField?: ILinkField
): {
  sourceActions: IJOTAction[];
  foreignActions: IJOTAction[];
} {
  const foreignDatasheetId = sourceField.property.foreignDatasheetId;
  const foreignSnapshot = getSnapshot(state, foreignDatasheetId)!;
  const foreignField = isolateForeignField || getField(state, sourceField.property.brotherFieldId!, foreignDatasheetId);
  // 生成兄弟字段需要的值
  const foreignLinkRecordValueMap: Record<string, string[]> = {};
  const foreignActions: IJOTAction[] = [];
  const sourceActions: IJOTAction[] = [];
  function eachFieldValue(fieldId: string, recordMap: IRecordMap, cb: (rid: string, v?: string[]) => void) {
    for (const recordId in recordMap) {
      const record = recordMap[recordId];
      const linkCellValue = record.data && record.data[fieldId];
      cb(recordId, linkCellValue as string[] | undefined);
    }
  }

  // 以 postField 为依据生成关联列的值映射
  eachFieldValue(sourceField.id, sourceSnapshot.recordMap, (recordId, linkCellValue) => {
    if (!linkCellValue) {
      return;
    }
    const filteredLinkCellValue = linkCellValue.filter(rid => {
      // 如果关联单元格汇总 rid 在关联表不存在，则删掉这条 rid
      if (!foreignSnapshot.recordMap[rid]) {
        return false;
      }
      if (foreignLinkRecordValueMap[rid]) {
        foreignLinkRecordValueMap[rid].push(recordId);
      } else {
        foreignLinkRecordValueMap[rid] = [recordId];
      }
      return true;
    });
    if (filteredLinkCellValue.length !== linkCellValue.length) {
      const action = DatasheetActions.setRecord2Action(sourceSnapshot, {
        fieldId: sourceField.id,
        recordId: recordId,
        value: filteredLinkCellValue,
      });
      action && sourceActions.push(action);
    }
  });

  console.log({ foreignLinkRecordValueMap });

  // 遍历关联表，把存在的替换，不存在的删除，缺失的补充
  foreignSnapshot && eachFieldValue(foreignField.id, foreignSnapshot.recordMap, (recordId, linkCellValue) => {
    let action: IJOTAction | null = null;
    const newCellValue = foreignLinkRecordValueMap[recordId];
    if (newCellValue) {
      // 数组中存在不同的值才需要替换
      if (xor(linkCellValue, newCellValue)) {
        action = DatasheetActions.setRecord2Action(foreignSnapshot, {
          fieldId: foreignField.id,
          recordId: recordId,
          value: newCellValue,
        });
      }
    } else {
      action = DatasheetActions.setRecord2Action(foreignSnapshot, {
        fieldId: foreignField.id,
        recordId: recordId,
        value: null,
      });
    }
    action && foreignActions.push(action);
  });

  console.log({ sourceActions, foreignActions });
  return { sourceActions, foreignActions };
}
