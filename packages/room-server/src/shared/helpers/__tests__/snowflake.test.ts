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

import { groupBy } from 'lodash';
import { IdWorker, TIMESTAMP_LEFT_SHIFT } from '../snowflake';

describe('snowflake', () => {
  it('should generate unique IDs', () => {
    const ids = Array(1000)
      .fill(0)
      .map(_ => IdWorker.nextId());
    const idSet = new Set(ids);
    expect(idSet.size).toEqual(1000);
  });

  it('should generate monotonically increasing IDs', () => {
    const ids = Array(1000)
      .fill(0)
      .map(_ => IdWorker.nextId());
    for (let i = 0; i < ids.length - 1; i++) {
      expect(ids[i]).toBeLessThan(ids[i + 1]!);
    }
  });

  it('should generate unique IDs in one millisecond', () => {
    const ids = Array(1000)
      .fill(0)
      .map(_ => IdWorker.nextId());
    const idGroups = groupBy(ids, id => id >> TIMESTAMP_LEFT_SHIFT);
    for (const timestamp in idGroups) {
      const idsInOneMs = idGroups[timestamp]!;
      const set = new Set(idsInOneMs);
      expect(set.size).toEqual(idsInOneMs.length);
    }
  });
});
