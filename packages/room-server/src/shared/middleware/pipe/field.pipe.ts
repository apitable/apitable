import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTipConstant, FieldKeyEnum, FieldType, ICellValue, IField, ISelectField, SelectField } from '@apitable/core';
import {
  DATASHEET_ENRICH_SELECT_FIELD, DATASHEET_HTTP_DECORATE, DATASHEET_LINKED, DATASHEET_MEMBER_FIELD, DATASHEET_META_HTTP_DECORATE, InjectLogger
} from '../../common';
import { FieldTypeEnum } from 'shared/enums/field.type.enum';
import { ApiException } from '../../exception/api.exception';
import { FastifyRequest } from 'fastify';
import { IFieldRoTransformOptions, IFieldValue, IFieldValueMap } from '../../interfaces';
import { flatten, keyBy } from 'lodash';
import { DatasheetRecordService } from 'database/services/datasheet/datasheet.record.service';
import { FieldManager } from '../../../fusion/field.manager';
import { Logger } from 'winston';

/**
 * Field pipe transformer, get fieldId, memberId and spaceId by fieldName
 * @author Zoe zheng
 * @date 2020/8/7 5:45 PM
 */
@Injectable()
export class FieldPipe implements PipeTransform {
  constructor(
    private readonly recordService: DatasheetRecordService,
    @InjectLogger() private readonly logger: Logger,
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) { }

  /**
   * field transform
   * @param value
   * @param type
   * @param metatype
   * @return
   * @author Zoe Zheng
   * @date 2020/8/4 4:05 PM
   */
  async transform(value: any, { type, metatype }: ArgumentMetadata): Promise<any> {
    const datasheet = this.request[DATASHEET_HTTP_DECORATE];
    const meta = this.request[DATASHEET_META_HTTP_DECORATE];
    let fieldMap = meta.fieldMap;
    if (value.fieldKey === FieldKeyEnum.NAME) {
      fieldMap = keyBy(Object.values(meta.fieldMap), 'name');
    }
    const records: any[] = [];
    for (const index of Object.keys(value.records)) {
      const record = value.records[index];
      const fields: IFieldValueMap = {};
      for (const fieldKey of Object.keys(record.fields)) {
        const field = fieldMap[fieldKey];
        const fieldValue = record.fields[fieldKey];
        if (field) {
          this.validate(fieldValue, field, { field: value.fieldKey === FieldKeyEnum.NAME ? field.name : field.id });
          // options field
          if ([FieldType.SingleSelect, FieldType.MultiSelect].includes(field.type)) {
            const { property: { options }} = (field as ISelectField);
            const existOptions: typeof options = this.request[DATASHEET_ENRICH_SELECT_FIELD][field.id]?.property.options || options;
            if (fieldValue == null) {
              fields[field.id] = null;
              continue;
            }
            const transformedOptionIds = flatten([fieldValue]).map(optionValue => {
              const { option, isCreated } = SelectField.getOrCreateNewOption({ name: optionValue }, existOptions);
              if (isCreated) {
                existOptions.push(option);
                (field as ISelectField).property.options = existOptions;
                this.request[DATASHEET_ENRICH_SELECT_FIELD][field.id] = field;
              }
              return option.id;
            });
            fields[field.id] = field.type === FieldType.SingleSelect ? transformedOptionIds[0] : transformedOptionIds;
          } else {
            // transform
            fields[field.id] = await this.fieldTransform(fieldValue, field, {
              spaceId: datasheet.spaceId,
              fieldMap: meta.fieldMap,
            });
          }
          // collect recordIds if it is link type field
          if (field.type === FieldType.Link) {
            const foreignDatasheetId = field.property.foreignDatasheetId;
            const linkRecordIds: string[] = [];
            if (fields[field.id]) {
              linkRecordIds.push(...fields[field.id] as string[]);
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
    const validator = FieldManager.findService(FieldTypeEnum.get(field.type).name);
    // without validator
    if (!validator) {
      this.logger.error(JSON.stringify({ validator: FieldTypeEnum.get(field.type).name, trace: 'field validator not found' }));
      FieldManager.findService(FieldTypeEnum.get(FieldType.NotSupport).name).throwException(field, ApiTipConstant.api_params_invalid_value);
    }
    return validator;
  }
}
