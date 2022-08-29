import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { getNewId, IAttachmentValue, ICellValue, IDPrefix, IField } from '@vikadata/core';
import { isString } from 'class-validator';
import { IFieldValue } from 'interfaces';
import { AssetRepository } from 'modules/repository/asset.repository';
import { BaseField } from 'modules/services/fusion/field/base.field';
import { FieldManager } from '../field.manager';

@Injectable()
export class AttachmentField extends BaseField implements OnApplicationBootstrap {
  constructor(private readonly assetRepo: AssetRepository) {
    super();
  }

  public validate(fieldValues: IFieldValue, field: IField) {
    if (fieldValues === null) return;
    if (Array.isArray(fieldValues)) {
      fieldValues.forEach((value: any) => {
        // 验证必要参数
        if (!value.token) this.throwException(field, 'api_params_instance_attachment_token_error');
        if (!value.name) this.throwException(field, 'api_params_instance_attachment_name_error');
        // 验证参数类型
        if (!isString(value.token)) this.throwException(field, 'api_param_attachment_token_type_error');
        if (!isString(value.name)) this.throwException(field, 'api_param_attachment_name_type_error');
      });
      return;
    }
    this.throwException(field, 'api_param_attachment_array_type_error');
  }

  async roTransform(fieldValues: IFieldValue[], field: IField): Promise<ICellValue> {
    const ids = [];
    const cellValues: IAttachmentValue[] = [];
    for (const value of fieldValues as any) {
      const asset = await this.assetRepo.selectBaseInfoByFileUrl(value.token);
      if (!asset) {
        this.throwException(field, 'api_param_attachment_not_exists');
        break;
      }
      cellValues.push({
        id: getNewId(IDPrefix.File, ids),
        name: value.name,
        size: asset.fileSize,
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
