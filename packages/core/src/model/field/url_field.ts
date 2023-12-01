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
import { first } from 'lodash';
import { IReduxState } from 'exports/store/interfaces';
import { FieldType, IField, IHyperlinkSegment, ISegment, IURLField } from 'types/field_types';

import { DatasheetActions } from '../../commands_actions/datasheet';
import { ICellValue } from '../record';
import { TextBaseField } from './text_base_field';
import { getFieldDefaultProperty } from './const';
import { IURLProperty } from 'types/field_types';
export class URLField extends TextBaseField {
  constructor(public override field: IURLField, public override state: IReduxState) {
    super(field, state);
  }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.URL) as IURLProperty;
  }

  static override cellValueSchema = Joi.array().items(Joi.object({
    text: Joi.string().allow('').required(),
    type: Joi.number().required(),
    link: Joi.string(),
    title: Joi.string(),
    favicon: Joi.string(),
  }).required()).allow(null).required();

  static override propertySchema = Joi.object({
    isRecogURLFlag: Joi.boolean(),
  });

  override cellValueToApiStringValue(cellValue: ICellValue): string | null {
    const result = this.cellValueToString(cellValue as ISegment[]);
    if (result === null) {
      return '';
    }
    return result;
  }

  cellValueToURL(cellValue: ICellValue): string | null {
    if (cellValue === null) {
      return '';
    }

    const cv = [cellValue].flat();

    return (cv as IHyperlinkSegment[]).map(seg => seg?.text || seg?.title).join('') || null;
  }

  cellValueToTitle(cellValue: ICellValue): string | null {
    if (cellValue === null) {
      return '';
    }

    const cv = [cellValue].flat();

    return (cv as IHyperlinkSegment[]).map(seg => seg?.title || seg?.text).join('') || null;
  }

  override cellValueToString(cellValue: ICellValue): string | null {
    if (cellValue === null) {
      return null;
    }

    const cv = [cellValue].flat();

    return (cv as IHyperlinkSegment[]).map(seg => seg?.text || seg?.title).join('') || null;
  }

  override validateProperty() {
    return URLField.propertySchema.validate(this.field.property);
  }

  override validateCellValue(cv: ICellValue) {
    return URLField.cellValueSchema.validate(cv);
  }

  override cellValueToApiStandardValue(cellValue: ISegment[] | null): ISegment | string | null {
    if (cellValue == null) {
      return null;
    }
    const cv = first([cellValue].flat()) as IHyperlinkSegment;
    if (!cv) {
      return null;
    }
    return {
      title: cv.title || cv.text,
      text: cv.text,
      favicon: cv.favicon || ''
    } as ISegment;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IURLField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.URL,
      property: this.defaultProperty(),
    };
  }
}
