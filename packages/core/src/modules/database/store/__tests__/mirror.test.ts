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

import {
  getSnapshot,
  getStringifyCellValue
} from 'modules/database/store/selectors/resource/datasheet';
import { IReduxState } from '../../../../exports/store/interfaces';
import * as mirrorState from './mirror_state.json';

// init data
describe('mirror show data successfully', () => {
  const state = mirrorState as any as IReduxState;

  it('The correlation data can be obtained normally in the mirror', () => {
    const snapshot = getSnapshot(state, 'dst20W6iYZfeeGaVzu')!;
    const stringifyCellValue = getStringifyCellValue(state, snapshot, 'recHwtmd2T99W', 'fldGZrNET2StU');
    expect(stringifyCellValue).toBe('可乐可乐');
  });
});