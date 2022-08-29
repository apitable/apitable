import { ExecuteResult, ICollaCommandDef, ICommandOptionBase } from 'command_manager';
import { WidgetActions } from 'model';
import { Selectors } from 'store';
import { ResourceType } from 'types';

export interface ISetWidgetName extends ICommandOptionBase {
  newWidgetName: string
}

export const setWidgetName: ICollaCommandDef<ISetWidgetName> = {
  undoable: false,

  execute(context, options) {
    const state = context.model;
    const { resourceId, newWidgetName } = options;
    const widgetPack = Selectors.getResourcePack(state, resourceId, ResourceType.Widget);

    if (!widgetPack) {
      return null;
    }
    
    const widgetSnapshot = widgetPack.widget.snapshot;

    const setWidgetNameAction = WidgetActions.setWidgetName2Action(widgetSnapshot, { newWidgetName });

    if (!setWidgetNameAction) {
      return null;
    }

    return {
      resourceId: resourceId,
      resourceType: options.resourceType,
      result: ExecuteResult.Success,
      actions: setWidgetNameAction,
    };
  },
};
