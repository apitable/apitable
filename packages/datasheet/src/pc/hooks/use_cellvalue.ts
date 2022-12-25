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

import { FormulaBaseError, IFormulaField, ILookUpField, Selectors } from '@apitable/core';
import { useSelector } from 'react-redux';

export interface IComputeCVProps {
  recordId: string;
  field: IFormulaField | ILookUpField;
}

export const useComputeCellValue = (props: IComputeCVProps) => {
  const { recordId, field } = props;
  const datasheetId = field.property.datasheetId;
  const cv = useSelector(state => {
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    try {
      return Selectors.getCellValue(state, snapshot, recordId, field.id, true);
    } catch (e) {
      const message = e instanceof FormulaBaseError ? e : new FormulaBaseError('');
      return message;
    }
  });
  return cv;
};
