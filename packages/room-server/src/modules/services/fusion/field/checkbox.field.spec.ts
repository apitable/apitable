import { FieldType, ICheckboxField } from '@apitable/core';
import { CheckboxField } from 'modules/services/fusion/field/checkbox.field';

describe('CheckBoxField', () => {
  let fieldClass: CheckboxField;
  let field: ICheckboxField;
  beforeAll(() => {
    fieldClass = new CheckboxField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '复选框',
      type: FieldType.Checkbox,
      property: { icon: 'haha' }
    };
  });

  describe('validate', () => {
    it('null--should return null', () => {
      expect(() => fieldClass.validate(null, field)).not.toThrow();
    });

    it('not boolean--should throw an error', () => {
      expect(() => fieldClass.validate(1, field)).toThrow(/^api_param_checkbox_field_type_error$/);
    });
  });
});
