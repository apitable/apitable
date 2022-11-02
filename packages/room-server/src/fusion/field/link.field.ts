import { ICellValue, IField } from '@apitable/core';
import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FieldManager } from 'fusion/field.manager';
import { BaseField } from 'fusion/field/base.field';
import { FusionApiRecordService } from 'fusion/services/fusion.api.record.service';
import { IFieldValue } from 'shared/interfaces';

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
      // Empty arrays are not allowed
      if (!fieldValue.length) this.throwException(field, 'api_params_link_field_recordids_empty_error', extra);
      if (field.property.limitSingleRecord && fieldValue.length > 1) {
        // Only single
        this.throwException(field, 'api_params_link_field_records_max_count_error', extra);
      }
    } else {
      this.throwException(field, 'api_param_link_field_type_error', extra);
    }
  }

  async roTransform(fieldValue: IFieldValue, field: IField): Promise<ICellValue> {
    // Deduplicate data
    const cellValue: string[] = Array.from(new Set(fieldValue as string[]));
    // Verify presence
    await this.recordService.validateRecordExists(field.property.foreignDatasheetId, cellValue,
      'api_params_link_field_recordids_not_exists');
    return fieldValue as ICellValue;
  }

  onApplicationBootstrap(): any {
    FieldManager.setService(LinkField.name, this);
  }
}
