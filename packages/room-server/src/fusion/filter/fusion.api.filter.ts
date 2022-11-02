import {
  evaluate, expressionTransform, Field, FieldKeyEnum, FieldType, getNewId, IDPrefix, IFieldMap, IFormulaField, IReduxState, ISnapshot, IViewColumn,
  IViewProperty, IViewRow, parse, Selectors
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { keyBy } from 'lodash';
import { Store } from 'redux';
import { ApiException } from 'shared/exception';
import { IFusionApiFilterInterface } from '../fusion.api.filter.interface';
import { FieldQueryRo } from '../ros/field.query.ro';
import { RecordQueryRo } from '../ros/record.query.ro';

/**
 * Field Conversion Service
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
    // Fictitiously pass in a field for calculation
    // TODO: Here field is only used to filter themselves and get snapshot, you can consider putting forward the parameters to todo optimization?
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
    // The fieldMap after permission processing
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
        // When specifying a view, it is consistent with the view order being visible and invisible.
        if (field && !column.hidden) {
          return Field.bindContext(field, state).getApiMeta(dstId);
        }
        return null;
      }).filter(Boolean);
    }
    // When no view ID is specified, the full list of fields is returned in the order of the first view, regardless of the field display.
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
    // Simulate a field
    const field: IFormulaField = {
      id: getNewId(IDPrefix.Field),
      name: FusionApiFilter.FIELD_NAME,
      type: FieldType.Formula,
      property: {
        datasheetId: datasheet.id, // The formula is calculated by locating the current datasheetId by fieldProperty;
        expression,
      },
    };
    // TODO: Do we need to judge here according to the fieldKey?
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
    // The fieldMap after permission processing
    const fieldMap: IFieldMap = Selectors.getFieldMapBase(datasheet, fieldPermissionMap);
    const snapshot = Selectors.getSnapshot(state, dstId);
    if (viewId) {
      const view = Selectors.getViewById(snapshot, viewId);
      if (view) {
        return (view.columns as IViewColumn[]).reduce<IViewColumn[]>((data: IViewColumn[], cur) => {
          const field = fieldMap[cur.fieldId];
          // When specifying a view, it is displayed in line with the view order.
          if (field && !cur.hidden) {
            data.push(cur);
          }
          return data;
        }, []);
      }
    }
    // If you do not specify a view ID, all columns with permissions are returned
    return Object.keys(fieldMap).map(fieldId => {
      return { fieldId: fieldId };
    });
  }
}
