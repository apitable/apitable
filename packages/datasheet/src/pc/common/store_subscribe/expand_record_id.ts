import { RecordVision, StoreActions } from '@apitable/core';
import { expandRecordRoute, clearExpandModal } from 'pc/components/expand_record';
import { store } from 'pc/store';

let preRecordId: string | null;

store.subscribe(function routeRecordChange() {
  const state = store.getState();
  const isLogin = state.user.isLogin;
  const { viewId, recordId, shareId } = state.pageParams;

  // Share page to expand cards even if you are not logged in
  if (!isLogin && !shareId) {
    return;
  }

  const isSideRecordOpen = state.space.isSideRecordOpen;

  if (!recordId) {
    preRecordId && clearExpandModal();
    preRecordId = null;
    if (isSideRecordOpen) {
      store.dispatch((StoreActions.toggleSideRecord(false))); // Close the side record card when the recordId does not exist for the route
    }

    return;
  }

  // Compatible with cases where there is no viewId but there is a recordId
  if (!viewId || preRecordId === recordId) {
    return;
  }

  preRecordId = recordId;

  if (!isSideRecordOpen && state.recordVision === RecordVision.Side) {
    store.dispatch((StoreActions.toggleSideRecord(true)));
  }

  expandRecordRoute();
});
