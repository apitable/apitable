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

export const createRecordOps = [
  {
    messageId: 'Ytv6cCegqyw184qIhc8z',
    baseRevision: 15,
    resourceId: 'dst2CXiPKQRdfgZBsa',
    resourceType: 0,
    operations: [
      {
        cmd: 'AddRecords',
        actions: [
          {
            n: 'LI',
            p: [
              'meta',
              'views',
              0,
              'rows',
              4
            ],
            li: {
              recordId: 'recL3avIg0ydn'
            }
          },
          {
            n: 'OI',
            p: [
              'recordMap',
              'recL3avIg0ydn'
            ],
            oi: {
              id: 'recL3avIg0ydn',
              data: {},
              commentCount: 0,
              comments: []
            }
          }
        ]
      }
    ]
  }
];

// Create with field data.
export const duplicateRecordOps = [
  {
    messageId: 'CXduhfHP1AWVOWpLtWNe',
    baseRevision: 24,
    resourceId: 'dst2CXiPKQRdfgZBsa',
    resourceType: 0,
    operations: [
      {
        cmd: 'AddRecords',
        actions: [
          {
            n: 'LI',
            p: [
              'meta',
              'views',
              0,
              'rows',
              6
            ],
            li: {
              recordId: 'recYbbp4CF5KO'
            }
          },
          {
            n: 'OI',
            p: [
              'recordMap',
              'recYbbp4CF5KO'
            ],
            oi: {
              id: 'recYbbp4CF5KO',
              data: {
                fld3uEu7eLKB9: [
                  'optkpdgG5lLj9'
                ],
                fldBSXiPB3UQY: [
                  {
                    text: '3',
                    type: 1
                  }
                ]
              },
              commentCount: 0,
              comments: []
            }
          }
        ],
        fieldTypeMap: {
          fld3uEu7eLKB9: 4,
          fldBSXiPB3UQY: 19
        }
      }
    ]
  }
];

export const updateRecordOps = [
  {
    messageId: 'FztlWXFvs5cikdP74vsv',
    baseRevision: 16,
    resourceId: 'dst2CXiPKQRdfgZBsa',
    resourceType: 0,
    operations: [
      {
        cmd: 'SetRecords',
        actions: [
          {
            n: 'OI',
            p: [
              'recordMap',
              'recL3avIg0ydn',
              'data',
              'fldBSXiPB3UQY'
            ],
            oi: [
              {
                type: 1,
                text: '1'
              }
            ]
          }
        ],
        fieldTypeMap: {
          fldBSXiPB3UQY: 19
        }
      }
    ]
  }
];

export const deleteRecordOps = [
  {
    messageId: 'TNRoM7zi7TZAr04Yn550',
    baseRevision: 17,
    resourceId: 'dst2CXiPKQRdfgZBsa',
    resourceType: 0,
    operations: [
      {
        cmd: 'DeleteRecords',
        actions: [
          {
            n: 'LD',
            p: [
              'meta',
              'views',
              0,
              'rows',
              4
            ],
            ld: {
              recordId: 'recL3avIg0ydn'
            }
          },
          {
            n: 'OD',
            p: [
              'recordMap',
              'recL3avIg0ydn'
            ],
            od: {
              id: 'recL3avIg0ydn',
              data: {
                fldBSXiPB3UQY: [
                  {
                    type: 1,
                    text: '1'
                  }
                ]
              },
              commentCount: 0,
              comments: [],
              recordMeta: {
                createdAt: 1629110237215,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fldBSXiPB3UQY: {
                    at: 1629110487775,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              }
            }
          }
        ]
      }
    ]
  }
];

export const updateRecordsOpsByFill = [
  {
    messageId: 'OwzCNj4dSxupWUZUIieE',
    baseRevision: 23,
    resourceId: 'dst2CXiPKQRdfgZBsa',
    resourceType: 0,
    operations: [
      {
        cmd: 'FillDataToCells',
        actions: [
          {
            n: 'OI',
            p: [
              'recordMap',
              'recU0WTDTeAtE',
              'data',
              'fldBSXiPB3UQY'
            ],
            oi: [
              {
                type: 1,
                text: '3'
              }
            ]
          },
          {
            n: 'OI',
            p: [
              'recordMap',
              'recU0WTDTeAtE',
              'data',
              'fld3uEu7eLKB9'
            ],
            oi: [
              'optkpdgG5lLj9'
            ]
          },
          {
            n: 'OI',
            p: [
              'recordMap',
              'rec8S99sTR4XO',
              'data',
              'fldBSXiPB3UQY'
            ],
            oi: [
              {
                type: 1,
                text: '3'
              }
            ]
          },
          {
            n: 'OI',
            p: [
              'recordMap',
              'rec8S99sTR4XO',
              'data',
              'fld3uEu7eLKB9'
            ],
            oi: [
              'optkpdgG5lLj9'
            ]
          }
        ],
        fieldTypeMap: {
          fldBSXiPB3UQY: 19,
          fld3uEu7eLKB9: 4
        }
      }
    ]
  }
];
