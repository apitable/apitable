import { getResourceWidgetPanels } from '../../store/selectors';
import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DatasheetActions } from '../../model/datasheet';
import { CollaCommandName } from '..';

export interface IMoveWidgetPanel {
  cmd: CollaCommandName.MoveWidgetPanel;
  panelId: string;
  targetIndex: number;
  resourceId: string;
  resourceType: ResourceType.Datasheet | ResourceType.Mirror;
}

export const moveWidgetPanel: ICollaCommandDef<IMoveWidgetPanel> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IMoveWidgetPanel) {
    const { model: state } = context;
    const { targetIndex, panelId, resourceId, resourceType } = options;

    if (targetIndex > 2) {
      return null;
    }

    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);

    if (!widgetPanels) {
      return null;
    }

    const sourceIndex = widgetPanels.findIndex(item => item.id === panelId);

    if (sourceIndex < 0) {
      return null;
    }

    const moveWidgetPanelAction = DatasheetActions.movePanel2Action(targetIndex, sourceIndex, resourceType);
    if (!moveWidgetPanelAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: moveWidgetPanelAction,
    };
  },
};
