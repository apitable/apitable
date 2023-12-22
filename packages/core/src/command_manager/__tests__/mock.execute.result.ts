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

import { ExecuteResult, ExecuteType, ICollaCommandExecuteSuccessResult } from 'command_manager/types';
import { IJOTAction, ILocalChangeset, IOperation, OTActionName } from 'engine';
import { IResourceOpsCollect } from 'command_manager/command_manager';
import { IComments } from 'modules/database/store/interfaces/resource/datasheet/datasheet';
import { ICellValue } from 'model/record';
import { FieldType, ResourceType } from 'types';

export const mockOperationOfAddOneDefaultRecordInDst1 = (recordId: string): IOperation => ({
  cmd: 'AddRecords',
  actions: [
    {
      li: {
        recordId,
      },
      n: OTActionName.ListInsert,
      p: ['meta', 'views', 0, 'rows', 0],
    },
    {
      li: {
        recordId,
      },
      n: OTActionName.ListInsert,
      p: ['meta', 'views', 1, 'rows', 3],
    },
    {
      n: OTActionName.ObjectInsert,
      oi: {
        commentCount: 0,
        comments: [],
        data: {
          fld2: ['opt2', 'opt1'],
        },
        id: recordId,
        recordMeta: {},
      },
      p: ['recordMap', recordId],
    },
  ],
  fieldTypeMap: {
    fld2: FieldType.MultiSelect,
  },
});

export const mockOpsCollectsOfAddOneDefaultRecordInDst1 = (recordId: string): IResourceOpsCollect[] => [
  {
    operations: [mockOperationOfAddOneDefaultRecordInDst1(recordId)],
    resourceId: 'dst1',
    resourceType: 0,
  },
];

export const mockResultOfAddOneDefaultRecordInDst1 = (recordId: string): ICollaCommandExecuteSuccessResult => ({
  resourceId: 'dst1',
  resourceType: ResourceType.Datasheet,
  result: ExecuteResult.Success,
  data: [recordId],
  operation: mockOperationOfAddOneDefaultRecordInDst1(recordId),
  linkedActions: [],
  executeType: ExecuteType.Execute,
  resourceOpsCollects: mockOpsCollectsOfAddOneDefaultRecordInDst1(recordId),
});

export const mockChangesetsOfAddOneDefaultRecordInDst1 = (recordId: string): ILocalChangeset[] =>
  mockOpsCollectsOfAddOneDefaultRecordInDst1(recordId).map(ops => ({
    baseRevision: 1,
    messageId: 'x',
    resourceId: 'dst1',
    resourceType: ResourceType.Datasheet,
    operations: ops.operations,
  }));

export const mockAddOneRecordResult = (
  dstId: string,
  recordId: string,
  cellValues: { [fieldId: string]: ICellValue },
  actions: IJOTAction[] = [],
) => {
  const operation: IOperation = {
    cmd: 'AddRecords',
    actions: [
      {
        li: {
          recordId,
        },
        n: OTActionName.ListInsert,
        p: ['meta', 'views', 0, 'rows', 0],
      },
      {
        li: {
          recordId,
        },
        n: OTActionName.ListInsert,
        p: ['meta', 'views', 1, 'rows', 3],
      },
      {
        n: OTActionName.ObjectInsert,
        oi: {
          commentCount: 0,
          comments: [],
          data: cellValues,
          id: recordId,
          recordMeta: {},
        },
        p: ['recordMap', recordId],
      },
      ...actions,
    ],
    fieldTypeMap: {
      fld2: FieldType.MultiSelect,
      fld3: FieldType.Member,
    },
  };
  return {
    resourceId: dstId,
    resourceType: ResourceType.Datasheet,
    result: ExecuteResult.Success,
    data: [recordId],
    operation,
    linkedActions: [],
    executeType: ExecuteType.Execute,
    resourceOpsCollects: [
      {
        operations: [operation],
        resourceId: dstId,
        resourceType: ResourceType.Datasheet,
      },
    ],
  };
};

