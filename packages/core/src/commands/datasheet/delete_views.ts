import { find, isEmpty } from 'lodash';
import { IJOTAction, jot } from 'engine/ot';
import { DatasheetActions } from 'model';
import { Selectors } from '../../exports/store';
import { Strings, t } from '../../exports/i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

// import { IGridViewProperty } from 'store/interface';

export interface IDeleteView {
  viewId: string;
}

export interface IDeleteViewsOptions {
  cmd: CollaCommandName.DeleteViews;
  data: IDeleteView[];
}

export const deleteViews: ICollaCommandDef<IDeleteViewsOptions> = {

  undoable: true,

  execute: (context, options) => {

    const { model: state } = context;
    const { data } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }
    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { viewId } = recordOption;

      if (views.length === 1) {
        // The last view cannot be deleted
        return collected;
      }

      // Check if viewId exists
      if (!find(views, { id: viewId })) {
        throw new Error(t(Strings.error_del_view_failed_not_found_target));
      }

      const action = DatasheetActions.deleteView2Action(snapshot, { viewId });

      if (!action) {
        return collected;
      }

      if (collected.length) {
        const transformedAction = jot.transform([action], collected, 'right');
        collected.push(...transformedAction);
      } else {
        collected.push(action);
      }

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
 execute(options: IDeleteViewsOptions & { cmd: 'DeleteViews' });
 }
 }

 */
