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

import { EventRealTypeEnums, OPEventNameEnums } from 'event_manager/const';
import { testPath } from 'event_manager/helper';
import { ResourceType } from 'types/resource_types';
import { IAtomEventType } from '../interface';
import { IOPBaseContext } from './../../interface/event.interface';

interface IRecordDelete {
  datasheetId: string;
  recordId: string;
}
export class OPEventRecordDeleted extends IAtomEventType<IRecordDelete> {
  eventName = OPEventNameEnums.RecordDeleted;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  test(args: IOPBaseContext) {
    const { action, resourceId } = args;
    const { pass, recordId } = testPath(action.p, ['recordMap', ':recordId'], action.n === 'OD');
    return {
      pass,
      context: {
        datasheetId: resourceId,
        recordId,
      }
    };
  }
}