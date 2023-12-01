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

import { IFormState, IFormPack } from 'modules/database/store/interfaces/resource/form';
import { IReduxState } from '../../../../../exports/store/interfaces';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { DEFAULT_PERMISSION } from 'modules/shared/store/constants';

const getFormPack = (state: IReduxState, id?: string): IFormPack | null => {
  const formId = id || state.pageParams.formId;
  if (!formId) {
    return null;
  }
  return state.formMap[formId] ?? null;
};

export const getForm = (state: IReduxState, id?: string): IFormState | null => {
  const formPack = getFormPack(state, id);
  if (!formPack) {
    return null;
  }
  return formPack.form;
};

export const getFormLoading = (state: IReduxState, id?: string) => {
  const formPack = getFormPack(state, id);
  if (!formPack) {
    return false;
  }
  return formPack.loading;
};

export const getFormErrorCode = (state: IReduxState, id?: string) => {
  const formPack = getFormPack(state, id);
  if (!formPack) {
    return ;
  }
  return formPack.errorCode;
};

export const getFieldPermissionMapFromForm = (state: IReduxState, id?: string) => {
  const form = getForm(state, id);
  if (!form) {
    return;
  }
  return form.fieldPermissionMap;
};

export const getFormPermission = (state: IReduxState, resourceId?: string) => {
  const formPack = getFormPack(state, resourceId);
  if (!formPack || !formPack.form || !formPack.connected) {
    return DEFAULT_PERMISSION;
  }

  return formPack.form.permissions;
};

export const getFormClient = (state: IReduxState, id?: string) => {
  const formPack = getFormPack(state, id);
  if (!formPack) {
    return null;
  }
  return formPack.client;
};

export const getFormSnapshot = (state: IReduxState, id?: string) => {
  const form = getForm(state, id);
  if (!form) {
    return null;
  }
  return form.snapshot;
};

export const getFormRelMeta = (state: IReduxState, id?: string) => {
  const sourceInfo = getForm(state, id)?.sourceInfo;
  if (!sourceInfo) {
    return null;
  }
  const { datasheetId, viewId } = sourceInfo;
  const datasheetSnapshot = getSnapshot(state, datasheetId);
  if (!datasheetSnapshot) {
    return null;
  }

  const currentView = datasheetSnapshot.meta.views.filter(view => {
    return view.id === viewId;
  });
  if (!currentView.length) {
    return null;
  }
  return {
    fieldMap: datasheetSnapshot.meta.fieldMap,
    views: currentView,
  };
};
