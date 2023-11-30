import { CollaCommandName } from 'commands/enum';
import { IOperation, OTActionName } from 'engine';
import { IDatasheetMap, IDatasheetState, IPageParams, IReduxState, ISnapshot } from 'exports/store/interfaces';
import { ViewType } from 'modules/shared/store/constants';

import { FieldType, ResourceType, SegmentType } from 'types';
import { ILinkConsistencyError, checkLinkConsistency, generateFixLinkConsistencyChangesets } from 'utils/link_consistency';

const mockStateLinkDeletedRecordsAndMissingRecordIdsInBothDatasheets: IReduxState = ({
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
        name: 'Dst 1',
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
              data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld1-2': ['rec2-2', 'rec2-10'] },
              commentCount: 0,
            },
            'rec1-3': {
              id: 'rec1-3',
              data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }] },
              commentCount: 0,
            },
            'rec1-4': {
              id: 'rec1-4',
              data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld1-2': ['rec2-2', 'rec2-1', 'rec2-7', 'rec2-3'] },
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
        name: 'Dst 2',
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
              data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1', 'rec1-3', 'rec1-37'] },
              commentCount: 0,
            },
            'rec2-3': {
              id: 'rec2-3',
              data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld2-2': ['rec1-39', 'rec1-4', 'rec1-1', 'rec1-37', 'rec1-3'] },
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
            name: 'Dst 1',
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
    const result = checkLinkConsistency(mockState, 'dst1');
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
              name: 'Dst 1',
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
              name: 'Dst 2',
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
      const result = checkLinkConsistency(mockState, 'dst2');
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
              name: 'Dst 1',
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
              name: 'Dst 2',
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
        const result = checkLinkConsistency(mockState, 'dst2');
        expect(result).toStrictEqual({
          mainDstId: 'dst1',
          mainDstName: 'Dst 1',
          errorRecordIds: new Map([
            [
              'dst2',
              new Map([
                ['rec2-1:fld2-2', { missing: new Set(['rec1-1']) }],
                ['rec2-2:fld2-2', { missing: new Set(['rec1-2', 'rec1-4']) }],
              ]),
            ],
          ]),
        } as ILinkConsistencyError);
      });

      test('missing recordIds in main datasheet', () => {
        const result = checkLinkConsistency(
          {
            ...mockState,
            pageParams: {
              datasheetId: 'dst2',
            },
          },
          'dst1',
        );
        expect(result).toStrictEqual({
          mainDstId: 'dst2',
          mainDstName: 'Dst 2',
          errorRecordIds: new Map([
            [
              'dst2',
              new Map([
                ['rec2-1:fld2-2', { missing: new Set(['rec1-1']) }],
                ['rec2-2:fld2-2', { missing: new Set(['rec1-2', 'rec1-4']) }],
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
                name: 'Dst 1',
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
                name: 'Dst 2',
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
        const result = checkLinkConsistency(mockState, 'dst2');
        expect(result).toStrictEqual({
          mainDstId: 'dst1',
          mainDstName: 'Dst 1',
          errorRecordIds: new Map([
            [
              'dst2',
              new Map([
                ['rec2-1:fld2-2', { missing: new Set(['rec1-1']) }],
                ['rec2-2:fld2-2', { missing: new Set(['rec1-2', 'rec1-4']) }],
              ]),
            ],
            [
              'dst1',
              new Map([
                ['rec1-3:fld1-2', { missing: new Set(['rec2-2', 'rec2-3']) }],
                ['rec1-1:fld1-2', { missing: new Set(['rec2-3']) }],
              ]),
            ],
          ]),
        } as ILinkConsistencyError);
      });

      describe('no edit permission', () => {
        test('no edit permission of main datasheet', () => {
          const result = checkLinkConsistency(
            {
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
            },
            'dst2',
          );
          expect(result).toStrictEqual(undefined);
        });

        test('no edit permission of foreign datasheet', () => {
          const result = checkLinkConsistency(
            {
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
            },
            'dst2',
          );
          expect(result).toStrictEqual(undefined);
        });
      });

      describe('isPartOfData', () => {
        test('main datasheet isPartOfData', () => {
          const result = checkLinkConsistency(
            {
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
            },
            'dst2',
          );
          expect(result).toStrictEqual(undefined);
        });

        test('foreign datasheet isPartOfData', () => {
          const result = checkLinkConsistency(
            {
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
            },
            'dst2',
          );
          expect(result).toStrictEqual(undefined);
        });
      });
    });

    describe('links deleted records', () => {
      const result = checkLinkConsistency(mockStateLinkDeletedRecordsAndMissingRecordIdsInBothDatasheets, 'dst2');
      expect(result).toStrictEqual({
        mainDstId: 'dst1',
        mainDstName: 'Dst 1',
        errorRecordIds: new Map([
          [
            'dst2',
            new Map([
              ['rec2-1:fld2-2', { missing: new Set(['rec1-1']) }],
              ['rec2-2:fld2-2', { missing: new Set(['rec1-2', 'rec1-4']), redundant: new Set(['rec1-37']) }],
              ['rec2-3:fld2-2', { redundant: new Set(['rec1-39', 'rec1-37']) }],
            ]),
          ],
          [
            'dst1',
            new Map([
              ['rec1-3:fld1-2', { missing: new Set(['rec2-2', 'rec2-3']) }],
              ['rec1-2:fld1-2', { redundant: new Set(['rec2-10']) }],
              ['rec1-1:fld1-2', { missing: new Set(['rec2-3']) }],
              ['rec1-4:fld1-2', { redundant: new Set(['rec2-7']) }],
            ]),
          ],
        ]),
      } as ILinkConsistencyError);
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
              name: 'Dst 1',
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
              name: 'Dst 2',
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
                    // Doesn't check uni-directional links that are unrelated to main datasheet
                    'fld2-4': {
                      id: 'fld2-4',
                      name: 'field 4',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst3',
                        brotherFieldId: 'fld3-4',
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
                    data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 3' }], 'fld2-4': ['rec3-2', 'rec3-8'] },
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
                    'fld3-4': {
                      id: 'fld3-4',
                      name: 'field 4',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst2',
                        brotherFieldId: 'fld2-4',
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

      const result = checkLinkConsistency(mockState, 'dst3');
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
              name: 'Dst 1',
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
              name: 'Dst 2',
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

      const result = checkLinkConsistency(mockState, 'dst3');
      expect(result).toStrictEqual({
        mainDstId: 'dst1',
        mainDstName: 'Dst 1',
        errorRecordIds: new Map([
          [
            'dst2',
            new Map([
              ['rec2-2:fld2-2', { missing: new Set(['rec1-4']) }],
              ['rec2-3:fld2-2', { missing: new Set(['rec1-4']) }],
            ]),
          ],
          [
            'dst1',
            new Map([
              ['rec1-3:fld1-2', { missing: new Set(['rec2-3']) }],
              ['rec1-1:fld1-2', { missing: new Set(['rec2-4']) }],
              ['rec1-1:fld1-3', { missing: new Set(['rec3-3']) }],
            ]),
          ],
          [
            'dst3',
            new Map([
              ['rec3-1:fld3-2', { missing: new Set(['rec1-2', 'rec1-4']) }],
              ['rec3-2:fld3-2', { missing: new Set(['rec1-2']) }],
            ]),
          ],
        ]),
      } as ILinkConsistencyError);
    });
  });
});

describe('generateFixLinkConsistencyChangesets', () => {
  test('missing & redundant recordIds changesets', () => {
    const state = mockStateLinkDeletedRecordsAndMissingRecordIdsInBothDatasheets;
    const error = checkLinkConsistency(state, 'dst2');
    expect(error).toBeTruthy();
    const changesets = generateFixLinkConsistencyChangesets(error!, state);
    expect(changesets).toStrictEqual([
      {
        resourceId: 'dst2',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectReplace,
                od: ['rec1-4'],
                oi: ['rec1-4', 'rec1-1'],
                p: ['recordMap', 'rec2-1', 'data', 'fld2-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec1-1', 'rec1-3', 'rec1-37'],
                oi: ['rec1-1', 'rec1-3', 'rec1-2', 'rec1-4'],
                p: ['recordMap', 'rec2-2', 'data', 'fld2-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec1-39', 'rec1-4', 'rec1-1', 'rec1-37', 'rec1-3'],
                oi: ['rec1-4', 'rec1-1', 'rec1-3'],
                p: ['recordMap', 'rec2-3', 'data', 'fld2-2'],
              },
            ],
          },
        ] as IOperation[],
      },
      {
        resourceId: 'dst1',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectReplace,
                od: ['rec2-2', 'rec2-10'],
                oi: ['rec2-2'],
                p: ['recordMap', 'rec1-2', 'data', 'fld1-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec2-2', 'rec2-1', 'rec2-7', 'rec2-3'],
                oi: ['rec2-2', 'rec2-1', 'rec2-3'],
                p: ['recordMap', 'rec1-4', 'data', 'fld1-2'],
              },
              {
                n: OTActionName.ObjectInsert,
                oi: ['rec2-2', 'rec2-3'],
                p: ['recordMap', 'rec1-3', 'data', 'fld1-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec2-1', 'rec2-2'],
                oi: ['rec2-1', 'rec2-2', 'rec2-3'],
                p: ['recordMap', 'rec1-1', 'data', 'fld1-2'],
              },
            ],
          },
        ] as IOperation[],
      },
    ]);
  });

  test('changesets contain oi & od', () => {
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
            name: 'Dst 1',
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
                    rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }],
                    frozenColumnCount: 1,
                  },
                ],
              },
              recordMap: {
                'rec1-1': {
                  id: 'rec1-1',
                  data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec2-2'] },
                  commentCount: 0,
                },
                'rec1-2': {
                  id: 'rec1-2',
                  data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }] },
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
            name: 'Dst 2',
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
                  data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld2-2': ['rec1-4', 'rec1-7'] },
                  commentCount: 0,
                },
                'rec2-2': {
                  id: 'rec2-2',
                  data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1', 'rec1-2'] },
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
    const error = checkLinkConsistency(mockState, 'dst2');
    expect(error).toBeTruthy();
    const changesets = generateFixLinkConsistencyChangesets(error!, mockState);
    expect(changesets).toStrictEqual([
      {
        resourceId: 'dst2',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectDelete,
                od: ['rec1-4', 'rec1-7'],
                p: ['recordMap', 'rec2-1', 'data', 'fld2-2'],
              },
            ],
          },
        ] as IOperation[],
      },
      {
        resourceId: 'dst1',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectInsert,
                oi: ['rec2-2'],
                p: ['recordMap', 'rec1-2', 'data', 'fld1-2'],
              },
            ],
          },
        ] as IOperation[],
      },
    ]);
  });
});

