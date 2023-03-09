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
import { CollaCommandName } from 'commands';
import { IRecordMap, Selectors } from '../../exports/store';
import { ResourceType } from 'types';

export interface IResetRecordsOptions {
  cmd: CollaCommandName.ResetRecords;
  datasheetId?: string;
  data: IRecordMap;
}

export const resetRecords: ICollaCommandDef<IResetRecordsOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state, fieldMapSnapshot } = context;
    const { data: _data } = options;
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }

    snapshot.recordMap = _data;

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions: [],
      fieldMapSnapshot
    };
  },
};