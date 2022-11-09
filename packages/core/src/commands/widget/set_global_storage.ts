import { ExecuteResult, ICollaCommandDef, ICommandOptionBase } from 'command_manager';
import { Strings, t } from 'i18n';
import { WidgetActions } from 'model';
import { Selectors } from '../../exports/store';
import { ResourceType } from 'types';

export interface ISetGlobalStorage extends ICommandOptionBase {
  key: string;
  value: any;
}

const MAX_GLOBAL_STORAGE_KEY = 100;

export const setGlobalStorage: ICollaCommandDef<ISetGlobalStorage> = {
  undoable: false,

  execute(context, options) {
    const state = context.model;
    const { resourceId, key, value } = options;
    const widgetPack = Selectors.getResourcePack(state, resourceId, ResourceType.Widget);

    if (!widgetPack) {
      return null;
    }

    const widgetSnapshot = widgetPack.widget.snapshot;

    if (Object.keys(widgetSnapshot).length > MAX_GLOBAL_STORAGE_KEY) {
      throw new Error(t(Strings.global_storage_size_large));
    }

    const setGlobalStorageAction = WidgetActions.setGlobalStorage2Action(widgetSnapshot, { key, value });

    if (!setGlobalStorageAction) {
      return null;
    }

    return {
      resourceId: options.resourceId,
      resourceType: options.resourceType,
      result: ExecuteResult.Success,
      actions: setGlobalStorageAction,
    };
  },
};
