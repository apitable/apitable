import { StoreActions, Selectors, compensator } from '@vikadata/core';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';
import { changeView } from 'pc/hooks';
import { StorageName, getStorage, setStorage } from 'pc/utils/storage/storage';

let viewId: string | undefined;
let datasheetActiveViewId: string | undefined;
let mirrorId: string | undefined;

const restoreGroupExpanding = () => {
  // 恢复 localStorage 中分组展开的信息
  const datasheetId = Selectors.getActiveDatasheetId(store.getState())!;
  const storageGroupCollapse = getStorage(StorageName.GroupCollapse);
  const key = `${datasheetId},${viewId}`;
  if (!storageGroupCollapse || !storageGroupCollapse[key] || !Array.isArray(storageGroupCollapse[key])) {
    return;
  }
  dispatch(StoreActions.setGroupingCollapse(datasheetId, storageGroupCollapse[key]));
};

store.subscribe(() => {
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state);
  const previousViewId = viewId;
  const previousMirrorId = mirrorId;
  const previousDatasheetActiveViewId = datasheetActiveViewId;
  viewId = state.pageParams.viewId;
  mirrorId = state.pageParams.mirrorId;
  datasheetActiveViewId = Selectors.getActiveView(state);

  // 等到数表加载完毕的时候，才开始后面的检查
  if (!snapshot || !datasheetActiveViewId) {
    return;
  }

  const datasheetId = state.pageParams.datasheetId;
  const spaceId = state.space.activeId;
  const uniqueId = `${spaceId},${datasheetId}`;

  if (viewId && previousViewId !== viewId) {
    // 因为上方条件判断已经过滤了大部分变动，只在view变化的时候才会进行必要的遍历比较
    if (snapshot.meta.views.find(view => view.id === viewId)) {
      dispatch(StoreActions.switchView(datasheetId!, viewId));
      setStorage(StorageName.DatasheetView, { [uniqueId]: viewId });
    } else {
      if (mirrorId) {
        return;
      }
      // viewId 在 datasheet 中不存在时，需要修正 URL。
      changeView(snapshot.meta.views[0].id);
    }
    restoreGroupExpanding();
    dispatch(StoreActions.setDatasheetComputed({}, datasheetId!));
    compensator.clearAll();
  }

  /**
   * 目的：没有 viewId，则跳转到当前激活 view, 也就是第一个 view
   * 1. 当 viewId == null，虽然本意是希望跳转到某一个视图，但是在跳转的过程，redux 会被频繁触发，导致 changeView 多次调用，
   * 在上面的背景下，增加了 previousDatasheetActiveViewId !== datasheetActiveViewId 的判断，用来减少 changeView 的调用
   * 2. 上述情况存在漏洞，当出现从镜像跳转到原表时，路由上的 viewId 会不存在，原因在于镜像和原表共享一份数据，从镜像跳转回原表，previousDatasheetActiveViewId 一定等于
   * datasheetActiveViewId。因此新增 previousMirrorId && !mirrorId 的判断，也就是当前一个条件为 false 时，判断当前的路由是否是从镜像离开
   * （PS：除了上述的思路，还有另一种是立即更新 pageParams 里的数据，这个问题之所以出现就是在于路由的变化并没有立即更新 pageParams，所以只要 pageParams 更新及时，这个问题也可以避免，
   * 但是现在的项目中，对 pageParams 的修改都是通过 usePageParams 这个 hooks，为了不破坏这个逻辑，就没采用这个方案）
   */
  if (!viewId && (previousDatasheetActiveViewId !== datasheetActiveViewId || (previousMirrorId && !mirrorId))) {
    const nextViewId = getStorage(StorageName.DatasheetView)?.[uniqueId] || datasheetActiveViewId;
    changeView(nextViewId);
    return;
  }

  return;
});
