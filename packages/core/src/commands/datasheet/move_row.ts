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

import { isEmpty } from 'lodash';
import { IJOTAction, jot } from 'engine/ot';
import { DatasheetActions } from 'commands_actions/datasheet';
import { DropDirectionType } from 'modules/shared/store/constants';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { getRowsIndexMap } from 'modules/database/store/selectors/resource/datasheet/rows_calc';

import { ISetRecordOptions, setRecords } from './set_records';
import { t, Strings } from '../../exports/i18n';
import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { Events, Player } from '../../modules/shared/player';

export interface IMoveRow {
  recordId: string;
  overTargetId: string;
  direction: DropDirectionType;
}

export interface IMoveRowOptions {
  cmd: CollaCommandName.MoveRow;
  data: IMoveRow[];
  recordData?: ISetRecordOptions[] | null;
  viewId: string;
}

export const moveRow: ICollaCommandDef<IMoveRowOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data, recordData, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);
    const recordMap = getRowsIndexMap(state, datasheetId)!;

    if (!snapshot) {
      return null;
    }

    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    if (!views.some(item => item.id === viewId)) {
      throw new Error(t(Strings.error_move_row_failed_invalid_params));
    }

    const linkedActions: ILinkedActions[] = [];
    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { recordId, overTargetId: targetRecordId, direction } = recordOption;
      const originRowIndex = recordMap.get(recordId);
      const targetRowIndex = recordMap.get(targetRecordId);
      if (targetRowIndex == null || originRowIndex == null) {
        Player.doTrigger(Events.app_error_logger, {
          error: new Error('There is a problem with the moved row record data'),
          metaData: {
            recordId,
            targetRecordId,
            targetRowIndex,
            originRowIndex,
            rowIndexMap: JSON.stringify(recordMap),
            recordIds: JSON.stringify(Object.keys(snapshot.recordMap)),
            rows: JSON.stringify(snapshot.meta.views[0]!.rows)
          },
        });
        return collected;
      }

      let targetIndex = originRowIndex > targetRowIndex ? targetRowIndex + 1 : targetRowIndex;
      if (direction === DropDirectionType.BEFORE) {
        targetIndex--;
      }
      const action = DatasheetActions.moveRow2Action(snapshot, { recordId, target: targetIndex, viewId });

      if (!action) {
        return collected;
      }

      if (collected.length) {
        const transformedAction = jot.transform([action], collected, 'right');
        collected.push(...transformedAction);
      } else {
        collected.push(action);
      }

      return collected;
    }, []);

    if (recordData) {
      const rst = setRecords.execute(context, {
        cmd: CollaCommandName.SetRecords,
        data: recordData,
      });
      if (rst) {
        if (rst.result === ExecuteResult.Fail) {
          return rst;
        }
        actions.push(...rst.actions);
        linkedActions.push(...(rst.linkedActions || []));
      }
    }

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
    };
  },
};
