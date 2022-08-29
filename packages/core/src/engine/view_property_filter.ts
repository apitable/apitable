import { getDstViewDataPack, getShareDstViewDataPack } from 'api/datasheet_api';
import { CollaCommandName } from 'commands';
import { IJOTAction } from 'engine/ot';
import { Strings, t } from 'i18n';
import { DatasheetActions } from 'model';
import { IFieldMap, IKanbanStyle, IPermissions, IReduxState, IViewProperty, Selectors, StoreActions } from 'store';
import { getCurrentViewBase, getSnapshot } from 'store/selector';
import { ErrorCode, ErrorType, IError, IFilterInfo, IGroupInfo, ISortInfo, ResourceType, ModalType } from 'types';

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

  /* 检查数据完整性的策略 */
  private _fieldIntegrityCheck(viewProperty: IViewPropertyKey, op, fieldMap) {
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
    const viewIndex = path[2];
    const snapshot = Selectors.getSnapshot(state, this._datasheetId);

    if (!snapshot) {
      return false;
    }

    const views = snapshot.meta.views!;
    const view = views[viewIndex];
    const opViewId = view?.id;

    if (!view || !opViewId) {
      return true;
    }

    if (view['autoSave']) {
      return true;
    }

    const propertyKey = path[3] as IViewPropertyKey;

    if (!propertyKey) {
      // 不存在 propertyKey 的话，就应该是在做视图的删除操作，视图删除也需要放行
      return true;
    }

    if (ViewPropertyFilter.ignoreViewProperty.includes(propertyKey)) {
      return true;
    }

    if (this._fromServer && path.includes('autoSave') && action['oi']) {
      // 从服务端收到 op，如果检查到存在对 autoSave 的修改，并且是开启状态，则需要拉取服务端的最新视图数据对本地做覆盖
      ViewPropertyFilter.resetViewProperty(state, {
        datasheetId: this._datasheetId,
        viewId: view.id,
        dispatch: this._dispatch,
        onError: this._listener.onError
      });
      return true;
    }

    if (path.includes('columns')) {
      // 同时出行 li 和 ld 操作，则说明在对原内容做替换，属于 LR，需要过滤掉
      // 比如隐藏列，修改列宽等
      if (action['li'] && action['ld']) {
        return false;
      }
      // li 和 ld 只存在一个，就只是删除或者新增
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
      // 如果检查到是在修改视图的协同状态，就不需要再对这次的 action 做过滤
      return actions;
    }

    const state: IReduxState = this._getState();
    if (!state.labs.includes('view_manual_save') && !state.share.featureViewManualSave) {
      // 没有开启全空间站的视图不协同的体验，这里就不用对数据做检查
      return actions;
    }

    if (commandName && [CollaCommandName.ManualSaveView, CollaCommandName.SetViewAutoSave].includes(commandName)) {
      // 手动对视图数据做保存，为了避免 field 不存在对于视图配置的影响，这里需要对 field 做存在性检查，对于异常的配置进行过滤
      // 该过滤方案仅用于从 client 提交数据到 server 端，反之并不调用该方法
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
    const snapshot = Selectors.getSnapshot(state, this._datasheetId);

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

  // 重置当前的是图配置，也就是和数据库数据保持一致
  static async resetViewProperty(state: IReduxState, { datasheetId, viewId, dispatch, onError, shareId }: IResetViewPropertyProps) {
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    const { success, data } = await ViewPropertyFilter.requestViewDate(datasheetId, viewId);

    if (success) {
      const revision = Selectors.getResourceRevision(state, datasheetId, ResourceType.Datasheet);

      if (data['revision'] < revision!) {
        // 数据库的版本比本地版本小，可能是在请求的同时正好在处理 op，所以重新发送一次请求
        return await this.requestViewDate(datasheetId, viewId, shareId);
      }

      if (data['revision'] > revision! + 1) {
        // 如果本地的版本比数据库的版本要小，则应该先补足版本号，再进行数据替换
        return this.handleError(onError);
      }

      const viewProperty = data['view'];

      const resetActions = DatasheetActions.resetView2Action(snapshot, { viewId: viewId, viewProperty: viewProperty as any as IViewProperty });

      if (!resetActions) {
        return this.handleError(onError);
      }

      dispatch(StoreActions.applyJOTOperations([{
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

  static async requestViewDate(datasheetId: string, viewId: string, shareId?: string) {
    const res = shareId ? await getShareDstViewDataPack(datasheetId, viewId, shareId) : await getDstViewDataPack(datasheetId, viewId);
    return res.data;
  }

  static getReaderRolePermission(state: IReduxState, datasheetId: string, permission?: IPermissions) {
    const spaceManualSaveViewIsOpen = state.labs.includes('view_manual_save') || Boolean(state.share.featureViewManualSave);
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
}
