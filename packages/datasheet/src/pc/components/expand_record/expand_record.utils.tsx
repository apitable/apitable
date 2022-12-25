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

import { expandRecordInner } from 'pc/components/expand_record/expand_record';
import { RecordType } from 'pc/components/expand_record/expand_record.enum';
import { IExpandRecordDatasheetProp, IExpandRecordIndependentProp } from 'pc/components/expand_record/expand_record.interface';
import { store } from 'pc/store';

/**
 * Exposed to external calls, independent card expansion, and forced centering
 */
export const expandRecordInCenter = (props: IExpandRecordIndependentProp) => {
  expandRecordInner({ recordType: RecordType.Independent, ...props, forceCenter: true });
};

/**
 * Exposed to external calls, independent card unfolding
 */
export const expandRecord = (props: IExpandRecordIndependentProp) => {
  expandRecordInner({ recordType: RecordType.Independent, ...props });
};

/**
 * Routing method triggers the expansion of the card
 */
export const expandRecordRoute = (props?: IExpandRecordDatasheetProp) => {
  const state = store.getState();
  const { datasheetId, viewId, mirrorId } = state.pageParams;
  if (!datasheetId || !viewId) {
    console.warn('Error calling expandRecordIdNavigate, route parameter not satisfied');
    return;
  }
  const commonProps = { datasheetId: mirrorId || datasheetId, viewId, recordIds: [], ...props };
  expandRecordInner({ recordType: RecordType.Datasheet, ...commonProps });
};
