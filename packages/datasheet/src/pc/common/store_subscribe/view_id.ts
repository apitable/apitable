import { StoreActions, Selectors, compensator } from '@vikadata/core';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';
import { changeView } from 'pc/hooks';
import { StorageName, getStorage, setStorage } from 'pc/utils/storage/storage';

let viewId: string | undefined;
let datasheetActiveViewId: string | undefined;

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
  const mirrorId = state.pageParams.mirrorId;
  const previousViewId = viewId;
  const previousDatasheetActiveViewId = datasheetActiveViewId;
  viewId = state.pageParams.viewId;
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

  // 没有 viewId，则跳转到当前激活 view, 也就是第一个 view
  if (!viewId && datasheetActiveViewId && previousDatasheetActiveViewId !== datasheetActiveViewId) {
    const nextViewId = getStorage(StorageName.DatasheetView)?.[uniqueId] || datasheetActiveViewId;
    changeView(nextViewId);
    return;
  }

  return;
});
