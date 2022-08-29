import { DatasheetActions } from 'model';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { IJOTAction } from 'engine';
import { IViewProperty, Selectors } from 'store';
import { CollaCommandName } from '..';
import { ResourceType } from 'types';
import { manualSaveView } from 'commands/datasheet/manual_save_view';

export interface ISetViewAutoSave {
  cmd: CollaCommandName.SetViewAutoSave;
  viewId: string;
  autoSave: boolean;
  viewProperty?: IViewProperty
}

export const setViewAutoSave: ICollaCommandDef<ISetViewAutoSave> = {
  undoable: false,

  execute: (context, options) => {
    const { model: state, fieldMapSnapshot } = context;
    const { autoSave, viewId, viewProperty } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }

    const setViewAutoSaveAction = DatasheetActions.setViewAutoSave2Action(snapshot, { viewId, autoSave });

    if (!setViewAutoSaveAction) {
      return null;
    }

    const actions: IJOTAction[] = [setViewAutoSaveAction];

    if (viewProperty) {
      const manualSaveViewActions = manualSaveView.execute(context, { cmd: CollaCommandName.ManualSaveView, viewId, viewProperty });

      if (manualSaveViewActions) {
        if (manualSaveViewActions.result === ExecuteResult.Fail) {
          return manualSaveViewActions;
        }
        actions.push(...manualSaveViewActions.actions);
      }
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      fieldMapSnapshot
    };
  },
};
