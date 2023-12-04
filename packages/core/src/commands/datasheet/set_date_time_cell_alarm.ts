/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IRecordAlarm } from '../../exports/store/interfaces';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
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
    const { state: state } = context;
    const { fieldId, recordId, alarm } = options;
    const newAlarmId = getNewId(IDPrefix.DateTimeAlarm);
    const datasheetId = options.datasheetId || getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);
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
