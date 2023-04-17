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
  AstNode,
  expressionTransform,
  FieldKeyEnum,
  FieldType,
  getNewId,
  IDPrefix,
  IFieldMap,
  IFormulaError,
  IFormulaExpr,
  IFormulaField,
  IReduxState,
  IViewColumn,
  IViewProperty,
  IViewRow,
  parse,
  Selectors,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { keyBy } from 'lodash';
import { InjectLogger } from 'shared/common';
import { ApiException } from 'shared/exception';
import { Logger } from 'winston';
import Piscina from 'piscina';
import path from 'path';
import { IWorkerGetVisibleRowsJob, WorkerJobType } from './types';
import { getVisibleRows } from './fusion.api.filter.worker';

const ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD_ENV = 'ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD';
const getRowFilterOffLoadComplexityThreshold = () => {
  if (process.env[ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD_ENV]) {
    const num = parseInt(process.env[ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD_ENV]);
    if (isNaN(num)) {
      return Infinity;
    }
    return num;
  }
  return Infinity;
};

/**
 * When the complexity of a visible row filtering job reaches this threshold, the main thread will offload the
 * filtering job onto another thread.
 *
 * Currently the complexity of a visible row filtering job is simply measured by (number of formula AST nodes * number of rows),
 * or (number of rows) if no formula is specified.
 *
 * If the ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD environment variable is not specified, the default threshold is 5000;
 * if ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD is not a number, the threshold is Infinity, that is, the row filtering job will
 * never be offloaded onto a worker.
 */
const ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD = getRowFilterOffLoadComplexityThreshold();

const measureVisibleRowFilteringComplexity = (rows: IViewRow[], node?: AstNode): number => {
  return node ? node.numNodes * rows.length : rows.length;
};

const MAX_WORKERS_ENV = 'MAX_WORKERS';
/**
 * If the environment variable MAX_WORKERS is not specified, the default maximum number of workers is (1.5 * number of CPUs);
 * if MAX_WORKERS is 0 or not a number, the maximum number of workers is 4.
 */
const MAX_WORKERS = process.env[MAX_WORKERS_ENV] ? parseInt(process.env[MAX_WORKERS_ENV]) || 4 : undefined;

/**
 * Field Conversion Service
 */
@Injectable()
export class FusionApiFilter {
  private static readonly FIELD_NAME = 'Virtual';
  private piscina: Piscina | undefined;

  constructor(@InjectLogger() private readonly logger: Logger) {
    if ((typeof MAX_WORKERS === 'number' && MAX_WORKERS <= 0) || !Number.isFinite(ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD)) {
      this.piscina = undefined;
    } else {
      this.piscina = new Piscina({
        // FIXME hard code source file path is a bad practice.
        filename: path.resolve(__dirname.replace('/src/', '/dist/'), 'fusion.api.filter.worker.js'),
        maxThreads: MAX_WORKERS,
      });
    }
  }

  /**
   * Filter fieldMap according to the given fields, fields may be IDs or names (currently only names are considered)
   *
   * @param filedMap
   * @param fieldKey
   * @param fields
   */
  fieldMapFilter(filedMap: IFieldMap, fieldKey: FieldKeyEnum, fields?: string[]): IFieldMap {
    const map: IFieldMap = {};
    if (fieldKey === FieldKeyEnum.NAME) {
      filedMap = keyBy(filedMap, 'name');
    }
    if (fields && fields.length) {
      fields.forEach(field => {
        if (filedMap[field]) {
          map[field] = filedMap[field]!;
        }
      });
      return map;
    }
    return filedMap;
  }

  /**
   * Get the final returned rows
   *
   * @param filterByFormula
   * @param view
   * @param state
   */
  async getVisibleRows(filterByFormula: string | undefined, view: IViewProperty, state: IReduxState): Promise<IViewRow[]> {
    const getVisibleRowsProfiler = this.logger.startTimer();
    const snapshot = Selectors.getSnapshot(state)!;
    let rows: IViewRow[];
    const { expr, ast }: { expr?: string; ast?: AstNode } = filterByFormula ? this.validateExpression(filterByFormula, state) : {};
    if (this.piscina && measureVisibleRowFilteringComplexity(view.rows, ast) > ROW_FILTER_OFFLOAD_COMPLEXITY_THRESHOLD) {
      rows = await this.piscina.run({
        type: WorkerJobType.GetVisibleRows,
        data: {
          filterByFormula: expr,
          view,
          state: {
            ...state,
            previewFile: {
              ...state.previewFile,
              // NOTE Funtions cannot be passed between worker threads. Since this function is not used in formula evaluation,
              // we simply remove it.
              onChange: (undefined as any) as () => void,
            },
          },
        },
      } as IWorkerGetVisibleRowsJob);
    } else {
      rows = getVisibleRows({
        filterByFormula: expr,
        view,
        state,
      });
    }
    getVisibleRowsProfiler.done({
      message: `getVisibleRows ${snapshot.datasheetId} profiler`,
    });
    return rows || [];
  }

  validateExpression(expression: string, state: IReduxState): { expr: string; ast: AstNode } {
    const datasheet = Selectors.getDatasheet(state)!;
    const snapshot = Selectors.getSnapshot(state)!;
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
    const result: IFormulaExpr | IFormulaError = parse(exprTransform, { field, fieldMap: snapshot.meta.fieldMap, state }, true);
    if (result.hasOwnProperty('error')) {
      throw ApiException.tipError(ApiTipConstant.api_param_formula_error, { message: (result as IFormulaError).error.message });
    }
    return { expr: exprTransform, ast: (result as IFormulaExpr).ast };
  }

  getColumnsByViewId(state: IReduxState, dstId: string, view?: IViewProperty): IViewColumn[] {
    const datasheet = Selectors.getDatasheet(state, dstId);
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state, dstId);
    // The fieldMap after permission processing
    const fieldMap: IFieldMap = Selectors.getFieldMapBase(datasheet, fieldPermissionMap)!;
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
    // If you do not specify a view ID, all columns with permissions are returned
    return Object.keys(fieldMap).map(fieldId => {
      return { fieldId: fieldId };
    });
  }
}
