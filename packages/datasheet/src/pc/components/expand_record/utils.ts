import { Field, ICellValue, IField, Navigation, StoreActions, Strings, t } from '@vikadata/core';
import { debounce } from 'lodash';
import { EXPAND_RECORD } from 'pc/components/expand_record/expand_record.enum';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';
import ReactDOM from 'react-dom';

export function getRecordName(title: ICellValue, field: IField) {
  if (!title) {
    return t(Strings.record_unnamed);
  }
  const result = Field.bindModel(field).cellValueToString(title);

  if (result && !result.trim()) {
    return t(Strings.record_unnamed);
  }
  return result || t(Strings.record_unnamed);
}

export function clearExpandModal() {
  const container = document.querySelectorAll(`.${EXPAND_RECORD}`);
  if (container.length) {
    container.forEach((item) => {
      ReactDOM.unmountComponentAtNode(item);
      item.parentElement!.removeChild(item);
    });
  }
}

/**
 * 路由方式展开卡片
 */
export const expandRecordIdNavigate = debounce((recordId?: string, isReplace?: boolean) => {
  const state = store.getState();
  const spaceId = state.space.activeId;
  const { datasheetId, viewId, shareId, templateId, categoryId, mirrorId } = state.pageParams;

  const urlObj = new URL(location.href);
  const searchParams = urlObj.searchParams;

  if (!recordId) {
    searchParams.delete('comment');
  }
  // 默认清除notifyId
  if (searchParams.has('notifyId')) {
    searchParams.delete('notifyId');
  }

  const query = [...searchParams.entries()].reduce((prev, [key, value]) => {
    prev[key] = value;
    return prev;
  }, {});

  if (shareId) {
    const params = { nodeId: mirrorId || datasheetId, viewId, recordId, shareId, datasheetId };
    isReplace ? Router.replace(Navigation.SHARE_SPACE, { params, clearQuery: true, query }) :
      Router.push(Navigation.SHARE_SPACE, { params, clearQuery: true, query });

  } else if (templateId) {
    const params = { nodeId: mirrorId || datasheetId, viewId, spaceId, recordId, categoryId, templateId, datasheetId };
    isReplace ? Router.replace(Navigation.TEMPLATE, { params, clearQuery: true, query }) :
      Router.push(Navigation.TEMPLATE, { params, clearQuery: true, query });
  } else {
    const params = { nodeId: mirrorId || datasheetId, viewId, spaceId, recordId, datasheetId };
    isReplace ? Router.replace(Navigation.WORKBENCH, { params, clearQuery: true, query }) :
      Router.push(Navigation.WORKBENCH, { params, clearQuery: true, query });
  }
}, 300);
export const recordModalCloseFns: Array<() => void> = [];

export function closeAllExpandRecord() {
  recordModalCloseFns.forEach(fn => {
    fn();
  });
  recordModalCloseFns.splice(0);
  store.dispatch(StoreActions.toggleRecordFullScreen(false));
}
