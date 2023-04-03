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

import { ApiTipConstant, ICellValue, IField, IHyperlinkSegment, SegmentType } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { isObject } from 'class-validator';
import { FieldManager } from 'fusion/field.manager';
import { BaseTextField } from 'fusion/field/base.text.field';
import { isString } from 'lodash';
import { ApiException } from 'shared/exception';
import { IFieldValue } from 'shared/interfaces';

@Injectable()
export class UrlField extends BaseTextField implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    FieldManager.setService(UrlField.name, this);
  }

  // eslint-disable-next-line require-await
  override async roTransform(fieldValue: IFieldValue, _field: IField): Promise<ICellValue> {
    if (fieldValue == null) {
      return null;
    }
    if (isString(fieldValue)) {
      return [
        {
          text: fieldValue!.toString(),
          type: SegmentType.Text,
        },
      ];
    }
    const cellValue: IHyperlinkSegment = {
      link: fieldValue['text'],
      text: fieldValue['text'],
      title: fieldValue['title'],
      type: SegmentType.Url,
      favicon: fieldValue['favicon']
    };
    return [cellValue];
  }

  override validate(fieldValue: IFieldValue, field: IField) {
    if (fieldValue === null) return;
    if (isObject(fieldValue)) {
      if (!fieldValue['text']) {
        throw ApiException.tipError(ApiTipConstant.api_params_instance_error, { property: field.name, value: 'text' });
      }
      return;
    }
    if (!isString(fieldValue)) {
      throw ApiException.tipError(ApiTipConstant.api_param_url_field_type_error, { field: field.name });
    }
  }
}
