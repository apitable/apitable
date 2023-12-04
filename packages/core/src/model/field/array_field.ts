import { FOperator } from 'types/view_types';
import { Field } from './field';

export abstract class ArrayValueField extends Field {
  // Who sets the value of the field need to specify the value type in the array
  static _acceptFilterOperators = [
    FOperator.Is,
    FOperator.IsNot,
    FOperator.Contains,
    FOperator.DoesNotContain,
    FOperator.IsEmpty,
    FOperator.IsNotEmpty,
    FOperator.IsRepeat,
  ];

  get acceptFilterOperators() {
    return ArrayValueField._acceptFilterOperators;
  }

  // Convert the custom type value in the original cellValue array to the basic type, no custom data structure is allowed
  abstract cellValueToArray(cellValue: any): (number | string | boolean)[] | null;

  // Different from cellValueToString, here is to convert the value of the underlying type returned by cellValueToArray into a string.
  // Most of the fields of arrayValueToString can be directly joined, and the format of number dataTime needs to be formatted first.
  abstract arrayValueToString(cellValues: any[] | null): string | null;
}

