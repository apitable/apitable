import { IChangeset } from 'engine/ot/interface';
import { IReduxState } from '../../exports/store';
import { IAtomEvent, ICombEvent, IOPEvent, IEventInstance, IRealAtomEvent, IVirtualAtomEvent } from './../interface';

// table id: recordId[]
export type IEventResourceMap = Map<string, string[]>;
export interface IOP2EventOptions {
   // Whether to enable virtual events
   enableVirtualEvent?: boolean;
   // Whether to enable combined events
   enableCombEvent?: boolean;
}
export interface IOP2Event {
  parseOps2Events(changesets: IChangeset[]): IEventInstance<IRealAtomEvent>[];
  makeVirtualEvents(events: IRealAtomEvent[], state: IReduxState): IEventInstance<IVirtualAtomEvent>[]
  makeCombEvents(atomEvents: IAtomEvent[]): IEventInstance<ICombEvent>[];
  getOpsResources(events: IEventInstance<IOPEvent>[]): IEventResourceMap;
}