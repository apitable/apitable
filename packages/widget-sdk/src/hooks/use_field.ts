import { shallowEqual, useSelector } from 'react-redux';
import { FieldType, getNewId, IDeniedField, IDPrefix, ConfigConstant } from 'core';
import { useMeta } from './use_meta';
import { useContext, useMemo } from 'react';
import { WidgetContext } from '../context';
import { IWidgetContext } from 'interface';
import { Field } from '../model/field';
import { Datasheet } from 'model';
import { getFieldMap, getFieldPermissionMap, getFieldRoleByFieldId } from 'store/selector';

/**
 * Get information about a specified field.
 * Rerendering is triggered when a field property changes.
 *
 * If no ID is passed in, undefined is returned.
 * 
 * @param fieldId The ID for this field.
 * @returns
 *
 * ### Example
 * ```js
 * import { useField } from '@apitable/widget-sdk';
 *
 * // show field name
 * function FieldName() {
 *   const field = useField('fldXXXXXXX');
 *   return <p>{field.name}</p>
 * }
 * ```
 * 
 */

export function useField(fieldId: string | undefined): Field | undefined;

/**
 * ## Support for loading the corresponding datasheet data field.
 * 
 * @param datasheet Datasheet instance, by {@link useDatasheet} get.
 * @param fieldId The ID for this field
 * @returns
 *
 * 
 * ### Example
 * ```js
 * import { useField, useDatasheet } from '@apitable/widget-sdk';
 *
 * // show field name corresponding to the datasheetId(dstXXXXXXXX) datasheet
 * function FieldName() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const field = useField(datasheet, 'fldXXXXXXX');
 *   return <p>{field.name}</p>
 * }
 * 
 * ```
 */
export function useField(datasheet: Datasheet | undefined, fieldId: string | undefined): Field | undefined;

export function useField(param1: Datasheet | string | undefined, param2?: string) {
  const { datasheetId: metaDatasheetId } = useMeta();
  const hasDatasheet = param1 instanceof Datasheet;
  const fieldId = param1 instanceof Datasheet ? param2 : param1;
  const datasheetId = hasDatasheet ? (param1 as Datasheet).datasheetId : metaDatasheetId;
  const context = useContext<IWidgetContext>(WidgetContext);
  const field = useSelector(state => {
    if (!fieldId) {
      return;
    }
    return getFieldMap(state, datasheetId)?.[fieldId];
  }, shallowEqual);

  const fieldRole = useSelector(state => {
    const fieldPermissionMap = getFieldPermissionMap(state);
    if (!fieldId) {
      return;
    }
    return getFieldRoleByFieldId(fieldPermissionMap, fieldId);
  });

  // If fieldRole dose not exist, the field really dose not exist, 
  // and if fieldRole is None, there is no permission to access
  return useMemo(() => {
    if (!datasheetId || !field) {
      return;
    }
    return new Field(datasheetId, context, fieldRole === ConfigConstant.Role.None ? createDeniedField() : field);
  }, [datasheetId, context, fieldRole, field]);
}

/** @internal */
export function createDeniedField(): IDeniedField {
  return {
    id: getNewId(IDPrefix.Field),
    name: 'NoPermission',
    type: FieldType.DeniedField,
    property: null,
  };
}
