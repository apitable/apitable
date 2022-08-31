
import { useRef, KeyboardEvent } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ContextMenu, contextMenuShow, IContextMenuItemProps, useThemeColors } from '@vikadata/components';
import {
  CollaCommandName, ExecuteResult, ICellValue,
  Selectors, StoreActions, Strings, t, View, ViewType,
  DatasheetApi,
} from '@vikadata/core';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined, ArrowUpOutlined,
  ColumnUrlOutlined,
  CopyOutlined, DeleteOutlined,
  ExpandRecordOutlined,
  AttentionOutlined,
  DuplicateOutlined,
  // PasteOutlined,
} from '@vikadata/icons';
import { useMount } from 'ahooks';
import { useRequest } from 'pc/hooks';
import difference from 'lodash/difference';
import path from 'path-browserify';
import { ShortcutActionName } from 'pc/common/shortcut_key';
import { getShortcutKeyString } from 'pc/common/shortcut_key/keybinding_config';
import { appendRow, Direction } from 'pc/common/shortcut_key/shortcut_actions/append_row';
import { Message } from 'pc/components/common';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { useDispatch } from 'pc/hooks';
import { EDITOR_CONTAINER } from 'pc/utils/constant';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { batchActions } from 'redux-batched-actions';
import { copy2clipBoard } from '../../../utils/dom';
import { flatContextData, isNumberKey, printableKey } from 'pc/utils';
import { IInputEditor, InputMenuItem } from './input_menu_item';
import { isInteger } from 'lodash';
import { isWindowsOS } from 'pc/utils/os';

export const GRID_RECORD_MENU = 'GRID_RECORD_MENU';

export function copyLink(recordId: string) {
  const url = new URL(window.location.href);
  url.pathname = path.join(url.pathname, recordId);
  copy2clipBoard(url.href, () => {
    Message.success({ content: t(Strings.link_copy_success) });
  });
}

interface IRecordMenuProps {
  insertDirection?: 'horizontal' | 'vertical'; //  插入新记录的方向
  hideInsert?: boolean;
  menuId?: string;
  extraData?: any[];
}

interface ITriggerRecordMenuProps<T> {
  id: string;
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent;
  props?: {
    recordId?: string;
    recordIndex?: number;
    cellValue?: { [fieldId: string]: ICellValue };
    fieldIndex?: number;
  } & T
}

export function triggerRecordMenu<T>(props: ITriggerRecordMenuProps<T>) {
  const { id, event, props: TriggerProps } = props;
  contextMenuShow(event as React.MouseEvent<HTMLElement>, id, TriggerProps);
}

// 复制记录
export function copyRecord(recordId: string) {
  return appendRow({
    recordId,
    isDuplicate: true,
  });
}

