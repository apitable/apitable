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
import { action_add_record } from '@apitable/databus-wasm-nodejs';
import { DatasheetActions } from '../datasheet';
import { ISnapshot } from '../../modules/database/store/interfaces/resource';
import MockDataForAction from './mock_data/action_add_record_mock';
describe('test add record', () => {

  it('test insert record in the end', () => {
    const snapshot = MockDataForAction as any as ISnapshot;
    const payload = { viewId: 'viwDtemXMuFxz', record: {
        id: 'reclj2P5LfpTF',
        data: {},
        commentCount: 0,
        comments: [],
        recordMeta: {},
      }, index: 3, newRecordIndex: 0 };
    const result = DatasheetActions.addRecord2Action(snapshot, payload);
    const resul2 = action_add_record(snapshot, payload);

    expect(result).toEqual(resul2);
  });

  it('test insert record in the start', () => {
    const snapshot = MockDataForAction as any as ISnapshot;
    const payload = { viewId: 'viwDtemXMuFxz', record: {
        id: 'recslko04eos1',
        data: {},
        commentCount: 0,
        comments: [],
        recordMeta: {},
      }, index: 0, newRecordIndex: 0 };
    const result = DatasheetActions.addRecord2Action(snapshot, payload);
    const resul2 = action_add_record(snapshot, payload);

    expect(result).toEqual(resul2);
  });

  it('test insert record in the middle', () => {
    const snapshot = MockDataForAction as any as ISnapshot;
    const payload = { viewId: 'viwDtemXMuFxz', record: {
        id: 'recyYpNFsYmUo',
        data: {},
        commentCount: 0,
        comments: [],
        recordMeta: {},
      }, index: 2, newRecordIndex: 0 };
    const result = DatasheetActions.addRecord2Action(snapshot, payload);
    const resul2 = action_add_record(snapshot, payload);

    expect(result).toEqual(resul2);
  });
});
