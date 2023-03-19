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

import { StatusCode } from 'config';
import { Strings, t } from 'exports/i18n';
import { ErrorCode, ErrorType } from 'types';

export const OVER_LIMIT_PER_SHEET_RECORDS = '305';
export const OVER_LIMIT_SPACE_RECORDS = '309';
const OVER_LIMIT_GANTT_VIEW_NUMBER = '307';
const OVER_LIMIT_CALENDAR_NUMBER = '308';

export const errorCapture = <T extends { event: { onError?(e: any, type?: 'modal' | 'subscribeUsage'): void } }>() => {
  return (_target: T, name: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;

    return {
      configurable: true,

      get(this: T) {
        const boundFn = fn.bind(this);
        Reflect.defineProperty(this, name, {
          value: boundFn,
          configurable: true,
          writable: true,
        });
        const i18nMessage = (code: number, message: string) => {
          switch (code) {
            case 50000:
              return t(Strings.socket_error_server);
            case 50001:
              return t(Strings.socket_error_network);
            case StatusCode.FRONT_VERSION_ERROR:
              return t(Strings.front_version_error_desc);
          }
          return message;
        };

        const getErrorType = (code: string) => {
          if ([OVER_LIMIT_PER_SHEET_RECORDS, OVER_LIMIT_SPACE_RECORDS, OVER_LIMIT_GANTT_VIEW_NUMBER, OVER_LIMIT_CALENDAR_NUMBER].includes(code)) {
            return 'subscribeUsage';
          }
          return;
        };

        const onError = (e: any) => {
          const code = e.code || ErrorCode.CollaSyncError;
          this.event.onError && this.event.onError({
            ...e,
            type: ErrorType.CollaError,
            code: code,
            message: i18nMessage(code, e.message),
          }, getErrorType(code));

          throw e;
        };

        return (...args: any[]) => {
          try {

            const promise = boundFn(...args);
            // If it is a promise, you need to listen catch catch
            if (promise instanceof Promise) {
              promise.catch(e => {
                onError(e);
              });
            }

            return promise;
          } catch (e) {
            onError(e);
          }
        };
      },
    };
  };
};
