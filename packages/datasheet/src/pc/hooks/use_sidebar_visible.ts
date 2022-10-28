import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { StoreActions } from '@apitable/core';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import { isNull } from 'lodash';

export const useSideBarVisible = () => {
  const sideBarVisible = useSelector(state => state.space.sideBarVisible);
  const { screenIsAtMost } = useResponsive();
  const dispatch = useDispatch();
  const setSideBarVisible = useCallback(
    (sideBarVisible: boolean) => {
      // It is necessary to ensure that the useEffect tampers with the sideBarVisible before the loc is dispatched
      setStorage(StorageName.IsPanelClosed, sideBarVisible, StorageMethod.Set);
      dispatch(StoreActions.setSideBarVisible(sideBarVisible));
    },
    [dispatch],
  );

  useEffect(() => {
    if (screenIsAtMost(ScreenSize.md)) return;
    // big screen device
    const localPanelClose = getStorage(StorageName.IsPanelClosed);
    if (isNull(localPanelClose)) {
      setSideBarVisible(true);
      return;
    }
    setSideBarVisible(localPanelClose);
  }, [setSideBarVisible, screenIsAtMost]);

  return {
    sideBarVisible,
    setSideBarVisible,
  };
};
