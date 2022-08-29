import { store } from 'pc/store';

store.subscribe(function spaceIdChange() {
  const state = store.getState();
  const spaceDomain = state.user.info?.spaceDomain;
  // 兼容一下本地调试
  if (process.env.NODE_ENV === 'production' && spaceDomain && spaceDomain !== window.location.host) {
    window.location.host = spaceDomain;
  }
});
