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

import { getDstViewDataPack, getShareDstViewDataPack } from '../modules/database/api/datasheet_api';
import { CollaCommandName } from 'commands/enum';
import { IJOTAction } from 'engine/ot/interface';
import { Strings, t } from '../exports/i18n';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IFieldMap, IKanbanStyle, IReduxState, IViewProperty } from '../exports/store/interfaces';
import { applyJOTOperations } from 'modules/database/store/actions/resource';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { getDatasheetClient } from 'modules/database/store/selectors/resource/datasheet/base';
import { getResourceRevision } from 'modules/database/store/selectors/resource';
import { ErrorCode, ErrorType, IError, IFilterInfo, IGroupInfo, ISortInfo, ResourceType, ModalType } from 'types';
import { getReaderRolePermission } from 'engine/get_reader_role_permission';

interface IViewPropertyFilterListener {
  onError?(error: IError): any;
}

type IViewPropertyKey = (keyof IViewProperty | 'style');

interface IResetViewPropertyProps {
  datasheetId: string;
  viewId: string;
  dispatch: (action: any) => void;
  shareId?: string;
  onError?(error: IError): any;
}

export class ViewPropertyFilter {
  private _fromServer?: boolean;
  static ignoreViewProperty = ['id', 'type', 'rows', 'name', 'lockInfo'];

  constructor(
      private _getState: () => IReduxState,
      private _dispatch: (action: any) => void,
      private _datasheetId: string,
      private _listener: IViewPropertyFilterListener
  ) {
  }

  private _checkGroupInfo(groupInfo: IGroupInfo, fieldMap: IFieldMap) {
    return groupInfo.every(info => {
      return fieldMap[info.fieldId];
    });
  }

  private _checkFilterInfo(filterInfo: IFilterInfo, fieldMap: IFieldMap) {
    if (!filterInfo.conditions.length) {
      return true;
    }
    return filterInfo.conditions.every(info => {
      return fieldMap[info.fieldId];
    });
  }

  private _checkSortInfo(sortInfo: ISortInfo, fieldMap: IFieldMap) {
    if (!sortInfo.rules.length) {
      return true;
    }
    return sortInfo.rules.every(info => {
      return fieldMap[info.fieldId];
    });
  }

  private _checkStyle(style: IKanbanStyle, fieldMap: IFieldMap) {
    if (style.kanbanFieldId) {
      return fieldMap[style.kanbanFieldId];
    }
    return true;
  }

  /* Strategy for checking data integrity */
  private _fieldIntegrityCheck(viewProperty: IViewPropertyKey, op: any, fieldMap: IFieldMap) {
    switch (viewProperty) {
      case 'groupInfo': {
        return this._checkGroupInfo(op, fieldMap);
      }
      case 'filterInfo': {
        return this._checkFilterInfo(op, fieldMap);
      }
      case 'sortInfo': {
        return this._checkSortInfo(op, fieldMap);
      }
      case 'style': {
        return this._checkStyle(op, fieldMap);
      }
      default: {
        return true;
      }
    }
  }

  private _actionFilter(action: IJOTAction) {
    const path = action.p;

    if (!path.includes('views')) {
      return true;
    }

    const state = this._getState();
    const viewIndex = path[2]!;
    const snapshot = getSnapshot(state, this._datasheetId);

    if (!snapshot) {
      return false;
    }

    const views = snapshot.meta.views!;
    const view = views[viewIndex];
    const opViewId = view?.id;

    if (!view || !opViewId) {
      return true;
    }

    const viewModified = getDatasheetClient(state, this._datasheetId)?.operateViewIds?.includes(opViewId) ?? false;
    const shouldApplyManuallySave = !viewModified;

    if (shouldApplyManuallySave) {
      return true;
    }

    if (view['autoSave']) {
      return true;
    }

    const propertyKey = path[3] as IViewPropertyKey;

    if (!propertyKey) {
      // If there is no propertyKey, it should be doing the delete operation of the view, and the view deletion also needs to be released
      return true;
    }

    if (ViewPropertyFilter.ignoreViewProperty.includes(propertyKey)) {
      return true;
    }

    if (this._fromServer && path.includes('autoSave') && action['oi']) {
      // Receive op from the server, if it is checked that there is a modification to autoSave,
      // and it is turned on, you need to pull the latest view data from the server to overwrite the local
      // FIXME handle errors
      void ViewPropertyFilter.resetViewProperty(state, {
        datasheetId: this._datasheetId,
        viewId: view.id,
        dispatch: this._dispatch,
        onError: this._listener.onError
      });
      return true;
    }

    if (path.includes('columns')) {
      // If the li and ld operations are performed at the same time,
      // it means that the original content is being replaced, which belongs to LR and needs to be filtered out
      // Such as hiding columns, modifying column widths, etc.
      if (action['li'] && action['ld']) {
        return false;
      }
      // There is only one li and ld, just delete or add
      if (action['li'] || action['ld']) {
        return true;
      }
      return false;
    }

    return false;
  }

