import { FieldType, IFieldMap, OTActionName, ResourceType, SegmentType } from '@apitable/core';
import { omit } from 'lodash';
import { OtException, ServerException } from 'shared/exception';
import { OtService } from '../ot.service';

const mockFieldMap: IFieldMap = {
  'fld2-1': {
    id: 'fld2-1',
    name: 'Dst 2 Field 1',
    type: FieldType.Link,
    property: {
      foreignDatasheetId: 'dst1',
    },
  },
  'fld2-2': {
    id: 'fld2-2',
    name: 'Dst 2 Field 2',
    type: FieldType.MultiSelect,
    property: {
      options: [
        {
          id: 'opt1',
          name: 'Option 1',
          color: 0,
        },
        {
          id: 'opt2',
          name: 'Option 2',
          color: 1,
        },
        {
          id: 'opt3',
          name: 'Option 3',
          color: 2,
        },
        {
          id: 'opt4',
          name: 'Option 4',
          color: 3,
        },
      ],
    },
  },
};

describe('transformLocalChangeset', () => {
  describe('transform simulaneous magic-link cell edits', () => {
    test('oi-oi', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectInsert,
                  oi: ['rec1-1'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectInsert,
            oi: ['rec1-2'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('oi-oi server has many actions', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectInsert,
                  oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectInsert,
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5'],
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-12', 'rec1-15', 'rec1-16', 'rec1-18'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('oi- server actions cancelled out', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectInsert,
                  oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectInsert,
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5'],
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-12', 'rec1-15', 'rec1-16', 'rec1-18'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectDelete,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-12', 'rec1-15', 'rec1-16', 'rec1-18'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('or-or', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['rec1-1'],
                  oi: ['rec1-1', 'rec1-3'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1'],
            oi: ['rec1-1', 'rec1-2'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('transform irrelevant link cell edit', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['rec1-1'],
                  oi: ['rec1-1', 'rec1-3'],
                  p: ['recordMap', 'rec2-11', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['opt1', 'opt2'],
                  oi: ['opt3', 'opt1', 'opt2'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-2'],
                },
              ],
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1'],
            oi: ['rec1-1', 'rec1-2'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['opt2'],
            oi: ['opt3', 'opt1'],
            p: ['recordMap', 'rec2-11', 'data', 'fld2-2'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('or-or client irrelevant cell edit, server link field type change', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['opt1', 'opt2'],
                  oi: ['opt3', 'opt1', 'opt2'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-2'],
                },
                {
                  n: OTActionName.ObjectReplace,
                  od: ['opt2'],
                  oi: ['opt1', 'opt2'],
                  p: ['recordMap', 'rec2-11', 'data', 'fld2-2'],
                },
              ],
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            od: {
              id: 'fld2-1',
              name: 'Dst 2 Field 1',
              type: FieldType.Link,
              property: {
                foreignDatasheetId: 'dst1',
              },
            },
            oi: {
              id: 'fld2-1',
              name: 'Dst 2 Field 1',
              type: FieldType.SingleText,
              property: {},
            },
            p: ['meta', 'fieldMap', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['opt2'],
            oi: ['opt3', 'opt1'],
            p: ['recordMap', 'rec2-11', 'data', 'fld2-1'],
          },
        ],
        10,
        {
          'fld2-1': {
            id: 'fld2-1',
            name: 'Dst 2 Field 1',
            type: FieldType.SingleText,
            property: {},
          },
        },
      );
      expect(changeset).toMatchSnapshot();
    });

    test('transform irrelevant non-link cell edit', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['opt1', 'opt2'],
                  oi: ['opt3', 'opt1', 'opt2'],
                  p: ['recordMap', 'rec2-11', 'data', 'fld2-2'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectInsert,
                  oi: ['opt2', 'opt3'],
                  p: ['recordMap', 'rec2-12', 'data', 'fld2-2'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectDelete,
                  od: ['opt3'],
                  p: ['recordMap', 'rec2-13', 'data', 'fld2-2'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectInsert,
            oi: ['rec1-1', 'rec1-2'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1'],
            oi: ['rec1-2', 'rec1-1'],
            p: ['recordMap', 'rec2-11', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectDelete,
            od: ['rec1-4'],
            p: ['recordMap', 'rec2-12', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('or-or server has many actions', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                  oi: ['rec1-1', 'rec1-3', 'rec1-5', 'rec1-18', 'rec1-8', 'rec1-10', 'rec1-6', 'rec1-12'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
            oi: ['rec1-15', 'rec1-1', 'rec1-4', 'rec1-5', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10', 'rec1-17', 'rec1-18', 'rec1-19'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-15', 'rec1-1', 'rec1-4', 'rec1-5', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10', 'rec1-17', 'rec1-18', 'rec1-19'],
            oi: ['rec1-1', 'rec1-3', 'rec1-4', 'rec1-7', 'rec1-18', 'rec1-9', 'rec1-10', 'rec1-17'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('or- server actions cancelled out', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                  oi: ['rec1-1', 'rec1-3', 'rec1-5', 'rec1-18', 'rec1-8', 'rec1-10', 'rec1-6', 'rec1-12'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-15', 'rec1-16', 'rec1-7', 'rec1-18'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-15', 'rec1-16', 'rec1-7', 'rec1-18'],
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-14', 'rec1-35', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-14', 'rec1-35', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('or- server action field type changes cancelled out', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                  oi: ['rec1-1', 'rec1-3', 'rec1-17', 'rec1-5', 'rec1-12', 'rec1-14'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            od: {
              id: 'fld2-1',
              name: 'Dst 2 Field 1',
              type: FieldType.Link,
              property: {
                foreignDatasheetId: 'dst1',
              },
            },
            oi: {
              id: 'fld2-1',
              name: 'Dst 2 Field 1',
              type: FieldType.SingleText,
              property: {},
            },
            p: ['meta', 'fieldMap', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
            oi: [{ type: SegmentType.Text, text: 't1, t2, t3, t4, t5, t6, t7, t8, t9, t10' }],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: {
              id: 'fld2-1',
              name: 'Dst 2 Field 1',
              type: FieldType.SingleText,
              property: {},
            },
            oi: {
              id: 'fld2-1',
              name: 'Dst 2 Field 1',
              type: FieldType.Link,
              property: {
                foreignDatasheetId: 'dst1',
              },
            },
            p: ['meta', 'fieldMap', 'fld2-1'],
          },
          {
            n: OTActionName.ObjectReplace,
            od: [{ type: SegmentType.Text, text: 't1, t2, t3, t4, t5, t6, t7, t8, t9, t10' }],
            oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('or-od', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectReplace,
                  od: ['rec1-2'],
                  oi: ['rec1-2', 'rec1-3'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectDelete,
            od: ['rec1-2'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('od-or', () => {
      const changeset = OtService.transformLocalChangeset(
        {
          messageId: 'msg1',
          resourceType: ResourceType.Datasheet,
          resourceId: 'dst2',
          operations: [
            {
              cmd: 'SetRecords',
              actions: [
                {
                  n: OTActionName.ObjectDelete,
                  od: ['rec1-3'],
                  p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
                },
              ],
              resourceType: ResourceType.Datasheet,
            },
          ],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            od: ['rec1-3'],
            oi: ['rec1-3', 'rec1-2'],
            p: ['recordMap', 'rec2-10', 'data', 'fld2-1'],
          },
        ],
        10,
        mockFieldMap,
      );
      expect(changeset).toMatchSnapshot();
    });

    test('client field type change cause error', () => {
      expect(() =>
        OtService.transformLocalChangeset(
          {
            messageId: 'msg1',
            resourceType: ResourceType.Datasheet,
            resourceId: 'dst2',
            operations: [
              {
                cmd: 'SetFieldAttr',
                actions: [
                  {
                    n: OTActionName.ObjectReplace,
                    od: {
                      id: 'fld2-1',
                      name: 'Dst 2 Field 1',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                      },
                    },
                    oi: {
                      id: 'fld2-1',
                      name: 'Dst 2 Field 1',
                      type: FieldType.SingleText,
                      property: {},
                    },
                    p: ['meta', 'fieldMap', 'fld2-1'],
                  },
                  {
                    n: OTActionName.ObjectReplace,
                    od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                    oi: [{ type: SegmentType.Text, text: 't1, t2, t3, t4, t5, t6, t7, t8, t9, t10' }],
                    p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
                  },
                ],
                resourceType: ResourceType.Datasheet,
              },
            ],
          },
          [
            {
              n: OTActionName.ObjectReplace,
              od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
              oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4'],
              p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
            },
          ],
          0,
          mockFieldMap,
        ),
      ).toThrowError(new ServerException(OtException.OPERATION_CONFLICT));
    });

    test('client field deletion cause error', () => {
      expect(() =>
        OtService.transformLocalChangeset(
          {
            messageId: 'msg1',
            resourceType: ResourceType.Datasheet,
            resourceId: 'dst2',
            operations: [
              {
                cmd: 'SetFieldAttr',
                actions: [
                  {
                    n: OTActionName.ObjectDelete,
                    od: {
                      id: 'fld2-1',
                      name: 'Dst 2 Field 1',
                      type: FieldType.Link,
                      property: {
                        foreignDatasheetId: 'dst1',
                      },
                    },
                    p: ['meta', 'fieldMap', 'fld2-1'],
                  },
                  {
                    n: OTActionName.ObjectDelete,
                    od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                    p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
                  },
                ],
                resourceType: ResourceType.Datasheet,
              },
            ],
          },
          [
            {
              n: OTActionName.ObjectReplace,
              od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
              oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4'],
              p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
            },
          ],
          0,
          mockFieldMap,
        ),
      ).toThrowError(new ServerException(OtException.OPERATION_CONFLICT));
    });

    test('server field type change cause error', () => {
      expect(() =>
        OtService.transformLocalChangeset(
          {
            messageId: 'msg1',
            resourceType: ResourceType.Datasheet,
            resourceId: 'dst2',
            operations: [
              {
                cmd: 'SetRecords',
                actions: [
                  {
                    n: OTActionName.ObjectReplace,
                    od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                    oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4'],
                    p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
                  },
                ],
                resourceType: ResourceType.Datasheet,
              },
            ],
          },
          [
            {
              n: OTActionName.ObjectReplace,
              od: {
                id: 'fld2-1',
                name: 'Dst 2 Field 1',
                type: FieldType.Link,
                property: {
                  foreignDatasheetId: 'dst1',
                },
              },
              oi: {
                id: 'fld2-1',
                name: 'Dst 2 Field 1',
                type: FieldType.SingleText,
                property: {},
              },
              p: ['meta', 'fieldMap', 'fld2-1'],
            },
            {
              n: OTActionName.ObjectReplace,
              od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
              oi: [{ type: SegmentType.Text, text: 't1, t2, t3, t4, t5, t6, t7, t8, t9, t10' }],
              p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
            },
          ],
          0,
          omit(mockFieldMap, 'fld2-1'),
        ),
      ).toThrowError(new ServerException(OtException.OPERATION_CONFLICT));
    });

    test('server field deletion cause error', () => {
      expect(() =>
        OtService.transformLocalChangeset(
          {
            messageId: 'msg1',
            resourceType: ResourceType.Datasheet,
            resourceId: 'dst2',
            operations: [
              {
                cmd: 'SetRecords',
                actions: [
                  {
                    n: OTActionName.ObjectReplace,
                    od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
                    oi: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4'],
                    p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
                  },
                ],
                resourceType: ResourceType.Datasheet,
              },
            ],
          },
          [
            {
              n: OTActionName.ObjectDelete,
              od: {
                id: 'fld2-1',
                name: 'Dst 2 Field 1',
                type: FieldType.Link,
                property: {
                  foreignDatasheetId: 'dst1',
                },
              },
              p: ['meta', 'fieldMap', 'fld2-1'],
            },
            {
              n: OTActionName.ObjectDelete,
              od: ['rec1-1', 'rec1-2', 'rec1-3', 'rec1-4', 'rec1-5', 'rec1-6', 'rec1-7', 'rec1-8', 'rec1-9', 'rec1-10'],
              p: ['recordMap', 'rec2-1', 'data', 'fld2-1'],
            },
          ],
          0,
          {},
        ),
      ).toThrowError(new ServerException(OtException.OPERATION_CONFLICT));
    });
  });
});

describe('transformLinkCellAction', () => {
  test('oi-oi has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectInsert,
        oi: ['rec1', 'rec3', 'rec13', 'rec4'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectInsert,
        oi: ['rec3', 'rec13', 'rec9', 'rec12', 'rec4'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec3', 'rec13', 'rec9', 'rec12', 'rec4'],
      oi: ['rec3', 'rec13', 'rec9', 'rec12', 'rec4', 'rec1'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('oi-oi no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectInsert,
        oi: ['rec1', 'rec3', 'rec13', 'rec4'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectInsert,
        oi: ['rec7', 'rec2'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec7', 'rec2'],
      oi: ['rec7', 'rec2', 'rec1', 'rec3', 'rec13', 'rec4'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('oi-oi identical', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectInsert,
        oi: ['rec1', 'rec3', 'rec13', 'rec4'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectInsert,
        oi: ['rec1', 'rec3', 'rec13', 'rec4'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('or-od has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec20', 'rec6', 'rec2', 'rec17', 'rec13', 'rec9', 'rec5', 'rec7', 'rec8'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectDelete,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectInsert,
      oi: ['rec20', 'rec17', 'rec13'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-od no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec20', 'rec13', 'rec17', 'rec12'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectDelete,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectInsert,
      oi: ['rec20', 'rec13', 'rec17', 'rec12'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-od or order changes', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec4', 'rec1', 'rec2', 'rec5', 'rec9', 'rec3', 'rec8', 'rec6', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectDelete,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('od-or has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectDelete,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec20', 'rec6', 'rec2', 'rec17', 'rec13', 'rec9', 'rec5', 'rec7', 'rec8'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec20', 'rec6', 'rec2', 'rec17', 'rec13', 'rec9', 'rec5', 'rec7', 'rec8'],
      oi: ['rec20', 'rec17', 'rec13'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('od-or no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectDelete,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec20', 'rec13', 'rec17', 'rec12'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('od-or no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectDelete,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec20', 'rec13', 'rec17', 'rec12'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('od-or or order changes', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectDelete,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec4', 'rec1', 'rec2', 'rec5', 'rec9', 'rec3', 'rec8', 'rec6', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectDelete,
      od: ['rec7', 'rec4', 'rec1', 'rec2', 'rec5', 'rec9', 'rec3', 'rec8', 'rec6', 'rec10'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec17', 'rec14', 'rec11', 'rec15', 'rec13', 'rec16'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26'],
      oi: ['rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26', 'rec17', 'rec14', 'rec11', 'rec15', 'rec13', 'rec16'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or client has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec17', 'rec6', 'rec11', 'rec5', 'rec13', 'rec16'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26'],
      oi: ['rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26', 'rec17', 'rec11', 'rec13', 'rec16'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or server has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec17', 'rec6', 'rec11', 'rec5', 'rec13', 'rec16'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec17', 'rec6', 'rec11', 'rec5', 'rec13', 'rec16'],
      oi: ['rec17', 'rec11', 'rec13', 'rec16', 'rec27', 'rec24', 'rec21', 'rec25', 'rec23', 'rec26'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or both has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec4', 'rec21', 'rec5', 'rec23', 'rec6', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec17', 'rec6', 'rec11', 'rec5', 'rec13', 'rec16', 'rec4'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec17', 'rec6', 'rec11', 'rec5', 'rec13', 'rec16', 'rec4'],
      oi: ['rec4', 'rec5', 'rec6', 'rec17', 'rec11', 'rec13', 'rec16', 'rec21', 'rec23', 'rec26'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or added has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec4', 'rec21', 'rec5', 'rec23', 'rec6', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec23', 'rec6', 'rec21', 'rec5', 'rec13', 'rec16', 'rec4'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec23', 'rec6', 'rec21', 'rec5', 'rec13', 'rec16', 'rec4'],
      oi: ['rec4', 'rec5', 'rec6', 'rec23', 'rec21', 'rec13', 'rec16', 'rec26'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or identical', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec4', 'rec21', 'rec5', 'rec23', 'rec6', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec4', 'rec21', 'rec5', 'rec23', 'rec6', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('or-or different order', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec4', 'rec21', 'rec5', 'rec23', 'rec6', 'rec26'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec21', 'rec6', 'rec5', 'rec7', 'rec26', 'rec4', 'rec23'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('or-or deleted no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec2', 'rec12', 'rec17', 'rec4', 'rec13', 'rec6', 'rec16', 'rec8', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec5', 'rec24', 'rec3', 'rec26', 'rec25', 'rec1', 'rec7', 'rec28'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec5', 'rec24', 'rec3', 'rec26', 'rec25', 'rec1', 'rec7', 'rec28'],
      oi: ['rec24', 'rec26', 'rec25', 'rec28', 'rec12', 'rec17', 'rec13', 'rec16'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or deleted has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec2', 'rec12', 'rec17', 'rec4', 'rec13', 'rec6', 'rec16', 'rec8', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec24', 'rec3', 'rec26', 'rec25', 'rec28', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec24', 'rec3', 'rec26', 'rec25', 'rec28', 'rec10'],
      oi: ['rec10', 'rec24', 'rec26', 'rec25', 'rec28', 'rec12', 'rec17', 'rec13', 'rec16'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or unchanged no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec8', 'rec12', 'rec17', 'rec5', 'rec13', 'rec16', 'rec3', 'rec6'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec24', 'rec4', 'rec26', 'rec25', 'rec2', 'rec9', 'rec28'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec7', 'rec24', 'rec4', 'rec26', 'rec25', 'rec2', 'rec9', 'rec28'],
      oi: ['rec24', 'rec26', 'rec25', 'rec28', 'rec12', 'rec17', 'rec13', 'rec16'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or unchanged has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec8', 'rec12', 'rec17', 'rec5', 'rec13', 'rec16', 'rec3', 'rec6'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec24', 'rec8', 'rec26', 'rec25', 'rec3', 'rec9', 'rec28'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec7', 'rec24', 'rec8', 'rec26', 'rec25', 'rec3', 'rec9', 'rec28'],
      oi: ['rec3', 'rec8', 'rec24', 'rec26', 'rec25', 'rec28', 'rec12', 'rec17', 'rec13', 'rec16'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or no deleted, no intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec2', 'rec3', 'rec17', 'rec4', 'rec5', 'rec6', 'rec7', 'rec12', 'rec8', 'rec9', 'rec10', 'rec13'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec22', 'rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec27', 'rec25', 'rec29', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec22', 'rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec27', 'rec25', 'rec29', 'rec10'],
      oi: [
        'rec1',
        'rec2',
        'rec3',
        'rec4',
        'rec5',
        'rec6',
        'rec7',
        'rec8',
        'rec9',
        'rec10',
        'rec22',
        'rec27',
        'rec25',
        'rec29',
        'rec17',
        'rec12',
        'rec13',
      ],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or no deleted, has intersection', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec2', 'rec3', 'rec17', 'rec4', 'rec5', 'rec6', 'rec16', 'rec7', 'rec12', 'rec8', 'rec9', 'rec10', 'rec13'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec22', 'rec1', 'rec2', 'rec3', 'rec16', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec17', 'rec25', 'rec12', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec22', 'rec1', 'rec2', 'rec3', 'rec16', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec17', 'rec25', 'rec12', 'rec10'],
      oi: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10', 'rec22', 'rec16', 'rec17', 'rec25', 'rec12', 'rec13'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or no deleted, no added, different order', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec7', 'rec8', 'rec1', 'rec4', 'rec6', 'rec3', 'rec2', 'rec10', 'rec9', 'rec5'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec9', 'rec6', 'rec7', 'rec3', 'rec8', 'rec5', 'rec1', 'rec10', 'rec4', 'rec2'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('or-or no deleted, added is superset', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec2', 'rec17', 'rec16', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec14', 'rec12', 'rec8', 'rec9', 'rec10', 'rec13', 'rec18'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec16', 'rec1', 'rec2', 'rec3', 'rec12', 'rec4', 'rec5', 'rec13', 'rec6', 'rec7', 'rec8', 'rec9', 'rec18', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec16', 'rec1', 'rec2', 'rec3', 'rec12', 'rec4', 'rec5', 'rec13', 'rec6', 'rec7', 'rec8', 'rec9', 'rec18', 'rec10'],
      oi: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10', 'rec16', 'rec12', 'rec13', 'rec18', 'rec17', 'rec14'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or no deleted, added is subset', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec16', 'rec1', 'rec2', 'rec3', 'rec12', 'rec4', 'rec5', 'rec13', 'rec6', 'rec7', 'rec8', 'rec9', 'rec18', 'rec10'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec2', 'rec17', 'rec16', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec14', 'rec12', 'rec8', 'rec9', 'rec10', 'rec13', 'rec18'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });

  test('or-or no added, deleted is superset', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec3', 'rec5', 'rec7'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec2', 'rec3', 'rec5', 'rec7', 'rec8'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual({
      n: OTActionName.ObjectReplace,
      od: ['rec1', 'rec2', 'rec3', 'rec5', 'rec7', 'rec8'],
      oi: ['rec1', 'rec3', 'rec5', 'rec7'],
      p: ['recordMap', 'rec1', 'data', 'fld1'],
    });
  });

  test('or-or no added, deleted is subset', () => {
    const result = OtService.transformLinkCellAction(
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec2', 'rec3', 'rec5', 'rec7', 'rec8'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
      {
        n: OTActionName.ObjectReplace,
        od: ['rec1', 'rec2', 'rec3', 'rec4', 'rec5', 'rec6', 'rec7', 'rec8', 'rec9', 'rec10'],
        oi: ['rec1', 'rec3', 'rec5', 'rec7'],
        p: ['recordMap', 'rec1', 'data', 'fld1'],
      },
    );
    expect(result).toStrictEqual(null);
  });
});
