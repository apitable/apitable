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

import { Field } from 'model/field';
// import 'reflect-metadata';
import { IRecordCellValue, IReduxState } from '../exports/store/interfaces';
import {
  getSnapshot,
  getDatasheet,
  getCellValue
} from 'modules/database/store/selectors/resource/datasheet';
import { BasicOpenValueType } from 'types/field_types_open';
import { getDashboard } from '../modules/database/store/selectors/resource/dashboard';
import { getForm } from '../modules/database/store/selectors/resource/form';
import { getWidget } from '../modules/database/store/selectors/resource/widget';
import { ResourceType } from '../types/resource_types';
import { FieldType } from 'types';

/**
 * Register event prototype decorator
 *
 * @EventMeta("RecordUpdated","ATOM")
 * class EventRecordUpdated {
 *  test(){
 *  }
 * }
 */
// export const EventMeta = (name: string, atomType: string = 'ATOM'): ClassDecorator => {
//   return (target: any) => {
//     Reflect.defineMetadata('name', name, target);
//     Reflect.defineMetadata('atomType', atomType, target);
//   };
// };

export const getResourceState = (resourceId: string, resourceType: ResourceType, state: IReduxState) => {
  switch (resourceType) {
    case ResourceType.Datasheet:
      return getDatasheet(state, resourceId);
    case ResourceType.Dashboard:
      return getDashboard(state, resourceId);
    case ResourceType.Widget:
      return getWidget(state, resourceId);
    case ResourceType.Form:
      return getForm(state, resourceId);
    default:
      return;
  }
};

/**
 * pathList = ["recordMap", "recGa2EHHKOTQ", "data", "fldBSXiPB3UQY"]
 * testPathList = ["recordMap", ":recordId", "data",":fieldId"]
 * return {
 *  pass:true,
 *  recordId:recGa2EHHKOTQ,
 *  fieldId:fldBSXiPB3UQY
 * }
 */
export const testPath = (pathList: (string | number)[], testPathList: string[], flag = true) => {
  const NOT_PASS_RES = {
    pass: false,
  };
  if (!flag || pathList.length !== testPathList.length) {
    return NOT_PASS_RES;
  }
  const res: {
    [key: string]: any
  } = { pass: true };

  for (let i = 0; i < testPathList.length; i++) {
    if (testPathList[i]!.startsWith(':')) {
      const pathKey = testPathList[i]!.slice(1);
      res[pathKey] = pathList[i];
      continue;
    }
    if (pathList[i] !== testPathList[i]) {
      return NOT_PASS_RES;
    }
  }
  return res;
};

export const shallowEqual = (objA: any, objB: any) => {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (const key of keysA) {
    if (!Object.hasOwnProperty.call(objB, key) ||
      !Object.is(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
};

interface ITransformOpFieldsProps {
  recordData: IRecordCellValue;
  state: IReduxState;
  datasheetId: string;
  recordId: string;
}

export const transformOpFields = (props: ITransformOpFieldsProps) => {
  const { state, datasheetId, recordData, recordId } = props;
  const snapshot = getSnapshot(state, datasheetId)!;
  const eventFields: { [key: string]: BasicOpenValueType | null } = {};
  const fieldTypeMap = new Map<string, number>();
  const newFields = { ...recordData };
  Object.keys(snapshot?.meta.fieldMap).forEach(fieldId => {
    const field = snapshot.meta.fieldMap[fieldId]!;
    let cellValue = recordData[fieldId]!;
    // FIXME: Only fill in what is not, there is a problem here.
    // The change to of op is the latest, and the one obtained from the database search may be old. subject to op
    // There is no field value in recordData, indicating that it is a calculated field.
    // Whether it is updated or created, it needs to be updated and recalculated.
    if (!recordData.hasOwnProperty(fieldId)) {
      cellValue = getCellValue(state, snapshot, recordId, fieldId);
      newFields[fieldId] = cellValue;
    }
    fieldTypeMap.set(fieldId, field.type);
    eventFields[fieldId] = field.type === FieldType.Formula
      ? Field.bindContext(field, state).cellValueToString(cellValue)
      : Field.bindContext(field, state).cellValueToOpenValue(cellValue);
  });
  return {
    fields: newFields,
    fieldTypeMap,
    eventFields
  };
};