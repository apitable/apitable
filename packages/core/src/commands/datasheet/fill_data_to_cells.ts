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

import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { IJOTAction } from 'engine';
import { zip } from 'lodash';
import { FillDirection, ICell, IRange } from 'model/view/range';
import { handleEmptyCellValue } from 'model/utils';
import { ICellValue } from 'model/record';
import { Field } from 'model/field';
import { IReduxState, ISnapshot } from '../../exports/store/interfaces';
import {
  getActiveDatasheetId,
  getSnapshot,
  getField,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { getCellMatrixFromRange } from 'modules/database/store/selectors/resource/datasheet/cell_range_calc';
import { getRangeFields } from 'modules/database/store/selectors/resource/datasheet/calc';
import { DateFormat, FieldType, IField, ResourceType } from 'types';
import { fastCloneDeep, transpose, getDate } from 'utils';
import { setFieldAttr } from './set_field_attr';
import { setRecords } from './set_records';
import dayjs from 'dayjs';

type ICopyPatterns = {
  type: 'copy';
};
type IArithmeticPatterns = {
  type: 'arithmetic';
  args: {diff: number}
};
type IDateArithmeticPatterns = {
  type: 'dateArithmetic';
  args: {dDiff: number, dUnit: string}
};
type IPatterns = ICopyPatterns | IArithmeticPatterns | IDateArithmeticPatterns;

const EARLIEST_DATE = -2177395200000; // time only supports up to 1901-01-01
const DELTA = 1e-12; // Tolerance when comparing floating-point numbers, EPSILON precision is too high

function patternFinder(selectCellCol: ICell[], fieldType: FieldType, state: IReduxState, snapshot: ISnapshot, field: IField):IPatterns {
  if (selectCellCol.length< 2) return { type: 'copy' };

  const nums: number[]= [];
  selectCellCol.forEach((selectCell)=>{
    let cellValue = getCellValue(state, snapshot, selectCell.recordId, selectCell.fieldId);
    cellValue = handleEmptyCellValue(cellValue, Field.bindContext(field, state).basicValueType);
    nums.push(cellValue);
  });
  if (nums.find(n=> n === null) === null) {return { type: 'copy' };}

  if (fieldType === FieldType.Number){
    if (Math.max(...nums) > (1e16 -1)){ return { type: 'copy' };}
    const diff = nums[1]! - nums[0]!;
    for (let i = 2; i < nums.length; i++) {
      const newDiff = nums[i]! - nums[i-1]!;
      if (Math.abs(newDiff - diff) > DELTA){
        return { type: 'copy' };
      }
    }
    return { type: 'arithmetic', args: { diff: diff } };
  } else if (fieldType === FieldType.DateTime){
    const { property: { includeTime, dateFormat } } = field;

    const _nums: number[] = includeTime ? nums : nums.map(getDate);

    // The format of the time is different without the corresponding calculation logic
    if (includeTime) { // When the specific point is reached
      const diff = _nums[1]! - _nums[0]!;
      for (let i = 2; i < _nums.length; i++) {
        const newDiff = _nums[i]! - _nums[i-1]!;
        if (Math.abs(newDiff - diff) > DELTA){
          return { type: 'copy' };
        }
      }
      return { type: 'dateArithmetic', args: { dDiff: diff, dUnit: 'time' } };
    }
    if ([DateFormat['YYYY/MM/DD'], DateFormat['YYYY-MM-DD'], DateFormat['DD/MM/YYYY'],
      DateFormat['MM-DD'], DateFormat['DD']].includes(dateFormat)) { // When the date arrives, the filled date defaults to 0:00
      const diff = dayjs(_nums[1]).diff(_nums[0]!, 'day');
      for (let i = 2; i < _nums.length; i++) {
        const newDiff = dayjs(_nums[i]).diff(_nums[i-1]!, 'day');
        if (Math.abs(newDiff - diff) > DELTA){
          return { type: 'copy' };
        }
      }
      return { type: 'dateArithmetic', args: { dDiff: diff, dUnit: 'day' } };
    } else if ([DateFormat['YYYY-MM'], DateFormat['MM']].includes(dateFormat)){
      // When it comes to the month, the filled date defaults to the 1st of the month
      const diff = dayjs(_nums[1]).diff(_nums[0]!, 'month');
      for (let i = 2; i < _nums.length; i++) {
        const newDiff = dayjs(_nums[i]).diff(_nums[i-1]!, 'month');
        if (Math.abs(newDiff - diff) > DELTA){
          return { type: 'copy' };
        }
      }
      return { type: 'dateArithmetic', args: { dDiff: diff, dUnit: 'month' } };
    } else if (dateFormat === DateFormat['YYYY']) { // When it comes to the year, the filled date defaults to January 1 of the current year
      const diff = dayjs(_nums[1]).diff(_nums[0]!, 'year');
      for (let i = 2; i < _nums.length; i++) {
        const newDiff = dayjs(_nums[i]).diff(_nums[i-1]!, 'year');
        if (Math.abs(newDiff - diff) > DELTA){
          return { type: 'copy' };
        }
      }
      return { type: 'dateArithmetic', args: { dDiff: diff, dUnit: 'year' } };
    }
  }
  return { type: 'copy' };
}

export interface IFillDataToCellOptions {
  cmd: CollaCommandName.FillDataToCells;
  selectionRange: IRange[];
  fillRange?: IRange;
  direction?: string;
}

export const fillDataToCell: ICollaCommandDef<IFillDataToCellOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state, fieldMapSnapshot } = context;
    const { selectionRange, fillRange, direction } = options;
    const datasheetId = getActiveDatasheetId(state);

    if (!state || !datasheetId || !fillRange) {
      return null;
    }
    const snapshot = getSnapshot(state, datasheetId)!;
    const actions: IJOTAction[] = [];
    const linkedActions: ILinkedActions[] = [];

    function copyCol(selectCells: ICell[], fillCells: ICell[]){
      const data: {
        recordId: string;
        fieldId: string;
        value: ICellValue;
      }[] = [];

      for (let i = 0; i < fillCells.length; i++) {
        const cellIndex = i % selectCells.length;
        const selectCell = selectCells[cellIndex]!;
        const fillCell = fillCells[i]!;
        const fieldId = fillCell.fieldId;
        const field = getField(state, fieldId, datasheetId);
        let cellValue = getCellValue(state, snapshot, selectCell.recordId, selectCell.fieldId);
        cellValue = handleEmptyCellValue(cellValue, Field.bindContext(field, state).basicValueType);
        data.push({
          recordId: fillCell.recordId,
          fieldId: fillCell.fieldId,
          value: cellValue,
        });
      }
      return data;
    }

    function arithmeticCol(diff: number, selectCellCol: ICell[], fillRangeCells: ICell[], unit?: string) {
      const data: {
        recordId: string;
        fieldId: string;
        value: number;
      }[] = [];
      const lastCell = selectCellCol.slice(-1)[0]!;
      const base = getCellValue(state, snapshot, lastCell.recordId, lastCell.fieldId);
      for (let i = 0; i < fillRangeCells.length; i++) {
        const cell = fillRangeCells[i]!;
        let value;
        if (unit === 'time') {
          value = diff*(i+1) + base;
        } else if (unit === 'day') {
          value = dayjs(dayjs(base).format('YYYY/MM/DD')).add(diff*(i+1), 'day').valueOf();
        } else if (unit === 'month') {
          value = dayjs(dayjs(base).format('YYYY/MM')).add(diff*(i+1), 'month').valueOf();
        } else if (unit === 'year') {
          value = dayjs(dayjs(base).format('YYYY')).add(diff*(i+1), 'year').valueOf();
        } else {
          value = diff*(i+1) + base;
        }
        data.push({
          recordId: cell.recordId,
          fieldId: cell.fieldId,
          value: value,
        });
      }
      return data;
    }

    // Calculate vertically filled data
    const computeFillDataVertical = (
      fillRangeCells: ICell[][],
      selectRangeCells: ICell[][],
      direction: FillDirection
    ) => {
      const data: {
        recordId: string;
        fieldId: string;
        value: ICellValue;
      }[] = [];
      const tSelectRangeCells = transpose(selectRangeCells);
      const tFillRangeCells = transpose(fillRangeCells);

      for (let j = 0; j < tSelectRangeCells.length; j++) { // Calculate by column
        const tSelectCellCol = tSelectRangeCells[j]!;
        const tFillCellCol = tFillRangeCells[j]!;

        if (direction === FillDirection.Top) {
          tSelectCellCol.reverse();
          tFillCellCol.reverse();
        }

        const fieldId = tSelectCellCol[0]!.fieldId;
        const field = getField(state, fieldId, datasheetId);
        // Determine the column type, find rules for time and numbers
        if (field.type === FieldType.Number || field.type === FieldType.DateTime){
          const pattern = patternFinder(tSelectCellCol, field.type, state, snapshot, field);
          switch (pattern.type) {
            case 'arithmetic':
              const { diff } = pattern.args;
              const colData = arithmeticCol(diff, tSelectCellCol, tFillCellCol);
              data.push(...colData);
              break;
            case 'dateArithmetic':
              const { dDiff, dUnit } = pattern.args;
              const dColData = arithmeticCol(dDiff, tSelectCellCol, tFillCellCol, dUnit);
              if (dColData.find(data=> data.value < EARLIEST_DATE)) {
                data.push(...copyCol(tSelectCellCol, tFillCellCol));
              } else {
                data.push(...dColData);
              }
              break;
            case 'copy':
              data.push(...copyCol(tSelectCellCol, tFillCellCol));
              break;
          }
        } else {
          data.push(...copyCol(tSelectCellCol, tFillCellCol));
        }
      }
      return data;
    };

    const updateFillFieldsProperty = (selectFields: IField[], fillFields: IField[], selectCells: ICell[]) => {
      const newFillFields: IField[] = [];
      for (const [index, field] of fillFields.entries()) {
        const selectField = selectFields[index % selectFields.length]!;
        const stdValues = selectCells.filter(cell => cell.fieldId === selectField.id).map(cell => {
          let cellValue = getCellValue(state, snapshot, cell.recordId, cell.fieldId);
          cellValue = handleEmptyCellValue(cellValue, Field.bindContext(selectField, state).basicValueType);
          return Field.bindContext(selectField, state).cellValueToStdValue(cellValue);
        });
        const newField = fastCloneDeep(field);

        const newProperty = newField.type === FieldType.Member ? newField.property :
          Field.bindContext(newField, state).enrichProperty(stdValues);

        const data = {
          ...newField,
          property: newProperty,
        };
        newFillFields.push(data);
        const rst = setFieldAttr.execute(context, {
          cmd: CollaCommandName.SetFieldAttr,
          fieldId: newField.id,
          data,
        });
        if (rst && rst.result === ExecuteResult.Success) {
          actions.push(...rst.actions);
        }
      }
      return newFillFields;
    };

    // Calculate horizontally filled data
    const computeFillDataHorizontal = (
      fillRangeCells: ICell[][],
      selectRangeCells: ICell[][],
      direction: FillDirection
    ) => {
      const data: {
        recordId: string;
        fieldId: string;
        value: ICellValue;
      }[] = [];
      const selectCells = zip(...selectRangeCells).flat() as ICell[];
      const fillCells = zip(...fillRangeCells).flat() as ICell[];
      if (direction === FillDirection.Left) {
        selectCells.reverse();
        fillCells.reverse();
      }
      // Horizontal padding, may need to extend the property of the field

      const fillFields = getRangeFields(state, fillRange, datasheetId)!;
      let newFillFields = fillFields;
      const selectFields = getRangeFields(state, selectionRange[0]!, datasheetId)!;
      newFillFields = updateFillFieldsProperty(selectFields, fillFields, selectCells);
      for (let i = 0; i < fillCells.length; i++) {
        const cellIndex = i % selectCells.length;
        const selectCell = selectCells[cellIndex]!;
        const fillCell = fillCells[i]!;
        const fillField = newFillFields.find(f => f.id === fillCell.fieldId)!;
        const selectField = getField(state, selectCell.fieldId, datasheetId);
        let selectCellValue = getCellValue(state, snapshot, selectCell.recordId, selectCell.fieldId);
        selectCellValue = handleEmptyCellValue(selectCellValue, Field.bindContext(selectField, state).basicValueType);
        const selectStdVal = Field.bindContext(selectField, state).cellValueToStdValue(selectCellValue);
        const willFillCellValue = Field.bindContext(fillField, state).stdValueToCellValue(selectStdVal);
        // Horizontal padding involves field conversion, select cv > stdVal > Fill cv
        data.push({
          recordId: fillCell.recordId,
          fieldId: fillCell.fieldId,
          value: willFillCellValue,
        });
      }
      return data;
    };

    const fillDataToCell = (
      selectionRange: IRange[], fillRange?: IRange, direction?: string,
    ) => {
      if (!fillRange || !selectionRange) {
        return;
      }
      const selectionRangeCells = getCellMatrixFromRange(state, selectionRange[0]!);
      const fillRangeCells = getCellMatrixFromRange(state, fillRange);
      if (!(selectionRangeCells && fillRangeCells)) {
        return;
      }
      let data: {
        recordId: string;
        fieldId: string;
        value: ICellValue;
      }[] = [];
      switch (direction) {
        case FillDirection.Below:
        case FillDirection.Top:
          data = computeFillDataVertical(fillRangeCells, selectionRangeCells, direction);
          break;
        case FillDirection.Right:
        case FillDirection.Left:
          data = computeFillDataHorizontal(fillRangeCells, selectionRangeCells, direction);
          break;
        default:
          return;
      }
      if (data.length) {
        const rst = setRecords.execute(context, {
          cmd: CollaCommandName.SetRecords,
          data,
        });
        if (rst) {
          if (rst.result === ExecuteResult.Fail) {
            return rst;
          }
          actions.push(...rst.actions);
          Object.assign(fieldMapSnapshot, rst.fieldMapSnapshot);
          linkedActions.push(...(rst.linkedActions || []));
        }
      }
      return;
    };

    fillDataToCell(selectionRange, fillRange, direction);

    if (actions.length === 0) {
      return null;
    }
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
      fieldMapSnapshot
    };
  },
};
