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
import { SortRo } from 'database/ros/sort.ro';
import { keyBy } from 'lodash';
import qs from 'qs';
import { ApiException } from 'shared/exception';
import { DATASHEET_META_HTTP_DECORATE } from 'shared/common';

/**
 * transform json into object
 * @author Zoe zheng
 * @date 2020/7/27 2:20 PM
 */
@Injectable()
export class QueryPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  transform(value: any): any {
    value = qs.parse(value);
    // transform, validate and sort the parameters
    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    let fieldMap = meta.fieldMap;
    if (value.fieldKey === FieldKeyEnum.NAME) {
      fieldMap = keyBy(Object.values(meta.fieldMap), 'name');
    }
    if (value && value.sort) {
      // validate and transform it into field id
      value.sort = this.validateSort(value.sort, fieldMap);
    }
    // validate view id
    if (value && value.viewId) {
      this.validateViewId(value.viewId, meta);
    }
    // validate fields
    if (value && value.fields) {
      this.validateFields(value.fields, fieldMap);
    }
    return value;
  }

  validateSort(sort: SortRo[], fieldMap: IFieldMap): SortRo[] {
    return sort.reduce<SortRo[]>((pre, cur) => {
      if (!fieldMap[cur.field]) throw ApiException.tipError(ApiTipConstant.api_param_sort_field_not_exists);
      pre.push(<SortRo>{ field: fieldMap[cur.field]!.id, order: cur.order.toLowerCase() });
      return pre;
    }, []);
  }

  validateViewId(viewId: string, meta: IMeta) {
    const views = meta.views;
    let exist = false;
    views.forEach(view => {
      if (view.id === viewId) exist = true;
    });
    if (!exist) throw ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists, { viewId });
  }

  validateFields(fields: string[], fieldMap: IFieldMap) {
    const notExists = fields.filter(field => {
      return !fieldMap[field];
    });
    if (notExists.length) throw ApiException.tipError(ApiTipConstant.api_query_params_invalid_fields, { fields: notExists.join(', ') });
  }
}
