/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { AnyAction, Store } from 'redux';
import { IFieldMap, IReduxState } from 'exports/store/interfaces';
import { getSnapshot, getField } from 'modules/database/store/selectors/resource/datasheet/base';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { IJOTAction } from 'engine';
import { Field } from 'model/field';
import { ICellValue } from 'model/record';
import produce from 'immer';
import { FieldType, IField } from 'types';
import { OneWayLinkField } from '../model/field/one_way_link_field';

export class CellFormatChecker {
  constructor(private store: Store<IReduxState, AnyAction>) {}

  static checkValueValid(cellValue: any, field: IField, state: IReduxState) {
    const isValid = Field.bindContext(field, state).validate(cellValue);
    if (isValid) {
      return cellValue;
    }
    // One-way link invalid data needs to be filtered out
    if (field.type === FieldType.OneWayLink) {
      return (Field.bindContext(field, state) as OneWayLinkField).filterRecordIds(cellValue);
    }
    return null;
  }

  private convertValue(fieldId: string, recordId: string, cellValue: ICellValue, fieldMapSnapshot: IFieldMap, datasheetId: string) {
    const state = this.store.getState();
    const currentField = getField(state, fieldId, datasheetId);
    const previousField = fieldMapSnapshot[fieldId]!;
    if (fieldMapSnapshot[currentField.id]!.type === currentField.type) {
      return CellFormatChecker.checkValueValid(cellValue, currentField, state);
    }

    const stdValue = Field.bindContext(previousField, state).cellValueToStdValue(cellValue);
    const result = Field.bindContext(currentField, state).stdValueToCellValue(stdValue);

    // Because the data has been corrected,
    // the old data structure will be updated at the same time to prevent the data from being correct
    // and the recorded FieldType is still wrong, resulting in an error in the middle layer
    fieldMapSnapshot[currentField.id] = currentField;

    if (cellValue && !result && currentField.type === FieldType.Link) {
      // Fix the data exception caused by the lack of associated ops in this table
      return getCellValue(state, getSnapshot(state)!, recordId, currentField.id);
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

