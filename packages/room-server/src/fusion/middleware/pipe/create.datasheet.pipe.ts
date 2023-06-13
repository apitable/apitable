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
  APIMetaFieldType,
  ApiTipConstant,
  Field,
  FieldTypeDescriptionMap,
  getFieldClass,
  getFieldTypeByString,
  getMaxFieldCountPerSheet,
  getNewId,
  IDPrefix,
  IField,
  IReduxState,
} from '@apitable/core';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { genDatasheetDescriptionDto } from 'fusion/dtos/datasheet.description.dto';
import { NodeEntity } from 'node/entities/node.entity';
import { DatasheetCreateRo } from 'fusion/ros/datasheet.create.ro';
import { DatasheetFieldCreateRo } from 'fusion/ros/datasheet.field.create.ro';
import { REQUEST_HOOK_FOLDER, REQUEST_HOOK_PRE_NODE, SPACE_ID_HTTP_DECORATE } from 'shared/common';
import { ApiException } from 'shared/exception';
import { FastifyRequest } from 'fastify';

@Injectable()
export class CreateDatasheetPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: FastifyRequest) {}

  transform(ro: DatasheetCreateRo): DatasheetCreateRo {
    if (!ro.name) {
      throw ApiException.tipError(ApiTipConstant.api_params_instance_error, { property: 'datasheet', value: 'name' });
    }
    if (ro.name && ro.name.length > 100) {
      throw ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
    }
    if (ro.fields && ro.fields.length > 0) {
      const fieldLenthLimit = getMaxFieldCountPerSheet();
      if (ro.fields.length > fieldLenthLimit) {
        throw ApiException.tipError(ApiTipConstant.api_params_max_count_error, { property: 'fields', value: fieldLenthLimit });
      }
      this.validateFields(ro.fields);
      this.validatePrimaryFieldType(ro.fields[0]!.type);
    }
    if (ro.description) {
      if (ro.description.length > 500) {
        throw ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'description', value: 500 });
      }
      ro.description = JSON.stringify(genDatasheetDescriptionDto(ro.description));
    }
    if (this.request.body) {
      const folder = this.request[REQUEST_HOOK_FOLDER];
      const preNode = this.request[REQUEST_HOOK_PRE_NODE];
      const spaceId = this.request[SPACE_ID_HTTP_DECORATE];
      this.validateFolderAndPreNode(spaceId, folder, preNode);
    }
    if (ro.fields) {
      ro.fields = this.transformProperty(ro.fields);
    }
    return ro;
  }

  public transformProperty(fields: DatasheetFieldCreateRo[]): DatasheetFieldCreateRo[] {
    fields.forEach((field) => {
      switch (field.type) {
        case APIMetaFieldType.Number:
          this.transformNumberProperty(field);
          break;
      }
    });
    return fields;
  }

  public validatePrimaryFieldType(type: string) {
    const fieldType = getFieldTypeByString(type as any)!;
    const canBePrimaryField = FieldTypeDescriptionMap[fieldType]!.canBePrimaryField;
    if (!canBePrimaryField) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_primary_field_type_error, { value: type });
    }
  }

  public validateFields(fields: DatasheetFieldCreateRo[]) {
    fields.forEach((field) => {
      this.validate(field);
    });
    const seen = new Set();
    const hasDuplicatedFieldName = fields.some(function(field) {
      return seen.size === seen.add(field.name).size;
    });
    if (hasDuplicatedFieldName) {
      throw ApiException.tipError(ApiTipConstant.api_params_must_unique, { property: 'field.name' });
    }
  }

  public validate(field: DatasheetFieldCreateRo) {
    if (!field.name) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'field.name' });
    }
    if (field.name.length > 100) {
      throw ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'field.name', value: 100 });
    }
    const fieldType = getFieldTypeByString(field.type as any)!;
    if (!fieldType) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: `fields[${field.name}].type`, value: field.type });
    }
    const fieldInfo = {
      id: getNewId(IDPrefix.Field),
      name: field.name,
      type: fieldType,
      property: getFieldClass(fieldType).defaultProperty(),
    } as IField;
    const fieldContext = Field.bindContext(fieldInfo, {} as IReduxState);
    const { error } = fieldContext.validateAddOpenFieldProperty(field.property || null);
    if (error) {
      throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: `fields[${field.name}].property`, value: field.property });
    }
    return true;
  }

  public validateFolderAndPreNode(spaceId: string, folder: NodeEntity, preNode: NodeEntity) {
    const isFolderGiven: boolean = Boolean(this.request.body?.['folderId']);
    const isPreNodeGiven: boolean = Boolean(this.request.body?.['preNodeId']);
    if (isFolderGiven) {
      if (!folder) {
        throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'folderId' });
      } else if (spaceId !== folder.spaceId) {
        throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'folderId' });
      }
    }
    if (isPreNodeGiven) {
      if (!preNode) {
        throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'preNodeId' });
      } else if (spaceId !== preNode.spaceId) {
        throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'preNodeId' });
      }
    }

    if (isFolderGiven && isPreNodeGiven) {
      if (preNode.parentId !== folder.nodeId) {
        throw ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'preNodeId' });
      }
    }
    return true;
  }

  private transformNumberProperty(field: DatasheetFieldCreateRo) {
    const property: any = field.property;
    if (typeof property.precision === 'string') {
      property.precision = Number(property.precision);
    }
    field.property = property;
  }
}
