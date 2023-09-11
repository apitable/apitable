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

import { find, get, has, values } from 'lodash';
import { IField, IMemberField, IMultiSelectField, ISelectField } from '@apitable/core';

interface ISelectFieldParam {
  cacheFieldOptions: object;
  fieldId: string;
  oiOrOd: string;
  field?: IField;
}
// Fill in the missing fields in the radio op
export const supplySelectField = (props: ISelectFieldParam) => {
  const { cacheFieldOptions, fieldId, oiOrOd, field } = props;
  if (get(field, 'property.options', []).some((op: any) => oiOrOd === op.id)) {
    return field;
  }
  const fieldOptionsMap = values(cacheFieldOptions[fieldId]) as ISelectField[];
  return find(fieldOptionsMap, (fo) => has(fo, 'property.options') && fo.property.options.some((op) => oiOrOd === op.id)) || field;
};

interface IMultiSelectOrMemberFieldParam {
  cacheFieldOptions: object;
  fieldId: string;
  oiOrOd: string[];
  field?: IField;
}
// Complete the missing fields in the multiple choice op
export const supplyMultiSelectField = (props: IMultiSelectOrMemberFieldParam) => {
  const { cacheFieldOptions, fieldId, oiOrOd, field } = props;
  if (get(field, 'property.options', []).some((op: any) => oiOrOd[0] === op.id)) {
    return field;
  }
  const fieldOptionsMap = values(cacheFieldOptions[fieldId]) as IMultiSelectField[];
  return find(fieldOptionsMap, (fo) => has(fo, 'property.options') && fo.property.options.some((op) => oiOrOd[0] === op.id)) || field;
};

// Completes a missing field in a member
export const supplyMemberField = (props: IMultiSelectOrMemberFieldParam) => {
  const { cacheFieldOptions, fieldId, oiOrOd, field } = props;
  if (get(field, 'property.unitIds', []).some((op: any) => oiOrOd[0] === op.id)) {
    return field;
  }
  const fieldOptionsMap = values(cacheFieldOptions[fieldId]) as IMemberField[];
  return find(fieldOptionsMap, (fo) => (get(fo, 'property.unitIds', []) as string[]).some((unitId) => oiOrOd[0] === unitId)) || field;
};

interface IExtraFieldParam {
  cacheFieldOptions: object;
  fieldId: string;
  field?: IField;
  revision: number;
  isOi?: boolean;
}
// Fill in the missing fields for scoring, checkboxes, numbers, dates, associated op
// TODO no change in actual cell data when scoring, ticking, number changing emoji
export const supplyExtraField = (props: IExtraFieldParam) => {
  const { cacheFieldOptions, fieldId, revision, isOi } = props;
  let { field } = props;
  const fieldOptionsMap = cacheFieldOptions[fieldId];
  const revisionKeys = fieldOptionsMap && Object.keys(fieldOptionsMap);
  let idx = 0;
  // Find the Field that is closest to and greater than or equal to the current version (the field is lost in later versions of the od operation)
  while (revisionKeys && idx < revisionKeys.length) {
    const curKey = revisionKeys[idx].split('_')[1];
    if (
      Number(curKey) >= revision &&
      (has(fieldOptionsMap, `${revisionKeys[idx]}.property.icon`) ||
        has(fieldOptionsMap, `${revisionKeys[idx]}.property.precision`) ||
        has(fieldOptionsMap, `${revisionKeys[idx]}.property.dateFormat`) ||
        has(fieldOptionsMap, `${revisionKeys[idx]}.property.foreignDatasheetId`))
    ) {
      // oi The field of the cache od is not taken in case of equal versions
      if (isOi) {
        if (Number(curKey) !== revision) {
          field = fieldOptionsMap[revisionKeys[idx]];
          break;
        }
      } else {
        field = fieldOptionsMap[revisionKeys[idx]];
        break;
      }
    }
    idx++;
  }
  return field;
};
