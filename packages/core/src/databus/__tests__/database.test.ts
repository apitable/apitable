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

import { fulfillStore } from './mock.store.provider';
import { MockDataBus } from './mock.databus';
import { StoreActions } from 'exports/store';
import { ResourceType } from 'types';

const db = MockDataBus.getDatabase();

describe('store provider', () => {
  it('should use custom store if createStore is given', async() => {
    const dst = await db.getDatasheet('dst1', {
      createStore(datasheetPack) {
        const store = fulfillStore(datasheetPack);
        store.dispatch(StoreActions.updateRevision(12408, 'dst1', ResourceType.Datasheet));
        return Promise.resolve(store);
      },
    });

    expect(dst).toBeTruthy();
    expect(dst!.revision).toStrictEqual(12408);
  });
});

describe('getDatasheet', () => {
  it('should return null if datasheet does not exist', async() => {
    const dst = await db.getDatasheet('dst7', {});
    expect(dst).toBeNull();
  });
});
