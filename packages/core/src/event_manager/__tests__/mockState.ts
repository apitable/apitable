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

export const state = {
  datasheetMap: {
    dst2CXiPKQRdfgZBsa: {
      loading: false,
      connected: true,
      errorCode: null,
      syncing: false,
      datasheet: {
        id: 'dst2CXiPKQRdfgZBsa',
        name: 'Basic Table',
        description: '{}',
        parentId: 'fodUZJvqc76aC',
        icon: '',
        nodeShared: false,
        nodePermitSet: false,
        revision: 25,
        spaceId: 'spcYGJHMuVaKC',
        role: 'manager',
        permissions: {
          manageable: true,
          editable: true,
          readable: true,
          childCreatable: true,
          renamable: true,
          iconEditable: true,
          descriptionEditable: true,
          movable: true,
          copyable: true,
          importable: true,
          exportable: true,
          removable: true,
          sharable: true,
          allowSaveConfigurable: true,
          allowEditConfigurable: true,
          templateCreatable: true,
          viewCreatable: true,
          viewRenamable: true,
          viewRemovable: true,
          viewMovable: true,
          viewExportable: true,
          viewFilterable: true,
          columnSortable: true,
          columnHideable: true,
          fieldSortable: true,
          fieldGroupable: true,
          rowHighEditable: true,
          columnWidthEditable: true,
          columnCountEditable: true,
          rowSortable: true,
          fieldCreatable: true,
          fieldRenamable: true,
          fieldPropertyEditable: true,
          fieldRemovable: true,
          rowCreatable: true,
          rowRemovable: true,
          cellEditable: true,
          fieldPermissionManageable: true,
          viewLayoutEditable: true,
          viewStyleEditable: true,
          viewKeyFieldEditable: true,
          viewColorOptionEditable: true
        },
        nodeFavorite: false,
        extra: {
          showRecordHistory: true
        },
        snapshot: {
          meta: {
            views: [
              {
                id: 'viwjtHpVDnJaq',
                name: 'Grid View',
                rows: [
                  {
                    recordId: 'recFD450czfVo'
                  },
                  {
                    recordId: 'recnXP0aC4Lzp'
                  },
                  {
                    recordId: 'recrBFLL0kbWc'
                  },
                  {
                    recordId: 'recI5esdo8gbj'
                  },
                  {
                    recordId: 'recU0WTDTeAtE'
                  },
                  {
                    recordId: 'rec8S99sTR4XO'
                  },
                  {
                    recordId: 'recYbbp4CF5KO'
                  },
                  {
                    recordId: 'recZETurPQkcq'
                  }
                ],
                type: 1,
                columns: [
                  {
                    fieldId: 'fldBSXiPB3UQY',
                    statType: 1
                  },
                  {
                    fieldId: 'fld3uEu7eLKB9'
                  },
                  {
                    fieldId: 'fldoDkVedlBgt'
                  },
                  {
                    fieldId: 'fldDNg0HTVFGD'
                  }
                ],
                frozenColumnCount: 1
              }
            ],
            fieldMap: {
              fld3uEu7eLKB9: {
                id: 'fld3uEu7eLKB9',
                name: 'tags',
                type: 4,
                property: {
                  options: [
                    {
                      id: 'opt6Bjso8bkyV',
                      name: 'A',
                      color: 0
                    },
                    {
                      id: 'optY1cLqdBDOr',
                      name: 'B',
                      color: 1
                    },
                    {
                      id: 'optkpdgG5lLj9',
                      name: 'C',
                      color: 2
                    }
                  ]
                }
              },
              fldBSXiPB3UQY: {
                id: 'fldBSXiPB3UQY',
                name: 'title',
                type: 19,
                property: {
                  defaultValue: ''
                }
              },
              fldDNg0HTVFGD: {
                id: 'fldDNg0HTVFGD',
                name: 'title_tags',
                type: 16,
                property: {
                  expression: '{fldBSXiPB3UQY}+{fld3uEu7eLKB9}',
                  datasheetId: 'dst2CXiPKQRdfgZBsa'
                }
              },
              fldoDkVedlBgt: {
                id: 'fldoDkVedlBgt',
                name: 'file',
                type: 6
              }
            }
          },
          recordMap: {
            rec8S99sTR4XO: {
              id: 'rec8S99sTR4XO',
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
              createdAt: 1629110805000,
              updatedAt: 1629110812000,
              revisionHistory: [
                22,
                24
              ],
              recordMeta: {
                createdAt: 1629110805275,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fld3uEu7eLKB9: {
                    at: 1629110812874,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  },
                  fldBSXiPB3UQY: {
                    at: 1629110812874,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              },
              commentCount: 0
            },
            recFD450czfVo: {
              id: 'recFD450czfVo',
              data: {
                fld3uEu7eLKB9: [
                  'opt6Bjso8bkyV'
                ],
                fldBSXiPB3UQY: [
                  {
                    text: '1',
                    type: 1
                  }
                ]
              },
              createdAt: 1629109953000,
              updatedAt: 1629110046000,
              revisionHistory: [
                0,
                8,
                13
              ],
              recordMeta: {
                createdAt: 1629109953927,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fld3uEu7eLKB9: {
                    at: 1629110035976,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  },
                  fldBSXiPB3UQY: {
                    at: 1629110046037,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              },
              commentCount: 0
            },
            recI5esdo8gbj: {
              id: 'recI5esdo8gbj',
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
              createdAt: 1629110050000,
              updatedAt: 1629110781000,
              revisionHistory: [
                15,
                20
              ],
              recordMeta: {
                createdAt: 1629110050658,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fld3uEu7eLKB9: {
                    at: 1629110781860,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  },
                  fldBSXiPB3UQY: {
                    at: 1629110781860,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              },
              commentCount: 0
            },
            recnXP0aC4Lzp: {
              id: 'recnXP0aC4Lzp',
              data: {
                fld3uEu7eLKB9: [
                  'optY1cLqdBDOr'
                ],
                fldBSXiPB3UQY: [
                  {
                    text: '2',
                    type: 1
                  }
                ]
              },
              createdAt: 1629109953000,
              updatedAt: 1629110047000,
              revisionHistory: [
                0,
                10,
                14
              ],
              recordMeta: {
                createdAt: 1629109953927,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fld3uEu7eLKB9: {
                    at: 1629110040182,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  },
                  fldBSXiPB3UQY: {
                    at: 1629110047036,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              },
              commentCount: 0
            },
            recrBFLL0kbWc: {
              id: 'recrBFLL0kbWc',
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
              createdAt: 1629109953000,
              updatedAt: 1629110773000,
              revisionHistory: [
                0,
                12,
                19
              ],
              recordMeta: {
                createdAt: 1629109953927,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fld3uEu7eLKB9: {
                    at: 1629110043308,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  },
                  fldBSXiPB3UQY: {
                    at: 1629110773010,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              },
              commentCount: 0
            },
            recU0WTDTeAtE: {
              id: 'recU0WTDTeAtE',
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
              createdAt: 1629110804000,
              updatedAt: 1629110812000,
              revisionHistory: [
                21,
                24
              ],
              recordMeta: {
                createdAt: 1629110804320,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fld3uEu7eLKB9: {
                    at: 1629110812874,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  },
                  fldBSXiPB3UQY: {
                    at: 1629110812874,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              },
              commentCount: 0
            },
            recZETurPQkcq: {
              id: 'recZETurPQkcq',
              data: {},
              createdAt: 1629110806000,
              updatedAt: 1629110806000,
              revisionHistory: [
                23
              ],
              recordMeta: {
                createdAt: 1629110806552,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c'
              },
              commentCount: 0
            },
            recYbbp4CF5KO: {
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
              comments: [],
              recordMeta: {
                createdAt: 1629256103437,
                createdBy: 'eeb620a54e2248c69c25de68e6eb668c',
                fieldUpdatedMap: {
                  fld3uEu7eLKB9: {
                    at: 1629256103437,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  },
                  fldBSXiPB3UQY: {
                    at: 1629256103437,
                    by: 'eeb620a54e2248c69c25de68e6eb668c'
                  }
                }
              }
            }
          },
          datasheetId: 'dst2CXiPKQRdfgZBsa'
        },
        isPartOfData: false,
        activeView: 'viwjtHpVDnJaq'
      },
      client: {
        gridViewDragState: {
          dragTarget: {},
          hoverRecordId: null,
          hoverRowOfAddRecord: null
        },
        gridViewActiveFieldState: {
          fieldId: '',
          fieldRectLeft: 0,
          fieldRectBottom: 0,
          clickLogOffsetX: 0,
          fieldIndex: -1,
          tempSelection: [],
          operate: null
        },
        selection: {
          ranges: [
            {
              start: {
                recordId: 'recYbbp4CF5KO',
                fieldId: 'fldBSXiPB3UQY'
              },
              end: {
                recordId: 'recYbbp4CF5KO',
                fieldId: 'fldBSXiPB3UQY'
              }
            }
          ],
          activeCell: {
            recordId: 'recYbbp4CF5KO',
            fieldId: 'fldBSXiPB3UQY'
          }
        },
        collaborators: [
          {
            socketId: '/room#dKl2AohM_Fvo1FwYANVT',
            userName: 'Clark Mophie',
            memberName: 'Clark Mophie Yuro',
            avatar: 'https://s1.vika.cn/image/2020/02/05/RTWB7/3m6e9bmDIlbYNrwA==.jpeg',
            userId: 'eeb620a54e2248c69c25de68e6eb668c',
            createTime: 1463493227
          }
        ],
        newRecordExpectIndex: null,
        activeRowInfo: {
          type: 'UpdateRecord',
          positionInfo: {
            fieldId: 'fldBSXiPB3UQY',
            recordId: 'recYbbp4CF5KO',
            visibleRowIndex: 6,
            isInit: false
          },
          recordSnapshot: {
            meta: {
              fieldMap: {
                fld3uEu7eLKB9: {
                  id: 'fld3uEu7eLKB9',
                  name: 'tags',
                  type: 4,
                  property: {
                    options: [
                      {
                        id: 'opt6Bjso8bkyV',
                        name: 'A',
                        color: 0
                      },
                      {
                        id: 'optY1cLqdBDOr',
                        name: 'B',
                        color: 1
                      },
                      {
                        id: 'optkpdgG5lLj9',
                        name: 'C',
                        color: 2
                      }
                    ]
                  }
                },
                fldBSXiPB3UQY: {
                  id: 'fldBSXiPB3UQY',
                  name: 'title',
                  type: 19,
                  property: {
                    defaultValue: ''
                  }
                },
                fldDNg0HTVFGD: {
                  id: 'fldDNg0HTVFGD',
                  name: 'title_tags',
                  type: 16,
                  property: {
                    expression: '{fldBSXiPB3UQY}+{fld3uEu7eLKB9}',
                    datasheetId: 'dst2CXiPKQRdfgZBsa'
                  }
                },
                fldoDkVedlBgt: {
                  id: 'fldoDkVedlBgt',
                  name: 'file',
                  type: 6
                }
              }
            },
            recordMap: {
              recYbbp4CF5KO: {
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
                  ],
                  fldDNg0HTVFGD: '3C'
                },
                commentCount: 0,
                comments: []
              }
            },
            datasheetId: 'dst2CXiPKQRdfgZBsa'
          }
        },
        searchResultCursorIndex: 0,
        searchKeyword: '',
        groupingCollapseIds: [],
        kanbanGroupCollapse: [],
        isEditingCell: null,
        loadingRecord: {},
        widgetPanelStatus: {
          opening: false,
          width: 320,
          activePanelId: null,
          loading: false
        },
        ganttViewStatus: {
          gridWidth: 256,
          gridVisible: true,
          settingPanelWidth: 328,
          settingPanelVisible: true,
          dateUnitType: 'Month'
        },
        gridViewHoverFieldId: null,
        highlightFiledId: null,
        closeSyncViewIds: []
      },
      fieldPermissionMap: {},
      computedInfo: {},
      computedStatus: {}
    }
  }
};