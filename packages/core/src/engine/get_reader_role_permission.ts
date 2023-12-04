
import { IPermissions, IReduxState } from '../exports/store/interfaces';
import { getCurrentViewBase } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';

export function getReaderRolePermission(state: IReduxState, datasheetId: string, permission?: IPermissions) {
  const spaceManualSaveViewIsOpen = state.labs?.includes('view_manual_save') ||
      Boolean(state.share?.featureViewManualSave) ||
      Boolean(state.embedInfo?.viewManualSave);
  const viewId = state.pageParams.viewId;
  if (!viewId || !spaceManualSaveViewIsOpen || !permission) {
    return permission;
  }
  const view = getCurrentViewBase(getSnapshot(state, datasheetId)!, viewId, datasheetId);

  if (!view || view.autoSave) {
    return permission;
  }

  return {
    ...permission,
    viewFilterable: true,
    columnSortable: true,
    columnHideable: true,
    fieldSortable: true,
    fieldGroupable: true,
    rowHighEditable: true,
    columnWidthEditable: true,
    columnCountEditable: true,
    viewLayoutEditable: true,
    viewStyleEditable: true,
    viewKeyFieldEditable: true,
    viewColorOptionEditable: true,
    visualizationEditable: true,
  };
}