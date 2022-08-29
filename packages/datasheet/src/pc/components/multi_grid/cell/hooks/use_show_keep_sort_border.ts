import { Selectors } from '@vikadata/core';
import { useSelector, shallowEqual } from 'react-redux';

export const useShowKeepSortBorder = (groupHeadRecordId: string) => {
  const { gridViewDragState, keepSort } = useSelector(state => {
    return {
      gridViewDragState: Selectors.getGridViewDragState(state),
      keepSort: Selectors.getActiveViewSortInfo(state)?.keepSort,
    };
  }, shallowEqual);

  if (
    keepSort &&
    gridViewDragState.dragTarget &&
    groupHeadRecordId &&
    gridViewDragState.hoverGroupHeadRecordId === groupHeadRecordId
  ) {
    return true;
  }
  return false;
};
