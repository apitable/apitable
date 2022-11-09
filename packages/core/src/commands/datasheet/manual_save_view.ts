import { DatasheetActions } from 'model';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { ITemporaryView } from '../../store/interfaces';
import { IJOTAction } from 'engine';
import { Selectors } from 'store';
import { CollaCommandName } from '..';
import { ResourceType } from 'types';

export interface IManualSaveView {
  cmd: CollaCommandName.ManualSaveView;
  viewId: string;
  viewProperty: ITemporaryView
}

export const manualSaveView: ICollaCommandDef<IManualSaveView> = {
  undoable: false,

  execute: (context, options) => {
    const { model: state, fieldMapSnapshot } = context;
    const { viewProperty, viewId } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }

    const manualSaveViewActions = DatasheetActions.manualSaveView2Action(snapshot, { viewId, viewProperty });

    if (!manualSaveViewActions) {
      return null;
    }

    const actions: IJOTAction[] = [...manualSaveViewActions];

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      fieldMapSnapshot
    };
  },
};
