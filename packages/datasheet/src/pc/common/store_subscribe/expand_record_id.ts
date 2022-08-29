import { RecordVision, StoreActions } from '@vikadata/core';
import { expandRecordRoute, clearExpandModal } from 'pc/components/expand_record';
import { store } from 'pc/store';

let preRecordId: string | null;

store.subscribe(function routeRecordChange() {
  const state = store.getState();
  const isLogin = state.user.isLogin;
  const { viewId, recordId, shareId } = state.pageParams;
  // 分享页未登录也可以展开卡片
  if (!isLogin && !shareId) {
    return;
  }
  const isSideRecordOpen = state.space.isSideRecordOpen;

  if (!recordId) {
    preRecordId && clearExpandModal();
    preRecordId = null;
    if (isSideRecordOpen) {
      store.dispatch((StoreActions.toggleSideRecord(false))); // 当路由不存在 recordId 时，关闭侧边记录卡片
    }

    return;
  }
  // 兼容没有 viewId 但是有 recordId 的情况
  if ((preRecordId && recordId) || !viewId) {
    preRecordId = recordId;
    return;
  }
  preRecordId = recordId;

  if (!isSideRecordOpen && state.recordVision === RecordVision.Side) {
    store.dispatch((StoreActions.toggleSideRecord(true)));
  }
  expandRecordRoute();
});