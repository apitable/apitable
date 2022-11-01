import { OP2Event } from 'event_manager/op2event';
import { IChangeset } from './../../engine/ot/interface';
import { OPEventNameEnums } from './../const';
import { eventRecordDeleted } from './expectEvents';
import { createRecordOps, deleteRecordOps, duplicateRecordOps, updateRecordOps, updateRecordsOpsByFill } from './mockOps';
import { state } from './mockState';

describe('convert op to OPEvent', () => {
  it('create record', () => {
    const watchedEvents = [OPEventNameEnums.RecordCreated];
    const op2event = new OP2Event(watchedEvents);
    // create record
    const events1 = op2event.parseOps2Events(createRecordOps as IChangeset[]);
    expect(events1[0].eventName).toEqual('RecordCreated');
    // duplicate record
    const events2 = op2event.parseOps2Events(duplicateRecordOps as IChangeset[]);
    expect(events2[0].eventName).toEqual('RecordCreated');
  });

  it('delete record', () => {
    const watchedEvents = [OPEventNameEnums.RecordDeleted];
    const op2event = new OP2Event(watchedEvents);
    const events = op2event.parseOps2Events(deleteRecordOps as IChangeset[]);
    expect(events).toEqual(eventRecordDeleted);
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
    expect(events3[0].realType).toEqual('VIRTUAL');

    const watchedEvents2 = [OPEventNameEnums.RecordUpdated];
    const op2event2 = new OP2Event(watchedEvents2);
    // atomic event => compound event
    const events4 = op2event2.makeCombEvents([...events1, ...events2, ...events3]);
    expect(events4[0].eventName).toEqual('RecordUpdated');
  });
});