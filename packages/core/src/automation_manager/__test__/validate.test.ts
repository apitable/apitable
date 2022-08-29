import { JSONSchema7 } from 'json-schema';
import { validateMagicForm } from '../validate';
import { formData, conditionSchema } from './mock_data';
describe('测试表单校验', () => {

  it('测试 oneOf conditionSchema  校验', () => {
    const res = validateMagicForm(conditionSchema as JSONSchema7, formData);
    expect(res.errors.length).toEqual(1);
  });
});