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

import { BasicValueType } from 'types';
import { isServer } from 'utils/env';

// album(gallery) view has no cover field ID
export const NO_COVER_FIELD_ID = 'NO_COVER_FIELD_ID';

export const DEFAULT_TIME_ZONE = isServer() && (process.env.TZ || process.env.TIMEZONE) || 'America/Toronto';

export const ValueTypeMap = {
  [BasicValueType.Number]: 'number',
  [BasicValueType.String]: 'string',
  [BasicValueType.Boolean]: 'boolean',
  [BasicValueType.Array]: 'array',
  [BasicValueType.DateTime]: 'string',
};
