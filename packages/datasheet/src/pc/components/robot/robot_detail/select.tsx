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

// eslint-disable-next-line no-restricted-imports
import { useControllableValue } from 'ahooks';
import { DropdownSelect as SelectBase } from '@apitable/components';

/**
 * Wrapping of component select component, in order not to affect the existing component logic, now wrap a layer here. Support for controllable values
 */
export const Select = (props: { value?: any; onChange?: (value: any) => void; options: any[]; disabled?: boolean; placeholder?: string }) => {
  const [state] = useControllableValue<any>(props);
  const { disabled, onChange, options, placeholder } = props;
  const handleChange = (option: { value: any }) => {
    // setState(option.value);
    onChange && onChange(option.value);
  };
  return <SelectBase disabled={disabled} placeholder={placeholder} options={options} value={state} onSelected={handleChange} />;
};
