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
import { IWidgetContext } from 'interface';
import { Datasheet, Field } from '../model';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { createDeniedField } from './use_field';
import { getFieldMap, getFieldPermissionMap, getWidgetDatasheet } from 'store';

/**
 * Get information of primary field.
 * Rerendering is triggered when a field property changes.
 * 
 * @returns primary field info.
 *
 * ### Example
 * ```js
 * import { usePrimaryField, useDatasheet } from '@apitable/widget-sdk';
 *
 * // Show primary field name
 * function PrimaryFieldName() {
 *   const field = usePrimaryField();
 *   return <p>{field.name}</p>
 * }
 * 
 * // Show corresponding datasheetId(dstXXXXXXXX) Name of the primary field of the datasheet 
 * function DatasheetPrimaryFieldName() {
 *   const useDatasheet = useDatasheet('dstXXXXXXXX');
 *   const field = usePrimaryField(useDatasheet);
 *   return <p>{field.name}</p>
 * }
 * ```
 * 
 */

export function usePrimaryField(datasheet?: Datasheet) {
  const { datasheetId: metaDatasheetId } = useMeta();
  const datasheetId = datasheet ? datasheet.datasheetId : metaDatasheetId;
  const context = useContext<IWidgetContext>(WidgetContext);
  const primaryFieldId = useSelector(state => {
    return getWidgetDatasheet(state, datasheetId)?.snapshot.meta.views[0]!.columns[0]!.fieldId;
  });
  
  const fieldMap = useSelector(state => {
    return getFieldMap(state, datasheetId);
  }, shallowEqual);

  const fieldPermissionMap = useSelector(state => {
    return getFieldPermissionMap(state, datasheetId);
  });

  return useMemo(() => {
    if (!datasheetId || !fieldMap || !primaryFieldId) {
      return null;
    }

    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, primaryFieldId);
    return new Field(datasheetId, context, fieldRole === ConfigConstant.Role.None ? createDeniedField() : fieldMap[primaryFieldId]!);
  }, [datasheetId, fieldMap, primaryFieldId, fieldPermissionMap, context]);
}
