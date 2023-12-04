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

import { IChangeset } from 'engine/ot/interface';
import { IReduxState } from '../../exports/store/interfaces';
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