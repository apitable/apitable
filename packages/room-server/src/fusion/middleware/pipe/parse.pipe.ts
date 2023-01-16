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

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { isString } from 'class-validator';

@Injectable()
export class ParseObjectPipe implements PipeTransform<string, Object> {
  transform(value: string, metadata: ArgumentMetadata): Object {
    try {
      if (!isString(value)) {
        return value;
      }
      return plainToClass<any, Object>(metadata.metatype as ClassType<any>, JSON.parse(value));
    } catch (e) {
      throw new BadRequestException('Bad Request');
    }
  }
}
