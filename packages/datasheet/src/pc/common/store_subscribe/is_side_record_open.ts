import { RecordVision, StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage';

let preIsSideRecordOpen = false;

store.subscribe(() => {
  const state = store.getState();
  const isSideRecordOpen = state.space.isSideRecordOpen;
  
  //  Opened the side record card
  if (isSideRecordOpen && !preIsSideRecordOpen) {
    // Determine if the left-hand directory tree should be closed
    const sideBarVisible = state.space.sideBarVisible;
    if (sideBarVisible && getStorage(StorageName.RecordVision) == RecordVision.Side && window.innerWidth < 1920) {
      setStorage(StorageName.IsPanelClosed, false, StorageMethod.Set);
      store.dispatch(StoreActions.setSideBarVisible(false));
    }
  }
  preIsSideRecordOpen = isSideRecordOpen;
});
