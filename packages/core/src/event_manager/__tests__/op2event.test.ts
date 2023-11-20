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

import { OP2Event } from 'event_manager/op2event';
import { IChangeset } from './../../engine/ot/interface';
import { OPEventNameEnums } from './../enum';
import { createRecordOps, deleteRecordOps, duplicateRecordOps, updateRecordOps, updateRecordsOpsByFill } from './mockOps';
import { state } from './mockState';

describe('convert op to OPEvent', () => {
  it('create record', () => {
    const watchedEvents = [OPEventNameEnums.RecordCreated];
    const op2event = new OP2Event(watchedEvents);
    // create record
    const events1 = op2event.parseOps2Events(createRecordOps as IChangeset[]);
    expect(events1[0]!.eventName).toEqual('RecordCreated');
    // duplicate record
    const events2 = op2event.parseOps2Events(duplicateRecordOps as IChangeset[]);
    expect(events2[0]!.eventName).toEqual('RecordCreated');
  });

  it('delete record', () => {
    const watchedEvents = [OPEventNameEnums.RecordDeleted];
    const op2event = new OP2Event(watchedEvents);
    const events = op2event.parseOps2Events(deleteRecordOps as IChangeset[]);
    expect(events[0]!.eventName).toEqual('RecordDeleted');
  });

  it('update cell', () => {
    const watchedEvents = [OPEventNameEnums.CellUpdated];
    const op2event = new OP2Event(watchedEvents);
    // update a single cell
    const events1 = op2event.parseOps2Events(updateRecordOps as IChangeset[]);
    // console.log(events1);
    // expect(events1).toEqual(eventRecordCreated);

    // update multiple cells
    const events2 = op2event.parseOps2Events(updateRecordsOpsByFill as IChangeset[]);
    // console.log(events2);

    // Get resources (server only)
    const resources = op2event.getOpsResources(events2);
    expect([...resources.keys()]).toEqual(['dst2CXiPKQRdfgZBsa']);

    // Calculate virtual events
    const events3 = op2event.makeVirtualEvents(events2, state as any);
    expect(events3[0]!.realType).toEqual('VIRTUAL');

    const watchedEvents2 = [OPEventNameEnums.RecordUpdated];
    const op2event2 = new OP2Event(watchedEvents2);
    // atomic event => compound event
    const events4 = op2event2.makeCombEvents([...events1, ...events2, ...events3]);
    expect(events4[0]!.eventName).toEqual('RecordUpdated');
  });
});