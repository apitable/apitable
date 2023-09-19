/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { debounce } from 'lodash';
import { createRoot } from 'react-dom/client';
import { Field, ICellValue, IField, Navigation, PREVIEW_DATASHEET_ID, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { EXPAND_RECORD } from 'pc/components/expand_record/expand_record.enum';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';

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
      createRoot(item).unmount();
      item.parentElement!.removeChild(item);
    });
  }
}

/**
 * Routing method expansion card
 */
export const expandRecordIdNavigate = debounce((recordId?: string, isReplace?: boolean) => {
  const state = store.getState();
  const spaceId = state.space.activeId;
  const { datasheetId, viewId, shareId, templateId, categoryId, mirrorId, embedId } = state.pageParams;
  const datasheet = Selectors.getDatasheet(state);
  if (datasheet?.id === PREVIEW_DATASHEET_ID) {
    return;
  }

  const urlObj = new URL(location.href);
  const searchParams = urlObj.searchParams;

  if (!recordId) {
    searchParams.delete('comment');
  }
  // Clear notifyId by default
  if (searchParams.has('notifyId')) {
    searchParams.delete('notifyId');
  }

  const query = [...searchParams.entries()].reduce((prev, [key, value]) => {
    prev[key] = value;
    return prev;
  }, {});
  if (shareId) {
    const params = { nodeId: mirrorId || datasheetId, viewId, recordId, shareId, datasheetId };
    isReplace
      ? Router.replace(Navigation.SHARE_SPACE, { params, clearQuery: true, query })
      : Router.push(Navigation.SHARE_SPACE, { params, clearQuery: true, query });
  } else if (templateId) {
    const params = { nodeId: mirrorId || datasheetId, viewId, spaceId, recordId, categoryId, templateId, datasheetId };
    isReplace
      ? Router.replace(Navigation.TEMPLATE, { params, clearQuery: true, query })
      : Router.push(Navigation.TEMPLATE, { params, clearQuery: true, query });
  } else if (embedId) {
    const params = { nodeId: mirrorId || datasheetId, viewId, recordId, embedId, datasheetId };
    isReplace
      ? Router.replace(Navigation.EMBED_SPACE, { params, clearQuery: true, query })
      : Router.push(Navigation.EMBED_SPACE, { params, clearQuery: true, query });
  } else {
    const params = { nodeId: mirrorId || datasheetId, viewId, spaceId, recordId, datasheetId };
    isReplace
      ? Router.replace(Navigation.WORKBENCH, { params, clearQuery: true, query })
      : Router.push(Navigation.WORKBENCH, { params, clearQuery: true, query, options: { shallow: true } });
  }
}, 300);
export const recordModalCloseFns: Array<() => void | Promise<void>> = [];

export async function closeAllExpandRecord(): Promise<void> {
  for (const fn of recordModalCloseFns) {
    await fn();
  }
  recordModalCloseFns.splice(0);
  store.dispatch(StoreActions.toggleRecordFullScreen(false));
}
