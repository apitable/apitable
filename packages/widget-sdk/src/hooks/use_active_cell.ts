import { useSelector } from 'react-redux';
import { useMeta } from './use_meta';
import { ICell, IWidgetState } from 'interface';
import { isCurrentDatasheetActive, getSelection } from '../store/selector';

const getActiveCell = (state: IWidgetState, currentDatasheetId?: string) => {
  if (!isCurrentDatasheetActive(state, currentDatasheetId)) {
    return;
  }
  const selection = getSelection(state);
  return selection?.activeCell;
};

/**
 * 获取当前光标激活的单元格坐标, 返回一个 {@link ICell}。当光标移动或者切换视图的时候，会触发重新渲染。
 *
 * 如果你不仅需要激活单元格的信息，还需要选区信息，请使用 {@link useSelection}。
 * 
 * @param 
 * 
 * @returns
 *
 * ### 示例
 * ```js
 * import { useActiveCell, useRecord } from '@vikadata/widget-sdk';
 *
 * // 渲染当前选中单元格的值
 * function ActiveCell() {
 *   const activeCell = useActiveCell();
 *   const activeRecord = useRecord(activeCell?.recordId);
 *   if (!activeCell || !activeRecord) {
 *     return <p>无激活的单元格</p>
 *   }
 *   return <p>激活的单元格: {activeRecord.getCellValueString(activeCell.fieldId)}</p>
 * }
 * ```
 */
export function useActiveCell(): ICell | undefined {
  const { datasheetId } = useMeta();
  return useSelector(state => {
    return getActiveCell(state, datasheetId);
  });
}
