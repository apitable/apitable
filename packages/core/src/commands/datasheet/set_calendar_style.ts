import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { IJOTAction } from 'engine';
import { Strings, t } from 'i18n';
import { CalendarView } from 'model';
import { ISetCalendarStyle } from '../../exports/store';
import { getActiveDatasheetId, getDatasheet } from '../../exports/store/selectors';
import { ResourceType } from 'types';

export type ISetCalendarStyleOptions = {
  cmd: CollaCommandName.SetCalendarStyle;
  viewId: string;
  data: ISetCalendarStyle[];
  isClear?: boolean;
};

export const setCalendarStyle: ICollaCommandDef<ISetCalendarStyleOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const { viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);
    if (!state || !datasheet) {
      return null;
    }

    // Determine whether the currently operating view is the active view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_modify_column_failed_wrong_target_view));
    }

    const actions: IJOTAction[] = [];
    const setCalendarStyleAction = CalendarView.setCalendarStyle2Action(datasheet.snapshot, options);
    setCalendarStyleAction && actions.push(...setCalendarStyleAction);
    if (actions.length === 0) {
      return null;
    }
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

