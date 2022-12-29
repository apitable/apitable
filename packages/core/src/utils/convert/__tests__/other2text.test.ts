import { str2text } from '..';
import assert from 'assert';
import cases from './other2text.test.json';

describe('test convert text to number', () => {
  it('should convert string to number correctly', () => {
    const { validCases, invalidCases } = cases;
    for (let i = 0; i < invalidCases.length; i++) {
      const { args, expected } = invalidCases[i]!;
      const result = str2text.apply(null, args as [string]);
      assert.deepEqual(result, expected, `bad case: str2text(${args.join(',')})`);
    }

    for (let i = 0; i < validCases.length; i++) {
      const { args, expected } = validCases[i]!;
      const result = str2text.apply(null, args as [string]);
      assert.deepEqual(result, expected, `bad case: str2text(${args.join(',')})`);
    }
  });
});