export const mockLinkedOperationsOfDeleteLinkFieldInDst2: IOperation[] = [
  {
    actions: [
      {
        ld: {
          fieldId: 'fld3-2',
        },
        n: OTActionName.ListDelete,
        p: ['meta', 'views', 0, 'columns', 1],
      },
      {
        n: OTActionName.ObjectDelete,
        od: {
          id: 'fld3-2',
          name: '3 my field 2',
          property: {
            brotherFieldId: 'fld2-2',
            foreignDatasheetId: 'dst2',
          },
          type: 7,
        },
        p: ['meta', 'fieldMap', 'fld3-2'],
      },
    ],
    cmd: 'DeleteField',
    mainLinkDstId: 'dst2',
  },
];

const mockOperationOfDeleteLinkFieldInDst2: IOperation = {
  cmd: 'DeleteField',
  actions: [
    {
      n: OTActionName.ObjectDelete,
      od: [],
      p: ['recordMap', 'rec2-1', 'data', 'fld2-2'],
    },
    {
      n: OTActionName.ObjectDelete,
      od: ['rec3-1'],
      p: ['recordMap', 'rec2-2', 'data', 'fld2-2'],
    },
    {
      ld: {
        fieldId: 'fld2-2',
      },
      n: OTActionName.ListDelete,
      p: ['meta', 'views', 0, 'columns', 1],
    },
    {
      n: OTActionName.ObjectDelete,
      od: {
        id: 'fld2-2',
        name: 'Field 2',
        property: {
          brotherFieldId: 'fld3-2',
          foreignDatasheetId: 'dst3',
        },
        type: FieldType.Link,
      },
      p: ['meta', 'fieldMap', 'fld2-2'],
    },
  ],
};

export const mockOpsCollectsOfDeleteLinkFieldInDst2: IResourceOpsCollect[] = [
  {
    operations: [{ ...mockOperationOfDeleteLinkFieldInDst2, mainLinkDstId: 'dst2' }],
    resourceId: 'dst2',
    resourceType: ResourceType.Datasheet,
  },
  {
    operations: mockLinkedOperationsOfDeleteLinkFieldInDst2,
    resourceId: 'dst3',
    resourceType: ResourceType.Datasheet,
  },
];

export const mockResultOfDeleteLinkFieldInDst2: ICollaCommandExecuteSuccessResult = {
  resourceId: 'dst2',
  resourceType: ResourceType.Datasheet,
  result: ExecuteResult.Success,
  data: undefined,
  operation: mockOperationOfDeleteLinkFieldInDst2,
  linkedActions: mockLinkedOperationsOfDeleteLinkFieldInDst2.map(op => ({
    actions: op.actions,
    datasheetId: 'dst3',
  })),
  executeType: ExecuteType.Execute,
  resourceOpsCollects: mockOpsCollectsOfDeleteLinkFieldInDst2,
};

export const mockChangesetsOfDeleteLinkFieldInDst2: ILocalChangeset[] = [
  {
    baseRevision: 2,
    messageId: 'x',
    resourceId: 'dst2',
    resourceType: ResourceType.Datasheet,
    operations: mockOpsCollectsOfDeleteLinkFieldInDst2[0]!.operations,
  },
  {
    baseRevision: 3,
    messageId: 'x',
    resourceId: 'dst3',
    resourceType: ResourceType.Datasheet,
    operations: mockOpsCollectsOfDeleteLinkFieldInDst2[1]!.operations,
  },
];

export const mockAddOneCommentResult = (dstId: string, recordId: string, comment: IComments) => {
  const operation: IOperation = {
    cmd: 'UpdateComment',
    actions: [
      {
        n: OTActionName.ListInsert,
        p: ['recordMap', recordId, 'comments', 'emojis'],
        li: comment,
      },
    ],
  };
  return {
    resourceId: dstId,
    resourceType: ResourceType.Datasheet,
    result: ExecuteResult.Success,
    data: undefined,
    operation,
    linkedActions: [],
    executeType: ExecuteType.Execute,
    resourceOpsCollects: [
      {
        operations: [operation],
        resourceId: dstId,
        resourceType: ResourceType.Datasheet,
      },
    ],
  };
};
