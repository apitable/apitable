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
  CollectType, DateFormat, FieldType, IAutoNumberField, ICreatedByField, ICreatedTimeField, IFormulaField, ILastModifiedByField,
  ILastModifiedTimeField, ILookUpField, TimeFormat
} from '@apitable/core';
import { AutoNumberField } from 'fusion/field/auto.number.field';
import { CreatedByField } from 'fusion/field/created.by.field';
import { CreatedTimeField } from 'fusion/field/created.time.field';
import { FormulaField } from 'fusion/field/formula.field';
import { LastModifiedByField } from 'fusion/field/last.modified.by.field';
import { LastModifiedTimeField } from 'fusion/field/last.modified.time.field';
import { LookUpField } from 'fusion/field/look.up.field';

describe('AutoNumberField', () => {
  let fieldClass: AutoNumberField;
  let field: IAutoNumberField;

  beforeAll(() => {
    fieldClass = new CreatedTimeField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Created time',
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
      name: 'Created time',
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
  let fieldClass: CreatedByField;
  let field: ICreatedByField;

  beforeAll(() => {
    fieldClass = new CreatedByField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Created by',
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
  let fieldClass: FormulaField;
  let field: IFormulaField;

  beforeAll(() => {
    fieldClass = new FormulaField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Formula',
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
  let fieldClass: LookUpField;
  let field: ILookUpField;

  beforeAll(() => {
    fieldClass = new LookUpField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Formula',
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
  let fieldClass: LastModifiedTimeField;
  let field: ILastModifiedTimeField;

  beforeAll(() => {
    fieldClass = new LastModifiedTimeField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Last edited time',
      type: FieldType.LastModifiedTime,
      property: {
        datasheetId: 'string',
        // date format
        dateFormat: DateFormat['YYYY-MM-DD'],
        // time format
        timeFormat: TimeFormat['HH:mm'],
        // does it include time
        includeTime: true,
        // dependent field collection type
        collectType: CollectType.AllFields,
        // dependent fields
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
  let fieldClass: LastModifiedByField;
  let field: ILastModifiedByField;

  beforeAll(() => {
    fieldClass = new LastModifiedByField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Last edited by',
      type: FieldType.LastModifiedBy,
      property: {
        datasheetId: 'string',
        uuids: ['aaa'],
        // dependent field collection type
        collectType: CollectType.AllFields,
        // dependent fields
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
