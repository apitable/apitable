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

import { ApiTipConstant, Field, getFieldClass, getFieldTypeByString, getNewId, IDPrefix, IField, IReduxState } from '@apitable/core';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { FieldCreateRo } from 'fusion/ros/field.create.ro';
import { ApiException } from 'shared/exception';
import { CreateDatasheetPipe } from './create.datasheet.pipe';

@Injectable()
export class CreateFieldPipe implements PipeTransform {

  constructor(
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) {
  }

  transform(ro: FieldCreateRo): FieldCreateRo {
    this.validate(ro);
    this.transformProperty(ro);
    return ro;
  }

  public transformProperty(field: FieldCreateRo) {
    const pipe = new CreateDatasheetPipe(this.request);
    pipe.transformProperty([field]);
  }

  public validate(field: FieldCreateRo) {
    if (!field.name) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'name' });
    }
    if (field.name && field.name.length > 100) {
      throw ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
    }
    const fieldType = getFieldTypeByString(field.type as any)!;
    if (!fieldType) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'type', value: field.type });
    }
    const fieldInfo = {
      id: getNewId(IDPrefix.Field),
      name: field.name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
    const { error } = fieldContext.validateAddOpenFieldProperty(field.property || null);
    if (error) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'property', value: field.property });
    }
    return true;
  }

}