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

import { WidgetProps } from '@rjsf/core';
import { Checkbox } from '@apitable/components';

const selectValue = (value: any, selected: any, all: any) => {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
};

const deselectValue = (value: any, selected: any) => {
  return selected.filter((v: any) => v !== value);
};

export const CheckboxesWidget = ({ id, options, value, onChange }: WidgetProps) => {
  const { enumOptions, enumDisabled } = options;

  const _onChange = (option: any, checked: boolean) => {
    const all = (enumOptions as any).map(({ value }: any) => value);
    if (checked) {
      onChange(selectValue(option.value, value, all));
    } else {
      onChange(deselectValue(option.value, value));
    }
  };
  return (
    <>
      {(enumOptions as any).map((option: any, index: number) => {
        const checked = value.indexOf(option.value) !== -1;
        const itemDisabled = Boolean(enumDisabled && (enumDisabled as any).indexOf(option.value) !== -1);
        return (
          <div key={`${id}_${index}`} style={{ display: 'flex' }}>
            <Checkbox checked={checked} disabled={itemDisabled} onChange={(value) => _onChange(option, value)}>
              {option.label}
            </Checkbox>
          </div>
        );
      })}
    </>
  );
};
