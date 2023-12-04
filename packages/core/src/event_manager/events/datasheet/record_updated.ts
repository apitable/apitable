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

import { EventAtomTypeEnums, EventRealTypeEnums, testPath, transformOpFields } from 'event_manager';
import { groupBy } from 'lodash';
import { IReduxState } from '../../../exports/store/interfaces';
import {
  getDatasheet,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { ResourceType } from 'types';
import { IAtomEventType, ICombEventType } from '../interface';
import { EventSourceTypeEnums, OPEventNameEnums } from './../../enum';
import {
  IAtomEvent, IEventInstance, IEventTestResult, IOPBaseContext, IOPEvent
} from './../../interface/event.interface';

interface IRecordMetaUpdated {
  datasheetId: string;
  recordId: string;
  action: any;
}
export class OPEventRecordMetaUpdated extends IAtomEventType<IRecordMetaUpdated> {
  eventName = OPEventNameEnums.RecordMetaUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;

  test({ action, resourceId }: IOPBaseContext) {
    let pass,
        recordId;
    if (action.p.length === 3) {
      ({ pass, recordId } = testPath(action.p, ['recordMap', ':recordId', 'recordMeta']));
    } else {
      ({ pass, recordId } = testPath(action.p, ['recordMap', ':recordId', 'recordMeta', 'fieldUpdatedMap']));
    }
    return {
      pass,
      context: {
        datasheetId: resourceId,
        recordId,
        action,
      }
    };
  }
}
export class OPEventRecordCommentUpdated implements IAtomEventType<any> {
  eventName = OPEventNameEnums.RecordCommentUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  atomType = EventAtomTypeEnums.ATOM;
  test(opContext: IOPBaseContext, _sourceType?: EventSourceTypeEnums.ALL): IEventTestResult<any> {
    const { action, resourceId } = opContext;
    const { pass, recordId } = testPath(action.p, ['recordMap', ':recordId', 'comments', ':commentIndex']);
    return {
      pass: pass,
      context: {
        datasheetId: resourceId,
        recordId: recordId,
        action,
      }
    };
  }
}

export class OPEventRecordUpdated extends ICombEventType {
  eventName = OPEventNameEnums.RecordUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  acceptEventNames = [OPEventNameEnums.CellUpdated];
  comb(events: IEventInstance<IAtomEvent>[]): IEventInstance<IOPEvent>[] {
    const res: IEventInstance<IOPEvent>[] = [];
    const eventBuffer = events.filter(event => this.acceptEventNames.includes(event.eventName));
    const groupEvents = groupBy(eventBuffer, ({ context }) => {
      const { datasheetId, recordId } = context;
      return `${datasheetId}-${recordId}`;
    });
    Object.keys(groupEvents).forEach(dstRecordId => {
      const [datasheetId, recordId] = dstRecordId.split('-');
      // log all cell update events
      const events = groupEvents[dstRecordId]!;
      const recordChange = {};
      const diffFields: string[] = [];
      // console.log('comb events', events);
      events.forEach(event => {
        if (event.context.change) {
          recordChange[event.context.fieldId] = event.context.change.to;
        }
        diffFields.push(event.context.fieldId);
      });
      res.push({
        eventName: OPEventNameEnums.RecordUpdated,
        context: {
          datasheetId,
          recordId,
          fields: recordChange,
          diffFields
        },
        scope: this.scope,
        realType: this.realType as any, // FIXME: type
        atomType: this.atomType,
        sourceType: EventSourceTypeEnums.ALL,
      });
    });
    return res;
  }
  /**
   * When generating events through op, some fields need to be completed with the help of state context. Complete the event context here
   */
  fill(events: IEventInstance<IOPEvent>[], state: IReduxState) {
    return events.map(event => {
      if (event.eventName === OPEventNameEnums.RecordUpdated) {
        const { datasheetId, recordId } = event.context;
        event.context.datasheetName = getDatasheet(state, datasheetId)?.name;
        event.context.state = state;
        const { fields, eventFields } = transformOpFields({
          recordData: event.context.fields,
          state: state,
          datasheetId,
          recordId
        });
        // This fields are used for trigger filter verification, where fieldValue is the cellValue from op
        event.context.fields = fields;
        // This eventFields is used for trigger output, where fieldValue is eventCV converted by cv
        event.context.eventFields = eventFields;
      }
      return event;
    });
  }
}

