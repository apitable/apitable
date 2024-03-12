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

import { useMount } from 'ahooks';
import parser from 'html-react-parser';
import { isInteger } from 'lodash';
import difference from 'lodash/difference';
import path from 'path-browserify';
import * as React from 'react';
import { KeyboardEvent, useRef, useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';
import { ContextMenu, IContextMenuItemProps, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  DatasheetApi,
  ExecuteResult,
  ICollaCommandExecuteResult,
  Selectors,
  StoreActions,
  Strings,
  t,
  View,
  ViewType,
} from '@apitable/core';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  AttentionOutlined,
  LinkOutlined,
  CopyOutlined,
  DeleteOutlined,
  DuplicateOutlined,
  ExpandOutlined,
  ArchiveOutlined
} from '@apitable/icons';
import { ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { appendRow, Direction } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { useDispatch, useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData, isNumberKey, printableKey } from 'pc/utils';
import { EDITOR_CONTAINER } from 'pc/utils/constant';
import { getEnvVariables } from 'pc/utils/env';
import { isWindowsOS } from 'pc/utils/os';
import { copy2clipBoard } from '../../../utils/dom';
import { IInputEditor, InputMenuItem } from './input_menu_item';

export const GRID_RECORD_MENU = 'GRID_RECORD_MENU';

export function copyLink(recordId: string) {
  const url = new URL(window.location.href);
  url.pathname = path.join(url.pathname, recordId);
  copy2clipBoard(url.href, () => {
    Message.success({ content: t(Strings.link_copy_success) });
  });
}

interface IRecordMenuProps {
  insertDirection?: 'horizontal' | 'vertical';
  hideInsert?: boolean;
  menuId?: string;
  extraData?: any[];
}

export function copyRecord(recordId: string): Promise<ICollaCommandExecuteResult<string[]>> {
  return appendRow({
    recordId,
    isDuplicate: true,
  });
}

export const RecordMenu: React.FC<React.PropsWithChildren<IRecordMenuProps>> = (props) => {
  const colors = useThemeColors();
  const { insertDirection = 'vertical', hideInsert, menuId, extraData } = props;
  const recordRanges = useAppSelector((state) => Selectors.getSelectionRecordRanges(state));
  const view = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const permission = useAppSelector((state) => Selectors.getPermissions(state, datasheetId));
  const isOrgChart = view.type === ViewType.OrgChart;
  const isCalendar = view.type === ViewType.Calendar;
  const isGallery = view.type === ViewType.Gallery;
  const isKanban = view.type === ViewType.Kanban;
  const dispatch = useDispatch();
  const { rowCreatable, rowRemovable } = useAppSelector(Selectors.getPermissions);
  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId)!;
  const { mirrorId, shareId, templateId, embedId } = useAppSelector((state) => state.pageParams);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const beforeInputRef = useRef<IInputEditor>(null);
  const afterInputRef = useRef<IInputEditor>(null);
  const selection = useAppSelector(Selectors.getSelectRanges);
  const subscriptions = useAppSelector((state) => state.subscriptions)!;
  const { manageable } = useAppSelector((state) => Selectors.getPermissions(state, datasheetId));

  const { run: subscribeRecordByIds } = useRequest(DatasheetApi.subscribeRecordByIds, { manual: true });
  const { run: unsubscribeRecordByIds } = useRequest(DatasheetApi.unsubscribeRecordByIds, { manual: true });

  const hasSelection = selection && selection.length;
  const onlyOperateOneRecord = (() => {
    // Selections and selected records are mutually exclusive;
    // if a selection exists, there will be no selected records, and if a selected record exists, there will be no selection.
    if (hasSelection) {
      const selectRecords = Selectors.getRangeRecords(store.getState(), selection[0]);
      return !(selectRecords && selectRecords.length > 1);
    }
    return !(recordRanges && recordRanges.length > 1);
  })();
  const allowInsertRecord = onlyOperateOneRecord && rowCreatable;

  useMount(() => {
    wrapperRef.current && wrapperRef.current.focus();
  });

  function archiveRecord(recordId: string) {
    const data: string[] = [];
    if (!isCalendar && recordRanges && recordRanges.length) {
      // Handling the deletion of ticked rows
      for (const v of recordRanges) {
        data.push(v);
      }
    } else if (!isCalendar && selection && selection.length) {
      // Handling the deletion of selections
      for (const v of selection) {
        const selectRecords = Selectors.getRangeRecords(store.getState(), v);
        selectRecords && data.push(...selectRecords.map((r) => r.recordId));
      }
    } else {
      // Handling right-click menu deletion
      data.push(recordId);
    }
    // The setTimeout is used here to ensure that the user is alerted that a large amount of data is being deleted before it is deleted
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ArchiveRecords,
      data,
    });

    if (ExecuteResult.Success === result) {
      Message.success({ content: t(Strings.archive_record_success) });

      dispatch(batchActions([StoreActions.clearSelection(datasheetId), StoreActions.clearActiveRowInfo(datasheetId)]));
    }
  }

  function deleteRecord(recordId: string) {
    const data: string[] = [];
    if (!isCalendar && recordRanges && recordRanges.length) {
      // Handling the deletion of ticked rows
      for (const v of recordRanges) {
        data.push(v);
      }
    } else if (!isCalendar && selection && selection.length) {
      // Handling the deletion of selections
      for (const v of selection) {
        const selectRecords = Selectors.getRangeRecords(store.getState(), v);
        selectRecords && data.push(...selectRecords.map((r) => r.recordId));
      }
    } else {
      // Handling right-click menu deletion
      data.push(recordId);
    }
    // The setTimeout is used here to ensure that the user is alerted that a large amount of data is being deleted before it is deleted
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteRecords,
      data,
    });

    if (ExecuteResult.Success === result) {
      notifyWithUndo(
        t(Strings.notification_delete_record_by_count, {
          count: data.length,
        }),
        NotifyKey.DeleteRecord,
      );

      dispatch(batchActions([StoreActions.clearSelection(datasheetId), StoreActions.clearActiveRowInfo(datasheetId)]));
    }
  }

  const recordShowName = View.bindModel(view.type).recordShowName;

  function getArchiveString() {
    const recordShowUnit = View.bindModel(view.type).recordShowUnit;
    let archiveCount = 0;
    if (onlyOperateOneRecord) {
      return t(Strings.menu_archive_record, { recordShowName });
    }

    if (hasSelection) {
      const selectRecords = Selectors.getRangeRecords(store.getState(), selection[0]);
      archiveCount = selectRecords ? selectRecords.length : 0;
    }
    if (recordRanges && recordRanges.length) {
      archiveCount = recordRanges.length;
    }

    return t(Strings.menu_archive_multi_records, {
      count: archiveCount,
      unit: recordShowUnit,
      recordShowName,
    });
  }

  function getDeleteString() {
    const recordShowUnit = View.bindModel(view.type).recordShowUnit;
    let deleteCount = 0;
    if (onlyOperateOneRecord) {
      return t(Strings.menu_delete_record, { recordShowName });
    }

    if (hasSelection) {
      const selectRecords = Selectors.getRangeRecords(store.getState(), selection[0]);
      deleteCount = selectRecords ? selectRecords.length : 0;
    }
    if (recordRanges && recordRanges.length) {
      deleteCount = recordRanges.length;
    }
    return t(Strings.menu_delete_multi_records, {
      count: deleteCount,
      unit: recordShowUnit,
      recordShowName,
    });
  }

  const getSubOrUnsubText = useCallback(
    (recordId: string): string => {
      // Compatibility of views for Calendar, Kanban, Gallery and OrgChart views
      if (isCalendar || isKanban || isGallery || isOrgChart) {
        return subscriptions.includes(recordId) ? t(Strings.cancel_watch_record_single) : t(Strings.record_watch_single);
      }

      if (hasSelection) {
        const selectRecords = Selectors.getRangeRecords(store.getState(), selection[0]);

        if (!selectRecords) return t(Strings.record_watch_single);

        if (selectRecords?.length > 1) {
          const recordIds = selectRecords.map((el) => el.recordId);
          // Determine if the selected record is all in the subscription
          return [...new Set([...subscriptions, ...recordIds])].length === subscriptions.length
            ? t(Strings.cancel_watch_record_multiple, { count: recordIds.length })
            : t(Strings.record_watch_multiple, { count: recordIds.length });
        }

        return subscriptions.includes(selectRecords[0].recordId) ? t(Strings.cancel_watch_record_single) : t(Strings.record_watch_single);
      }

      if (recordRanges) {
        if (recordRanges.length > 1) {
          return [...new Set([...subscriptions, ...recordRanges])].length === subscriptions.length
            ? t(Strings.cancel_watch_record_multiple, { count: recordRanges.length })
            : t(Strings.record_watch_multiple, { count: recordRanges.length });
        }

        return [...new Set([...subscriptions, ...recordRanges])].length === subscriptions.length
          ? t(Strings.cancel_watch_record_single)
          : t(Strings.record_watch_single);
      }

      return t(Strings.record_watch_single);
    },
    [isCalendar, isKanban, isGallery, isOrgChart, subscriptions, selection, recordRanges, hasSelection],
  );

  const onSubOrUnsub = (recordId: string) => {
    if (onlyOperateOneRecord) {
      subscriptions.includes(recordId) ? onUnsubscribe([recordId]) : onSubscribe([recordId]);
      return;
    }

    if (hasSelection) {
      const selectRecords = Selectors.getRangeRecords(store.getState(), selection[0]);

      if (!selectRecords) return;

      const recordIds = selectRecords.map((el) => el.recordId);
      // Determine if the selected record is all in the subscription
      if ([...new Set([...subscriptions, ...recordIds])].length === subscriptions.length) {
        onUnsubscribe(recordIds);
      } else {
        onSubscribe(recordIds);
      }

      return;
    }

    if (recordRanges?.length) {
      if ([...new Set([...subscriptions, ...recordRanges])].length === subscriptions.length) {
        onUnsubscribe(recordRanges);
      } else {
        onSubscribe(recordRanges);
      }
    }
  };

  const onSubscribe = async (recordIds: string[]) => {
    const { data } = await subscribeRecordByIds({ datasheetId, mirrorId, recordIds });

    if (data?.success) {
      Message.info({ content: t(Strings.watch_record_success) });
      dispatch(StoreActions.setSubscriptionsAction([...new Set([...subscriptions, ...recordIds])]));
    } else {
      Message.error({ content: data.message });
    }
  };

  const onUnsubscribe = async (recordIds: string[]) => {
    const { data } = await unsubscribeRecordByIds({ datasheetId, mirrorId, recordIds });

    if (data?.success) {
      Message.info({ content: t(Strings.cancel_watch_record_success) });
      dispatch(StoreActions.setSubscriptionsAction(difference(subscriptions, recordIds)));
    } else {
      Message.error({ content: data.message });
    }
  };

  const onInputChange = (value: string, ref: React.RefObject<IInputEditor>) => {
    const editorElem = ref.current;
    if (value === '') return editorElem?.setValue(value);
    const count = parseInt(value);
    if (!isInteger(count)) return;
    if (count < 1) return editorElem?.setValue(String(1));
    if (count > 100) return editorElem?.setValue(String(100));
    return editorElem?.setValue(String(count));
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const printable = printableKey(event.nativeEvent);
    const acceptable = isNumberKey(event.nativeEvent);
    if (printable && !acceptable) {
      event.preventDefault();
    }
  };

  const handleCopy = (e: ClipboardEvent) => {
    resourceService.instance!.clipboard.copy(e);
  };

  /**
   * resourceService.instance!.clipboard.copy must accept ClipboardEvent
   * There is only PointerEvent in contextMenu, can't get ClipboardEvent
   * Rewriting the methods in Clipboard is too redundant
   * If the ContextMenu can be opened, the EditorContainerBase must exist, so execCommand to maximize the reuse
   *
   * The context-menu refactoring does not trigger onCopy to the editor, so you need to listen to it manually.
   */
  const onCopy = () => {
    document.addEventListener('copy', handleCopy);
    const editorDOM = document.getElementById(EDITOR_CONTAINER);
    if (editorDOM) {
      document.execCommand('copy');
    }
    document.removeEventListener('copy', handleCopy);
  };

  const IconInsertBefore = insertDirection === 'horizontal' ? ArrowLeftOutlined : ArrowUpOutlined;
  const IconInsertAfter = insertDirection === 'horizontal' ? ArrowRightOutlined : ArrowDownOutlined;

  const getArchiveNotice = (content) => {
    return <div>{parser(content)}</div>;
  };

  let data: Partial<IContextMenuItemProps>[][] = [
    [
      {
        icon: <LinkOutlined color={colors.thirdLevelText} />,
        text: t(Strings.menu_copy_record_url, { recordShowName }),
        hidden: !onlyOperateOneRecord || !!embedId,
        onClick: ({ props: { recordId } }: any) => {
          copyLink(recordId);
        },
      },
      {
        icon: <DuplicateOutlined color={colors.thirdLevelText} />,
        text: t(Strings.menu_duplicate_record, { recordShowName }),
        hidden: !onlyOperateOneRecord || !rowCreatable,
        onClick: ({ props: { recordId } }: any) => copyRecord(recordId),
      },
      {
        icon: <ExpandOutlined color={colors.thirdLevelText} />,
        text: t(Strings.menu_expand_record, { recordShowName }),
        shortcutKey: getShortcutKeyString(ShortcutActionName.ExpandRecord),
        hidden: !onlyOperateOneRecord,
        onClick: ({ props: { recordId } }: any) => {
          expandRecordIdNavigate(recordId);
        },
      },
      {
        icon: <AttentionOutlined color={colors.thirdLevelText} />,
        text: ({ props: { recordId } }: any) => getSubOrUnsubText(recordId),
        hidden: isCalendar || !!shareId || !!templateId || !getEnvVariables().RECORD_WATCHING_VISIBLE || !!embedId,
        onClick: ({ props: { recordId } }: any) => onSubOrUnsub(recordId),
      },
    ],
    [
      {
        icon: <ArchiveOutlined color={colors.thirdLevelText} />,
        text: getArchiveString(),
        hidden: !rowRemovable || !manageable || Boolean(mirrorId),
        onClick: ({ props: { recordId } }: any) => {
          Modal.warning({
            title: t(Strings.menu_archive_record),
            content: getArchiveNotice(t(Strings.archive_notice)),
            onOk: () => archiveRecord(recordId),
            closable: true,
            hiddenCancelBtn: false,
          });
        },
      },
      {
        icon: <DeleteOutlined color={colors.thirdLevelText} />,
        text: getDeleteString(),
        hidden: !rowRemovable,
        onClick: ({ props: { recordId } }: any) => {
          deleteRecord(recordId);
        },
      },
    ],
  ];

  if (!hideInsert) {
    data = [
      [
        {
          icon: <IconInsertBefore color={colors.thirdLevelText} />,
          text: (
            <InputMenuItem
              ref={beforeInputRef}
              initValue={1}
              text={t(Strings.menu_insert_record_above)}
              textKey={'lineCount'}
              onChange={(value) => onInputChange(value, beforeInputRef)}
              onKeyDown={onInputKeyDown}
            />
          ),
          shortcutKey: getShortcutKeyString(ShortcutActionName.PrependRow),
          hidden: !allowInsertRecord,
          onClick: ({ props: { recordId } }: any) =>
            appendRow({
              recordId,
              direction: Direction.Up,
              count: Number(beforeInputRef.current?.getValue() || 1),
            }),
        },
        {
          icon: <IconInsertAfter color={colors.thirdLevelText} />,
          text: (
            <InputMenuItem
              ref={afterInputRef}
              initValue={1}
              text={t(Strings.menu_insert_record_below)}
              textKey={'lineCount'}
              onChange={(value) => onInputChange(value, afterInputRef)}
              onKeyDown={onInputKeyDown}
            />
          ),
          shortcutKey: getShortcutKeyString(ShortcutActionName.AppendRow),
          hidden: !allowInsertRecord,
          onClick: ({ props: { recordId } }: any) =>
            appendRow({
              recordId,
              direction: Direction.Down,
              count: Number(afterInputRef.current?.getValue() || 1),
            }),
        },
      ],
      ...data,
    ];
  }

  data = [
    [
      {
        icon: <CopyOutlined color={colors.thirdLevelText} />,
        text: t(Strings.copy_from_cell),
        shortcutKey: getShortcutKeyString(ShortcutActionName.Copy),
        hidden: isCalendar || isGallery || isKanban || !permission.copyable,
        onClick: onCopy,
      },
      // TODO: paste because of browser security restrictions,
      // need to save a copy of the content before processing data, and does not support external content copy
      // {
      //   icon: <PasteOutlined color={colors.thirdLevelText} />,
      //   text: t(Strings.paste),
      //   shortcutKey: getShortcutKeyString(ShortcutActionName.Paste),
      //   hidden: isCalendar,
      //   onClick: () => onPaste(),
      // },
    ],
    ...data,
  ];

  if (extraData) {
    data.splice(data.length - 1, 0, extraData);
  }

  const contextMenuData = flatContextData(data, true);

  return <ContextMenu menuId={menuId || GRID_RECORD_MENU} overlay={contextMenuData} width={isWindowsOS() ? 320 : 280} />;
};
