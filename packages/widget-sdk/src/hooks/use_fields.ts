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

import { ConfigConstant, Selectors } from 'core';
import { useContext, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { IWidgetContext, IFieldQuery } from 'interface';
import { Datasheet, Field } from '../model';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { createDeniedField } from './use_field';
import { getFieldMap, getFieldPermissionMap, getView } from '../store';

/**
 * Get information about all fields(columns) of currently view. 
 * Rerendering is triggered when the fields property/columns order changes.
 * 
 * If not viewId passed in, an empty array is returned.
 * 
 * @param viewId The ID for view.
 * @param query Optional parameter that specifies which fieldId data to query.
 * @returns
 *
 * ### Example
 * ```js
 * import { useFields, useActiveViewId } from '@apitable/widget-sdk';
 *
 * // Show all field names
 * function FieldNames() {
 *   const viewId = useActiveViewId();
 *   const fields = useFields(viewId);
 *   return (<div>
 *     {fields.map(field => <p key={field.id}>{field.name}</p>)}
 *   </div>);
 * }
 * ```
 * 
 */
export function useFields(viewId: string | undefined, query?: IFieldQuery): Field[];

/**
 * ## Support for loading the corresponding datasheet data fields.
 * 
 * @param datasheet Datasheet instance, by {@link useDatasheet} get.
 * @param viewId The ID for view.
 * @param query Optional parameter that specifies which fieldId data to query.
 * @returns
 *
 * ### Example
 * ```js
 * import { useFields, useDatasheet } from '@apitable/widget-sdk';
 *
 * // Show all field names corresponding to the datasheetId(dstXXXXXXXX) datasheet
 * function FieldNames() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const fields = useFields(datasheet, 'vieXXXXXXX');
 *   return (<div>
 *     {fields.map(field => <p key={field.id}>{field.name}</p>)}
 *   </div>);
 * }
 * ```
 * 
 */
export function useFields(datasheet: Datasheet | undefined, viewId: string | undefined, query?: IFieldQuery): Field[];

export function useFields(param1: Datasheet | string | undefined, param2?: IFieldQuery | string | undefined, param3?: IFieldQuery) {
  const { datasheetId: metaDatasheetId } = useMeta();
  const hasDatasheet = param1 instanceof Datasheet;
  const datasheetId = hasDatasheet ? (param1 as Datasheet).datasheetId : metaDatasheetId;
  const usedDatasheetId = hasDatasheet ? datasheetId : undefined;
  const viewId = (hasDatasheet ? param2 : param1) as string;
  const query = hasDatasheet ? param3 : (param2 as IFieldQuery);
  const context = useContext<IWidgetContext>(WidgetContext);
  const columns = useSelector(state => getView(state, viewId, usedDatasheetId)?.columns, shallowEqual);
  const fieldMap = useSelector(state => getFieldMap(state, usedDatasheetId), shallowEqual);
  const fieldPermissionMap = useSelector(state => getFieldPermissionMap(state, usedDatasheetId));
  return useMemo(() => {
    if (!viewId || !datasheetId || !fieldMap || !columns) {
      return [];
    }

    let _columns = columns;
    if (query && 'ids' in query) {
      if (!query.ids) {
        _columns = [];
      }
      const idSet = new Set(query.ids);
      _columns = _columns.filter(col => idSet.has(col.fieldId));
    }

    if(query && 'visible' in query && query.visible) {
      _columns = _columns.filter(col => !col.hidden);
    }

    return _columns.map(({ fieldId }) => {
      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
      return new Field(datasheetId, context, fieldRole === ConfigConstant.Role.None ? createDeniedField() : fieldMap[fieldId]!);
    });
    
  }, [viewId, datasheetId, fieldMap, columns, query, fieldPermissionMap, context]);
}
