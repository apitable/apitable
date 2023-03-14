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

import {
  CollaCommandName, consistencyCheck, Events, IJOTAction, ILinkConsistencyError, ILinkIds, IResourceOpsCollect, IUserInfo, ModalConfirmKey,
  OTActionName, Player, ResourceType, Selectors, Strings, t,
} from '@apitable/core';
import * as Sentry from '@sentry/nextjs';
import { Modal } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import posthog from 'posthog-js';
import { IModalConfirmArgs } from './interface';

let lastModalDestroy: any = null;

const fixInnerConsistency = (datasheetId: string) => {
  const actions: IJOTAction[] = [];
  const state = store.getState();
  const datasheet = Selectors.getDatasheet(state, datasheetId);
  if (!datasheet) {
    return;
  }
  const errorInfo = consistencyCheck(datasheet.snapshot);
  if (!errorInfo) {
    return;
  }

  errorInfo.forEach(data => {
    // Delete duplicate view
    if ('duplicateViews' in data) {
      data.duplicateViews.forEach((index, i) => {
        actions.push({
          n: OTActionName.ListDelete,
          p: ['meta', 'views', index - i],
          ld: datasheet.snapshot.meta.views[index],
        });
      });
      return;
    }

    const {
      viewId,
      notExistInRecordMap,
      notExistInViewRow,
      notExistInFieldMap,
      notExistInViewColumn,
      duplicateRows,
      duplicateColumns,
      replaceRows,
      recordsInMap,
    } = data;
    const viewIndex = datasheet.snapshot.meta.views.findIndex(view => view.id === viewId);
    const rows = datasheet.snapshot.meta.views[viewIndex].rows;
    const columns = datasheet.snapshot.meta.views[viewIndex].columns;
    // row/column index is value to prevent duplicate deletions
    const rowsToDelete = new Set<number>(duplicateRows);
    const columnsToDelete = new Set<number>(duplicateColumns);

    // column and row may have null values in them, which should be dealt with in advance
    rows.forEach((item, index) => {
      if (!item) {
        rowsToDelete.add(index);
      }
    });
    columns.forEach((item, index) => {
      if (!item) {
        columnsToDelete.add(index);
      }
    });

    // If there are more than 100 rows of data that cannot be matched, the rows of the view are replaced in their entirety
    if (replaceRows) {
      actions.push({
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'rows'],
        od: rows,
        oi: recordsInMap.map(recordId => ({ recordId })),
      });
    }

    // If it does not exist in the recordMap, delete it in the view
    notExistInRecordMap &&
      notExistInRecordMap.forEach((recordId: string) => {
        const rowIndex = rows.findIndex(row => row && row.recordId === recordId);
        rowIndex > -1 && rowsToDelete.add(rowIndex);
      });

    // If it does not exist in the view, add it to the view
    notExistInViewRow &&
      notExistInViewRow.forEach((recordId: string) => {
        actions.push({
          n: OTActionName.ListInsert,
          p: ['meta', 'views', viewIndex, 'rows', rows.length],
          li: { recordId },
        });
      });

    // If it does not exist in the fieldMap, delete it in the view
    notExistInFieldMap &&
      notExistInFieldMap.forEach((fieldId: string) => {
        const columnIndex = columns.findIndex(column => column && column.fieldId === fieldId);
        columnIndex > -1 && columnsToDelete.add(columnIndex);
      });

    // If it does not exist in the view, add it to the view
    notExistInViewColumn &&
      notExistInViewColumn.forEach((fieldId: string) => {
        actions.push({
          n: OTActionName.ListInsert,
          p: ['meta', 'views', viewIndex, 'columns', columns.length],
          li: { fieldId },
        });
      });

    Array.from(rowsToDelete)
      .sort()
      .forEach((index, i) => {
        actions.push({
          n: OTActionName.ListDelete,
          p: ['meta', 'views', viewIndex, 'rows', index - i],
          ld: rows[index],
        });
      });
    Array.from(columnsToDelete)
      .sort()
      .forEach((index, i) => {
        actions.push({
          n: OTActionName.ListDelete,
          p: ['meta', 'views', viewIndex, 'columns', index - i],
          ld: columns[index],
        });
      });
  });

  const operation = {
    cmd: CollaCommandName.FixConsistency,
    actions,
  };

  resourceService.instance!.operationExecuted([{ resourceId: datasheetId, resourceType: ResourceType.Datasheet, operations: [operation] }]);
  Sentry.captureMessage('fixInnerConsistency: Inner data inconsistency of datasheet found and attempts made to fix', {
    extra: {
      datasheetId,
      operation,
    },
  });
};

