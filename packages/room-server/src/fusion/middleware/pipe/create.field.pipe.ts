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

import {
  ApiTipConstant,
  Field,
  FieldType,
  getFieldClass,
  getFieldTypeByString,
  getFieldTypeString,
  getNewId,
  IAddOpenMagicLookUpFieldProperty,
  IDPrefix,
  IField,
  IFieldMap,
  ILinkField,
  IReduxState,
} from '@apitable/core';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { FastifyRequest } from 'fastify';
import { FieldCreateRo } from 'fusion/ros/field.create.ro';
import { DATASHEET_FIELD_MAP_HTTP_DECORATE } from 'shared/common';
import { ApiException } from 'shared/exception';
import { CreateDatasheetPipe } from './create.datasheet.pipe';

@Injectable()
export class CreateFieldPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: FastifyRequest,
    private readonly metaService: DatasheetMetaService,
  ) {}

  async transform(ro: FieldCreateRo): Promise<FieldCreateRo> {
    await this.validate(ro);
    this.transformProperty(ro);
    return ro;
  }

  public transformProperty(field: FieldCreateRo) {
    const pipe = new CreateDatasheetPipe(this.request);
    pipe.transformProperty([field]);
  }

  public async validate(field: FieldCreateRo) {
    if (!field.name) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'name' });
    }
    if (field.name && field.name.length > 100) {
      throw ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
    }
    const fieldType = getFieldTypeByString(field.type as any)!;
    if (!fieldType) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'type', value: field.type });
    }
    const fieldInfo = {
      id: getNewId(IDPrefix.Field),
      name: field.name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
    const { error } = fieldContext.validateAddOpenFieldProperty(field.property || null, true);
    if (error) {
      throw ApiException.tipError(ApiTipConstant.api_param_validate_error, { message: error.message });
    }
    if (fieldType === FieldType.LookUp) {
      await this.validateLookUpField(field);
    }
    return true;
  }

  private async validateLookUpField(field: FieldCreateRo) {
    const fieldMap = this.request[DATASHEET_FIELD_MAP_HTTP_DECORATE] as IFieldMap;
    const property = field.property! as IAddOpenMagicLookUpFieldProperty;
    const linkField = fieldMap[property.relatedLinkFieldId];
    if (!linkField) {
      throw ApiException.tipError(ApiTipConstant.api_params_lookup_related_link_field_not_exists, { fieldId: property.relatedLinkFieldId });
    }
    if (linkField.type !== FieldType.Link && linkField.type !== FieldType.OneWayLink) {
      throw ApiException.tipError(ApiTipConstant.api_params_lookup_related_field_not_link, { fieldId: property.relatedLinkFieldId });
    }
    const dstId = (this.request.params as any).dstId;
    const { foreignDatasheetId } = (linkField as ILinkField).property;
    const isSelfLink = dstId === foreignDatasheetId;
    const targetField = isSelfLink
      ? Boolean(fieldMap[property.targetFieldId])
      : await this.metaService.checkFieldExist(foreignDatasheetId, property.targetFieldId);
    if (!targetField) {
      throw ApiException.tipError(ApiTipConstant.api_params_lookup_target_field_not_exists, { fieldId: property.targetFieldId });
    }
    if (property.sortInfo) {
      for (const { fieldId: sortFieldId } of property.sortInfo.rules) {
        const sortField = isSelfLink ? fieldMap[sortFieldId] : await this.metaService.getFieldByFldIdAndDstId(foreignDatasheetId, sortFieldId);
        if (!sortField) {
          throw ApiException.tipError(ApiTipConstant.api_params_lookup_sort_field_not_exists, { fieldId: sortFieldId });
        }
        // FIXME lookup field canGroup requires loading foreign datasheets, handle it later.
        if (sortField.type !== FieldType.LookUp) {
          const context = Field.bindContext(sortField, {} as IReduxState);
          if (!context.canGroup || context.hasError) {
            throw ApiException.tipError(ApiTipConstant.api_params_lookup_field_can_not_sort, { fieldId: sortFieldId });
          }
        }
      }
    }
    if (property.filterInfo && property.filterInfo.conditions.length) {
      const foreignFieldMap = isSelfLink ? fieldMap : await this.metaService.getFieldMapByDstId(foreignDatasheetId);
      for (const condition of property.filterInfo.conditions) {
        const filterField = foreignFieldMap[condition.fieldId];
        if (!filterField) {
          throw ApiException.tipError(ApiTipConstant.api_params_lookup_filter_field_not_exists, { fieldId: condition.fieldId });
        }
        condition.fieldType = getFieldTypeString(filterField.type);
        if (![FieldType.Formula, FieldType.LookUp].includes(filterField.type)) {
          const context = Field.bindContext(filterField, {} as IReduxState);
          if (!context.acceptFilterOperators.includes(condition.operator)) {
            throw ApiException.tipError(ApiTipConstant.api_params_lookup_filter_field_invalid_operation, {
              fieldId: condition.fieldId,
              operator: condition.operator,
            });
          }
        }
      }
    }
  }
}
