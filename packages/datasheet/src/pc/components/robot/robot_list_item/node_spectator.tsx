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

import { useTheme } from '@apitable/components';

export const NodeSpectator = () => {
  const theme = useTheme();
  return (
    <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        // eslint-disable-next-line max-len
        d="M0.758154 7.54292C0.424911 7.74383 0 7.50384 0 7.11472L0 0.885052C0 0.495981 0.424815 0.255987 0.758061 0.456794L5.92592 3.57085C6.24846 3.76521 6.24851 4.23288 5.92601 4.42731L0.758154 7.54292Z"
        fill={theme.color.fc3}
      />
    </svg>
  );
};
