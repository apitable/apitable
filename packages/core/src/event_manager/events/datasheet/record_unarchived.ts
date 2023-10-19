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

import { IOperation } from 'engine/ot/interface';
import { testPath } from 'event_manager';
import { ResourceType } from 'types';
import { IAtomEventType } from '../interface';
import { EventRealTypeEnums, OPEventNameEnums } from './../../enum';
import { AnyObject, IOPBaseContext } from './../../interface/event.interface';

interface IRecordUnarchived {
  datasheetId: string;
  recordId: string;
  op: IOperation;
  fields: AnyObject;
  diffFields: string[];
}

export class OPEventRecordUnarchived extends IAtomEventType<IRecordUnarchived> {
  eventName = OPEventNameEnums.RecordUnarchived;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;

  test({ action, resourceId, op }: IOPBaseContext) {
    const { pass, recordId } = testPath(action.p, ['recordMap', ':recordId'], ('oi' in action));

    let success = pass;
    if (op.cmd !== 'UnarchiveRecords') {
      success = false;
    }

    if (!success) {
      return {
        pass: success,
        context: null
      };
    }
    // fill phase will overwrite diffFields
    const diffFields = Object.keys(action['oi'].data);
    return {
      pass,
      context: {
        datasheetId: resourceId,
        recordId,
        op,
        fields: action['oi'].data,
        diffFields
      }
    };
  }
}