export const RecordMenu: React.FC<IRecordMenuProps> = (props) => {
  const colors = useThemeColors();
  const { insertDirection = 'vertical', hideInsert, menuId, extraData } = props;
  const recordRanges = useSelector(state => Selectors.getSelectionRecordRanges(state));
  const view = useSelector(state => Selectors.getCurrentView(state))!;
  const isCalendar = view.type === ViewType.Calendar;
  const commandManager = resourceService.instance!.commandManager;
  const dispatch = useDispatch();
  const { rowCreatable, rowRemovable } = useSelector(Selectors.getPermissions);
  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const { mirrorId, shareId, templateId } = useSelector(state => state.pageParams);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const beforeInputRef = useRef<IInputEditor>(null);
  const afterInputRef = useRef<IInputEditor>(null);
  const selection = useSelector(Selectors.getSelectRanges);
  const subscriptions = useSelector(state => state.subscriptions)!;

  const { run: subscribeRecordByIds } = useRequest(DatasheetApi.subscribeRecordByIds, { manual: true });
  const { run: unsubscribeRecordByIds } = useRequest(DatasheetApi.unsubscribeRecordByIds, { manual: true });

  const hasSelection = selection && selection.length;
  const onlyOperateOneRecord = (() => {
    // 选区和选中记录是互斥的，存在选区，就不会有选中记录，存在选中记录就不会有选区。
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

  function deleteRecord(recordId: string) {
    const data: string[] = [];
    if (!isCalendar && recordRanges && recordRanges.length) {
      // 处理勾选行的删除
      for (const v of recordRanges) {
        data.push(v);
      }
    } else if (!isCalendar && selection && selection.length) {
      // 处理选区的删除
      for (const v of selection) {
        const selectRecords = Selectors.getRangeRecords(store.getState(), v);
        selectRecords && data.push(...selectRecords.map(r => r.recordId));
      }
    } else {
      // 处理直接右键的删除
      data.push(recordId);
    }
    // 这里使用 setTimeout 为了确保在删除大量数据前，能提示用户正在删除
    const { result } = commandManager.execute({
      cmd: CollaCommandName.DeleteRecords,
      data,
    });

    if (ExecuteResult.Success === result) {
      notifyWithUndo(t(Strings.notification_delete_record_by_count, {
        count: data.length,
      }), NotifyKey.DeleteRecord);

      dispatch(batchActions(
        [
          StoreActions.clearSelection(datasheetId),
          StoreActions.clearActiveRowInfo(datasheetId),
        ]
      ));
    }
  }

  const recordShowName = View.bindModel(view.type).recordShowName;

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

  const subOrUnsubText = React.useMemo((): string => {
    if (hasSelection) {
      const selectRecords = Selectors.getRangeRecords(store.getState(), selection[0]);

      if (!selectRecords) return t(Strings.record_watch_single);

      if (selectRecords?.length > 1) {
        const recordIds = selectRecords.map(el => el.recordId);
        // 判断已选中的record是否全部在subscription中
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
  }, [subscriptions, selection, recordRanges, hasSelection]);

  const onSubOrUnsub = (recordId: string) => {
    if (onlyOperateOneRecord) {
      subscriptions.includes(recordId) ? onUnsubscribe([recordId]) : onSubscribe([recordId]);
      return;
    }

    if (hasSelection) {
      const selectRecords = Selectors.getRangeRecords(store.getState(), selection[0]);

      if (!selectRecords) return;
      
      const recordIds = selectRecords.map(el => el.recordId);
      // 判断已选中的record是否全部在subscription中
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

  const onSubscribe = async(recordIds: string[]) => {
    const { data } = await subscribeRecordByIds({ datasheetId, mirrorId, recordIds });

    if (data?.success) {
      Message.info({ content: t(Strings.watch_record_success) });
      dispatch(StoreActions.setSubscriptionsAction([...new Set([...subscriptions, ...recordIds])]));
    } else {
      Message.error({ content: data.message });
    }
  };

  const onUnsubscribe = async(recordIds: string[]) => {
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

  const handleCopy = (e) => {
    resourceService.instance!.clipboard.copy(e);
  };

  /**
   * resourceService.instance!.clipboard.copy必须接收ClipboardEvent
   * contextMenu中只有PointerEvent，获取不到ClipboardEvent
   * 重写Clipboard中的方法过于冗余
   * 能打开ContextMenu的condition下，EditorContainerBase必然是存在的，故execCommand以最大化复用
   * 
   * context-menu 重构后无法触发到编辑器的 onCopy，所以需要手动监听
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

  let data: Partial<IContextMenuItemProps>[][] = [
    [
      {
        icon: <ColumnUrlOutlined color={colors.thirdLevelText} />,
        text: t(Strings.menu_copy_record_url, { recordShowName }),
        hidden: !onlyOperateOneRecord,
        onClick: ({ props: { recordId }}) => { copyLink(recordId); },
      },
      {
        icon: <DuplicateOutlined color={colors.thirdLevelText} />,
        text: t(Strings.menu_duplicate_record, { recordShowName }),
        hidden: !onlyOperateOneRecord || !rowCreatable,
        onClick: ({ props: { recordId }}) => copyRecord(recordId),
      },
      {
        icon: <ExpandRecordOutlined color={colors.thirdLevelText} />,
        text: t(Strings.menu_expand_record, { recordShowName }),
        shortcutKey: getShortcutKeyString(ShortcutActionName.ExpandRecord),
        hidden: !onlyOperateOneRecord,
        onClick: ({ props: { recordId }}) => {
          expandRecordIdNavigate(recordId);
        },
      },
      {
        icon: <AttentionOutlined color={colors.thirdLevelText} />,
        text: subOrUnsubText,
        hidden: isCalendar || !!shareId || !!templateId,
        onClick: ({ props: { recordId }}) => onSubOrUnsub(recordId),
      },
    ],
    [
      {
        icon: <DeleteOutlined color={colors.thirdLevelText} />,
        text: getDeleteString(),
        hidden: !rowRemovable,
        onClick: ({ props: { recordId }}) => {
          deleteRecord(recordId);
        },
      },
    ],
  ];

  if (!hideInsert) {
    data = [[
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
        onClick: ({ props: { recordId }}) => appendRow({ 
          recordId, 
          direction: Direction.Up, 
          count: Number(beforeInputRef.current?.getValue() || 1)
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
        onClick: ({ props: { recordId }}) => appendRow({ 
          recordId, 
          direction: Direction.Down,
          count: Number(afterInputRef.current?.getValue() || 1)
        })
      },
    ], ...data];
  }

  data = [[
    {
      icon: <CopyOutlined color={colors.thirdLevelText} />,
      text: t(Strings.copy_from_cell),
      shortcutKey: getShortcutKeyString(ShortcutActionName.Copy),
      hidden: isCalendar,
      onClick: onCopy,
    },
    // TODO: paste因为浏览器安全性限制，需去保存一份copy内容再处理数据，且不支持外部内容copy
    // {
    //   icon: <PasteOutlined color={colors.thirdLevelText} />,
    //   text: t(Strings.paste),
    //   shortcutKey: getShortcutKeyString(ShortcutActionName.Paste),
    //   hidden: isCalendar,
    //   onClick: () => onPaste(),
    // },
  ], ...data];

  if (extraData) {
    data.splice(data.length - 1, 0, extraData);
  }

  const contextMenuData = flatContextData(data, true);

  return (
    <ContextMenu
      menuId={menuId}
      overlay={contextMenuData}
      width={isWindowsOS() ? 320 : 280}
    />
  );
};
