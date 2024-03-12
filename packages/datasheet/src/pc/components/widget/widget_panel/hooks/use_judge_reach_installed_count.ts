import { ConfigConstant, ResourceType, Selectors } from '@apitable/core';

import { useAppSelector } from 'pc/store/react-redux';

export const useJudgeReachInstalledCount = () => {
  const activeWidgetPanel = useAppSelector((state) => {
    const { datasheetId, mirrorId } = state.pageParams;
    const resourceId = mirrorId || datasheetId;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    return Selectors.getResourceActiveWidgetPanel(state, resourceId!, resourceType);
  })!;

  const widgetCount = activeWidgetPanel!.widgets.length;

  return Boolean(widgetCount >= ConfigConstant.WIDGET_PANEL_MAX_WIDGET_COUNT);
};
