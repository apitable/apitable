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
 * 获取当前视图所有的字段(列)信息。
 * 当字段属性/列顺序发生变化的时候，会触发重新渲染。
 * 
 * 如果没有传入 viewId 会返回空数组。
 * 
 * @param viewId 视图ID
 * @param query 可选参数，指定查询哪些 fieldId 数据
 * @returns
 *
 * ### 示例
 * ```js
 * import { useFields, useActiveViewId } from '@vikadata/widget-sdk';
 *
 * // 展示全部字段名称
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
 * 
 * ## 支持加载对应表格数据 Fields
 * 
 * @param datasheet Datasheet 实例，通过 {@link useDatasheet} 获取
 * @param viewId 视图ID
 * @param query 可选参数，指定查询哪些 fieldId 数据
 * @returns
 *
 * ### 示例
 * ```js
 * import { useFields, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // 展示对应 datasheetId(dstXXXXXXXX) 表的全部字段名称
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
      return new Field(datasheetId, context, fieldRole === ConfigConstant.Role.None ? createDeniedField() : fieldMap[fieldId]);
    });
    
  }, [viewId, datasheetId, fieldMap, columns, query, fieldPermissionMap, context]);
}
