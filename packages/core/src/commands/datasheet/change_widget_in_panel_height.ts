import { ICollaCommandDef, ICollaCommandExecuteContext, ExecuteResult } from 'command_manager';
import { getWidgetPanels } from '../../store/selectors';
import { DatasheetActions } from 'model';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';

export interface IChangeWidgetInPanelHeight {
  cmd: CollaCommandName.ChangeWidgetInPanelHeight;
  datasheetId: string;
  panelId: string;
  widgetId: string;
  widgetHeight: number
}

export const changeWidgetInPanelHeight: ICollaCommandDef<IChangeWidgetInPanelHeight> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { model: state } = context;
    const { widgetId, datasheetId, panelId, widgetHeight } = options;
    const widgetPanels = getWidgetPanels(state, datasheetId);

    if (!widgetPanels) { return null; }

    const widgetPanelIndex = widgetPanels.findIndex(item => item.id === panelId);

    if (widgetPanelIndex < 0) { return null; }

    const widgets = widgetPanels[widgetPanelIndex].widgets;
    const widgetIndex = widgets.findIndex(item => item.id === widgetId);
    
    if (widgetIndex < 0) { return null; }

    const changeWidgetHeightAction = DatasheetActions.changeWidgetHeight2Action(
      state, { widgetIndex, widgetPanelIndex, widgetHeight,datasheetId }
    );

    if (!changeWidgetHeightAction) { 
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions: changeWidgetHeightAction,
    };
  },
};