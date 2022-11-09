import { ExecuteResult, ICollaCommandDef, ICommandOptionBase } from 'command_manager';
import { WidgetActions } from 'model';
import { Selectors } from '../../exports/store';
import { ResourceType } from 'types';

export interface ISetWidgetDepDstId extends ICommandOptionBase {
  dstId: string;
  // sourceId actually refers to the image,
  sourceId?: string;
}

export const setWidgetDepDstId: ICollaCommandDef<ISetWidgetDepDstId> = {
  undoable: false,

  execute(context, options) {
    const state = context.model;
    const { dstId, resourceId, sourceId } = options;
    const widgetPack = Selectors.getResourcePack(state, resourceId, ResourceType.Widget);

    if (!widgetPack) {
      return null;
    }

    const widgetSnapshot = widgetPack.widget.snapshot;

    if (widgetSnapshot.datasheetId) {
      return null;
    }

    const setWidgetDepDstIdAction = WidgetActions.setWidgetDepDstId2Action(widgetSnapshot, { dstId, sourceId });

    if (!setWidgetDepDstIdAction) {
      return null;
    }

    return {
      resourceId: options.resourceId,
      resourceType: options.resourceType,
      result: ExecuteResult.Success,
      actions: setWidgetDepDstIdAction,
    };
  },
};
