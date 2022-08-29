import { Selectors, StoreActions, ToolBarMenuCardOpenState } from '@vikadata/core';
import { useDispatch, useSelector } from 'react-redux';
import { ToolHandleType } from './interface';

export const ToolbarMap = {
  [ToolBarMenuCardOpenState.RowHeight]: ToolHandleType.ChangeRowHeight,
  [ToolBarMenuCardOpenState.FieldHidden]: ToolHandleType.HideField,
  [ToolBarMenuCardOpenState.ExclusiveFieldHidden]: ToolHandleType.HideExclusiveField,
  [ToolBarMenuCardOpenState.Filter]: ToolHandleType.ViewFilter,
  [ToolBarMenuCardOpenState.Group]: ToolHandleType.ViewGroup,
  [ToolBarMenuCardOpenState.Sort]: ToolHandleType.ViewSort,
  [ToolBarMenuCardOpenState.GallerySetting]: ToolHandleType.GallerySetting,
  [ToolHandleType.OrgChartSetting]: ToolBarMenuCardOpenState.OrgChartSetting,
  [ToolBarMenuCardOpenState.ViewSwitcher]: ToolHandleType.ViewSwitcher,
  [ToolBarMenuCardOpenState.KanbanFieldHidden]: ToolHandleType.HiddenKanbanGroup,
  [ToolBarMenuCardOpenState.None]: null,
};

export const ToolbarReMap = {
  [ToolHandleType.ChangeRowHeight]: ToolBarMenuCardOpenState.RowHeight,
  [ToolHandleType.HideField]: ToolBarMenuCardOpenState.FieldHidden,
  [ToolHandleType.HideExclusiveField]: ToolBarMenuCardOpenState.ExclusiveFieldHidden,
  [ToolHandleType.ViewFilter]: ToolBarMenuCardOpenState.Filter,
  [ToolHandleType.ViewGroup]: ToolBarMenuCardOpenState.Group,
  [ToolHandleType.ViewSort]: ToolBarMenuCardOpenState.Sort,
  [ToolHandleType.GallerySetting]: ToolBarMenuCardOpenState.GallerySetting,
  [ToolHandleType.OrgChartSetting]: ToolBarMenuCardOpenState.OrgChartSetting,
  [ToolHandleType.ViewSwitcher]: ToolBarMenuCardOpenState.ViewSwitcher,
  [ToolHandleType.HiddenKanbanGroup]: ToolBarMenuCardOpenState.KanbanFieldHidden,
};

export function useToolbarMenuCardOpen(type: ToolHandleType) {
  const dispatch = useDispatch();
  const toolbarMenuCardState = useSelector(state => Selectors.getToolbarMenuCardState(state));
  const toolHandleType = ToolbarMap[toolbarMenuCardState];

  const setToolbarMenuCardOpen = (open: boolean) => {
    const ToolbarMenuType = ToolbarReMap[type];
    if (open) {
      dispatch(StoreActions.setToolbarMenuCardOpen(ToolbarMenuType));
    } else {
      dispatch(StoreActions.setToolbarMenuCardOpen(ToolBarMenuCardOpenState.None));
    }
  };

  const open = type === toolHandleType;
  return {
    open, setToolbarMenuCardOpen,
  };
}
