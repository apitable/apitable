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
 * 获得主字段信息。
 * 当字段属性发生变化的时候，会触发重新渲染。
 * 
 * @returns 主字段信息
 *
 * ### 示例
 * ```js
 * import { usePrimaryField, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 展示主字段名称
 * function PrimaryFieldName() {
 *   const field = usePrimaryField();
 *   return <p>{field.name}</p>
 * }
 * 
 * // 展示对应 datasheetId(dstXXXXXXXX) 表格主字段名称
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
