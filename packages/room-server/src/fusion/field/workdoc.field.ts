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
import { FieldManager } from 'fusion/field.manager';
import { IFieldValue } from 'shared/interfaces';
import { BaseField } from './base.field';

@Injectable()
export class WorkDocField extends BaseField implements OnApplicationBootstrap {
  constructor() {
    super();
  }

  onApplicationBootstrap(): any {
    FieldManager.setService(WorkDocField.name, this);
  }

  override validate(fieldValues: IFieldValue, field: IField) {
    if (fieldValues === null) return;
    this.throwException(field, ApiTipConstant.api_params_workdoc_can_not_operate);
  }
}
