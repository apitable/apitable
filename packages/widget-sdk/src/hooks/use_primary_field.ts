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
 * import { usePrimaryField, useDatasheet } from '@vikadata/widget-sdk';
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
    return getWidgetDatasheet(state, datasheetId)?.snapshot.meta.views[0].columns[0].fieldId;
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
    return new Field(datasheetId, context, fieldRole === ConfigConstant.Role.None ? createDeniedField() : fieldMap[primaryFieldId]);
  }, [datasheetId, fieldMap, primaryFieldId, fieldPermissionMap, context]);
}
