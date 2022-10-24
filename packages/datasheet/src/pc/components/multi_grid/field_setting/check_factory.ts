import {
  ComputeRefManager, Field, FieldType, FieldTypeDescriptionMap, getComputeRefManager, getUniqName, IField, IFormulaField, ILinkField, ILookUpField,
  IMultiSelectField, ISingleSelectField, LookUpField, Selectors, Strings, t,
} from '@apitable/core';
import produce from 'immer';
import keyBy from 'lodash/keyBy';
import { store } from 'pc/store';
import { getTestFunctionAvailable } from 'pc/utils/storage';

const compose = (...args) => (value, datasheetId) => args.reduceRight((preValue, curFn) => curFn(preValue, datasheetId), value);

export const checkComputeRef = (curField: string | ILookUpField | IFormulaField) => {
  if (typeof curField === 'string') {
    return curField;
  }
  try {
    const state = store.getState();
    const globalComputeRefManager = getComputeRefManager(state);
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const currSnapshot = Selectors.getSnapshot(state, datasheetId);
    const fieldMap = currSnapshot?.meta.fieldMap;
    const draftFieldMap = { ...fieldMap, [curField.id]: curField };
    // 利用收集依赖的循环引用检查，判断是否发生了循环 lookup;
    const draftComputeRefManager = new ComputeRefManager(
      new Map(globalComputeRefManager.refMap),
      new Map(globalComputeRefManager.reRefMap),
    );
    // !!! 这里是模拟判断是否发生循环引用，不要将 draft 的引用关系，加入到缓存中。
    draftComputeRefManager.computeRefMap(draftFieldMap, datasheetId, state, false);

    // 允许构造循环依赖时，不做检查直接返回。
    if (getTestFunctionAvailable('allowFieldLoopRef')) {
      return curField;
    }
    // 判断是否存在循环依赖, 如果要构造循环依赖的字段，可以注释掉这里。
    if (!draftComputeRefManager.checkRef(`${datasheetId}-${curField.id}`)) {
      throw Error(t(Strings.field_circular_err));
    }
    return curField;
  } catch (error: any) {
    return error.message;
  }
};

export class CheckFieldSettingBase {

  static checkFieldNameBlank(curField: IField, datasheetId?: string) {
    return produce<IField, IField>(curField, draft => {
      if (!draft.name.trim().length) {
        const state = store.getState();
        const fieldMap = Selectors.getFieldMap(state, datasheetId || state.pageParams.datasheetId!)!;
        draft.name = getUniqName(FieldTypeDescriptionMap[curField.type].title, Object.keys(fieldMap).map(id => fieldMap[id].name));
      }
      return draft;
    });
  }

  static checkFieldNameLen(curField: IField) {
    return produce(curField, draft => {
      if (draft.name.length > 100) {
        draft.name = draft.name.slice(0, 100);
      }
      return draft;
    });
  }

  // 神奇表单中新增列时pageParams拿不到datasheetId
  static checkStream(curField: IField, datasheetId?: string) {
    return compose(
      CheckFieldSettingBase.checkFieldNameLen,
      CheckFieldSettingBase.checkFieldNameBlank,
    )(curField, datasheetId);
  }
}

class CheckFieldOption {
  // 检查是否存在选项配置
  static isExitOption(curField: IMultiSelectField | ISingleSelectField): boolean {
    if (!curField.property || !curField.property.options) {
      return false;
    }
    return true;
  }

  static checkOptionBlank(curField: IMultiSelectField | ISingleSelectField, datasheetId?: string) {
    return produce(curField, draft => {
      const state = store.getState();
      const fieldMap = Selectors.getFieldMap(state, datasheetId || state.pageParams.datasheetId!)!;
      const _filed = fieldMap[draft.id] as (IMultiSelectField | ISingleSelectField);
      if (!_filed) {
        return draft;
      }
      if (_filed.type !== FieldType.SingleSelect && _filed.type !== FieldType.MultiSelect) {
        return draft;
      }
      const optionIdMap = keyBy(_filed.property.options, 'id');
      draft.property.options.map(item => {
        if (!item.name && optionIdMap[item.id]) {
          item.name = optionIdMap[item.id].name;
        }
        return item;
      });
      return draft;
    });
  }

  static deleteBlankOption(curField: IMultiSelectField | ISingleSelectField) {
    return produce(curField, draft => {
      draft.property.options = draft.property.options.filter(item => {
        return item.name.trim().length > 0;
      });
      return draft;
    });
  }

  static checkStream(curField: IMultiSelectField | ISingleSelectField, datasheetId?: string) {
    if (!CheckFieldOption.isExitOption(curField)) {
      return CheckFieldSettingBase.checkStream(curField);
    }
    return compose(
      CheckFieldOption.deleteBlankOption,
      CheckFieldOption.checkOptionBlank,
      // CheckFieldOption.checkNameLen,
      CheckFieldSettingBase.checkStream,
    )(curField, datasheetId);
  }
}

class CheckFieldLink {
  static checkForeignDatasheetId(curField: ILinkField) {
    if (!curField.property || !curField.property.foreignDatasheetId) {
      return t(Strings.no_foreignDstId);
    }
    return curField;
  }

  static checkForeignDatasheet(preResult: string | ILinkField) {
    if (typeof preResult === 'string') {
      return preResult;
    }

    const foreignDatasheet = Selectors.getDatasheet(store.getState(), preResult.property.foreignDatasheetId);
    if (!foreignDatasheet) {
      return t(Strings.link_data_error);
    }

    return preResult;
  }

  static checkStream(curField: ILinkField, datasheetId?: string) {
    return compose(
      CheckFieldLink.checkForeignDatasheet,
      CheckFieldLink.checkForeignDatasheetId,
      CheckFieldSettingBase.checkStream,
    )(curField, datasheetId);
  }
}

class CheckFieldLookUp {
  static checkLookUpEntityField(preResult: string | ILookUpField) {
    if (typeof preResult === 'string') {
      return preResult;
    }
    const lookUpEntityField = (Field.bindModel(preResult) as LookUpField).getLookUpEntityField();
    if (!lookUpEntityField) {
      return t(Strings.no_lookup_field);
    }
    return preResult;

  }

  static checkExitLinkField(curField: ILookUpField) {
    const relatedLinkField = (Field.bindModel(curField) as LookUpField).getRelatedLinkField();
    if (!relatedLinkField) {
      return t(Strings.no_foreignDstId);
    }
    return curField;
  }

  static checkStream(curField: ILookUpField, datasheetId?: string) {
    return compose(
      CheckFieldLookUp.checkLookUpEntityField,
      checkComputeRef,
      CheckFieldLookUp.checkExitLinkField,
      CheckFieldSettingBase.checkStream,
    )(curField, datasheetId);
  }
}

class CheckFieldFormula {
  static checkStream(curField: ILookUpField, datasheetId?: string) {
    return compose(
      checkComputeRef,
      CheckFieldSettingBase.checkStream,
    )(curField, datasheetId);
  }
}

export const checkFactory = {
  [FieldType.MultiSelect]: CheckFieldOption.checkStream,
  [FieldType.SingleSelect]: CheckFieldOption.checkStream,
  [FieldType.LookUp]: CheckFieldLookUp.checkStream,
  [FieldType.Link]: CheckFieldLink.checkStream,
  [FieldType.Formula]: CheckFieldFormula.checkStream,
};
