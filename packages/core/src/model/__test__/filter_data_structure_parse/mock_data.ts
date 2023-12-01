import { IReduxState } from 'exports/store/interfaces';
import { IOpenFilterInfo } from 'types/open';

const singleTextFieldId = 'fldatcBb73HmF';
const dateFieldId = 'fldx3xuCoKZWp';
export const openFilterInfoMock: IOpenFilterInfo = {
  or: [
    {
      fieldKey: singleTextFieldId, // field name or ID
      SingleText: {
        is: '1' // Operators: value
      }
    }
  ],
  and: [
    {
      fieldKey: singleTextFieldId, // field name or ID
      SingleText: {
        is: '1' // Operators: value
      }
    },
    {
      or: [
        {
          fieldKey: dateFieldId, // field name or ID,
          // Operators: value -> [date operators, value]
          DateTime: {
            is: ['ExactDate', 1651507200000]
          }
        },
        {
          fieldKey: dateFieldId, // field name or ID,
          DateTime: {
            // [opeartor, value]
            is: ['DateRange', 1651507200000, 1651507200000]
          }
        }
      ]
    }
  ]
};

export const innerFilter = {
  conjunction: 'and',
  conditions: [
    {
      conditionId: 'cdtAsOwey6Wox',
      fieldId: 'fldatcBb73HmF',
      fieldType: 19,
      operator: 'is',
      value: [
        '1'
      ]
    },
    {
      conjunction: 'or',
      conditions: [
        {
          conditionId: 'cdtMldjJe7uQE',
          fieldId: 'fldx3xuCoKZWp',
          fieldType: 5,
          operator: 'is',
          value: [
            'ExactDate',
            1651507200000
          ]
        },
        {
          conditionId: 'cdtISStFjxHC0',
          fieldId: 'fldx3xuCoKZWp',
          fieldType: 5,
          operator: 'is',
          value: [
            'DateRange',
            '1651507200000-1651507200000'
          ]
        }
      ]
    }
  ]
};

