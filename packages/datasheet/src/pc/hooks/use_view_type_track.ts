import { tracker } from 'pc/utils/tracker';
import { TrackEvents, Selectors, ViewType } from '@vikadata/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const viewMap = {
  1: '维格视图',
  2: '看板视图',
  3: '相册视图',
  4: '神奇表单',
  5: '日历视图',
  6: '甘特视图',
  7: '架构视图',
};

export const useViewTypeTrack = () => {
  const { formId, mirrorId, datasheetId } = useSelector(state => state.pageParams);
  const currentView = useSelector(state => Selectors.getCurrentView(state));

  useEffect(() => {
    if (currentView?.id) {
      tracker.track(TrackEvents.ViewsInfo, {
        viewName: viewMap[currentView.type]
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mirrorId, datasheetId, currentView?.id]);

  useEffect(() => {
    if (formId) {
      tracker.track(TrackEvents.ViewsInfo, {
        viewName: viewMap[ViewType.Form]
      });
    }
  }, [formId]);
};
