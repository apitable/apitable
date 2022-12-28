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

// Only the JSON type is exported, because the text type is deprecated
// otherwise. (If you want to use it somewhere, you're welcome to pull it out
// into a separate module that json0 can depend on).
import { Strings, t } from '../../exports/i18n';
import json0 from 'ot-json0/lib/json0';
import { IJot } from './interface';

export * from './interface';
export * from './compose';

export const jot: IJot = {
  ...json0,
  apply(json, actions) {
    try {
      return json0.apply(json, actions);
    } catch (e) {
      if ((e as Error).message === 'invalid / missing instruction in op') {
        throw new Error(t(Strings.missing_instruction_op_error), { cause: e });
      } else {
        throw e;
      }
    }
  }
};
