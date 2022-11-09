import { getResourceWidgetPanels } from '../../store/selectors';
import { ResourceType } from 'types';
import { CollaCommandName } from '..';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DatasheetActions } from '../../model/datasheet';

export interface IModifyWidgetPanelName {
  cmd: CollaCommandName.ModifyWidgetPanelName;
  panelId: string;
  panelName: string;
  resourceId: string;
  resourceType: ResourceType.Datasheet | ResourceType.Mirror;
}

export const modifyWidgetPanelName: ICollaCommandDef<IModifyWidgetPanelName> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IModifyWidgetPanelName) {
    const { model: state } = context;
    const { panelName, panelId, resourceId, resourceType } = options;

    if (!panelName) {
      return null;
    }

    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);

    if (!widgetPanels) {
      return null;
    }

    const panel = widgetPanels.find(item => item.id === panelId);

    if (!panel) {
      return null;
    }

    const existPanelNames = widgetPanels.map(item => { return item.name; });

    if (existPanelNames.includes(panelName)) {
      return null;
    }

    const moveWidgetPanelAction = DatasheetActions.modifyPanelName2Acton(state, { ...panel, name: panelName }, widgetPanels, resourceType);

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
