import { FieldType, INumberField } from '@apitable/core';
import { NumberField } from 'modules/services/fusion/field/number.field';

describe('BaseNumberField', () => {
  let fieldClass: NumberField;
  let field: INumberField;
  beforeAll(() => {
    fieldClass = new NumberField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '数字',
      type: FieldType.Number,
      property: { precision: 0, defaultValue: null },
    };
  });

  describe('validate', () => {
    it('null--should return null', () => {
      expect(() => fieldClass.validate(null, field, { field: 'fldpRxaCC8Mhe' })).not.toThrow();
    });

    it('not number--should throw error', () => {
      expect(() => fieldClass.validate('null', field, { field: 'fldpRxaCC8Mhe' }))
        .toThrow(/^api_param_number_field_type_error$/);
    });
  });
});
