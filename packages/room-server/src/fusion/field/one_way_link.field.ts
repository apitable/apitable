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

import { ApiTipConstant, ICellValue, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FieldManager } from 'fusion/field.manager';
import { BaseField } from 'fusion/field/base.field';
import { FusionApiRecordService } from 'fusion/services/fusion.api.record.service';
import { IFieldValue } from 'shared/interfaces';

@Injectable()
export class OneWayLinkField extends BaseField implements OnModuleInit, OnApplicationBootstrap {
  private recordService: FusionApiRecordService | undefined;

  constructor(private moduleRef: ModuleRef) {
    super();
  }

  onModuleInit(): any {
    this.recordService = this.moduleRef.get(FusionApiRecordService, { strict: false });
  }

  override validate(fieldValue: IFieldValue[], field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (Array.isArray(fieldValue)) {
      // Empty arrays are not allowed
      if (!fieldValue.length) this.throwException(field, ApiTipConstant.api_params_link_field_recordids_empty_error, extra);
      if (field.property.limitSingleRecord && fieldValue.length > 1) {
        // Only single
        this.throwException(field, ApiTipConstant.api_params_link_field_records_max_count_error, extra);
      }
    } else {
      this.throwException(field, ApiTipConstant.api_param_link_field_type_error, extra);
    }
  }

  override async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    // Deduplicate data
    const cellValue: string[] = Array.from(new Set(fieldValue as string[]));
    // Verify presence
    await this.recordService!.validateRecordExists(field.property.foreignDatasheetId, cellValue,
      ApiTipConstant.api_params_link_field_recordids_not_exists);
    return fieldValue as ICellValue;
  }

  onApplicationBootstrap(): any {
    FieldManager.setService(OneWayLinkField.name, this);
  }
}
