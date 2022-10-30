import { isEmpty, find } from 'lodash';
import { IJOTAction } from 'engine/ot';
import { DatasheetActions } from 'model';
import { Selectors, IViewColumn } from 'store';
import { t, Strings } from 'i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

export interface IModifyViewBase {
  viewId: string;
}

export interface IModifyViewColumns extends IModifyViewBase {
  viewId: string;
  key: 'columns';
  value: IViewColumn[];
}

export interface IModifyViewStrings extends IModifyViewBase {
  viewId: string;
  key: 'name' | 'description';
  value: string;
}

type IModifyView = IModifyViewColumns | IModifyViewStrings;

export interface IModifyViewsOptions {
  cmd: CollaCommandName.ModifyViews;
  data: IModifyView[];
  datasheetId?: string
}

export const modifyViews: ICollaCommandDef<IModifyViewsOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const { data, datasheetId: _datasheetId } = options;
    const activeDatasheetId = Selectors.getActiveDatasheetId(state)!;
    const datasheetId = _datasheetId || activeDatasheetId;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { viewId, key, value } = recordOption;

      // character is too long or not filled
      if (key === 'name' && (value.length > 30 || value.length < 1)) {
        return collected;
      }

      // Check if there is a view with the same name
      if (key === 'name' && find(views, { name: value as string })) {
        throw new Error(t(Strings.error_modify_view_failed_duplicate_name));
      }
      // Check if viewId exists
      if (!find(views, { id: viewId })) {
        throw new Error(t(Strings.error_modify_view_failed_not_found_target));
      }
      const action = DatasheetActions.modifyView2Action(snapshot, { viewId, key, value });
      action && collected.push(...action);
      return collected;
    }, []);

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IModifyViewOptions & { cmd: 'ReplaceViews' });
 }
 }

 */
