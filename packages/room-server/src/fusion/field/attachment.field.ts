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

import { ApiTipConstant, getNewId, IAttachmentValue, ICellValue, IDPrefix, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { isString } from 'class-validator';
import { BaseField } from 'fusion/field/base.field';
import { IFieldValue } from 'shared/interfaces';
import { IAssetDTO } from 'shared/services/rest/rest.interface';
import { RestService } from 'shared/services/rest/rest.service';
import { FieldManager } from '../field.manager';

@Injectable()
export class AttachmentField extends BaseField implements OnApplicationBootstrap {
  constructor(private readonly restService: RestService) {
    super();
  }

  public override validate(fieldValues: IFieldValue, field: IField) {
    if (fieldValues === null) return;
    if (Array.isArray(fieldValues)) {
      fieldValues.forEach((value: any) => {
        if (!value) this.throwException(field, ApiTipConstant.api_params_instance_attachment_token_error);
        // Validate the necessary parameters
        if (!value.token) this.throwException(field, ApiTipConstant.api_params_instance_attachment_token_error);
        if (!value.name) this.throwException(field, ApiTipConstant.api_params_instance_attachment_name_error);
        // Validate the parameter type
        if (!isString(value.token)) this.throwException(field, ApiTipConstant.api_param_attachment_token_type_error);
        if (!isString(value.name)) this.throwException(field, ApiTipConstant.api_param_attachment_name_type_error);
      });
      return;
    }
    this.throwException(field, ApiTipConstant.api_param_attachment_array_type_error);
  }

  override async roTransform(fieldValues: IFieldValue[], field: IField): Promise<ICellValue> {
    const ids: string[] = [];
    const cellValues: IAttachmentValue[] = [];
    for (const value of fieldValues as any) {
      const asset: IAssetDTO = (await this.restService.getAssetInfo(value.token))!;
      if (!asset) {
        this.throwException(field, ApiTipConstant.api_param_attachment_not_exists);
        break;
      }
      cellValues.push({
        id: getNewId(IDPrefix.File, ids),
        name: value.name,
        size: asset.size,
        token: value.token,
        width: asset.width || undefined,
        height: asset.height || undefined,
        bucket: asset.bucket,
        mimeType: asset.mimeType,
        preview: asset.preview ? asset.preview : undefined,
      });
    }
    return cellValues;
  }

  onApplicationBootstrap(): any {
    FieldManager.setService(AttachmentField.name, this);
  }
}
