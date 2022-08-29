import { FieldType, ITextField } from '@vikadata/core';
import { TextField } from 'modules/services/fusion/field/text.field';

describe('BaseTextField', () => {
  let fieldClass: TextField;
  let field: ITextField;
  beforeAll(() => {
    fieldClass = new TextField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: '文本',
      type: FieldType.Text,
      property: null,
    };
  });

  describe('validate', () => {
    it('null--should return null', () => {
      expect(() => fieldClass.validate(null, field)).not.toThrow();
    });
    it('not text--should throw an error', () => {
      expect(() => fieldClass.validate(1, field)).toThrow(/^api_param_text_field_type_error$/);
    });
  });
});
