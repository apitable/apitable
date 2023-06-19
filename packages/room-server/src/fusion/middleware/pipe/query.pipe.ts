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

import { ApiTipConstant, FieldKeyEnum, IFieldMap, IMeta } from '@apitable/core';
import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SortRo } from 'fusion/ros/sort.ro';
import { isString, keyBy } from 'lodash';
import qs from 'qs';
import { ApiException } from 'shared/exception';
import { DATASHEET_META_HTTP_DECORATE } from 'shared/common';
import { OrderEnum } from 'shared/enums';

/**
 * transform json into object
 */
@Injectable()
export class QueryPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  transform(value: any) {
    value = qs.parse(value);
    if (!value) {
      return value;
    }
    // transform, validate and sort the parameters
    if (value.sort || value.viewId || value.fields) {
      const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
      let fieldMap = meta.fieldMap;
      if (value.fieldKey === FieldKeyEnum.NAME) {
        fieldMap = keyBy(Object.values(meta.fieldMap), 'name');
      }
      if (value.sort) {
        // validate and transform it into field id
        value.sort = QueryPipe.validateSort(value.sort, fieldMap);
      }
      // validate view id
      if (value.viewId) {
        QueryPipe.validateViewId(value.viewId, meta);
      }
      // validate fields
      if (value.fields) {
        QueryPipe.validateFields(value.fields, fieldMap);
      }
    }
    return value;
  }

  static validateSort(sorts: SortRo[], fieldMap: IFieldMap): SortRo[] {
    return sorts.map((sort) => {
      if (sort && isString(sort)) {
        sort = JSON.parse(sort);
      }
      if (!fieldMap[sort.field]) throw ApiException.tipError(ApiTipConstant.api_param_sort_field_not_exists, { fieldId: sort.field });
      return { field: fieldMap[sort.field]!.id, order: sort.order.toLowerCase() as OrderEnum };
    });
  }

  static validateViewId(viewId: string, meta: IMeta) {
    const views = meta.views;
    let exist = false;
    views.forEach((view) => {
      if (view.id === viewId) exist = true;
    });
    if (!exist) throw ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists, { viewId });
  }

  static validateFields(fields: string[], fieldMap: IFieldMap) {
    const notExists = fields.filter((field) => {
      return !fieldMap[field];
    });
    if (notExists.length) throw ApiException.tipError(ApiTipConstant.api_query_params_invalid_fields, { fields: notExists.join(', ') });
  }
}