describe('generateFixLinkConsistencyChangesets', () => {
  test('missing & redundant recordIds changesets', () => {
    const state = mockStateLinkDeletedRecordsAndMissingRecordIdsInBothDatasheets;
    const error = checkLinkConsistency(state, 'dst2');
    expect(error).toBeTruthy();
    const changesets = generateFixLinkConsistencyChangesets(error!, state);
    expect(changesets).toStrictEqual([
      {
        resourceId: 'dst2',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectReplace,
                od: ['rec1-4'],
                oi: ['rec1-4', 'rec1-1'],
                p: ['recordMap', 'rec2-1', 'data', 'fld2-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec1-1', 'rec1-3', 'rec1-37'],
                oi: ['rec1-1', 'rec1-3', 'rec1-2', 'rec1-4'],
                p: ['recordMap', 'rec2-2', 'data', 'fld2-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec1-39', 'rec1-4', 'rec1-1', 'rec1-37', 'rec1-3'],
                oi: ['rec1-4', 'rec1-1', 'rec1-3'],
                p: ['recordMap', 'rec2-3', 'data', 'fld2-2'],
              },
            ],
          },
        ] as IOperation[],
      },
      {
        resourceId: 'dst1',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectReplace,
                od: ['rec2-2', 'rec2-10'],
                oi: ['rec2-2'],
                p: ['recordMap', 'rec1-2', 'data', 'fld1-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec2-2', 'rec2-1', 'rec2-7', 'rec2-3'],
                oi: ['rec2-2', 'rec2-1', 'rec2-3'],
                p: ['recordMap', 'rec1-4', 'data', 'fld1-2'],
              },
              {
                n: OTActionName.ObjectInsert,
                oi: ['rec2-2', 'rec2-3'],
                p: ['recordMap', 'rec1-3', 'data', 'fld1-2'],
              },
              {
                n: OTActionName.ObjectReplace,
                od: ['rec2-1', 'rec2-2'],
                oi: ['rec2-1', 'rec2-2', 'rec2-3'],
                p: ['recordMap', 'rec1-1', 'data', 'fld1-2'],
              },
            ],
          },
        ] as IOperation[],
      },
    ]);
  });

  test('changesets contain oi & od', () => {
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
            name: 'Dst 1',
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
                    rows: [{ recordId: 'rec1-1' }, { recordId: 'rec1-2' }],
                    frozenColumnCount: 1,
                  },
                ],
              },
              recordMap: {
                'rec1-1': {
                  id: 'rec1-1',
                  data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld1-2': ['rec2-2'] },
                  commentCount: 0,
                },
                'rec1-2': {
                  id: 'rec1-2',
                  data: { 'fld1-1': [{ type: SegmentType.Text, text: 'rec 2' }] },
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
            name: 'Dst 2',
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
                  data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 1' }], 'fld2-2': ['rec1-4', 'rec1-7'] },
                  commentCount: 0,
                },
                'rec2-2': {
                  id: 'rec2-2',
                  data: { 'fld2-1': [{ type: SegmentType.Text, text: 'rec 2' }], 'fld2-2': ['rec1-1', 'rec1-2'] },
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
    const error = checkLinkConsistency(mockState, 'dst2');
    expect(error).toBeTruthy();
    const changesets = generateFixLinkConsistencyChangesets(error!, mockState);
    expect(changesets).toStrictEqual([
      {
        resourceId: 'dst2',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectDelete,
                od: ['rec1-4', 'rec1-7'],
                p: ['recordMap', 'rec2-1', 'data', 'fld2-2'],
              },
            ],
          },
        ] as IOperation[],
      },
      {
        resourceId: 'dst1',
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions: [
              {
                n: OTActionName.ObjectInsert,
                oi: ['rec2-2'],
                p: ['recordMap', 'rec1-2', 'data', 'fld1-2'],
              },
            ],
          },
        ] as IOperation[],
      },
    ]);
  });
});
