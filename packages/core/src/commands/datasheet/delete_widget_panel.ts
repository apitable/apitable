import { getResourceWidgetPanels } from '../../store/selectors';
import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DatasheetActions } from '../../model/datasheet';
import { CollaCommandName } from '..';

export interface IDeleteWidgetPanel {
  cmd: CollaCommandName.DeleteWidgetPanel;
  deletePanelId: string;
  resourceId: string;
  resourceType: ResourceType.Datasheet | ResourceType.Mirror;
}

export const deleteWidgetPanel: ICollaCommandDef<IDeleteWidgetPanel> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IDeleteWidgetPanel) {
    const { model: state } = context;
    const { deletePanelId, resourceType, resourceId } = options;

    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);

    if (!widgetPanels) {
      return null;
    }

    const panel = widgetPanels.find(item => item.id === deletePanelId);

    if (!panel) {
      return null;
    }

    const deleteWidgetPanelAction = DatasheetActions.deleteWidgetPanel2Action(state, deletePanelId, widgetPanels, resourceType);

    if (!deleteWidgetPanelAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: deleteWidgetPanelAction,
    };
  },
};
