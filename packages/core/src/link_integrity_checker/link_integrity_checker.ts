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

import { AnyAction, Store } from 'redux';
import { IReduxState } from '../exports/store/interfaces';
import {
  getField,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { IJOTAction } from 'engine';
import { FieldType, IField } from 'types';

// resolve one-way association
export class LinkIntegrityChecker {
  constructor(private store: Store<IReduxState, AnyAction>) {}

  parse(actions: IJOTAction[], datasheetId: string, linkedActions?: { actions: IJOTAction[], datasheetId: string }[]) {
    if (linkedActions?.length) {
      return actions;
    }
    const state = this.store.getState();
    for (const action of actions) {
      if (!action.p.includes('fieldMap')) {
        continue;
      }

      const data = (action['oi'] || action['od']) as IField;
      const currentField = getField(state, data.id, datasheetId);

      if (currentField.type !== FieldType.Link) {
        continue;
      }
      return [];
    }
    return actions;
  }
}
