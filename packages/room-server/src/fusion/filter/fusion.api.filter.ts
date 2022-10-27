import { Injectable } from '@nestjs/common';
import { evaluate, expressionTransform, Field, FieldKeyEnum, FieldType, getNewId, IDPrefix, IFieldMap, IFormulaField, IReduxState, ISnapshot, IViewColumn, IViewProperty, IViewRow, parse, Selectors } from '@apitable/core';
import { ApiException } from '../../shared/exception/api.exception';
import { keyBy } from 'lodash';
import { FieldQueryRo } from '../ros/field.query.ro';
import { RecordQueryRo } from '../ros/record.query.ro';
import { Store } from 'redux';
import { IFusionApiFilterInterface } from '../fusion.api.filter.interface';

/**
 * <p>
 * 字段转换服务
 * </p>
 * @author Zoe zheng
 * @date 2020/7/31 3:31 下午
 */
@Injectable()
export class FusionApiFilter implements IFusionApiFilterInterface {
  private static readonly FIELD_NAME = '虚拟';

  fieldMapFilter(filedMap: IFieldMap, fieldKey: FieldKeyEnum, fields?: string[]): IFieldMap {
    const map: IFieldMap = {};
    if (fieldKey === FieldKeyEnum.NAME) {
      filedMap = keyBy(filedMap, 'name');
    }
    if (fields && fields.length) {
      fields.forEach(field => {
        if (filedMap[field]) {
          map[field] = filedMap[field];
        }
      });
      return map;
    }
    return filedMap;
  }

  formulaFilter(expression: string, rows: IViewRow[], snapshot: ISnapshot, state: IReduxState): IViewRow[] {
    // 虚构一个field传入进行计算, todo 这里field只是用来过滤自己和获取snapshot,可以考虑把参数提出来 todo 优化 ？？
    const datasheet = Selectors.getDatasheet(state);
    const field: IFormulaField = {
      id: getNewId(IDPrefix.Field),
      name: FusionApiFilter.FIELD_NAME,
      type: FieldType.Formula,
      property: {
        datasheetId: datasheet.id,
        expression,
      },
    };
    return rows.filter(row => {
      const result = evaluate(
        expression,
        {
          state,
          field,
          record: snapshot.recordMap[row.recordId],
        },
        false,
        false,
      );
      if (result) {
        return true;
      }
      return false;
    });
  }

  getVisibleRows(query: RecordQueryRo, view: IViewProperty, store: Store<IReduxState>): IViewRow[] | null {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state);
    if (query.filterByFormula) {
      const expression = this.validateExpression(query.filterByFormula, state);
      view.rows = this.formulaFilter(expression, view.rows, snapshot, state);
      // 直接返回
      if (!view.rows.length) {
        return null;
      }
    }
    const rows = Selectors.getVisibleRowsBase(store.getState(), snapshot, view);
    return rows && rows.length ? rows : null;
  }

  getVisibleFieldList(dstId: string, state: IReduxState, query: FieldQueryRo) {
    const datasheet = Selectors.getDatasheet(state, dstId);
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state, dstId);
    // 经过权限处理后的 fieldMap
    const fieldMap = Selectors.getFieldMapBase(datasheet, fieldPermissionMap);

    const { viewId } = query;
    const snapshot = Selectors.getSnapshot(state, dstId);
    if (viewId) {
      const view = Selectors.getViewById(snapshot, viewId);
      if (!view) {
        throw ApiException.tipError('api_query_params_view_id_not_exists', { viewId });
      }
      return (view.columns as IViewColumn[]).map(column => {
        const field = fieldMap[column.fieldId];
        // 指定视图时，与视图顺序显隐保持一致。
        if (field && !column.hidden) {
          return Field.bindContext(field, state).getApiMeta(dstId);
        }
        return null;
      }).filter(Boolean);
    }
    // 不指定视图 ID 时，按照第一个视图的字段顺序，不受字段显影影响，返回全部字段列表。
    const firstView = snapshot.meta.views[0];
    return (firstView.columns as IViewColumn[]).map(column => {
      const field = fieldMap[column.fieldId];
      if (field) {
        return Field.bindContext(field, state).getApiMeta(dstId);
      }
      return null;
    }).filter(Boolean);
  }

  validateExpression(expression: string, state: IReduxState) {
    const datasheet = Selectors.getDatasheet(state);
    const snapshot = Selectors.getSnapshot(state);
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    // 模拟一个field
    const field: IFormulaField = {
      id: getNewId(IDPrefix.Field),
      name: FusionApiFilter.FIELD_NAME,
      type: FieldType.Formula,
      property: {
        datasheetId: datasheet.id, // formula 进行计算是，需要通过 fieldProperty 定位到当前 datasheetId;
        expression,
      },
    };
    // todo 这里要根据fieldKey判断一下么？
    const exprTransform = expressionTransform(expression, { fieldMap: snapshot.meta.fieldMap, fieldPermissionMap }, 'id');
    const result: any = parse(exprTransform, { field, fieldMap: snapshot.meta.fieldMap, state }, true);
    if (result.hasOwnProperty('error')) {
      throw ApiException.tipError('api_param_formula_error', { message: result.error.message });
    }
    return exprTransform;
  }

  getColumnsByViewId(store: Store<IReduxState>, dstId: string, viewId: string) {
    const state: IReduxState = store.getState();
    const datasheet = Selectors.getDatasheet(state, dstId);
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state, dstId);
    // 经过权限处理后的 fieldMap
    const fieldMap: IFieldMap = Selectors.getFieldMapBase(datasheet, fieldPermissionMap);
    const snapshot = Selectors.getSnapshot(state, dstId);
    if (viewId) {
      const view = Selectors.getViewById(snapshot, viewId);
      if (view) {
        return (view.columns as IViewColumn[]).reduce<IViewColumn[]>((data: IViewColumn[], cur) => {
          const field = fieldMap[cur.fieldId];
          // 指定视图时，与视图顺序显隐保持一致。
          if (field && !cur.hidden) {
            data.push(cur);
          }
          return data;
        }, []);
      }
    }
    // 不指定视图 ID 时，返回全部的有权限的列
    return Object.keys(fieldMap).map(fieldId => {
      return { fieldId: fieldId };
    });
  }
}
