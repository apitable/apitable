import { JSONSchema7 } from 'json-schema';
import { validateMagicForm } from '../validate';
import { formData, conditionSchema } from './mock_data';
describe('form validate', () => {

  it('oneOf conditionSchema', () => {
    const res = validateMagicForm(conditionSchema as JSONSchema7, formData);
    expect(res.errors.length).toEqual(1);
  });
});