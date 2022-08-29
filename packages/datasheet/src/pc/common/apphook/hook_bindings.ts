import {
  consistencyCheck, CollaCommandName, Events, IJOTAction, IUserInfo, OTActionName, Player, ResourceType, Selectors, Strings, t,
} from '@vikadata/core';
import * as Sentry from '@sentry/react';
import { Modal } from 'pc/components/common';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { tracker } from 'pc/utils/tracker';
import { IModalConfirmArgs, ModalConfirmKey } from './interface';

let lastModalDestroy: any = null;

// 设置用户ID，登录了
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

// 错误上报相关
Player.bindTrigger(Events.app_error_logger, args => {
  const { error, metaData } = args;
  console.warn('! ' + 'app_error_logger', args);
  Sentry.captureException(error, {
    extra: metaData,
  });
});

// 错误上报相关
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
          // 删除重复 view
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
          // row/column index 为 value，防止重复删除
          const rowsToDelete = new Set<number>(duplicateRows);
          const columnsToDelete = new Set<number>(duplicateColumns);

          // column 和 row 中可能有 null 类型的值，这里要提前处理掉
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

          // 有超过 100 行的数据无法匹配，对该视图的 rows 做整体的替换
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

          // 在 recordMap 中不存在的，要在 view 中删除
          notExistInRecordMap &&
            notExistInRecordMap.forEach((recordId: string) => {
              const rowIndex = rows.findIndex(row => row && row.recordId === recordId);
              rowIndex > -1 && rowsToDelete.add(rowIndex);
            });

          // 在 view 中不存在的，要在 view 中新增
          notExistInViewRow &&
            notExistInViewRow.forEach((recordId: string) => {
              actions.push({
                n: OTActionName.ListInsert,
                p: ['meta', 'views', viewIndex, 'rows', rows.length],
                li: { recordId },
              });
            });

          // 在 fieldMap 中不存在的，要在 view 中删除
          notExistInFieldMap &&
            notExistInFieldMap.forEach((fieldId: string) => {
              const columnIndex = columns.findIndex(column => column && column.fieldId === fieldId);
              columnIndex > -1 && columnsToDelete.add(columnIndex);
            });

          // 在 view 中不存在的，要在 view 中新增
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
        Sentry.captureMessage('fixConsistency: 发现数据一致性错误，并尝试修复', {
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

// 埋点统计相关
Player.bindTrigger(Events.app_tracker, args => {
  tracker.track(args.name, args.props);
});
