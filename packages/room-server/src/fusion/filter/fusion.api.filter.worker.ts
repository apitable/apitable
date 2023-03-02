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

import { evaluate, FieldType, getNewId, IDPrefix, IFormulaField, IViewRow, Selectors, ViewDerivateBase } from '@apitable/core';
import { IWorkerGetVisibleRowsJobData, IWorkerJob, WorkerJobType } from './types';

const DUMMY_FIELD_NAME = 'Virtual';

export const getVisibleRows = (data: IWorkerGetVisibleRowsJobData): IViewRow[] => {
  const { filterByFormula, state, view } = data;
  const snapshot = Selectors.getSnapshot(state)!;
  const datasheetId = Selectors.getDatasheet(state)!.id;

  if (filterByFormula) {
    // Fictitiously pass in a field for calculation
    // TODO: Here field is only used to filter themselves and get snapshot, you can consider putting forward the parameters to todo optimization?
    const field: IFormulaField = {
      id: getNewId(IDPrefix.Field),
      name: DUMMY_FIELD_NAME,
      type: FieldType.Formula,
      property: {
        datasheetId,
        expression: filterByFormula,
      },
    };
    view.rows = view.rows.filter(row => {
      const result = evaluate(
        filterByFormula,
        {
          state,
          field,
          record: snapshot.recordMap[row.recordId]!,
        },
        false,
        false,
      );
      if (result) {
        return true;
      }
      return false;
    });

    if (!view.rows.length) {
      return [];
    }
  }
  return new ViewDerivateBase(state, datasheetId).getViewDerivation(view).visibleRows;
};

export default (job: IWorkerJob) => {
  switch (job.type) {
    case WorkerJobType.GetVisibleRows:
      return getVisibleRows(job.data);
  }
};
