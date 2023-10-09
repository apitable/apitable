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

import { DropdownSelect as Select } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { IWidgetProps } from '../../core/interface';
import { literal2Operand, operand2Literal } from '../utils';

export const SelectWidget = ({ options: { enumOptions }, value, onChange, rawErrors }: IWidgetProps) => {
  // const hasError = Boolean(rawErrors?.length);
  const style = { width: '100%' };
  // hasError ? { border: '1px solid red', width: '100%' } :

  return (
    <>
      <Select
        options={(enumOptions || []) as any}
        value={operand2Literal(value)}
        onSelected={(option) => {
          onChange(literal2Operand(option.value));
        }}
        dropdownMatchSelectWidth
        noDataTip={t(Strings.no_option)}
        triggerStyle={style}
        placeholder={t(Strings.robot_select_option)}
      />
    </>
  );
};
