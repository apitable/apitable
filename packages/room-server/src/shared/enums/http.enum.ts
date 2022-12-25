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

import Enum from 'shared/enums/enum';

export enum FusionApiVersion {
  /**
   * v1.1 version
   */
  V11 = '1.1',
  /**
   * default version is v1.0
   */
  V10 = '1.0',
}

export const ApiHttpMethod = new Enum([
  { key: 'get', value: 1 },
  { key: 'post', value: 2 },
  { key: 'patch', value: 3 },
  { key: 'put', value: 4 },
]);
