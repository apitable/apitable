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

export const eventRecordCreated = [
  {
    eventName: 'RecordCreated',
    realType: 'REAL',
    atomType: 'ATOM',
    scope: 0,
    context: {
      datasheetId: 'dst2CXiPKQRdfgZBsa',
      recordId: 'recL3avIg0ydn',
      fields: {}
    },
    sourceType: 'LOCAL'
  }
];

export const eventRecordDuplicated = [
  {
    eventName: 'RecordCreated',
    realType: 'REAL',
    atomType: 'ATOM',
    scope: 0,
    context: {
      datasheetId: 'dst2CXiPKQRdfgZBsa',
      recordId: 'recYbbp4CF5KO',
      fields: {
        fld3uEu7eLKB9: ['optkpdgG5lLj9'],
        fldBSXiPB3UQY: [{ text: '3', type: 1 }]
      }
    },
    sourceType: 'LOCAL'
  }
];

export const eventRecordDeleted = [
  {
    eventName: 'RecordDeleted',
    realType: 'REAL',
    atomType: 'ATOM',
    scope: 0,
    context: { datasheetId: 'dst2CXiPKQRdfgZBsa', recordId: 'recL3avIg0ydn' },
    sourceType: 'LOCAL'
  }
];