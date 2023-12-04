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

import Joi from 'joi';
import { IReduxState } from 'exports/store/interfaces';
import { ICellValue } from '../record';
import { ArrayValueField } from './array_field';
import { IFilterCondition, FOperator } from 'types/view_types';
import { isArray, isNumber, isString, isEqual } from 'lodash';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { IAttacheField, FieldType, IAttachmentValue, IStandardValue, IField, BasicValueType } from 'types/field_types';
import { cellValueToImageSrc } from 'utils';
import { BasicOpenValueTypeBase, IAttachmentFieldOpenValue } from 'types/field_types_open';
import { Strings, t } from '../../exports/i18n';
import { isNullValue } from 'model/utils';
import { IAddOpenAttachmentFieldProperty } from 'types';
import { joiErrorResult } from './validate_schema';
import { getFieldDefaultProperty } from './const';
const baseAttachmentFieldSchema = {
  id: Joi.string().required(),
  name: Joi.string().required(),
  mimeType: Joi.string().required(),
  token: Joi.string().required(),
  bucket: Joi.string().required(),
  size: Joi.number().required(),
  width: Joi.number(),
  height: Joi.number(),
  preview: Joi.string().allow(''),
};

export class AttachmentField extends ArrayValueField {
  static propertySchema = Joi.equal(null);

  static cellValueSchema = Joi.array().items(Joi.object(baseAttachmentFieldSchema).required()).allow(null).required();

  static openWriteValueValueSchema = Joi.array().items(Joi.object({
    ...baseAttachmentFieldSchema,
    url: Joi.string(),
    previewUrl: Joi.string(),
  }).required()).allow(null).required();

  constructor(public override field: IAttacheField, state: IReduxState) {
    super(field, state);
  }

  get apiMetaProperty() {
    return null;
  }

  get openValueJsonSchema() {
    return {
      type: 'array',
      title: this.field.name,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_IDs),
          },
          name: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_names),
          },
          mimeType: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_mime_types),
          },
          token: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_upload_token),
          },
          bucket: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_storage_locations),
          },
          size: {
            type: 'number',
            title: t(Strings.robot_variables_join_attachment_sizes),
          },
          width: {
            type: 'number',
            title: t(Strings.robot_variables_join_attachment_widths)
          },
          height: {
            type: 'number',
            title: t(Strings.robot_variables_join_attachment_heights)
          },
          preview: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_preview_image_token),
          },
          previewUrl: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_thumbnail_URLs),
          },
          url: {
            type: 'string',
            title: t(Strings.robot_variables_join_attachment_URLs),
          }
        }
      }
    };
  }

  override get canGroup(): boolean {
    return false;
  }

  override get acceptFilterOperators(): FOperator[] {
    return [
      FOperator.IsEmpty,
      FOperator.IsNotEmpty,
    ];
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.Array;
  }

  override get innerBasicValueType(): BasicValueType {
    return BasicValueType.String;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IAttacheField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Attachment,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: null,
    };
  }

  validateProperty() {
    return AttachmentField.propertySchema.validate(this.field.property);
  }

  validateCellValue(cv: ICellValue) {
    return AttachmentField.cellValueSchema.validate(cv);
  }

  validateOpenWriteValue(owv: IAttachmentValue[] | null) {
    return AttachmentField.openWriteValueValueSchema.validate(owv);
  }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Attachment) as null;
  }

  override eq(cv1: IAttachmentValue[] | null, cv2: IAttachmentValue[] | null): boolean {
    if (cv1 == null || cv2 == null) {
      return cv1 === cv2;
    }
    return isEqual(
      [cv1].flat().map(item => item.token),
      [cv2].flat().map(item => item.token),
    );
  }

  validate(value: any): value is IAttachmentValue[] {
    return isArray(value) && (value as IAttachmentValue[]).every((attachment: IAttachmentValue) => {
      return Boolean(
        attachment &&
        isString(attachment.id) &&
        isString(attachment.bucket) &&
        isString(attachment.token) &&
        isString(attachment.mimeType) &&
        isString(attachment.name) &&
        isNumber(attachment.size),
      );
    });
  }

  cellValueToArray(cellValue: ICellValue): string[] | null {
    if (this.validate(cellValue)) {
      return cellValue.map(cur => {
        const filePath: string = cellValueToImageSrc(cur);
        return `${cur.name} (${filePath})`;
      });
    }
    return null;
  }

  // most of arrayValueToString's field just join, except number dataTime's with format
  arrayValueToString(cellValues: string[] | null): string | null {
    return cellValues && cellValues.length ? cellValues.join(', ') : null;
  }

  cellValueToString(cellValue: ICellValue): string | null {
    return this.arrayValueToString(this.cellValueToArray(cellValue));
  }

  cellValueToStdValue(val: IAttachmentValue[] | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: FieldType.Attachment,
      data: [],
    };

    if (val != null) {
      stdVal.data = val.map(attach => {
        return {
          text: this.cellValueToString([attach]) || '',
          ...attach,
        };
      });
    }

    return stdVal;
  }

  stdValueToCellValue(stdVal: IStandardValue): IAttachmentValue[] | null {
    if (stdVal.data.length === 0) {
      return null;
    }

    const cellValue = stdVal.data.map(val => {
      const { text, ...v } = val;
      console.log(text);
      return v;
    });

    if (this.validate(cellValue)) {
      return cellValue;
    }

    return null;
  }

  defaultValueForCondition(_condition: IFilterCondition): null {
    return null;
  }

  cellValueToApiStandardValue(cellValue: ICellValue): any[] | null {
    if (this.validate(cellValue)) {
      return cellValue.map(value => {
        return {
          id: value.id,
          name: value.name,
          size: value.size,
          mimeType: value.mimeType,
          token: value.token,
          width: value?.width,
          height: value?.height,
          preview: value.preview ? cellValueToImageSrc(value, { isPreview: true }) : undefined,
          url: cellValueToImageSrc(value),
        };
      });
    }
    return null;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(cellValue: IAttachmentValue[] | null): BasicOpenValueTypeBase | null {
    if (!isNullValue(cellValue)) {
      return cellValue.map(value => {
        return {
          // original value
          ...value,
          // addon value
          previewUrl: value.preview ? cellValueToImageSrc(value, { isPreview: true }) : undefined,
          url: cellValueToImageSrc(value),
        };
      });
    }
    return null;
  }

  openWriteValueToCellValue(openWriteValue: IAttachmentFieldOpenValue[] | null): ICellValue | null {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    return openWriteValue.map(v => ({
      id: v.id,
      name: v.name,
      mimeType: v.mimeType,
      token: v.token,
      bucket: v.bucket,
      size: v.size,
      width: v?.width,
      height: v?.height,
      preview: v?.preview
    }));
  }

  override validateAddOpenFieldProperty(updateProperty: IAddOpenAttachmentFieldProperty) {
    if (updateProperty === null) {
      return { error: undefined, value: null };
    }
    return this.validateUpdateOpenProperty(updateProperty);
  }

  override filterValueToOpenFilterValue(): null {
    return null;
  }

  override openFilterValueToFilterValue(): null {
    return null;
  }

  override validateOpenFilterValue(value: null) {
    if (value) {
      return joiErrorResult('The attachment field does not need to set the filter criteria value');
    }
    return Joi.allow(null).validate(value);
  }
}
