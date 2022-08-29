import { Field } from 'model';
// import 'reflect-metadata';
import { IRecordCellValue, IReduxState, Selectors } from 'store';
import { getDatasheet } from 'store/selector/resource';
import { BasicOpenValueType } from 'types/field_types_open';
import { getDashboard } from '../store/selector/resource/dashboard';
import { getForm } from '../store/selector/resource/form';
import { getWidget } from '../store/selector/resource/widget';
import { ResourceType } from '../types/resource_types';

/**
 * 注册事件原型装饰器
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
    if (testPathList[i].startsWith(':')) {
      const pathKey = testPathList[i].slice(1);
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
  const snapshot = Selectors.getSnapshot(state, datasheetId)!;
  const eventFields: { [key: string]: BasicOpenValueType | null } = {};
  const newFields = { ...recordData };
  Object.keys(snapshot?.meta.fieldMap).forEach(fieldId => {
    const field = snapshot.meta.fieldMap[fieldId];
    let cellValue = recordData[fieldId];
    // FIXME: 只填充没有的，这里有个问题。op 的change to 是最新的，查库出来的可能是旧的。以 op 为准
    // recordData 里面没有字段值，表明是计算字段，不管是更新还是创建，都需要更新重新计算一遍。
    if (!recordData.hasOwnProperty(fieldId)) {
      cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
      newFields[fieldId] = cellValue;
    }
    const fieldEventValue = Field.bindContext(field, state).cellValueToOpenValue(cellValue);
    eventFields[fieldId] = fieldEventValue;
  });
  return {
    fields: newFields,
    eventFields
  };
};