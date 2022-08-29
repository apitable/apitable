import { useContext, useMemo } from 'react';
import { IWidgetContext } from 'interface';
import { WidgetContext } from '../context';
import { useMeta } from './use_meta';
import { Datasheet } from '../model';
import { Selectors, StoreActions } from 'core';
import { getWidgetDatasheetPack, refreshUsedDatasheetAction } from 'store';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { isIframe } from 'iframe_message/utils';
import { widgetMessage } from 'iframe_message';

/**
 * 用于将 React 组件链接到 datasheet 的 hook。
 * datasheet 会提供对表格数据进行修改的接口，并提供对应的权限检查接口。
 * 
 * @param
 * 
 * @returns Datasheet 实例
 * ### 示例
 * ```js
 * import { useDatasheet } from '@vikadata/widget-sdk';
 *
 * function AddRecord() {
 *   const datasheet = useDatasheet();
 *   const [error, setError] = useState();
 *   // 参数的 key 为 fieldId， value 为单元格值
 *   const valuesMap = {
 *     fld1234567980: 'this is a text value',
 *     fld0987654321: 1024,
 *   }
 *   function addRecord(valuesMap) {
 *     if (!datasheet) {
 *       return;
 *     }
 *     const permission = datasheet.checkPermissionsForAddRecord(valuesMap)
 *     if (permission.acceptable) {
 *       datasheet.addRecord(valuesMap);
 *       return;
 *     }
 *     setError(permission.message);
 *   }
 *   return (<div>
 *     {error && <p>{error}</p>}
 *     <button onClick={() => addRecord(valuesMap)}>新增一行</button>
 *   </div>);
 * }
 * 
 * ```
 * 
 */
export function useDatasheet(datasheetId?: string | undefined) {
  const context = useContext<IWidgetContext>(WidgetContext);
  const { datasheetId: metaDatasheetId } = useMeta();
  const _datasheetId = datasheetId || metaDatasheetId;
  const dispatch = useDispatch();
  const datasheet = useSelector(state => getWidgetDatasheetPack(state, _datasheetId));
  const usedDatasheetMap = useSelector(state => state.datasheetMap, shallowEqual);
  const datasheetObj = Selectors.getDatasheetPack(context.globalStore.getState(), datasheetId);
  const iframe = isIframe();
  if (iframe && datasheetId && (!datasheetObj || datasheetObj.datasheet?.isPartOfData)) {
    widgetMessage.loadOtherDatasheetInit(datasheetId);
  } else if (!iframe && datasheetId && (!datasheetObj || (!datasheetObj.loading && !datasheetObj.errorCode))) {
    !usedDatasheetMap?.[datasheetId] && dispatch(refreshUsedDatasheetAction({ [datasheetId]: null }));
    context.globalStore.dispatch(StoreActions.fetchDatasheet(datasheetId) as any);
  }
  
  return useMemo(() => {
    if (!_datasheetId) return undefined;
    return new Datasheet(_datasheetId, context);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_datasheetId, context, datasheet]);
}
