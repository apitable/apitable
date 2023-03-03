import { IDatasheetMap, IDatasheetState, IPageParams, IReduxState, ISnapshot, ViewType } from 'exports/store';
import { FieldType, SegmentType } from 'types';
import { ILinkConsistencyError, checkLinkConsistency } from 'utils/link_consistency_check';

describe('checkLinkConsistency', () => {
  test('datasheet without link fields', () => {
    const mockState: IReduxState = ({
      pageParams: {
        datasheetId: 'dst1',
      } as IPageParams,
      datasheetMap: ({
        dst1: {
          loading: false,
          connected: false,
          syncing: false,
          datasheet: ({
            id: 'dst1',
            isPartOfData: false,
            snapshot: {
              meta: {
                fieldMap: {
                  'fld1-1': {
                    id: 'fld1-1',
                    name: 'field 1',
                    type: FieldType.SingleText,
                    property: {},
                  },
                  'fld1-2': {
                    id: 'fld1-2',
                    name: 'field 2',
                    type: FieldType.MultiSelect,
                    property: {
                      options: [
                        { id: 'opt1', name: 'option 1', color: 0 },
                        { id: 'opt2', name: 'option 2', color: 1 },
                        { id: 'opt3', name: 'option 3', color: 2 },
                      ],
                    },
                  },
                },
                views: [
                  {
                    id: 'viw1',
                    name: 'view 1',
                    type: ViewType.Grid,
                    columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                    rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }],
                    frozenColumnCount: 1,
                  },
                ],
              },
              recordMap: {
                'rec1-1': {
                  id: 'rec1-1',
                  data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['opt1'] },
                  commentCount: 0,
                },
                'rec1-2': {
                  id: 'rec1-2',
                  data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['opt2'] },
                  commentCount: 0,
                },
                'rec1-3': {
                  id: 'rec1-3',
                  data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                  commentCount: 0,
                },
              },
              datasheetId: 'dst1',
            } as ISnapshot,
            permissions: {
              editable: true,
            },
          } as any) as IDatasheetState,
        },
      } as any) as IDatasheetMap,
    } as any) as IReduxState;
    const result = checkLinkConsistency(mockState);
    expect(result).toStrictEqual(undefined);
  });

  describe('one link field', () => {
    test('no missing recordIds', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst2',
                        brotherFieldId: 'fld2-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec2-1', 'rec2-2'] },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec2-2'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
          dst2: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst2',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld2-1': {
                      id: 'fld2-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld2-2': {
                      id: 'fld2-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld2-1' }, { fieldId: 'fld2-2' }],
                      rows: [{ recordId: 'rec2-1' }, { recordId: 'rec2-2' }, { recordId: 'rec2-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec2-1': {
                    id: 'rec2-1',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld2-2': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec2-2': {
                    id: 'rec2-2',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1', 'rec1-2'] },
                    commentCount: 0,
                  },
                  'rec2-3': {
                    id: 'rec2-3',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst2',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;
      const result = checkLinkConsistency(mockState);
      expect(result).toStrictEqual(undefined);
    });

    describe('with missing recordIds', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst2',
                        brotherFieldId: 'fld2-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec2-1', 'rec2-2'] },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec2-2'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                    commentCount: 0,
                  },
                  'rec1-4': {
                    id: 'rec1-4',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-2': ['rec2-2', 'rec2-1', 'rec2-3'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
          dst2: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst2',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld2-1': {
                      id: 'fld2-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld2-2': {
                      id: 'fld2-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld2-1' }, { fieldId: 'fld2-2' }],
                      rows: [{ recordId: 'rec2-1' }, { recordId: 'rec2-2' }, { recordId: 'rec2-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec2-1': {
                    id: 'rec2-1',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld2-2': ['rec1-4'] },
                    commentCount: 0,
                  },
                  'rec2-2': {
                    id: 'rec2-2',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec2-3': {
                    id: 'rec2-3',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld2-2': ['rec1-4'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst2',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;

      test('missing recordIds in foreign datasheet', () => {
        const result = checkLinkConsistency(mockState);
        expect(result).toStrictEqual({
          mainDstId: 'dst1',
          missingRecords: new Map([
            [
              'dst2',
              new Map([
                ['rec2-1:fld2-2', new Set(['rec1-1'])],
                ['rec2-2:fld2-2', new Set(['rec1-2', 'rec1-4'])],
              ]),
            ],
          ]),
        } as ILinkConsistencyError);
      });

      test('missing recordIds in main datasheet', () => {
        const result = checkLinkConsistency({
          ...mockState,
          pageParams: {
            datasheetId: 'dst2',
          },
        });
        expect(result).toStrictEqual({
          mainDstId: 'dst2',
          missingRecords: new Map([
            [
              'dst2',
              new Map([
                ['rec2-1:fld2-2', new Set(['rec1-1'])],
                ['rec2-2:fld2-2', new Set(['rec1-2', 'rec1-4'])],
              ]),
            ],
          ]),
        } as ILinkConsistencyError);
      });

      test('missing recordIds in both datasheets', () => {
        const mockState: IReduxState = ({
          pageParams: {
            datasheetId: 'dst1',
          } as IPageParams,
          datasheetMap: ({
            dst1: {
              loading: false,
              connected: false,
              syncing: false,
              datasheet: ({
                id: 'dst1',
                isPartOfData: false,
                snapshot: {
                  meta: {
                    fieldMap: {
                      'fld1-1': {
                        id: 'fld1-1',
                        name: 'field 1',
                        type: FieldType.SingleText,
                        property: {},
                      },
                      'fld1-2': {
                        id: 'fld1-2',
                        name: 'field 2',
                        type: FieldType.Link,
                        property: {
                          foreignDatasheetId: 'dst2',
                          brotherFieldId: 'fld2-2',
                        },
                      },
                    },
                    views: [
                      {
                        id: 'viw1',
                        name: 'view 1',
                        type: ViewType.Grid,
                        columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                        rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }],
                        frozenColumnCount: 1,
                      },
                    ],
                  },
                  recordMap: {
                    'rec1-1': {
                      id: 'rec1-1',
                      data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec2-1', 'rec2-2'] },
                      commentCount: 0,
                    },
                    'rec1-2': {
                      id: 'rec1-2',
                      data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec2-2'] },
                      commentCount: 0,
                    },
                    'rec1-3': {
                      id: 'rec1-3',
                      data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                      commentCount: 0,
                    },
                    'rec1-4': {
                      id: 'rec1-4',
                      data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-2': ['rec2-2', 'rec2-1', 'rec2-3'] },
                      commentCount: 0,
                    },
                  },
                  datasheetId: 'dst1',
                } as ISnapshot,
                permissions: {
                  editable: true,
                },
              } as any) as IDatasheetState,
            },
            dst2: {
              loading: false,
              connected: false,
              syncing: false,
              datasheet: ({
                id: 'dst2',
                isPartOfData: false,
                snapshot: {
                  meta: {
                    fieldMap: {
                      'fld2-1': {
                        id: 'fld2-1',
                        name: 'field 1',
                        type: FieldType.SingleText,
                        property: {},
                      },
                      'fld2-2': {
                        id: 'fld2-2',
                        name: 'field 2',
                        type: FieldType.Link,
                        property: {
                          foreignDatasheetId: 'dst1',
                          brotherFieldId: 'fld1-2',
                        },
                      },
                    },
                    views: [
                      {
                        id: 'viw1',
                        name: 'view 1',
                        type: ViewType.Grid,
                        columns: [{ fieldId: 'fld2-1' }, { fieldId: 'fld2-2' }],
                        rows: [{ recordId: 'rec2-1' }, { recordId: 'rec2-2' }, { recordId: 'rec2-3' }],
                        frozenColumnCount: 1,
                      },
                    ],
                  },
                  recordMap: {
                    'rec2-1': {
                      id: 'rec2-1',
                      data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld2-2': ['rec1-4'] },
                      commentCount: 0,
                    },
                    'rec2-2': {
                      id: 'rec2-2',
                      data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1', 'rec1-3'] },
                      commentCount: 0,
                    },
                    'rec2-3': {
                      id: 'rec2-3',
                      data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld2-2': ['rec1-4', 'rec1-1', 'rec1-3'] },
                      commentCount: 0,
                    },
                  },
                  datasheetId: 'dst2',
                } as ISnapshot,
                permissions: {
                  editable: true,
                },
              } as any) as IDatasheetState,
            },
          } as any) as IDatasheetMap,
        } as any) as IReduxState;
        const result = checkLinkConsistency(mockState);
        expect(result).toStrictEqual({
          mainDstId: 'dst1',
          missingRecords: new Map([
            [
              'dst2',
              new Map([
                ['rec2-1:fld2-2', new Set(['rec1-1'])],
                ['rec2-2:fld2-2', new Set(['rec1-2', 'rec1-4'])],
              ]),
            ],
            [
              'dst1',
              new Map([
                ['rec1-3:fld1-2', new Set(['rec2-2', 'rec2-3'])],
                ['rec1-1:fld1-2', new Set(['rec2-3'])],
              ]),
            ],
          ]),
        } as ILinkConsistencyError);
      });

      describe('no edit permission', () => {
        test('no edit permission of main datasheet', () => {
          const result = checkLinkConsistency({
            ...mockState,
            datasheetMap: {
              ...mockState.datasheetMap,
              dst1: {
                ...mockState.datasheetMap.dst1,
                datasheet: {
                  ...mockState.datasheetMap.dst1!.datasheet,
                  permissions: {
                    editable: false,
                  },
                } as IDatasheetState,
              },
            } as IDatasheetMap,
          });
          expect(result).toStrictEqual(undefined);
        });

        test('no edit permission of foreign datasheet', () => {
          const result = checkLinkConsistency({
            ...mockState,
            datasheetMap: {
              ...mockState.datasheetMap,
              dst2: {
                ...mockState.datasheetMap.dst2,
                datasheet: {
                  ...mockState.datasheetMap.dst2!.datasheet,
                  permissions: {
                    editable: false,
                  },
                } as IDatasheetState,
              },
            } as IDatasheetMap,
          });
          expect(result).toStrictEqual(undefined);
        });
      });

      describe('isPartOfData', () => {
        test('main datasheet isPartOfData', () => {
          const result = checkLinkConsistency({
            ...mockState,
            datasheetMap: {
              ...mockState.datasheetMap,
              dst1: {
                ...mockState.datasheetMap.dst1,
                datasheet: {
                  ...mockState.datasheetMap.dst1!.datasheet,
                  isPartOfData: true,
                } as IDatasheetState,
              },
            } as IDatasheetMap,
          });
          expect(result).toStrictEqual(undefined);
        });

        test('foreign datasheet isPartOfData', () => {
          const result = checkLinkConsistency({
            ...mockState,
            datasheetMap: {
              ...mockState.datasheetMap,
              dst2: {
                ...mockState.datasheetMap.dst2,
                datasheet: {
                  ...mockState.datasheetMap.dst2!.datasheet,
                  isPartOfData: true,
                } as IDatasheetState,
              },
            } as IDatasheetMap,
          });
          expect(result).toStrictEqual(undefined);
        });
      });
    });
  });

  describe('two link fields references different datasheets', () => {
    test('no missing recordIds', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst2',
                        brotherFieldId: 'fld2-2',
                      },
                    },
                    'fld1-3': {
                      id: 'fld1-3',
                      name: 'field 3',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst3',
                        brotherFieldId: 'fld3-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }, { fieldId: 'fld1-3' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec2-1', 'rec2-2'], 'fld1-3': ['rec3-1'] },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec2-2'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-3': ['rec3-1', 'rec3-3'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
          dst2: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst2',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld2-1': {
                      id: 'fld2-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld2-2': {
                      id: 'fld2-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld2-1' }, { fieldId: 'fld2-2' }],
                      rows: [{ recordId: 'rec2-1' }, { recordId: 'rec2-2' }, { recordId: 'rec2-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec2-1': {
                    id: 'rec2-1',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld2-2': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec2-2': {
                    id: 'rec2-2',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1', 'rec1-2'] },
                    commentCount: 0,
                  },
                  'rec2-3': {
                    id: 'rec2-3',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst2',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
          dst3: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst3',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld3-1': {
                      id: 'fld3-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld3-2': {
                      id: 'fld3-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-3',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld3-1' }, { fieldId: 'fld3-2' }],
                      rows: [{ recordId: 'rec3-1' }, { recordId: 'rec3-2' }, { recordId: 'rec3-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec3-1': {
                    id: 'rec3-1',
                    data: { 'fld3-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld3-2': ['rec1-1', 'rec1-3'] },
                    commentCount: 0,
                  },
                  'rec3-2': {
                    id: 'rec3-2',
                    data: { 'fld3-1': [{ type: SegmentType.Text, text: 'rec 2' }] },
                    commentCount: 0,
                  },
                  'rec3-3': {
                    id: 'rec3-3',
                    data: { 'fld3-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld3-2': ['rec1-3'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst2',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;

      const result = checkLinkConsistency(mockState);
      expect(result).toStrictEqual(undefined);
    });

    test('missing recordIds in all datasheets', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst2',
                        brotherFieldId: 'fld2-2',
                      },
                    },
                    'fld1-3': {
                      id: 'fld1-3',
                      name: 'field 3',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst3',
                        brotherFieldId: 'fld3-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }, { fieldId: 'fld1-3' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec2-1', 'rec2-2'], 'fld1-3': ['rec3-1'] },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec2-2'], 'fld1-3': ['rec3-1', 'rec3-2'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-3': ['rec3-1', 'rec3-3'] },
                    commentCount: 0,
                  },
                  'rec1-4': {
                    id: 'rec1-4',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-2': ['rec2-2', 'rec2-3'], 'fld1-3': ['rec3-1'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
          dst2: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst2',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld2-1': {
                      id: 'fld2-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld2-2': {
                      id: 'fld2-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld2-1' }, { fieldId: 'fld2-2' }],
                      rows: [{ recordId: 'rec2-1' }, { recordId: 'rec2-2' }, { recordId: 'rec2-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec2-1': {
                    id: 'rec2-1',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld2-2': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec2-2': {
                    id: 'rec2-2',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1', 'rec1-2'] },
                    commentCount: 0,
                  },
                  'rec2-3': {
                    id: 'rec2-3',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld2-2': ['rec1-3'] },
                    commentCount: 0,
                  },
                  'rec2-4': {
                    id: 'rec2-4',
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld2-2': ['rec1-1'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst2',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
          dst3: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst3',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld3-1': {
                      id: 'fld3-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld3-2': {
                      id: 'fld3-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-3',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld3-1' }, { fieldId: 'fld3-2' }],
                      rows: [{ recordId: 'rec3-1' }, { recordId: 'rec3-2' }, { recordId: 'rec3-3' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec3-1': {
                    id: 'rec3-1',
                    data: { 'fld3-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld3-2': ['rec1-1', 'rec1-3'] },
                    commentCount: 0,
                  },
                  'rec3-2': {
                    id: 'rec3-2',
                    data: { 'fld3-1': [{ type: SegmentType.Text, text: 'rec 2' }] },
                    commentCount: 0,
                  },
                  'rec3-3': {
                    id: 'rec3-3',
                    data: { 'fld3-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld3-2': ['rec1-3', 'rec1-1'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst2',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;

      const result = checkLinkConsistency(mockState);
      expect(result).toStrictEqual({
        mainDstId: 'dst1',
        missingRecords: new Map([
          [
            'dst2',
            new Map([
              ['rec2-2:fld2-2', new Set(['rec1-4'])],
              ['rec2-3:fld2-2', new Set(['rec1-4'])],
            ]),
          ],
          [
            'dst1',
            new Map([
              ['rec1-3:fld1-2', new Set(['rec2-3'])],
              ['rec1-1:fld1-2', new Set(['rec2-4'])],
              ['rec1-1:fld1-3', new Set(['rec3-3'])],
            ]),
          ],
          [
            'dst3',
            new Map([
              ['rec3-1:fld3-2', new Set(['rec1-2', 'rec1-4'])],
              ['rec3-2:fld3-2', new Set(['rec1-2'])],
            ]),
          ],
        ]),
      });
    });
  });

  describe('self link field', () => {
    test('no missing recordIds', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-3',
                      },
                    },
                    'fld1-3': {
                      id: 'fld1-3',
                      name: 'field 3',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }, { recordId: 'rec1-4' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec1-1', 'rec1-2', 'rec1-4'], 'fld1-3': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec1-4'], 'fld1-3': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                    commentCount: 0,
                  },
                  'rec1-4': {
                    id: 'rec1-4',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-3': ['rec1-2', 'rec1-1'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;

      const result = checkLinkConsistency(mockState);
      expect(result).toStrictEqual(undefined);
    });

    test('missing recordIds in foreign datasheet', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-3',
                      },
                    },
                    'fld1-3': {
                      id: 'fld1-3',
                      name: 'field 3',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }, { recordId: 'rec1-4' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec1-1', 'rec1-2', 'rec1-4'] },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec1-4'], 'fld1-3': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-2': ['rec1-4'] },
                    commentCount: 0,
                  },
                  'rec1-4': {
                    id: 'rec1-4',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-3': ['rec1-2'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;

      const result = checkLinkConsistency(mockState);
      expect(result).toStrictEqual({
        mainDstId: 'dst1',
        missingRecords: new Map([
          [
            'dst1',
            new Map([
              ['rec1-1:fld1-3', new Set(['rec1-1'])],
              ['rec1-4:fld1-3', new Set(['rec1-1', 'rec1-3'])],
            ]),
          ],
        ]),
      } as ILinkConsistencyError);
    });

    test('missing recordIds in main datasheet', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-3',
                      },
                    },
                    'fld1-3': {
                      id: 'fld1-3',
                      name: 'field 3',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }, { recordId: 'rec1-4' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: {
                      'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }],
                      'fld1-2': ['rec1-1', 'rec1-4'],
                      'fld1-3': ['rec1-3', 'rec1-1'],
                    },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec1-4'], 'fld1-3': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                    commentCount: 0,
                  },
                  'rec1-4': {
                    id: 'rec1-4',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-3': ['rec1-2', 'rec1-1', 'rec1-3', 'rec1-4'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;

      const result = checkLinkConsistency(mockState);
      expect(result).toStrictEqual({
        mainDstId: 'dst1',
        missingRecords: new Map([
          [
            'dst1',
            new Map([
              ['rec1-3:fld1-2', new Set(['rec1-1', 'rec1-4'])],
              ['rec1-1:fld1-2', new Set(['rec1-2'])],
              ['rec1-4:fld1-2', new Set(['rec1-4'])],
            ]),
          ],
        ]),
      } as ILinkConsistencyError);
    });

    test('missing recordIds in both datasheets', () => {
      const mockState: IReduxState = ({
        pageParams: {
          datasheetId: 'dst1',
        } as IPageParams,
        datasheetMap: ({
          dst1: {
            loading: false,
            connected: false,
            syncing: false,
            datasheet: ({
              id: 'dst1',
              isPartOfData: false,
              snapshot: {
                meta: {
                  fieldMap: {
                    'fld1-1': {
                      id: 'fld1-1',
                      name: 'field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    'fld1-2': {
                      id: 'fld1-2',
                      name: 'field 2',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-3',
                      },
                    },
                    'fld1-3': {
                      id: 'fld1-3',
                      name: 'field 3',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                        brotherFieldId: 'fld1-2',
                      },
                    },
                  },
                  views: [
                    {
                      id: 'viw1',
                      name: 'view 1',
                      type: ViewType.Grid,
                      columns: [{ fieldId: 'fld1-1' }, { fieldId: 'fld1-2' }],
                      rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }, { recordId: 'rec1-3' }, { recordId: 'rec1-4' }],
                      frozenColumnCount: 1,
                    },
                  ],
                },
                recordMap: {
                  'rec1-1': {
                    id: 'rec1-1',
                    data: {
                      'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }],
                      'fld1-2': ['rec1-1', 'rec1-4', 'rec1-5', 'rec1-3'],
                      'fld1-3': ['rec1-3', 'rec1-1'],
                    },
                    commentCount: 0,
                  },
                  'rec1-2': {
                    id: 'rec1-2',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec1-4', 'rec1-5'], 'fld1-3': ['rec1-1'] },
                    commentCount: 0,
                  },
                  'rec1-3': {
                    id: 'rec1-3',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
                    commentCount: 0,
                  },
                  'rec1-4': {
                    id: 'rec1-4',
                    data: {
                      'fld1-1': [{ type: SegmentType.Text, text: 'rec 4' }],
                      'fld1-2': ['rec1-5'],
                      'fld1-3': ['rec1-2', 'rec1-1', 'rec1-3', 'rec1-4', 'rec1-5'],
                    },
                    commentCount: 0,
                  },
                  'rec1-5': {
                    id: 'rec1-5',
                    data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 5' }], 'fld1-2': ['rec1-4'] },
                    commentCount: 0,
                  },
                },
                datasheetId: 'dst1',
              } as ISnapshot,
              permissions: {
                editable: true,
              },
            } as any) as IDatasheetState,
          },
        } as any) as IDatasheetMap,
      } as any) as IReduxState;

      const result = checkLinkConsistency(mockState);
      expect(result).toStrictEqual({
        mainDstId: 'dst1',
        missingRecords: new Map([
          [
            'dst1',
            new Map([
              ['rec1-5:fld1-3', new Set(['rec1-1', 'rec1-2', 'rec1-4'])],
              ['rec1-3:fld1-3', new Set(['rec1-1'])],
              ['rec1-3:fld1-2', new Set(['rec1-1', 'rec1-4'])],
              ['rec1-1:fld1-2', new Set(['rec1-2'])],
              ['rec1-4:fld1-2', new Set(['rec1-4'])],
            ]),
          ],
        ]),
      } as ILinkConsistencyError);
    });
  });
});
