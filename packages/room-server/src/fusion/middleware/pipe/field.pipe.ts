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

import { ApiTipConstant, FieldKeyEnum, FieldType, ICellValue, IField, IMeta, ISelectField, SelectField } from '@apitable/core';
import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DatasheetRecordService } from 'database/datasheet/services/datasheet.record.service';
import { FastifyRequest } from 'fastify';
import { FieldManager } from 'fusion/field.manager';
import { flatten, isEmpty, keyBy } from 'lodash';
import {
  API_MAX_MODIFY_RECORD_COUNTS,
  DATASHEET_ENRICH_SELECT_FIELD,
  DATASHEET_HTTP_DECORATE,
  DATASHEET_LINKED,
  DATASHEET_MEMBER_FIELD,
  DATASHEET_META_HTTP_DECORATE,
  InjectLogger,
} from 'shared/common';
import { FieldTypeEnum } from 'shared/enums/field.type.enum';
import { ApiException } from 'shared/exception';
import { IFieldRoTransformOptions, IFieldValue, IFieldValueMap } from 'shared/interfaces';
import { Logger } from 'winston';

/**
 * Field pipe transformer, get fieldId, memberId and spaceId by fieldName
 */
@Injectable()
export class FieldPipe implements PipeTransform {
  constructor(
    private readonly recordService: DatasheetRecordService,
    @InjectLogger() private readonly logger: Logger,
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) {
  }

  // no use function
  async transform(value: any, _: ArgumentMetadata): Promise<any> {
    const datasheet = this.request[DATASHEET_HTTP_DECORATE];
    const meta = this.request[DATASHEET_META_HTTP_DECORATE] as IMeta;
    let fieldMap = meta.fieldMap;
    if (value.fieldKey === FieldKeyEnum.NAME) {
      fieldMap = keyBy(Object.values(meta.fieldMap), 'name');
    }
    const records: any[] = [];
    for (const record of value.records) {
      const fields: IFieldValueMap = {};
      for (const fieldKey of Object.keys(record.fields)) {
        const field = fieldMap[fieldKey];
        const fieldValue = record.fields[fieldKey];
        if (field) {
          this.validate(fieldValue, field, { field: value.fieldKey === FieldKeyEnum.NAME ? field.name : field.id });
          // options field
          if ([FieldType.SingleSelect, FieldType.MultiSelect].includes(field.type)) {
            const {
              property: { options },
            } = field as ISelectField;
            const existOptions: typeof options = this.request[DATASHEET_ENRICH_SELECT_FIELD][field.id]?.property.options || options;
            if (fieldValue == null) {
              fields[field.id] = null;
              continue;
            }
            const transformedOptionIds = flatten([fieldValue]).filter(value => !isEmpty(value)).map(optionValue => {
              const { option, isCreated } = SelectField.getOrCreateNewOption({ name: optionValue }, existOptions);
              if (isCreated) {
                existOptions.push(option);
                (field as ISelectField).property.options = existOptions;
                this.request[DATASHEET_ENRICH_SELECT_FIELD][field.id] = field;
              }
              return option.id;
            });
            fields[field.id] = field.type === FieldType.SingleSelect ? transformedOptionIds[0]! : transformedOptionIds;
          } else {
            // transform
            fields[field.id] = await this.fieldTransform(fieldValue, field, {
              spaceId: datasheet.spaceId,
              fieldMap: meta.fieldMap,
            });
          }
          // collect recordIds if it is link type field
          if (field.type === FieldType.Link || field.type == FieldType.OneWayLink) {
            const foreignDatasheetId = field.property.foreignDatasheetId;
            const linkRecordIds: string[] = [];
            if (fields[field.id]) {
              linkRecordIds.push(...(fields[field.id] as string[]));
            }
            // complete the information if it is link type field
            if (record.recordId) {
              const result = await this.recordService.getLinkRecordIdsByRecordIdAndFieldId(datasheet.dstId, record.recordId, field.id);
              if (result) {
                linkRecordIds.push(...result);
              }
            }
            if (linkRecordIds && linkRecordIds.length) {
              if (this.request[DATASHEET_LINKED].hasOwnProperty(foreignDatasheetId)) {
                this.request[DATASHEET_LINKED][foreignDatasheetId].push(...linkRecordIds);
              } else {
                this.request[DATASHEET_LINKED][foreignDatasheetId] = linkRecordIds;
              }
            }
          }
          // transform member field
          if (field.type === FieldType.Member && field.property.shouldSendMsg && fields[field.id]) {
            this.request[DATASHEET_MEMBER_FIELD].add(fieldKey);
          }
        }
      }
      if (!Object.keys(fields).length) throw ApiException.tipError(ApiTipConstant.api_params_invalid_fields_value);
      record.fields = fields;
      records.push(record);
    }
    if (records.length > API_MAX_MODIFY_RECORD_COUNTS) {
      throw ApiException.tipError(ApiTipConstant.api_params_records_max_count_error, { count: API_MAX_MODIFY_RECORD_COUNTS });
    }
    value.records = records;
    return value;
  }

  private validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string }) {
    // validate fields value while there is no null value, null means clear the value for updating APIs
    const validator = this.getFieldManager(field);
    validator.validate(fieldValue, field, extra);
  }

  private fieldTransform(fieldValue: IFieldValue, field: IField, options: IFieldRoTransformOptions): ICellValue | null {
    // transform the field value while there is no null value
    if (fieldValue != null) {
      const transformer = this.getFieldManager(field);
      return transformer.roTransform(fieldValue, field, options);
    }
    return null;
  }

  private getFieldManager(field: IField) {
    const validator = FieldManager.findService(FieldTypeEnum.get(field.type)!.name);
    // without validator
    if (!validator) {
      this.logger.error(JSON.stringify({ validator: FieldTypeEnum.get(field.type)!.name, trace: 'field validator not found' }));
      FieldManager.findService(FieldTypeEnum.get(FieldType.NotSupport)!.name).throwException(field, ApiTipConstant.api_params_invalid_value);
    }
    return validator;
  }
}
