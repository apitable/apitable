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

import { RecordType } from 'pc/components/expand_record/expand_record.enum';

export interface IExpandRecordDatasheetProp {
  onClose?: () => void;
  preventOpenNewModal?: boolean;
}

export interface IExpandRecordIndependentProp {
  recordIds: string[];
  datasheetId: string;
  activeRecordId?: string;
  viewId?: string;
  onClose?: () => void;
  forceCenter?: boolean;
  preventOpenNewModal?: boolean;
}

export interface IPaneIconProps {
  active: boolean;
  onClick: () => void;
}

export interface IExpandRecordWrapperProp {
  recordType: RecordType;
  modalClose: () => void | Promise<void>;
  recordIds: string[];
  nodeId: string;
  activeRecordId?: string;
  viewId?: string;
  onClose?: () => void;
}

export interface IExpandRecordComponentProp extends IExpandRecordIndependentProp {
  recordType: RecordType;
  modalClose: () => void;
  activeRecordId: string;
  switchRecord: (index: number) => void;
  mirrorId?: string;
  pageParamsRecordId?: string;
}

export interface IExpandRecordInnerProp extends IExpandRecordIndependentProp {
  recordType: RecordType;
}
