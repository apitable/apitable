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

import { ApiTipConstant, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseField } from 'fusion/field/base.field';
import { IFieldValue } from 'shared/interfaces';
import { FieldManager } from '../field.manager';
import { IFieldValidatorInterface } from '../i.field.validator.interface';

@Injectable()
export class NotSupportField extends BaseField implements OnApplicationBootstrap, IFieldValidatorInterface {
  override validate(_fieldValue: IFieldValue, field: IField): void {
    this.throwException(field, ApiTipConstant.api_param_default_error);
  }

  onApplicationBootstrap() {
    FieldManager.setService(NotSupportField.name, this);
  }
}
