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

import {
  ComputeRefManager, Field, FieldType, FieldTypeDescriptionMap, getComputeRefManager, getUniqName, IField, IFormulaField, ILinkField, ILookUpField,
  IMultiSelectField, ISingleSelectField, LookUpField, Selectors, Strings, t,
} from '@apitable/core';
import produce from 'immer';
import keyBy from 'lodash/keyBy';
import { store } from 'pc/store';
import { getTestFunctionAvailable } from 'pc/utils/storage';

const compose = (...args: any) => (value: any, datasheetId: string) => args.reduceRight((preValue: any, curFn: (arg0: any, arg1: string) => any) => curFn(preValue, datasheetId), value);

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
    // Use the circular reference check of the collection dependency to determine if a circular lookup has occurred;
    const draftComputeRefManager = new ComputeRefManager(
      new Map(globalComputeRefManager.refMap),
      new Map(globalComputeRefManager.reRefMap),
    );
    // Here is the simulation to determine whether circular references occur, do not add the reference relationship of draft, to the cache.
    draftComputeRefManager.computeRefMap(draftFieldMap, datasheetId, state, false);

    // Allow constructing loop dependencies to be returned directly without checking.
    if (getTestFunctionAvailable('allowFieldLoopRef')) {
      return curField;
    }
    // Determine if there is a circular dependency, and comment out this field if you want to construct a circular dependency.
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

  // PageParams can't get datasheetId when adding columns in magic form
  static checkStream(curField: IField, datasheetId?: string) {
    return compose(
      CheckFieldSettingBase.checkFieldNameLen,
      CheckFieldSettingBase.checkFieldNameBlank,
    )(curField, datasheetId!);
  }
}

class CheckFieldOption {
  // Check for the presence of option configurations
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
    )(curField, datasheetId!);
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
    )(curField, datasheetId!);
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
    )(curField, datasheetId!);
  }
}

class CheckFieldFormula {
  static checkStream(curField: ILookUpField, datasheetId?: string) {
    return compose(
      checkComputeRef,
      CheckFieldSettingBase.checkStream,
    )(curField, datasheetId!);
  }
}

export const checkFactory = {
  [FieldType.MultiSelect]: CheckFieldOption.checkStream,
  [FieldType.SingleSelect]: CheckFieldOption.checkStream,
  [FieldType.LookUp]: CheckFieldLookUp.checkStream,
  [FieldType.Link]: CheckFieldLink.checkStream,
  [FieldType.Formula]: CheckFieldFormula.checkStream,
};
