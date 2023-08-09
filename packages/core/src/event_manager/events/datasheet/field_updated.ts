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

import { testPath } from 'event_manager';
import { ResourceType } from 'types';
import { IAtomEventType } from '../interface';
import { EventRealTypeEnums, OPEventNameEnums } from './../../enum';
import { IOPBaseContext } from './../../interface/event.interface';

interface IFieldUpdated {
  fieldId: string;
  datasheetId: string;
}

export class OPEventFieldUpdated extends IAtomEventType<IFieldUpdated> {
  eventName = OPEventNameEnums.FieldUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;

  test({ action, resourceId }: IOPBaseContext) {
    const { pass, fieldId } = testPath(action.p, ['meta', 'fieldMap', ':fieldId']);
    return {
      pass,
      context: {
        fieldId,
        datasheetId: resourceId,
      }
    };
  }
}