const fixLinkConsistency = (error: ILinkConsistencyError) => {
  const resourceOps: IResourceOpsCollect[] = [];
  const state = store.getState();

  for (const [dstId, cells] of error.missingRecords) {
    const datasheet = Selectors.getDatasheet(state, dstId);
    if (!datasheet) {
      return;
    }

    const {
      snapshot: { recordMap },
    } = datasheet;

    const actions: IJOTAction[] = [];

    for (const [cellId, recordIds] of cells) {
      const [recordId, fieldId] = cellId.split(':', 2) as [string, string];
      const oldRecordIds = recordMap[recordId]?.data[fieldId] as ILinkIds | undefined;
      if (oldRecordIds) {
        actions.push({
          n: OTActionName.ObjectReplace,
          od: oldRecordIds,
          oi: [...oldRecordIds, ...recordIds],
          p: ['recordMap', recordId, 'data', fieldId],
        });
      } else {
        actions.push({
          n: OTActionName.ObjectInsert,
          oi: [...recordIds],
          p: ['recordMap', recordId, 'data', fieldId],
        });
      }
    }

    resourceOps.push({
      resourceId: dstId,
      resourceType: ResourceType.Datasheet,
      operations: [
        {
          cmd: CollaCommandName.FixConsistency,
          actions,
        },
      ],
    });
  }

  resourceService.instance!.operationExecuted(resourceOps);
  Sentry.captureMessage('fixLinkConsistency: Link inconsistency found and attempts made to fix', {
    extra: {
      mainDstId: error.mainDstId,
      resourceOps,
    },
  });
};

// Set user ID, logged in
Player.bindTrigger(Events.app_set_user_id, (args: IUserInfo) => {
  posthog.identify(args.uuid);

  Sentry.setUser({
    email: args.email,
    username: args.nickName,
    memberName: args.memberName,
    uuid: args.uuid,
    spaceName: args.spaceName,
  });
});

// Error reporting related
Player.bindTrigger(Events.app_error_logger, args => {
  const { error, metaData } = args;
  console.warn('! ' + 'app_error_logger', args);
  Sentry.captureException(error, {
    extra: metaData,
  });
});

// Error reporting related
Player.bindTrigger(Events.app_modal_confirm, (args: IModalConfirmArgs) => {
  const { key, metaData } = args;
  switch (key) {
    case ModalConfirmKey.FixLinkConsistency: {
      if (lastModalDestroy) {
        lastModalDestroy();
      }
      lastModalDestroy = Modal.confirm({
        title: 'Oops',
        type: 'warning',
        content: t(Strings.confirm_link_inconsistency_detected),
        onOk: () => {
          fixLinkConsistency(metaData.error);
          lastModalDestroy = null;
        },
      });
      break;
    }
    case ModalConfirmKey.FixInnerConsistency:
    default: {
      const handleOk = () => {
        const { datasheetId } = metaData;
        fixInnerConsistency(datasheetId);
        lastModalDestroy = null;
      };

      if (lastModalDestroy) {
        lastModalDestroy();
      }
      lastModalDestroy = Modal.confirm({
        title: 'Oops',
        type: 'warning',
        content: t(Strings.confirm_the_system_has_detected_a_conflict_in_document),
        onOk: handleOk,
      });
      break;
    }
  }
});
