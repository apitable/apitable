import { AnyAction, Store } from 'redux';
import { IFieldMap, IReduxState, Selectors } from 'store';
import { IJOTAction } from 'engine';
import { Field, ICellValue } from 'model';
import produce from 'immer';
import { FieldType, IField } from 'types';

export class CellFormatChecker {
  constructor(private store: Store<IReduxState, AnyAction>) {}

  static checkValueValid(cellValue: any, field: IField, state: IReduxState) {
    if (Field.bindContext(field, state).validate(cellValue)) {
      return cellValue;
    }
    return null;
  }

  private convertValue(fieldId: string, recordId: string, cellValue: ICellValue, fieldMapSnapshot: IFieldMap, datasheetId: string) {
    const state = this.store.getState();
    const currentField = Selectors.getField(state, fieldId, datasheetId);
    const previousField = fieldMapSnapshot[fieldId];
    if (fieldMapSnapshot[currentField.id].type === currentField.type) {
      return CellFormatChecker.checkValueValid(cellValue, currentField, state);
    }

    const stdValue = Field.bindContext(previousField, state).cellValueToStdValue(cellValue);
    const result = Field.bindContext(currentField, state).stdValueToCellValue(stdValue);

    // 因为已经对数据做了修正，所以同时会对旧的数据结构做更新，避免数据正确，记录的 FieldType 还是错误，导致中间层报错
    fieldMapSnapshot[currentField.id] = currentField;

    if (cellValue && !result && currentField.type === FieldType.Link) {
      // 修复由于本表缺少关联 op 导致的数据异常
      return Selectors.getCellValue(state, Selectors.getSnapshot(state)!, recordId, currentField.id);
    }

    return result;
  }

  parse(actions: IJOTAction[], datasheetId: string, fieldMapSnapshot?: IFieldMap) {
    if (!fieldMapSnapshot) {
      return actions;
    }
    const fieldIds = Object.keys(fieldMapSnapshot);
    return produce<IJOTAction[]>(actions, draft => {
      for (const action of draft) {
        if (!action.p.includes('recordMap')) {
          continue;
        }
        if (!action['oi']) {
          continue;
        }
        const recordId = action.p[1] as string;
        if (action.p.length === 4) {
          if (!fieldIds.includes(action.p[3] as string)) {
            continue;
          }
          const fieldId = action.p[3] as string;
          const cellValue = action['oi'];

          action['oi'] = this.convertValue(fieldId, recordId, cellValue, fieldMapSnapshot, datasheetId);
        }
        if (action.p.length === 2 && 'data' in action['oi']) {

          for (const fieldId of fieldIds) {
            const cellValue = action['oi'].data[fieldId];

            action['oi'].data[fieldId] = this.convertValue(fieldId, recordId, cellValue, fieldMapSnapshot, datasheetId);
          }
        }
      }

      return draft;
    });
  }
}