  public parseActions(actions: IJOTAction[], { fromServer, commandName }: { fromServer?: boolean; commandName?: CollaCommandName }) {
    this._fromServer = fromServer;

    if (
      commandName &&
        [CollaCommandName.AddViews, CollaCommandName.DeleteViews, CollaCommandName.MoveViews, CollaCommandName.DeleteField,
          CollaCommandName.SetFieldAttr].includes(commandName)
    ) {
      // If it is detected that the collaborative state of the view is being modified, there is no need to filter this action.
      return actions;
    }

    const state: IReduxState = this._getState();
    if (!state.labs?.includes('view_manual_save') && !state.share?.featureViewManualSave && !state.embedInfo?.viewManualSave) {
      // There is no uncoordinated view of the entire space station, so there is no need to check the data here
      return actions;
    }

    if (commandName && [CollaCommandName.ManualSaveView, CollaCommandName.SetViewAutoSave].includes(commandName)) {
      // Manually save the view data. In order to avoid the impact of the field's absence on the view configuration,
      // it is necessary to check the field's existence and filter the abnormal configuration.
      // This filtering scheme is only used to submit data from the client to the server, otherwise this method is not called
      return actions.filter((action) => this._filterFieldExist(action));
    }

    return actions.filter((action) => this._actionFilter(action));
  }

  private _filterFieldExist(action: IJOTAction) {
    const path = action.p;

    if (!path.includes('views')) {
      return true;
    }

    const state = this._getState();
    const snapshot = getSnapshot(state, this._datasheetId);

    if (!snapshot) {
      return false;
    }
    const fieldMap = snapshot?.meta.fieldMap;
    const propertyKey = path[3] as IViewPropertyKey;

    if (action['oi']) {
      return this._fieldIntegrityCheck(propertyKey, action['oi'], fieldMap);
    }
    return true;
  }

  // Reset the current graph configuration, which is consistent with the database data
  static async resetViewProperty(state: IReduxState, { datasheetId, viewId, dispatch, onError, shareId }: IResetViewPropertyProps) {
    const snapshot = getSnapshot(state, datasheetId)!;
    const { success, data } = await ViewPropertyFilter.requestViewData(datasheetId, viewId);

    if (success) {
      const revision = getResourceRevision(state, datasheetId, ResourceType.Datasheet);

      if (data['revision'] < revision!) {
        // The version of the database is smaller than the local version, it may be that the op is being processed
        // at the same time as the request, so resend the request
        return await this.requestViewData(datasheetId, viewId, shareId);
      }

      if (data['revision'] > revision! + 1) {
        // If the local version is smaller than the database version, you should make up the version number first, and then perform data replacement
        return this.handleError(onError);
      }

      const viewProperty = data['view'];

      const resetActions = DatasheetActions.resetView2Action(snapshot, { viewId: viewId, viewProperty: viewProperty as any as IViewProperty });

      if (!resetActions) {
        return this.handleError(onError);
      }

      dispatch(applyJOTOperations([{
        cmd: CollaCommandName.SetViewAutoSave,
        actions: resetActions
      }], ResourceType.Datasheet, datasheetId));
      return;
    }
    return this.handleError(onError);
  }

  static handleError(onError?: (error: IError) => any) {
    onError?.({
      type: ErrorType.CollaError,
      code: ErrorCode.EngineCreateFailed,
      message: t(Strings.manual_save_view_error),
      modalType: ModalType.Warning
    });
  }

  static async requestViewData(datasheetId: string, viewId: string, shareId?: string) {
    const res = shareId ? await getShareDstViewDataPack(datasheetId, viewId, shareId) : await getDstViewDataPack(datasheetId, viewId);
    return res.data;
  }

  static getReaderRolePermission = getReaderRolePermission;
}