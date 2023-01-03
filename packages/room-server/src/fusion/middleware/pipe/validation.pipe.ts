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

import { ApiTipConstant } from '@apitable/core';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import qs from 'qs';
import { ApiException, ApiTipId } from 'shared/exception';

/**
 * Global parameter validation pipe
 * @author Zoe zheng
 * @date 2020/8/7 6:11 PM
 */
@Injectable()
export class ValidationPipe implements PipeTransform {

  /**
   *
   * get parameters that need to be validated
   * @param metaType parameters metaType
   * @return
   * @author Zoe Zheng
   * @date 2020/8/4 4:05 PM
   */
  private static toValidate(metaType: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }

  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }
    let object;
    try {
      object = plainToClass(
        metatype,
        qs.parse(value, {
          allowDots: true,
          parseArrays: true,
        }),
      );
    } catch (e) {
      throw ApiException.tipError(ApiTipConstant.api_param_default_error);
    }
    // return the first error
    const errors = await validate(object);
    if (errors.length) {
      const validationError = this.getSingleError(errors);
      const messageId = Object.values(validationError.constraints!)[0] as ApiTipId;
      let contexts = {};
      if (validationError.contexts) {
        contexts = Object.values(validationError.contexts)[0];
      }
      throw ApiException.tipError(messageId, { ...contexts });
    }
    return object;
  }

  private getSingleError(errors: ValidationError[]): ValidationError {
    const validationError: ValidationError = errors[0]!;
    if (validationError.constraints) {
      return validationError;
    }
    return this.getSingleError(validationError.children);
  }
}
