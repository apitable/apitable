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

// Use antd first, then replace it with your own component
import { Radio } from 'antd';
import { getLiteralOperandValue } from '@apitable/core';
import { literal2Operand } from '../../../ui/utils';
import { IWidgetProps } from '../../interface';

export const RadioGroupWidget = ({ options, value, onChange }: IWidgetProps) => {
  const { enumOptions } = options;
  const _value = getLiteralOperandValue(value);
  const _onChange = (e: any) => {
    const newValue = literal2Operand(e.target.value);
    onChange(newValue);
  };
  return (
    <Radio.Group onChange={_onChange} value={_value}>
      {(enumOptions as any[])?.map((item) => (
        <Radio key={item.value} value={item.value}>
          {item.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};
