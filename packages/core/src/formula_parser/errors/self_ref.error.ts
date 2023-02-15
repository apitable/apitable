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

import { t, Strings } from 'exports/i18n';

/**
 * The error for formula expression parser 
 * references the column itself.
 */
export class SelfRefError extends Error {

  constructor() {
    
    // ideally, don't translation in `super` constructor
    // for compatibility of front-end i18n messages
    super(SelfRefError.parseI18NMessage());

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SelfRefError.prototype);
  }

  private static parseI18NMessage(): string {
    return t(Strings.function_err_no_ref_self_column);
  }
}