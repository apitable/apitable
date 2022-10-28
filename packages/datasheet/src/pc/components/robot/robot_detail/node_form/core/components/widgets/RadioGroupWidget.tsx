import { IWidgetProps } from '../../interface';
// Use antd first, then replace it with your own component
import { Radio } from 'antd';
import { literal2Operand } from '../../../ui/utils';
import { getLiteralOperandValue } from '@apitable/core';

export const RadioGroupWidget = ({
  schema,
  label,
  id,
  disabled,
  options,
  value,
  autofocus,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: IWidgetProps) => {
  const { enumOptions } = options;
  const _value = getLiteralOperandValue(value);
  const _onChange = e => {
    const newValue = literal2Operand(e.target.value);
    onChange(newValue);
  };
  return (
    <Radio.Group onChange={_onChange} value={_value}>
      {
        (enumOptions as any[])?.map(item => <Radio value={item.value}>{item.label}</Radio>)
      }
    </Radio.Group>
  );
};
