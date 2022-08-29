import { CollaCommandName } from 'commands/index';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { IJOTAction } from 'engine';
import { DatasheetActions } from 'model';
import { getResourceWidgetPanels, getResourceWidgetPanelStatus } from 'store/selector';
import { ResourceType } from 'types';
import { addWidgetPanel } from 'commands/common/add_widget_panel';

export interface IAddWidgetToPanel {
  cmd: CollaCommandName.AddWidgetToPanel;
  resourceId: string;
  resourceType: ResourceType.Mirror | ResourceType.Datasheet;
  widgetId: string;
}

export const addWidgetToPanel: ICollaCommandDef<IAddWidgetToPanel> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { model: state } = context;
    const { widgetId, resourceId, resourceType } = options;
    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);
    let panelIndex = 0;
    let installationIndex = 0;
    const actions: IJOTAction[] = [];

    if (!widgetPanels || !widgetPanels.length) {
      // 第一次安装一个小组件，需要先安装一个面板
      const rct = addWidgetPanel.execute(context, {
        cmd: CollaCommandName.AddWidgetPanel,
        resourceId,
        resourceType
      });
      if (rct && rct.result !== ExecuteResult.Fail) {
        actions.push(...rct.actions);
      }
    } else {
      const widgetPanelStatus = getResourceWidgetPanelStatus(state, resourceId, resourceType);
      const activePanelId = widgetPanelStatus?.activePanelId || widgetPanels[0].id;
      panelIndex = widgetPanels.findIndex(item => item.id === activePanelId);

      if (panelIndex < 0) {
        return null;
      }

      installationIndex = widgetPanels[panelIndex].widgets.length;
    }

    const addWidgetToPanelAction = resourceType === ResourceType.Datasheet ?
      DatasheetActions.addWidgetToPanel2Action(state, { installationIndex, panelIndex, widgetId }) :
      DatasheetActions.addWidgetToPanelWithMirror2Action(state, { installationIndex, panelIndex, widgetId });

    if (!addWidgetToPanelAction) {
      return null;
    }

    actions.push(...addWidgetToPanelAction);

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: actions,
    };
  },
};
