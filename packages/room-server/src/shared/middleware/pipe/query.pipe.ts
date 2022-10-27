import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FieldKeyEnum, IFieldMap, IMeta } from '@apitable/core';
import { DATASHEET_META_HTTP_DECORATE } from '../../common';
import { ApiException } from '../../exception/api.exception';
import { keyBy } from 'lodash';
import { SortRo } from '../../../database/ros/sort.ro';

/**
 * <p>
 * 转换page json参数为对象
 * </p>
 * @author Zoe zheng
 * @date 2020/7/27 2:20 下午
 */
@Injectable()
export class QueryPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  transform(value: any): any {
    // 转换/验证 排序参数
    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    let fieldMap = meta.fieldMap;
    if (value.fieldKey === FieldKeyEnum.NAME) {
      fieldMap = keyBy(Object.values(meta.fieldMap), 'name');
    }
    if (value && value.sort) {
      // 转换传入sort,全部转换为ID,验证field是否存在
      value.sort = this.validateSort(value.sort, fieldMap);
    }
    // 验证viewId
    if (value && value.viewId) {
      this.validateViewId(value.viewId, meta);
    }
    // 验证fields
    if (value && value.fields) {
      this.validateFields(value.fields, fieldMap);
    }
    return value;
  }

  validateSort(sort: SortRo[], fieldMap: IFieldMap): SortRo[] {
    return sort.reduce<SortRo[]>((pre, cur) => {
      if (!fieldMap[cur.field]) throw ApiException.tipError('api_param_sort_field_not_exists');
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
    if (!exist) throw ApiException.tipError('api_query_params_view_id_not_exists', { viewId });
  }

  validateFields(fields: string[], fieldMap: IFieldMap) {
    const notExists = fields.filter(field => {
      return !fieldMap[field];
    });
    if (notExists.length) throw ApiException.tipError('api_query_params_invalid_fields', { fields: notExists.join(', ') });
  }
}
