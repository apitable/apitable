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

export * from './expand_record';
export type { IExpandRecordComponentProp } from 'pc/components/expand_record/expand_record.interface';
export type { IExpandRecordWrapperProp } from 'pc/components/expand_record/expand_record.interface';
export type { IPaneIconProps } from 'pc/components/expand_record/expand_record.interface';
export type { IExpandRecordIndependentProp } from 'pc/components/expand_record/expand_record.interface';
export type { IExpandRecordDatasheetProp } from 'pc/components/expand_record/expand_record.interface';
export { expandRecord } from 'pc/components/expand_record/expand_record.utils';
export { expandRecordInCenter } from 'pc/components/expand_record/expand_record.utils';
export { getRecordName } from 'pc/components/expand_record/utils';
export { clearExpandModal } from 'pc/components/expand_record/utils';
export { expandRecordRoute } from 'pc/components/expand_record/expand_record.utils';
export { EXPAND_RECORD } from 'pc/components/expand_record/expand_record.enum';
export { RecordType } from 'pc/components/expand_record/expand_record.enum';
export type { IExpandRecordInnerProp } from 'pc/components/expand_record/expand_record.interface';
export { expandRecordIdNavigate } from 'pc/components/expand_record/utils';
export { closeAllExpandRecord } from 'pc/components/expand_record/utils';
export { recordModalCloseFns } from 'pc/components/expand_record/utils';
