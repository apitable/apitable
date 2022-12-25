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

import * as crypto from 'crypto';
import { join } from 'path';
import { LiteralObject } from '@nestjs/common';
import { extend } from 'lodash';

export abstract class BaseOssStore {
  protected abstract handleResponse(cb: any): any;

  protected options: any;

  protected constructor(args: LiteralObject) {
    this.options = extend({
      region: '',
      path: process.env.NODE_ENV,
      bucket: '',
      // whether or not to parse json
      parse: true,
      // file suffix
      fileSuffix: '.json'
    }, args);
  }

  protected getFileNameByKey(key: string): string {
    const keys = key.split(':');
    let filePath = this.options.path;
    for (let i = 0; i < keys.length - 1; i++) {
      filePath = join(filePath, keys[i]!);
    }
    const hash = crypto.createHash('md5').update(key + '').digest('hex');
    return join(filePath, hash + this.options.fileSuffix);
  }

}
