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
 * Params Error Type, used to identify the error type and error message
 */
export enum ParamsErrorType {
  NotEquals,
  AtLeastCount,
}

export class ParamsCountError extends Error {

  private _type: ParamsErrorType; 
  private _paramsName: string;
  private _paramsCount: number;

  constructor(type: ParamsErrorType, paramsName: string, paramsCount: number) {
    
    // ideally, don't translation in `super` constructor
    // for compatibility of front-end i18n messages
    super(ParamsCountError.parseI18NMessage(type, paramsName, paramsCount));

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ParamsCountError.prototype);

    this._type = type;
    this._paramsName = paramsName;
    this._paramsCount = paramsCount;
  }

  private static parseI18NMessage(type: ParamsErrorType, paramsName: string, paramsCount: number): string {
    let errorMessage: string;
    switch (type) {
      case ParamsErrorType.NotEquals:
        errorMessage = t(Strings.function_validate_params_count_at_least,{
          name: paramsName, 
          count: paramsCount });
        break;
      case ParamsErrorType.AtLeastCount:
        errorMessage = t(Strings.function_validate_params_count_at_least,{
          name: paramsName, 
          count: paramsCount,
        });
        break;
    }
    return errorMessage;
  }

  public get type() : ParamsErrorType {
    return this._type;
  }

  public get paramsName(): string {
    return this._paramsName;
  }

  public get paramsCount(): number {
    return this._paramsCount;
  }

}