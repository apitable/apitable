import { str2timestamp } from '../other2timestamp';
import assert from 'assert';
import cases from './other2timestamp.test.json';

// function getField(): DateTimeField {
//   const table: IDateTimeField = {
//     property: {
//       // 日期格式
//       dateFormat: 0,
//       // 时间格式
//       timeFormat: 0,
//       // 新增记录时是否自动填入创建时间
//       includeTime: false,
//       autoFill: true,
//     },
//     type: FieldType.DateTime,
//     id: '1',
//     name: 'test',
//   };
//   const field = new DateTimeField(table);
//   return field;
// }

describe('other2timestamp', () => {
  it('should convert string to timestamp correctly', () => {
    const { validCases, invalidCases, validDDMMYYCases } = cases;
    for (let i = 0; i < invalidCases.length; i++) {
      const { args, expected } = invalidCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case ${i}: str2timestamp(${args.join(',')})`);
    }

    for (let i = 0; i < validCases.length; i++) {
      const { args, expected } = validCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case: str2timestamp(${args.join(',')})`);
    }

    // const field = getField().field;
    // field.property.dateFormat = DateFormat['YYYY/MM/DD'];

    for (let i = 0; i < validCases.length; i++) {
      const { args, expected } = validCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case: str2timestamp(${args.join(',')})`);
    }

    for (let i = 0; i < invalidCases.length; i++) {
      const { args, expected } = invalidCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case: str2timestamp(${args.join(',')})`);
    }

    // field.property.dateFormat = DateFormat['YYYY-MM-DD'];

    for (let i = 0; i < validCases.length; i++) {
      const { args, expected } = validCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case: str2timestamp(${args.join(',')})`);
    }

    for (let i = 0; i < invalidCases.length; i++) {
      const { args, expected } = invalidCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case: str2timestamp(${args.join(',')})`);
    }

    // field.property.dateFormat = DateFormat['DD/MM/YYYY'];

    for (let i = 0; i < validDDMMYYCases.length; i++) {
      const { args, expected } = validDDMMYYCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case ${i}: str2timestamp(${args.join(',')})`);
    }

    for (let i = 0; i < invalidCases.length; i++) {
      const { args, expected } = invalidCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case ${i}: str2timestamp(${args.join(',')})`);
    }

    // field.property.dateFormat = DateFormat['MM-DD'];

    // const expectDate = new Date('2018-01-02');
    // let timestamp = str2timestamp('0102');
    // let date = new Date(timestamp!);
    // expect(date.getMonth()).toEqual(expectDate.getMonth());
    // expect(date.getDate()).toEqual(expectDate.getDate());
    // timestamp = str2timestamp('01/02');
    // date = new Date(timestamp!);
    // expect(date.getMonth()).toEqual(expectDate.getMonth());
    // expect(date.getDate()).toEqual(expectDate.getDate());
    // timestamp = str2timestamp('01-02');
    // date = new Date(timestamp!);
    // expect(date.getMonth()).toEqual(expectDate.getMonth());
    // expect(date.getDate()).toEqual(expectDate.getDate());

    for (let i = 0; i < invalidCases.length; i++) {
      const { args, expected } = invalidCases[i]!;
      const result = str2timestamp(args[0]!);
      assert.deepEqual(result, expected, `bad case: str2timestamp(${args.join(',')})`);
    }
  });
});
