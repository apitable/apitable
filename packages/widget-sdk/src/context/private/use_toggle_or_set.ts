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

import { useToggle } from 'ahooks';

// To be compatible with ahooks-v2.
// - see: https://ahooks.js.org/hooks/use-toggle
// - toggle no longer accepts parameters
// - Added set

export default function useToggleOrSet(
  defaultValue: boolean = false
): [boolean, { toggle: (defaultValue?: boolean) => void }] {
  const [state, { toggle, set }] = useToggle(defaultValue);

  function toggleOrSet(value?: boolean): void {
    if (value === undefined) {
      toggle();
    } else {
      set(value);
    }
  }

  return [state, { toggle: toggleOrSet }];
}
