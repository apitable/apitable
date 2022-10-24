import {
  CollectType, DateFormat, FieldType, IAutoNumberField, ICreatedByField, ICreatedTimeField, IFormulaField, ILastModifiedByField,
  ILastModifiedTimeField, ILookUpField, TimeFormat
} from '@apitable/core';
import { AutoNumberField } from 'modules/services/fusion/field/auto.number.field';
import { CreatedByField } from 'modules/services/fusion/field/created.by.field';
import { CreatedTimeField } from 'modules/services/fusion/field/created.time.field';
import { FormulaField } from 'modules/services/fusion/field/formula.field';
import { LastModifiedByField } from 'modules/services/fusion/field/last.modified.by.field';
import { LastModifiedTimeField } from 'modules/services/fusion/field/last.modified.time.field';
import { LookUpField } from 'modules/services/fusion/field/look.up.field';

describe('AutoNumberField', () => {
  let fieldClass: AutoNumberField;
  let field: IAutoNumberField;
  beforeAll(() => {
    fieldClass = new CreatedTimeField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '创建时间',
      type: FieldType.AutoNumber,
      property: {
        datasheetId: 'string',
        nextId: 1,
        viewIdx: 1,
      },
    };
  });

  describe('validate', () => {
    it('null--should throw error', () => {
      expect(() => fieldClass.validate(null, field)).toThrow(/^api_params_created_time_can_not_operate$/);
    });
  });
});

describe('CreatedTimeField', () => {
  let fieldClass: CreatedTimeField;
  let field: ICreatedTimeField;
  beforeAll(() => {
    fieldClass = new CreatedTimeField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '创建时间',
      type: FieldType.CreatedTime,
      property: {
        datasheetId: 'string',
        dateFormat: DateFormat['YYYY-MM-DD'],
        timeFormat: TimeFormat['HH:mm'],
        includeTime: true,
      },
    };
  });

  describe('validate', () => {
    it('null--should throw error', () => {
      expect(() => fieldClass.validate(null, field)).toThrow(/^api_params_created_time_can_not_operate$/);
    });
  });
});

describe('CreatedByField', () => {
  let fieldClass;
  let field: ICreatedByField;
  beforeAll(() => {
    fieldClass = new CreatedByField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '创建人',
      type: FieldType.CreatedBy,
      property: {
        datasheetId: 'string',
        uuids: ['aaa'],
      },
    };
  });

  describe('validate', () => {
    it('null--should throw error', () => {
      expect(() => fieldClass.validate(null, field)).toThrow(/^api_params_createdby_can_not_operate$/);
    });
  });
});

describe('FormulaField', () => {
  let fieldClass;
  let field: IFormulaField;
  beforeAll(() => {
    fieldClass = new FormulaField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '公式',
      type: FieldType.Formula,
      property: {
        datasheetId: 'string',
        expression: 'string',
      },
    };
  });

  describe('validate', () => {
    it('null--should throw error', () => {
      expect(() => fieldClass.validate(null, field)).toThrow(/^api_params_formula_can_not_operate$/);
    });
  });
});

describe('LookUpField', () => {
  let fieldClass;
  let field: ILookUpField;
  beforeAll(() => {
    fieldClass = new LookUpField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '公式',
      type: FieldType.LookUp,
      property: {
        datasheetId: 'string',
        relatedLinkFieldId: 'string',
        lookUpTargetFieldId: 'string',
      },
    };
  });

  describe('validate', () => {
    it('null--should throw error', () => {
      expect(() => fieldClass.validate(null, field)).toThrow(/^api_params_lookup_can_not_operate$/);
    });
  });
});

describe('LastModifiedTimeField', () => {
  let fieldClass;
  let field: ILastModifiedTimeField;
  beforeAll(() => {
    fieldClass = new LastModifiedTimeField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '公式',
      type: FieldType.LastModifiedTime,
      property: {
        datasheetId: 'string',
        // 日期格式
        dateFormat: DateFormat['YYYY-MM-DD'],
        // 时间格式
        timeFormat: TimeFormat['HH:mm'],
        // 是否包含时间
        includeTime: true,
        // 依赖的字段集合类型
        collectType: CollectType.AllFields,
        // 依赖的字段
        fieldIdCollection: ['aaa'],
      },
    };
  });

  describe('validate', () => {
    it('null--should throw error', () => {
      expect(() => fieldClass.validate(null, field)).toThrow(/^api_params_updated_time_can_not_operate$/);
    });
  });
});

describe('LastModifiedByField', () => {
  let fieldClass;
  let field: ILastModifiedByField;
  beforeAll(() => {
    fieldClass = new LastModifiedByField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '公式',
      type: FieldType.LastModifiedBy,
      property: {
        datasheetId: 'string',
        uuids: ['aaa'],
        // 依赖的字段集合类型
        collectType: CollectType.AllFields,
        // 依赖的字段
        fieldIdCollection: ['aaa'],
      },
    };
  });

  describe('validate', () => {
    it('null--should throw error', () => {
      expect(() => fieldClass.validate(null, field)).toThrow(/^api_params_updatedby_can_not_operate$/);
    });
  });
});
