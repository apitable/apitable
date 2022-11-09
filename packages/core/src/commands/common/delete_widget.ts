import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { DatasheetActions } from 'model';
import { Selectors } from '../../exports/store';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/index';

export interface IDeleteWidgetAction {
  cmd: CollaCommandName.DeleteWidget;
  widgetId: string;
  resourceId: string;
  resourceType: ResourceType;
}

export const deleteWidget: ICollaCommandDef<IDeleteWidgetAction> = {
  undoable: false,

  execute: (context, options) => {
    const { model: state } = context;
    const { widgetId, resourceId, resourceType } = options;

    const widgetPanels = Selectors.getResourceWidgetPanels(state, resourceId, resourceType);
    const activeWidgetPanel = Selectors.getResourceActiveWidgetPanel(state, resourceId, resourceType);

    if (!widgetPanels || !activeWidgetPanel) {
      return null;
    }

    const widgetPanelIndex = widgetPanels.findIndex(item => item.id === activeWidgetPanel.id);
    if (widgetPanelIndex < 0) {
      return null;
    }

    const widgets = activeWidgetPanel.widgets;
    const widgetIndex = widgets.findIndex(item => item.id === widgetId);

    if (widgetIndex < 0) {
      return null;
    }

    const deleteWidgetAction = resourceType === ResourceType.Datasheet ?
      DatasheetActions.deleteWidget2Action(state, { widgetPanelIndex, widget: widgets[widgetIndex], widgetIndex }) :
      DatasheetActions.deleteMirrorWidget2Action(state, { widgetPanelIndex, widget: widgets[widgetIndex], widgetIndex });

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: deleteWidgetAction,
    };
  },
};
