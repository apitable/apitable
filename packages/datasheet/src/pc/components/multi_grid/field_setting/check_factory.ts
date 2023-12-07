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

import produce from 'immer';
import { isNil } from 'lodash';
import keyBy from 'lodash/keyBy';
import {
  ButtonActionType,
  ComputeRefManager,
  Field,
  FieldType,
  FieldTypeDescriptionMap,
  getComputeRefManager,
  getUniqName,
  IButtonField,
  ICascaderField,
  IField,
  IFormulaField,
  ILinkField,
  ILookUpField,
  IMultiSelectField,
  ISingleSelectField,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { store } from 'pc/store';

const compose =
  (...args: any) =>
    (value: any, datasheetId: string) =>
      args.reduceRight((preValue: any, curFn: (arg0: any, arg1: string) => any) => curFn(preValue, datasheetId), value);

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
    const draftComputeRefManager = new ComputeRefManager(new Map(globalComputeRefManager.refMap), new Map(globalComputeRefManager.reRefMap));
    // Here is the simulation to determine whether circular references occur, do not add the reference relationship of draft, to the cache.
    draftComputeRefManager.computeRefMap(draftFieldMap, datasheetId, state, false);

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
    return produce<IField, IField>(curField, (draft) => {
      if (!draft.name.trim().length) {
        const state = store.getState();
        const fieldMap = Selectors.getFieldMap(state, datasheetId || state.pageParams.datasheetId!)!;
        draft.name = getUniqName(
          FieldTypeDescriptionMap[curField.type].title,
          Object.keys(fieldMap).map((id) => fieldMap[id].name),
        );
      }
      return draft;
    });
  }

  static checkFieldNameLen(curField: IField) {
    return produce(curField, (draft) => {
      if (draft.name.length > 100) {
        draft.name = draft.name.slice(0, 100);
      }
      return draft;
    });
  }

  // PageParams can't get datasheetId when adding columns in magic form
  static checkStream(curField: IField, datasheetId?: string) {
    return compose(CheckFieldSettingBase.checkFieldNameLen, CheckFieldSettingBase.checkFieldNameBlank)(curField, datasheetId!);
  }
}

class ButtonField {
  // Check for the presence of option configurations
  static isExitType(curField: IButtonField) {
    if (isNil(curField.property.action.type)) {
      return {
        errors: {
          property1: t(Strings.should_not_empty, {
            name: t(Strings.button_operation)
          }),
        },
      };
    }

    if (curField.property?.text ==null || curField.property?.text.length ===0) {
      return {
        errors: {
          property2: t(Strings.automation_content_should_not_empty),
        },
      };
    }

    if (curField.property.action?.type === ButtonActionType.OpenLink) {
      if (curField.property.action?.openLink?.expression == null || curField.property.action?.openLink?.expression.length === 0) {
        return {
          errors: {
            property4: t(Strings.open_url_emby_warning),
          },
        };
      }
    }

    if (curField.property.action?.type === ButtonActionType.TriggerAutomation) {
      if (curField.property.action?.automation?.automationId == null) {
        return {
          errors: {
            property: t(Strings.automation_not_empty),
          },
        };
      }
    }

    return curField;
  }

  static checkStream(curField: IButtonField, datasheetId?: string) {
    return compose(ButtonField.isExitType, CheckFieldSettingBase.checkFieldNameLen, CheckFieldSettingBase.checkFieldNameBlank)(curField, datasheetId!);
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
    return produce(curField, (draft) => {
      const state = store.getState();
      const fieldMap = Selectors.getFieldMap(state, datasheetId || state.pageParams.datasheetId!)!;
      const _filed = fieldMap[draft.id] as IMultiSelectField | ISingleSelectField;
      if (!_filed) {
        return draft;
      }
      if (_filed.type !== FieldType.SingleSelect && _filed.type !== FieldType.MultiSelect) {
        return draft;
      }
      const optionIdMap = keyBy(_filed.property.options, 'id');
      draft.property.options.map((item) => {
        if (!item.name && optionIdMap[item.id]) {
          item.name = optionIdMap[item.id].name;
        }
        return item;
      });
      return draft;
    });
  }

  static deleteBlankOption(curField: IMultiSelectField | ISingleSelectField) {
    return produce(curField, (draft) => {
      draft.property.options = draft.property.options.filter((item) => {
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

class CheckFieldOneWayLink {
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
      CheckFieldOneWayLink.checkForeignDatasheet,
      CheckFieldOneWayLink.checkForeignDatasheetId,
      CheckFieldSettingBase.checkStream,
    )(curField, datasheetId!);
  }
}

class CheckFieldLink extends CheckFieldOneWayLink {}

class CheckFieldLookUp {
  static checkLookUpEntityField(preResult: string | ILookUpField) {
    if (typeof preResult === 'string') {
      return preResult;
    }
    const lookUpEntityField = (Field.bindModel(preResult) as any).getLookUpEntityField();
    if (!lookUpEntityField) {
      return t(Strings.no_lookup_field);
    }
    return preResult;
  }

  static checkExitLinkField(curField: ILookUpField) {
    const relatedLinkField = (Field.bindModel(curField) as any).getRelatedLinkField();
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
    return compose(checkComputeRef, CheckFieldSettingBase.checkStream)(curField, datasheetId!);
  }
}

export interface IFieldCascaderErrors {
  errors: {
    linkedDatasheetId?: string;
    linkedViewId?: string;
    linkedFields?: string;
  };
}

class CheckFieldCascader {
  static checkCascaderDatasource(curField: ICascaderField) {
    if (!curField.property.linkedDatasheetId) {
      return {
        errors: {
          linkedDatasheetId: t(Strings.cascader_no_datasheet_error),
        },
      };
    }
    if (!curField.property.linkedViewId) {
      return {
        errors: {
          linkedViewId: t(Strings.cascader_no_view_error),
        },
      };
    }
    if (curField.property.linkedFields.length < 1) {
      return {
        errors: {
          linkedFields: t(Strings.cascader_no_rules_error),
        },
      };
    }

    return curField;
  }

  static checkStream(curField: ICascaderField, datasheetId?: string) {
    return compose(CheckFieldCascader.checkCascaderDatasource, CheckFieldSettingBase.checkStream)(curField, datasheetId!);
  }
}

export const checkFactory = {
  [FieldType.MultiSelect]: CheckFieldOption.checkStream,
  [FieldType.SingleSelect]: CheckFieldOption.checkStream,
  [FieldType.LookUp]: CheckFieldLookUp.checkStream,
  [FieldType.Link]: CheckFieldLink.checkStream,
  [FieldType.OneWayLink]: CheckFieldOneWayLink.checkStream,
  [FieldType.Formula]: CheckFieldFormula.checkStream,
  [FieldType.Cascader]: CheckFieldCascader.checkStream,
  [FieldType.Button]: ButtonField.checkStream,
};
