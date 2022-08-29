import { RecordVision, StoreActions } from '@vikadata/core';
import { store } from 'pc/store';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage';

let preIsSideRecordOpen = false;

store.subscribe(() => {
  const state = store.getState();
  const isSideRecordOpen = state.space.isSideRecordOpen;
  
  // 打开了侧边记录卡片
  if (isSideRecordOpen && !preIsSideRecordOpen) {
    // 判断左侧目录树是否要关闭
    const sideBarVisible = state.space.sideBarVisible;
    if (sideBarVisible && getStorage(StorageName.RecordVision) == RecordVision.Side && window.innerWidth < 1920) {
      setStorage(StorageName.IsPanelClosed, false, StorageMethod.Set);
      store.dispatch(StoreActions.setSideBarVisible(false));
    }
  }
  preIsSideRecordOpen = isSideRecordOpen;
});
