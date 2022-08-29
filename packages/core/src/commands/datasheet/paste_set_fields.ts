import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { IJOTAction } from 'engine';
import { Field, TextField } from 'model';
import { Selectors, ViewType } from 'store';
import { IViewColumn } from 'store/interface';
import { getSelectRanges, getViewById, getVisibleColumns } from 'store/selector';
import { FieldType, ResourceType } from 'types';
import { IField, IStandardValue } from 'types/field_types';
import { fastCloneDeep, NamePrefix } from '../../utils';
import { CollaCommandName } from '..';
import { addFields } from './add_fields';
import { setFieldAttr } from './set_field_attr';

export interface IPasteSetFieldsOptions {
  cmd: CollaCommandName.PasteSetFields;
  viewId: string;
  column: number;
  fields: Omit<IField, 'id'>[];
  stdValues: IStandardValue[][];
}

export const pasteSetFields: ICollaCommandDef<IPasteSetFieldsOptions> = {
  undoable: true,
  execute: (context, options) => {
    const { model: state } = context;
    const { viewId, column, stdValues } = options;
    const { fields } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;

    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const view = getViewById(snapshot, viewId);
    const actions: IJOTAction[] = [];
    const linkedActions: ILinkedActions[] = [];
    // 目前只有 Grid 视图才有粘贴
    if (!view || ![ViewType.Grid, ViewType.Gantt].includes(view.type)) {
      return null;
    }

    if (isNaN(column) || column < 0) {
      return null;
    }

    const fieldCount = fields.length;
    const visibleColumns = getVisibleColumns(state);
    const columnsToPaste = visibleColumns.slice(column, column + fieldCount);
    if (columnsToPaste.length === 0) {
      return null;
    }

    const fieldMap = snapshot.meta.fieldMap;
    const { fieldPropertyEditable, fieldCreatable } = Selectors.getPermissions(state);

    function enrichColumnProperty(column: IViewColumn, stdValues: IStandardValue[]) {
      const oldField = fieldMap[column.fieldId];
      if (!fieldPropertyEditable) {
        return;
      }
      const newField = fastCloneDeep(oldField);
      if (newField.type === FieldType.Member) {
        return;
      }
      const newProperty = Field.bindContext(newField, state).enrichProperty(stdValues);
      if (newProperty === newField.property) {
        return;
      }
      const rst = setFieldAttr.execute(context, {
        cmd: CollaCommandName.SetFieldAttr,
        fieldId: column.fieldId,
        data: {
          ...newField,
          property: newProperty,
        },
      });
      if (rst && rst.result === ExecuteResult.Success) {
        actions.push(...rst.actions);
        rst.linkedActions && linkedActions.push(...rst.linkedActions);
      }
    }

    // 在只复制了一个单元格的情况下，要对选区列进行 enrich field property
    const singleCellPaste = stdValues.length === 1 && stdValues[0].length === 1;
    if (singleCellPaste) {
      const ranges = getSelectRanges(state)!;
      const range = ranges[0]!;
      const fields = Selectors.getRangeFields(state, range, datasheetId)!;
      let stdValue = stdValues[0][0];
      const data = stdValue.data.filter(d => d.text);
      stdValue = { ...stdValue, data };
      for (const field of fields) {
        enrichColumnProperty({ fieldId: field.id }, [stdValue]);
      }
    } else {
      for (let i = 0, ii = columnsToPaste.length; i < ii; i++) {
        const column = columnsToPaste[i];
        const stdValueField = stdValues.reduce((result, stdValueRow) => {
          const stdValue = stdValueRow[i];
          if (stdValue) {
            const data = stdValue.data.filter(d => d.text);
            result.push({ ...stdValue, data });
          }
          return result;
        }, []);
        enrichColumnProperty(column, stdValueField);
      }
    }

    // 有要扩增的列
    let newFields = fields.slice(columnsToPaste.length);
    // 没有 fieldCreatable 的权限不允许添加新的列
    if (fieldCreatable && newFields.length > 0) {
      const fieldNames = new Set<string>();
      for (const fieldId in fieldMap) {
        fieldNames.add(fieldMap[fieldId].name);
      }
      newFields = newFields.map(field => {
        const originName = field.name;
        // 传入的 fields 可能带有fieldId，为了保证与新建 field 的 id 不冲突，我们在这类把它强制删除掉。
        delete (field as any).id;
        let name = originName;
        let i = 1;
        if (!originName) {
          do {
            name = `${NamePrefix.Field} ${i++}`;
          } while (fieldNames.has(name));
        } else {
          while (fieldNames.has(name)) {
            name = `${originName} (${i++})`;
          }
        }
        fieldNames.add(name);
        if (field.type === FieldType.LookUp) {
          const relatedLinkFieldId = field.property.relatedLinkFieldId;
          if (!fieldMap[relatedLinkFieldId] || fieldMap[relatedLinkFieldId].type !== FieldType.Link) {
            return {
              name,
              type: FieldType.Text,
              property: TextField.defaultProperty(),
            };
          }
        }
        return {
          ...field,
          name,
        };
      });
      const rst = addFields.execute(context, {
        cmd: CollaCommandName.AddFields,
        data: newFields.map((field, index) => ({
          viewId: view.id,
          index: index + visibleColumns.length,
          data: field,
        })),
      });
      if (rst) {
        if (rst.result === ExecuteResult.Fail) {
          return rst;
        }
        actions.push(...rst.actions);
        rst.linkedActions && linkedActions.push(...rst.linkedActions);
      }
    }

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IPasteSetFieldsOptions & { cmd: 'PasteSetFields' }):
 ICollaCommandExecuteResult<IPasteSetFieldsOptions>;
 }
 }

 */
