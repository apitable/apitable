import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext, ILinkedActions } from 'command_manager';
import { isEqual } from 'lodash';
import { Selectors } from 'store';
import { ISnapshot } from 'store/interface';
import { getDatasheet, getFieldMap } from 'store/selector';
import { FieldType, IField } from 'types/field_types';
import { IJOTAction } from 'engine';
import { Strings, t } from 'i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { clearOldBrotherField, createNewBrotherField, IInternalFix, setField } from '../common/field';
import { Field } from 'model/field';
import { DatasheetActions } from '../../model';

export interface ISetFieldAttrOptions {
  cmd: CollaCommandName.SetFieldAttr;
  datasheetId?: string;
  fieldId: string;
  deleteBrotherField?: boolean;
  data: IField;
  internalFix?: IInternalFix;
}

function generateLinkedFieldActions(
  context: ICollaCommandExecuteContext, snapshot: ISnapshot,
  oldField: IField, newField: IField, datasheetId: string, deleteBrotherField?: boolean,
  internalFix?: IInternalFix,
): { actions: IJOTAction[], linkedActions?: ILinkedActions[] } {
  const actions: IJOTAction[] = [];
  const linkedActions: ILinkedActions[] = [];
  const { model: state } = context;
  if (oldField.type === FieldType.Link && newField.type === FieldType.Link) {
    // 关联的表 id 没有变化，则不需要执行相关操作。
    if (oldField.property.foreignDatasheetId === newField.property.foreignDatasheetId) {
      return setField(context, snapshot, oldField, newField, datasheetId);
    }
  }

  if (oldField.type === FieldType.Link) {
    const clearedActions = clearOldBrotherField(context, oldField, deleteBrotherField);
    clearedActions && linkedActions.push(clearedActions);
  }

  if (newField.type === FieldType.Link) {
    const createdActions = createNewBrotherField(state, newField, datasheetId);
    createdActions && linkedActions.push(createdActions);
  }

  if (FieldType.Text === newField.type && internalFix?.clearOneWayLinkCell) {
    const fieldId = oldField.id;
    // 清理单向关联单元格内容
    if (snapshot.meta.fieldMap[fieldId]) {
      for (const recordId in snapshot.recordMap) {
        const action = DatasheetActions.setRecord2Action(snapshot, { recordId, fieldId, value: null });
        action && actions.push(action);
      }
    }
  }

  const newFieldData = setField(context, snapshot, oldField, newField, datasheetId);
  actions.push(...newFieldData.actions);
  return { actions: actions, linkedActions };
}

export const setFieldAttr: ICollaCommandDef<ISetFieldAttrOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const activeDatasheetId = Selectors.getActiveDatasheetId(state)!;
    const { fieldId, datasheetId = activeDatasheetId, deleteBrotherField, internalFix } = options;
    const newField = { ...options.data };
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot || fieldId !== newField.id) {
      return null;
    }

    const fieldMap = getFieldMap(state, datasheetId)!;
    const oldField = fieldMap[fieldId];
    if (!oldField) {
      return null;
    }
    /* 检查是否重名 */
    const duplicate = Object.values(fieldMap).some(f => {
      return f.id !== options.fieldId && f.name === options.data.name;
    });
    if (duplicate) {
      throw new Error(t(Strings.error_set_column_failed_duplicate_column_name));
    }

    if (
      oldField.type === FieldType.NotSupport ||
      newField.type === FieldType.NotSupport
    ) {
      throw new Error(t(Strings.error_set_column_failed_no_support_unknown_column));
    }

    if (
      oldField.type === newField.type &&
      oldField.name === newField.name &&
      oldField.desc === newField.desc &&
      oldField.required === newField.required &&
      isEqual(oldField.property, newField.property)
    ) {
      return null;
    }

    // 兼容线上部分字段 defaultValue 为 null 导致的报错
    if (
      [FieldType.Currency, FieldType.Percent, FieldType.Number].includes(newField.type) &&
      newField.property.defaultValue === null
    ) {
      newField.property = { ...newField.property, defaultValue: '' };
    }

    // AutoNumber 需要记录当前视图索引
    if (newField.type === FieldType.AutoNumber) {
      const datasheet = getDatasheet(state);
      const viewIdx = snapshot.meta.views.findIndex(item => item.id === datasheet?.activeView) || 0;
      newField.property = { ...newField.property, viewIdx };
    }

    // 保证以下字段的property一定有datasheetId
    if (
      !newField.property?.datasheetId &&
      [FieldType.AutoNumber, FieldType.CreatedBy, FieldType.CreatedTime, FieldType.LastModifiedBy, FieldType.LastModifiedTime].includes(newField.type)
    ) {
      newField.property = { ...newField.property, datasheetId };
    }

    // 修改关联字段时，要进行关联表的兄弟字段数据的维护
    if (oldField.type === FieldType.Link || newField.type === FieldType.Link) {
      const validateFieldPropertyError = Field.bindContext(newField, state).validateProperty().error;
      if (validateFieldPropertyError) {
        throw new Error(`${t(Strings.error_set_column_failed_bad_property)}: ${validateFieldPropertyError.details.map(d => d.message).join(',\n')}`);
      }
      const result = generateLinkedFieldActions(context, snapshot, oldField, newField, datasheetId, deleteBrotherField, internalFix);
      const linkedActions = result.linkedActions || [];

      return {
        result: ExecuteResult.Success,
        resourceId: datasheetId,
        resourceType: ResourceType.Datasheet,
        actions: result.actions,
        linkedActions,
      };
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions: setField(context, snapshot, oldField, newField, datasheetId).actions,
    };
  },
};
