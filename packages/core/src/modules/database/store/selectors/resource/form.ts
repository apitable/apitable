import { IFormState, IFormPack } from 'modules/database/store/interfaces/resource/form';
import { IReduxState } from '../../../../../exports/store/interfaces';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet';
import { DEFAULT_PERMISSION } from '../../../../../exports/store';

const getFormPack = (state: IReduxState, id?: string): IFormPack | null => {
  const formId = id || state.pageParams.formId;
  if (!formId) {
    return null;
  }
  return state.formMap[formId];
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
