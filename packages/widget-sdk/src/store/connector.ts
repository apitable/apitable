import { IReduxState, Selectors, StoreActions } from 'core';
import { IWidgetDatasheetState, IWidgetState } from 'interface';
import { shallowEqual } from 'react-redux';
import { createStore, Store, Unsubscribe } from 'redux';
import { SET_MIRROR_MAP, SET_SHARE_INFO, SET_USER_INFO, UPDATE_DASHBOARD, UPDATE_UNIT_INFO } from './constant';
import { refreshUsedDatasheetAction } from './slice/datasheetMap/action';
import { iframeWidgetDashboardSelector, widgetDatasheetSelector } from './slice/datasheetMap/selector';
import { rootReducers, setErrorCodeAction } from './slice/root';
import { refreshWidgetAction } from './slice/widget/action';

/**
 * 初始化 widgetState;
 */
const initRootWidgetState = (state: IReduxState, id: string): IWidgetState => {
  const widget = Selectors.getWidget(state, id) || null;
  let datasheet: IWidgetDatasheetState | null = null;
  const datasheetId = widget?.snapshot.datasheetId;
  if (datasheetId) {
    datasheet = widgetDatasheetSelector(state, datasheetId);
  }
  const errorCode = Selectors.getDatasheetErrorCode(state, datasheetId) || null;
  const sourceId = widget?.snapshot.sourceId;
  const mirror = sourceId?.startsWith('mir') && Selectors.getMirrorPack(state, sourceId);
  const dashboardPack = Selectors.getDashboardPack(state);
  return {
    widget,
    datasheetMap: datasheetId ? { [datasheetId]: datasheet } : {},
    errorCode,
    unitInfo: state.unitInfo,
    dashboard: iframeWidgetDashboardSelector(dashboardPack),
    widgetConfig: {
      isShowingSettings: false,
      isFullscreen: false
    },
    pageParams: state.pageParams,
    labs: state.labs,
    share: state.share,
    mirrorMap: mirror ? { [sourceId!]: mirror } : {},
    user: state.user.info
  };
};

/**
 *
 * @param props
 *  globalStore 是主应用中的全局 store
 *  widgetData widget
 * 通过绑定 datasheetId 创造一个专属 widget 的 store 环境。
 * TODO: 需要考虑没有 datasheetId 的情况，比如一个 pure widget ，或者 dashboard 中还未选择数表的 widget
 */
export const connectWidgetStore = (props: {
  id: string;
  globalStore: Store<IReduxState>;
}): { unSubscribe: Unsubscribe, widgetStore: Store<IWidgetState> } => {
  const { id, globalStore } = props;
  const widgetStore = createStore(rootReducers, initRootWidgetState(globalStore.getState(), id));
  /**
   * TODO: 如果没有必要使用数表的数据，这里的监控可以不需要
   * 监听整个 store 的变化，检查和 widget 绑定的 datasheet 相关数据是否有更新，检查内容参看 IWidgetDatasheetState
   * 数据流：globalStore 变化 ---> datasheetId 过滤 ---> widgetStore 变化
   */
  const unSubscribe = globalStore.subscribe(() => {
    const globalState = globalStore.getState();
    const newWidget = Selectors.getWidget(globalState, id);
    const datasheetId = newWidget?.snapshot.datasheetId;
    const newErrorCode = Selectors.getDatasheetErrorCode(globalState, datasheetId);

    const widgetState = widgetStore.getState();
    if (newWidget && !shallowEqual(newWidget, widgetState.widget)) {
      widgetStore.dispatch(refreshWidgetAction(newWidget));
    }
    if (newErrorCode && newErrorCode !== widgetState.errorCode) {
      widgetStore.dispatch(setErrorCodeAction(newErrorCode));
    }
    // 检查 datasheetMap 是否变化
    const updateUsedDatasheetMap = {};
    Object.keys(widgetState.datasheetMap).forEach(datasheetId => {
      const widgetUsedDatasheet = widgetDatasheetSelector(globalState, datasheetId);
      const dstMap: any = widgetState.datasheetMap[datasheetId] || {};
      if (
        widgetUsedDatasheet
        && !shallowEqual(widgetState.datasheetMap[datasheetId]?.client, widgetUsedDatasheet.client)) {
        dstMap.client = widgetUsedDatasheet.client;
        updateUsedDatasheetMap[datasheetId] = dstMap;
      }
      if (
        widgetUsedDatasheet
        && !shallowEqual(widgetState.datasheetMap[datasheetId]?.datasheet, widgetUsedDatasheet.datasheet)) {
        dstMap.datasheet = widgetUsedDatasheet.datasheet;
        updateUsedDatasheetMap[datasheetId] = dstMap;
      }
    });

    if (Object.keys(updateUsedDatasheetMap).length) {
      widgetStore.dispatch(refreshUsedDatasheetAction(updateUsedDatasheetMap));
    }

    if (!shallowEqual(globalState.labs, widgetState.labs)) {
      widgetStore.dispatch(StoreActions.setLabs(globalState.labs));
    }

    if (!shallowEqual(globalState.unitInfo, widgetState.unitInfo)) {
      widgetStore.dispatch({ type: UPDATE_UNIT_INFO, payload: globalState.unitInfo });
    }

    if (!shallowEqual(globalState.pageParams, widgetState.pageParams)) {
      widgetStore.dispatch({ type: 'UPDATE_PAGE_PARAMS', payload: globalState.pageParams });
    }

    if (!shallowEqual(globalState.share, widgetState.share)) {
      widgetStore.dispatch({ type: SET_SHARE_INFO, payload: globalState.share });
    }

    if (
      newWidget?.snapshot.sourceId?.startsWith('mir') &&
      !shallowEqual(globalState.mirrorMap[newWidget?.snapshot.sourceId], widgetState.mirrorMap?.[newWidget?.snapshot.sourceId!])
    ) {
      const mirror = globalState.mirrorMap[newWidget?.snapshot.sourceId!];
      widgetStore.dispatch({ type: SET_MIRROR_MAP, payload: { [newWidget?.snapshot.sourceId!]: mirror }});
    }

    const permissions = Selectors.getDashboard(globalState)?.permissions;
    if (!shallowEqual(permissions, widgetState.dashboard?.permissions)) {
      widgetStore.dispatch({ type: UPDATE_DASHBOARD, payload: { permissions }});
    }
    const collaborators = Selectors.getDashboardClient(globalState)?.collaborators;
    if (!shallowEqual(collaborators, widgetState.dashboard?.collaborators)) {
      widgetStore.dispatch({ type: UPDATE_DASHBOARD, payload: { collaborators }});
    }

    if (!shallowEqual(globalState.user.info, widgetState.user)) {
      widgetStore.dispatch({ type: SET_USER_INFO, payload: globalState.user.info });
    }
  });

  return {
    unSubscribe,
    widgetStore,
  };
};
