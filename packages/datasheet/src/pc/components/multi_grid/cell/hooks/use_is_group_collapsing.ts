import { CellType, ILinearRow, Selectors } from '@apitable/core';
import { useSelector } from 'react-redux';

export const useIsGroupCollapsing = (row: ILinearRow) => {
  const groupingCollapseIds = useSelector(Selectors.getGroupingCollapseIds);
  const groupingCollapseIdSet = new Set(groupingCollapseIds);
  return row.type === CellType.GroupTab && Boolean(groupingCollapseIdSet.has(`${row.recordId}_${row.depth}`));
};