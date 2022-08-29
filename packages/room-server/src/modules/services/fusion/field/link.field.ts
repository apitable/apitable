import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ICellValue, IField } from '@vikadata/core';
import { IFieldValue } from 'interfaces';
import { FieldManager } from 'modules/services/fusion/field.manager';
import { BaseField } from 'modules/services/fusion/field/base.field';
import { FusionApiRecordService } from 'modules/services/fusion/impl/fusion.api.record.service';

@Injectable()
export class LinkField extends BaseField implements OnModuleInit, OnApplicationBootstrap {
  private recordService: FusionApiRecordService;

  constructor(private moduleRef: ModuleRef) {
    super();
  }

  onModuleInit(): any {
    this.recordService = this.moduleRef.get(FusionApiRecordService, { strict: false });
  }

  validate(fieldValue: IFieldValue[], field: IField, extra?: { [key: string]: string }) {
    if (fieldValue === null) return;
    if (Array.isArray(fieldValue)) {
      // 不允许空数组
      if (!fieldValue.length) this.throwException(field, 'api_params_link_field_recordids_empty_error', extra);
      if (field.property.limitSingleRecord && fieldValue.length > 1) {
        // 只允许单个
        this.throwException(field, 'api_params_link_field_records_max_count_error', extra);
      }
    } else {
      this.throwException(field, 'api_param_link_field_type_error', extra);
    }
  }

  async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    // 去重
    const cellValue: string[] = Array.from(new Set(fieldValue as string[]));
    // 验证存在性
    await this.recordService.validateRecordExists(field.property.foreignDatasheetId, cellValue,
      'api_params_link_field_recordids_not_exists');
    return fieldValue as ICellValue;
  }

  onApplicationBootstrap(): any {
    FieldManager.setService(LinkField.name, this);
  }
}