export const expressFilter = {
  type: 'Expression',
  value: {
    operator: 'and',
    operands: [
      {
        type: 'Expression',
        value: {
          operator: 'is',
          operands: [
            {
              type: 'Literal',
              value: 'fldatcBb73HmF'
            },
            {
              type: 'Literal',
              value: ['1']
            }
          ]
        }
      },
      {
        type: 'Expression',
        value: {
          operator: 'or',
          operands: [
            {
              type: 'Expression',
              value: {
                operator: 'is',
                operands: [
                  {
                    type: 'Literal',
                    value: 'fldx3xuCoKZWp'
                  },
                  {
                    type: 'Literal',
                    value: ['ExactDate', 1651507200000]
                  }
                ]
              }
            },
            {
              type: 'Expression',
              value: {
                operator: 'is',
                operands: [
                  {
                    type: 'Literal',
                    value: 'fldx3xuCoKZWp'
                  },
                  {
                    type: 'Literal',
                    value: ['DateRange', '1651507200000-1651507200000']
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
} as any;

export const mockMeta = {
  fieldMap: {
    fld45CAzWsnPu: {
      isPrimary: false,
      name: 'Checkbox',
      property: {
        icon: 'white_check_mark'
      },
      type: 11,
      id: 'fld45CAzWsnPu'
    },
    fldH6daoOiSn6: {
      isPrimary: false,
      name: 'Number',
      property: {
        precision: 0,
        symbolAlign: 2
      },
      type: 2,
      id: 'fldH6daoOiSn6'
    },
    fldKQCIUnHHpr: {
      isPrimary: false,
      property: {
        options: [
          {
            id: 'optaotR1wtAL5',
            color: 0,
            name: '1'
          },
          {
            id: 'opt9dGTcjLRrm',
            color: 1,
            name: '2'
          }
        ]
      },
      name: 'Options',
      type: 4,
      id: 'fldKQCIUnHHpr'
    },
    fldatcBb73HmF: {
      isPrimary: true,
      property: {},
      name: 'Title',
      type: 19,
      id: 'fldatcBb73HmF'
    },
    fldrjet2OmA9I: {
      isPrimary: false,
      name: 'Single Select',
      property: {
        options: [
          {
            id: 'optNw4jBOCB93',
            color: 0,
            name: '1'
          },
          {
            id: 'optn0FvbP3o9v',
            color: 1,
            name: '2'
          }
        ]
      },
      type: 3,
      id: 'fldrjet2OmA9I'
    },
    fldx3xuCoKZWp: {
      isPrimary: false,
      name: 'Date',
      property: {
        dateFormat: 0,
        timeFormat: 1,
        includeTime: false,
        autoFill: false
      },
      type: 5,
      id: 'fldx3xuCoKZWp'
    }
  },
  views: [
    {
      groupInfo: [],
      frozenColumnCount: 1,
      autoSave: false,
      name: 'Grid view',
      type: 1,
      id: 'viw0IT1SLcuxn',
      rows: [
        {
          recordId: 'rec8qyPVCEh2v'
        },
        {
          recordId: 'recv421PcHhqK'
        },
        {
          recordId: 'recbr17cyTMyu'
        }
      ],
      columns: [
        {
          fieldId: 'fldatcBb73HmF',
          statType: 1
        },
        {
          fieldId: 'fldKQCIUnHHpr'
        },
        {
          fieldId: 'fldx3xuCoKZWp'
        },
        {
          fieldId: 'fldH6daoOiSn6',
          statType: 8
        },
        {
          fieldId: 'fld45CAzWsnPu'
        },
        {
          fieldId: 'fldrjet2OmA9I'
        }
      ],
      filterInfo: {
        conjunction: 'and',
        conditions: [
          {
            fieldId: 'fldrjet2OmA9I',
            fieldType: 3,
            conditionId: 'cdtJlYNA4o18q',
            operator: 'is',
            value: null
          }
        ]
      } as any
    }
  ],
  primaryFieldId: 'fldatcBb73HmF',
  widgetPanels: [
    {
      widgets: [
        {
          id: 'wdtouFWXXxskKhfXqR',
          height: 6.2,
          y: 9007199254740991
        }
      ],
      name: 'widget panel',
      datasheetId: 'dstxmCmSgH6hViHJ7x',
      id: 'wplbDiuNmMgt5'
    } as any
  ]
};

export const mockState = {
  datasheetMap: {
    dstxmCmSgH6hViHJ7x: {
      loading: false,
      connected: true,
      errorCode: null,
      syncing: false,
      datasheet: {
        id: 'dstxmCmSgH6hViHJ7x',
        name: 'basic 2',
        description: '{}',
        parentId: 'fodBxUdMnVuKU',
        icon: '',
        nodeShared: false,
        nodePermitSet: false,
        revision: 29,
        spaceId: 'spcpzpHG0AFpr',
        role: 'manager' as any,
        permissions: {
          nodeId: 'dstxmCmSgH6hViHJ7x',
          datasheetId: 'dstxmCmSgH6hViHJ7x',
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
          viewColorOptionEditable: true,
          viewLockManageable: true,
          viewManualSaveManageable: true,
          viewOptionSaveEditable: true
        } as any,
        snapshot: {
          meta: mockMeta,
          recordMap: {},
          datasheetId: 'dstxmCmSgH6hViHJ7x'
        },
        isPartOfData: false
      },
      client: {} as any,
      fieldPermissionMap: {},
      computedInfo: {},
      computedStatus: {}
    }
  },
  hooks: {
    pendingGuideWizardIds: [],
    curGuideWizardId: 0,
    curGuideStepIds: [],
    triggeredGuideInfo: {},
    config: null,
  },
  billing: {
    catalog: {},
    pruducts: {},
    plans: {},
    features: {},
    subscription: null,
  },
} as unknown as IReduxState;
