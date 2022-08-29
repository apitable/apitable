import { Store } from 'redux';
import without from 'lodash/without';
import {
  ExpCache, Field, FieldType, LookUpField, ResourceType, Selectors, StoreActions,
  IDatasheetMap, IFieldMap, ILinkField, ILookUpField, IReduxState,
} from 'core';
import { IResourceService } from '../resource/interface';

export function eqSet<T>(as: Set<T>, bs: Set<T>): boolean {
  if (as.size !== bs.size) {
    return false;
  }
  for (const a of as) if (!bs.has(a)) {
    return false;
  }
  return true;
}

export const subscribeDatasheetMap = (store: Store<IReduxState>, datasheetService: { instance: IResourceService | null }) => {
  let datasheetIdSet: Set<string> = new Set();
  let datasheetMap: IDatasheetMap = {};

  function linkLookUpField(datasheetId: string, visitedDst?: Set<string>) {
    const _visitedDst = visitedDst || new Set();
    if (_visitedDst.has(datasheetId)) {
      return;
    }
    const state = store.getState();
    const datasheet = Selectors.getDatasheet(state, datasheetId);
    const shareId = state.pageParams.shareId;
    const formId = state.pageParams.formId;
    if (shareId && formId) {
      return;
    }
    _visitedDst.add(datasheetId);
    if (!datasheet) {
      console.log(`gogogo 加载(${datasheetId}) 的数据`);
      return store.dispatch(StoreActions.fetchDatasheet(datasheetId) as any);
    }
    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    // const datasheetName = datasheet!.name;

    // console.log(`1.    载入表:${datasheetName}`);
    // 本表的 lookup 字段们
    const lookUpFields = Object.values(fieldMap).filter(field => field.type === FieldType.LookUp) as ILookUpField[];
    // const linkFields = Object.values(fieldMap).filter(field => field.type === FieldType.Link) as ILinkField[];
    // console.log(`2.    ${datasheetName} 中存在 ${lookUpFields.length} 个 lookup 字段: `, { lookUpFields });
    // console.log(`2.    ${datasheetName} 中存在 ${linkFields.length} 个 link 字段: `, { linkFields });
    let index = 1;

    const findNextLookUpField = (field: ILookUpField, fieldMap: IFieldMap, visitedField?: Set<string>) => {
      const _visitedField = visitedField || new Set();
      if (_visitedField.has(field.id)) {
        return;
      }
      _visitedField.add(field.id);
      // 本表 lookup 查询的实际字段
      const lookUpTargetField = (Field.bindModel(field) as LookUpField).getLookUpTargetField();
      if (!lookUpTargetField) {
        // 这个表的外键数据没有加载
        const foreignField = fieldMap[field.property.relatedLinkFieldId] as ILinkField;
        if (foreignField && foreignField.type === FieldType.Link) {
          console.log(`2.${index}.1 「${field.name}」 查询的表(${foreignField.property.foreignDatasheetId})数据未加载`);
          linkLookUpField(foreignField.property.foreignDatasheetId, _visitedDst);
        }
      } else {
        console.log(`2.${index}.1 「${field.name}」 查询的实际字段是: 「${lookUpTargetField.name}」`, { lookUpTargetField });
      }
      // lookup lookup le lookup
      // 本表的 lookup lookup 了外键表的另外一个 lookup 字段
      if (lookUpTargetField && lookUpTargetField.type === FieldType.LookUp) {
        console.log(`2.${index}.2 「${lookUpTargetField.name}」 也是一个 lookup 字段`);
        findNextLookUpField(lookUpTargetField, fieldMap, _visitedField);
      }
    };

    for (const field of lookUpFields) {
      findNextLookUpField(field, fieldMap);
      index++;
    }
  }

  return store.subscribe(function datasheetMapChange() {
    const state = store.getState();
    if (!datasheetService.instance?.checkRoomExist()) {
      return;
    }
    const previousDatasheetMap = datasheetMap;
    datasheetMap = state.datasheetMap;
    const previousDatasheetIdSet = datasheetIdSet;

    if (previousDatasheetMap === datasheetMap) {
      return;
    }

    datasheetIdSet = new Set(Object.keys(datasheetMap).filter(id => {
      return Boolean(datasheetMap![id].datasheet) && !datasheetMap![id]!.datasheet?.preview;
    }));
    if (eqSet(previousDatasheetIdSet, datasheetIdSet)) {
      return;
    }

    // 检查是否加载了新的 datasheet 数据，如果是，则通过 resourceService 建立长链通道。
    const currentDatasheetIds = Array.from(datasheetIdSet);
    const collaEngineKeys = datasheetService.instance.getCollaEngineKeys();
    const entityDatasheetIds = [...collaEngineKeys];
    const diff = without(currentDatasheetIds, ...entityDatasheetIds);
    console.log('create datasheetService', diff);
    diff.forEach(id => {
      datasheetService.instance!.createCollaEngine(id, ResourceType.Datasheet);
    });
    // 为什么要清理公式解析的缓存？参见: https://www.notion.so/Debug-2021-03-29-a5a756dc2c9640e2957103c9bb5eeebd#bd1ef9866f504b8c85be4c27088f9ada
    ExpCache.clearAll();
    diff.forEach(id => {
      linkLookUpField(id);
      const fieldMap = datasheetMap[id].datasheet!.snapshot.meta.fieldMap;
      datasheetService.instance!.computeRefManager.computeRefMap(fieldMap, id, state);
      // console.log('refMap', computeRefManager.refMap);
    });
  });
};
