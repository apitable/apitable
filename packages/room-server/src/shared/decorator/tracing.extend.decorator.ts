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

import { Logger } from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import { enableOtelJaeger } from 'app.environment';
import { merge } from 'lodash';

export function SpanAddTag(attributes: Attributes[]): MethodDecorator {
  const logger = new Logger('SpanAddTagDecorator');

  return (
    _target: object,
    _key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const _this = descriptor.value;

    descriptor.value = function(...args: any[]) {
      try {
        if (enableOtelJaeger) {
          const attrs = {};
          attributes.forEach(attr => merge(attrs, typeof attr === 'function' ? attr(args) : attr));
          trace.getActiveSpan()?.setAttributes(attrs);
        }
      } catch (e) {
        // ignore
        logger.warn(`set tracking attributes, error：${(e as Error)?.message}`);
      }
      return _this.apply(this, args);
    };
    return descriptor;
  };
}

declare type Attributes = ((args: any[]) => { [key: string]: string }) | { [key: string]: string };