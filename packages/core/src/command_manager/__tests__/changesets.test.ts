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

import { resourceOpsToChangesets } from '../changesets';
import { mockDatasheetMap } from './mock.datasheets';
import {
  mockChangesetsOfAddOneDefaultRecordInDst1,
  mockChangesetsOfDeleteLinkFieldInDst2,
  mockOpsCollectsOfAddOneDefaultRecordInDst1,
  mockOpsCollectsOfDeleteLinkFieldInDst2,
} from './mock.execute.result';
import { fulfillStore } from './mock.store';

describe('resourceOpsToChangesets', () => {
  const store = fulfillStore(mockDatasheetMap['dst1']!, { dst2: mockDatasheetMap['dst2']!, dst3: mockDatasheetMap['dst3']! });

  test('convert op in single datasheet', () => {
    const changesets = resourceOpsToChangesets(mockOpsCollectsOfAddOneDefaultRecordInDst1('rec10'), store.getState());

    changesets.forEach(changeset => (changeset.messageId = 'x'));

    expect(changesets).toStrictEqual(mockChangesetsOfAddOneDefaultRecordInDst1('rec10'));
  });

  test('convert multiple ops in single datasheet', () => {
    const changesets = resourceOpsToChangesets(
      [...mockOpsCollectsOfAddOneDefaultRecordInDst1('rec10'), ...mockOpsCollectsOfAddOneDefaultRecordInDst1('rec11')],
      store.getState(),
    );

    changesets.forEach(changeset => (changeset.messageId = 'x'));

    const expected = mockChangesetsOfAddOneDefaultRecordInDst1('rec10');
    expected[0]!.operations.push(...mockChangesetsOfAddOneDefaultRecordInDst1('rec11')[0]!.operations);

    expect(changesets).toStrictEqual(expected);
  });

  test('convert ops in multiple datasheets', () => {
    const changesets = resourceOpsToChangesets(mockOpsCollectsOfDeleteLinkFieldInDst2, store.getState());

    changesets.forEach(changeset => (changeset.messageId = 'x'));

    expect(changesets).toStrictEqual(mockChangesetsOfDeleteLinkFieldInDst2);
  });
});
