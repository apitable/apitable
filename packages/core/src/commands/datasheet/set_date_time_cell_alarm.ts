import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from 'commands';
import { DatasheetActions } from 'model';
import { IRecordAlarm, Selectors } from 'store';
import { ResourceType, WithOptional } from 'types';
import { getNewId, IDPrefix } from 'utils';

export interface ISetDateTimeCellAlarmOptions {
  cmd: CollaCommandName.SetDateTimeCellAlarm;
  datasheetId?: string;
  fieldId: string;
  recordId: string;
  alarm: WithOptional<IRecordAlarm, 'id'> | null;
}

/**
 * TODO(kailang)
 * Support new alarm clock OP
 */

export const setDateTimeCellAlarm: ICollaCommandDef<ISetDateTimeCellAlarmOptions> = {
  undoable: true,
  execute: (context, options) => {
    const { model: state } = context;
    const { fieldId, recordId, alarm } = options;
    const newAlarmId = getNewId(IDPrefix.DateTimeAlarm);
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const actions = DatasheetActions.setDateTimeCellAlarm(snapshot, {
      recordId,
      fieldId,
      alarm: alarm ? {
        id: newAlarmId,
        ...alarm,
      } : null
    });
    if (!actions) {
      return null;
    }
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  }
};
