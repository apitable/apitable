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
 * 获取一个指定的字段信息。
 * 当字段属性发生变化的时候，会触发重新渲染。
 *
 * 如果没有传入 Id 会返回 undefined。
 * 
 * @param fieldId 字段ID
 * @returns
 *
 * ### 示例
 * ```js
 * import { useField } from '@vikadata/widget-sdk';
 *
 * // 展示字段名称
 * function FieldName() {
 *   const field = useField('fldXXXXXXX');
 *   return <p>{field.name}</p>
 * }
 * ```
 * 
 */

export function useField(fieldId: string | undefined): Field | undefined;

/**
 * ## 支持加载对应表格数据 Field
 * 
 * @param datasheet Datasheet 实例，通过 {@link useDatasheet} 获取
 * @param fieldId 字段ID
 * @returns
 *
 * 
 * ### 示例
 * ```js
 * import { useField, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 展示对应 datasheetId(dstXXXXXXXX) 表的字段名称
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

  // fieldRole 不存在，则 field 真实不存在，fieldRole 为 None 则无权限访问
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
