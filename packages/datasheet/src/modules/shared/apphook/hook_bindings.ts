import {
  consistencyCheck, CollaCommandName, Events, IJOTAction, IUserInfo, OTActionName, Player, ResourceType, Selectors, Strings, t,
} from '@apitable/core';
import * as Sentry from '@sentry/react';
import { Modal } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { tracker } from 'pc/utils/tracker';
import { IModalConfirmArgs, ModalConfirmKey } from './interface';

let lastModalDestroy: any = null;

// Set user ID, logged in
Player.bindTrigger(Events.app_set_user_id, (args: IUserInfo) => {
  tracker.login(args.uuid);
  tracker.setProfile({
    nick_name: args.nickName,
    email: args.email,
  });

  tracker.setOnceProfile({
    userId: args.uuid,
    signup_time: Date.now(),
  });

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
    case ModalConfirmKey.FixConsistency:
    default: {
      const handleOk = () => {
        const actions: IJOTAction[] = [];
        const { datasheetId } = metaData;
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
            recordsInMap
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
              oi: recordsInMap.map(recordId => {
                return {
                  recordId: recordId
                };
              })
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

          Array.from(rowsToDelete).sort().forEach((index, i) => {
            actions.push({
              n: OTActionName.ListDelete,
              p: ['meta', 'views', viewIndex, 'rows', index - i],
              ld: rows[index],
            });
          });
          Array.from(columnsToDelete).sort().forEach((index, i) => {
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

        resourceService.instance!.operationExecuted([{ resourceId: datasheetId, resourceType: ResourceType.Datasheet, operations:[operation] }]);
        Sentry.captureMessage('fixConsistency: Data consistency errors found and attempts made to fix', {
          extra: {
            datasheetId,
            operation,
          },
        });
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
    }
  }
});

// Buried point statistics related
Player.bindTrigger(Events.app_tracker, args => {
  tracker.track(args.name, args.props);
});
