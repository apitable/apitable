import { IChangeset } from 'engine/ot/interface';
import { IReduxState } from 'store';
import { IAtomEvent, ICombEvent, IOPEvent, IEventInstance, IRealAtomEvent, IVirtualAtomEvent } from './../interface';

// 表格id: recordId[]
export type IEventResourceMap = Map<string, string[]>;
export interface IOP2EventOptions {
  // 是否开启虚拟事件
  enableVirtualEvent?: boolean;
  // 是否开启组合事件
  enableCombEvent?: boolean;
}
export interface IOP2Event {
  parseOps2Events(changesets: IChangeset[]): IEventInstance<IRealAtomEvent>[];
  makeVirtualEvents(events: IRealAtomEvent[], state: IReduxState): IEventInstance<IVirtualAtomEvent>[]
  makeCombEvents(atomEvents: IAtomEvent[]): IEventInstance<ICombEvent>[];
  getOpsResources(events: IEventInstance<IOPEvent>[]): IEventResourceMap;
}