import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTipConstant, FieldKeyEnum, IFieldMap, IMeta } from '@apitable/core';
import { DATASHEET_META_HTTP_DECORATE } from '../../common';
import { ApiException } from 'shared/exception';
import { keyBy } from 'lodash';
import { SortRo } from 'database/ros/sort.ro';
import qs from 'qs';

@Injectable()
export class QueryPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  transform(value: any): any {
    value = qs.parse(value, { comma: true });
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
      pre.push(<SortRo>{ field: fieldMap[cur.field].id, order: cur.order.toLowerCase() });
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
