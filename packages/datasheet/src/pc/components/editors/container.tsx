import { Message } from '@vikadata/components';
import {
  Cell,
  CellDirection,
  CollaCommandName,
  ConfigConstant,
  DATASHEET_ID,
  Field,
  FieldType,
  Group,
  ICell,
  ICellValue,
  IField,
  IRange,
  IRecord,
  IRecordAlarmClient,
  ISelection,
  Range,
  RangeDirection,
  Selectors,
  StoreActions,
  Strings,
  t,
  IHyperlinkSegment,
  isUrl,
  SegmentType,
} from '@vikadata/core';

import { isEqual, noop } from 'lodash';
import { ContextName, ShortcutActionManager, ShortcutActionName, ShortcutContext } from 'pc/common/shortcut_key';
import { appendRow } from 'pc/common/shortcut_key/shortcut_actions/append_row';
import { convertAlarmStructure } from 'pc/components/editors/date_time_editor/date_time_alarm/utils';
import { useDispatch } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { printableKey, recognizeURLAndSetTitle, IURLMeta } from 'pc/utils';
import { EDITOR_CONTAINER } from 'pc/utils/constant';

import { ClipboardEvent, forwardRef, KeyboardEvent, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { stopPropagation } from '../../utils/dom';
import { attachEventHoc, IEditorContainerOwnProps } from './attach_event_hoc';
import { AttachmentEditor } from './attachment_editor';
import { CheckboxEditor } from './checkbox_editor';
import { DateTimeEditor } from './date_time_editor';
import { EnhanceTextEditor } from './enhance_text_editor';
import { useCellEditorVisibleStyle } from './hooks';
import { IContainerEdit, IEditor } from './interface';
import { LinkEditor } from './link_editor';
import { MemberEditor } from './member_editor';

// Editors
import { NoneEditor } from './none_editor';
import { NumberEditor } from './number_editor';
import { OptionsEditor } from './options_editor';
import { RatingEditor } from './rating_editor';

import styles from './style.module.less';
import { TextEditor } from './text_editor';
import { expandRecordIdNavigate } from '../expand_record';
import { useUnmount } from 'ahooks';
import { setEndEditCell } from './end_edit_cell';

export interface IEditorPosition {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface IEditorContainerBaseOwnProps {
  field: IField;
  record?: IRecord;
  selectionRange: IRange;
  selection?: ISelection | null;
  activeCell: ICell | null;
  rectCalculator?: (activeCell: ICell) => Partial<IEditorPosition> | null;
}

type EditorContainerProps = IEditorContainerOwnProps & IEditorContainerBaseOwnProps;

const CELL_EDITOR = 'CELL_EDITOR';

// TODO: 区分 SimpleEditor 和 customEditor
const EditorContainerBase: React.ForwardRefRenderFunction<IContainerEdit, EditorContainerProps> = (props, ref) => {
  useImperativeHandle(
    ref,
    (): IContainerEdit => ({
      onViewMouseDown(activeCell?: ICell) {
        onViewMouseDown(activeCell);
      },
      focus() {
        focus();
      },
    }),
  );
  const { record, field, selectionRange, selection, activeCell, scrollLeft, scrollTop, rectCalculator } = props;
  const collaborators = useSelector(state => Selectors.collaboratorSelector(state));
  const snapshot = useSelector(state => Selectors.getSnapshot(state)!);
  const cellValue = useSelector(state => {
    if (field && !Field.bindModel(field).isComputed && record) {
      return Selectors.getCellValue(state, snapshot, record.id, field.id);
    }
    return null;
  });
  const viewId = useSelector(state => Selectors.getActiveView(state))!;
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const fieldPermissionMap = useSelector(Selectors.getFieldPermissionMap);
  const recordEditable = field ? Field.bindModel(field).recordEditable() : false;
  const isRecordExpanded = useSelector(state => Boolean(state.pageParams.recordId));
  const previewModalVisible = useSelector(state => state.space.previewModalVisible);
  const allowCopyDataToExternal = useSelector(state => {
    const _allowCopyDataToExternal = state.space.spaceFeatures?.allowCopyDataToExternal || state.share.allowCopyDataToExternal;
    return Boolean(_allowCopyDataToExternal);
  });
  const role = useSelector(state => Selectors.getDatasheet(state, datasheetId)!.role);
  const { groupInfo, groupBreakpoint, visibleRowsIndexMap } = useSelector(
    state => ({
      groupInfo: Selectors.getActiveViewGroupInfo(state),
      groupBreakpoint: Selectors.getGroupBreakpoint(state),
      visibleRowsIndexMap: Selectors.getPureVisibleRowsIndexMap(state),
    }),
    shallowEqual,
  );

  // FIXME: 这里还是使用组件内部 editing 控制状态，使用 redux 的 isEditing 状态，编辑框会闪烁一下。
  const [editing, setEditing] = useState(false);
  const editorX = !editing ? 0 : -scrollLeft!;
  const editorY = !editing ? 0 : -scrollTop!;
  const editorRef = useRef<IEditor | null>(null);
  /**
   * activeCellRef 的存在是为了解决单多选，成员这类通过弹出组件交互的字段，显著特点是这类组件具备在 editing 和 !editing 之间切换的能力
   * 流程上，点击不同的单元格， 保存上一个单元格的数据 -> 激活下一个单元格，点击自身则不应该发生变化
   * 单多选的另一个特殊在于编辑组件没有悬浮在相应的单元格上，导致每次对单元格的点击都会触发上述正常的流程，editing 的状态切换会被打破，那就永远也无法正常展示组件。
   * 所以需要用一个值用于记忆 「上一次」 的单元格是谁，那针对单多选，就可以由此判断是否再点击同一个单元格，阻止对 editing 状态切换的破坏
   *
   * bug 记录：
   * 20201121 - 最开始对 activeCell 的缓存和鼠标操作是绑定在一起的，每次点击新的单元格，当前的单元格信息就会被正常缓存。但是如果点击了单元格 A，通过 Tab 键切换到下一个单元格 B，
   * 此时缓存理应记录单元格 B 的数据，但是因为并非通过点击操作，所以事实上缓存的依然是单元格 A 的数据，如果此时在单元格 B 编辑完数据，再点回 A，B 的数据并不会保存，而是会被当做 A 的数据展示。
   * 所以为了解决该问题，明确一点，键盘操作应该和鼠标操作保持一致，都需要缓存即将要激活的单元格信息 缓存 = 要点击的单元格 或者 要切换过去的单元格
   */
  const activeCellRef = useRef<ICell | null>(
    field && record
      ? {
          recordId: record.id,
          fieldId: field.id,
        }
      : null,
  );
  const dispatch = useDispatch();
  const [editPositionInfo, setEditPositionInfo] = useState<IEditorPosition>(() => ({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  }));

  // const setEditing = status => {
  //   dispatch(StoreActions.setEditStatus(status));
  // };

  useEffect(() => {
    ShortcutContext.bind(ContextName.isEditing, () => editing);
    return () => {
      ShortcutContext.unbind(ContextName.isEditing);
    };
  });

  const onViewMouseDown = (nextActiveCell?: ICell) => {
    const oldCell = activeCellRef.current;
    cacheNextActiveCell(nextActiveCell || null);

    if (shallowEqual(nextActiveCell, oldCell)) {
      return;
    }

    endEdit();
  };

  /**
   * @description 将当前的选区置为编辑状态
   * 这里如果 keepValue 为true，说明需要留存当前store中存储的数据，在此基础上进行编辑
   * 为 false ， 说明store中即便保存数据也不使用，完全重新开始编辑
   *
   */
  const startEdit = (keepValue = false) => {
    if (!recordEditable) {
      fieldPermissionMap &&
        fieldPermissionMap[field.id] &&
        Message.warning({
          content: t(Strings.readonly_column),
          messageKey: CELL_EDITOR,
        });
      return;
    }
    if (Field.bindModel(field).isComputed) {
      return;
    }
    const editorRefCurrent = editorRef.current!;
    if (editorRefCurrent) {
      const { recordId, fieldId } = activeCell!;
      const state = store.getState();
      const cellUIIndex = Selectors.getCellUIIndex(state, activeCell!);
      cellUIIndex && props.scrollToItem(cellUIIndex);
      setEditing(true);
      dispatch(StoreActions.setEditStatus(datasheetId, { recordId, fieldId }));
      editorRefCurrent.onStartEdit && editorRefCurrent.onStartEdit(keepValue ? cellValue : undefined);
      focus();
    }
  };

  const preventSomeFieldKeyDown = () => {
    if (Field.bindModel(field).isComputed) {
      return false;
    }
    switch (field.type) {
      case FieldType.Attachment:
      case FieldType.Checkbox:
        return false;
      default:
        return true;
    }
  };

  const startEditByKeyDown = (event: KeyboardEvent) => {
    if (editing || !activeCell) {
      return;
    }
    const { metaKey, ctrlKey } = event;
    if (metaKey || ctrlKey) {
      return;
    }
    if (!preventSomeFieldKeyDown()) {
      return;
    }
    if (printableKey(event.nativeEvent)) {
      startEdit();
    }
  };

  const endEdit = (cancel = false) => {
    if (!editing) {
      return;
    }
    const editorRefCurrent = editorRef.current!;
    editorRefCurrent.onEndEdit && editorRefCurrent.onEndEdit(cancel);
    setEditing(false);
    dispatch(StoreActions.setEditStatus(datasheetId, null));
  };
  // 将 endEdit 暴露出去
  setEndEditCell(endEdit);
  useUnmount(() => {
    setEndEditCell(noop);
  });

  const focus = () => {
    const editorRefCurrent = editorRef.current;
    if (!editorRefCurrent || isRecordExpanded || previewModalVisible) {
      return;
    }
    editorRefCurrent.focus && editorRefCurrent.focus();
  };

  useEffect(() => {
    // 连续选区 - 通过鼠标快捷键选中的区块。
    // 非连续选区 - 通过记录前的 checkbox 选中记录组成的选区。可能是连续的，也可能是不连续的。统一当作非连续选区处理。
    // 连续选区和非连续选区互斥（点击 checkbox 时会清空连续选区)
    // 存在连续选区，一定会有激活单元格，自动 focus 激活单元格进入编辑状态。
    // 存在非连续选区时，也要 focus 编辑器。只有当页面中存在 activeElement 的时候 onCopy 事件才会触发。
    if (selection?.ranges || selection?.recordRanges) {
      focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  useEffect(() => {
    /**
     * 激活单元格变动时，广播协作光标。
     * sendCursor > room-server > broadcast ENGAGEMENT_CURSOR >
     * client on ENGAGEMENT_CURSOR > handleCursor > dispatch(cursorMove)
     */

    // 没有单元格的编辑权限，也不发送协同信息 @苏简
    // 协同光标，不需要关注是否能编辑。不可编辑也能体现用户是否聚焦在某个单元格，需要发送。但是不清楚 @苏简 当时为啥这样改，先观察一段时间。
    // if (!recordEditable) {
    //   return;
    // }

    if (!field || !record) {
      return;
    }
    // 单人房间不同步游标信息，减少请求量。
    if (collaborators.length > 1) {
      resourceService.instance!.sendCursor({
        datasheetId,
        viewId,
        fieldId: field.id,
        recordId: record.id,
        time: new Date().getTime(),
      });
    }
  }, [collaborators.length, datasheetId, field, record, viewId, recordEditable]);
  /**
   * 考虑到单元格位置在协同的状态下存在难以预测性（比如远程进行了增删行列操作、修改行高，左侧状态栏被拖动等）。
   * 目前采用暴力的方式，每次渲染直接从 dom 节点计算出来其所在位置，没有进行任何缓存行为。
   * 目前效果看起来还可以，没有出现计算瓶颈。
   */
  const getCellRelativeRect = (cell: ICell) => {
    const containerDom = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
    // note: 这里新增对cell的处理， 原因在于处理删除record，redux的更新不会及时卸载该组件，导致数据源缺失，但是该方法
    // 依旧被触发，导致cell.row 找不到
    if (!containerDom || !cell) {
      return null;
    }
    const cellDom = containerDom.querySelector(`[data-record-id="${cell.recordId}"][data-field-id="${cell.fieldId}"]`);
    if (cellDom) {
      const cellRect = cellDom.getBoundingClientRect();
      const containerRect = containerDom.getBoundingClientRect();
      const deltaLeft = cellRect.left - containerRect.left;
      const deltaTop = cellRect.top - containerRect.top;

      const getDelta = (delta: number, selfSize: number, containerSize: number) => {
        const safeBorder = 2;
        if (delta > safeBorder) {
          // 每超出左边界也没超出右边界
          if (delta < containerSize - selfSize) {
            return delta;
          }
          // 停在右边界
          return containerSize - selfSize - safeBorder;
        }
        // 停在左边界
        return safeBorder;
      };

      return {
        x: getDelta(deltaLeft, cellRect.width, containerRect.width),
        y: getDelta(deltaTop, cellRect.height, containerRect.height),
        width: cellRect.width,
        height: cellRect.height,
      };
    }

    return null;
  };

  const exitEdit = () => {
    endEdit(true);
  };

  const toggleEditing = (next?: boolean) => {
    if (!recordEditable) {
      return;
    }
    if (editing) {
      endEdit();
      if (next) {
        activeCellRef.current = null;
        cellMove(CellDirection.Down, true);
      }
    } else {
      startEdit(true);
    }
  };

  const rightShift = () => {
    if (editing) {
      endEdit();
    }
    cellMove(CellDirection.Right);
  };

  const leftShift = () => {
    if (editing) {
      endEdit();
    }
    cellMove(CellDirection.Left);
  };

  const appendNewRow = () => {
    appendRow();
    const state = store.getState();
    setTimeout(() => {
      const activeCellUIIndex = Selectors.getCellUIIndex(state, activeCell!);
      activeCellUIIndex && props.scrollToItem(activeCellUIIndex);
    }, 0);
  };

  useEffect(() => {
    const eventBundle = new Map([
      [
        ShortcutActionName.CellUp,
        () => {
          cellMove(CellDirection.Up);
        },
      ],
      [
        ShortcutActionName.CellDown,
        () => {
          cellMove(CellDirection.Down);
        },
      ],
      [
        ShortcutActionName.CellLeft,
        () => {
          cellMove(CellDirection.Left);
        },
      ],
      [
        ShortcutActionName.CellRight,
        () => {
          cellMove(CellDirection.Right);
        },
      ],
      [
        ShortcutActionName.CellUpEdge,
        () => {
          cellMove(CellDirection.UpEdge);
        },
      ],
      [
        ShortcutActionName.CellDownEdge,
        () => {
          cellMove(CellDirection.DownEdge);
        },
      ],
      [
        ShortcutActionName.CellLeftEdge,
        () => {
          cellMove(CellDirection.LeftEdge);
        },
      ],
      [
        ShortcutActionName.CellRightEdge,
        () => {
          cellMove(CellDirection.RightEdge);
        },
      ],

      [
        ShortcutActionName.SelectionUp,
        () => {
          selectionMove(RangeDirection.Up);
        },
      ],
      [
        ShortcutActionName.SelectionDown,
        () => {
          selectionMove(RangeDirection.Down);
        },
      ],
      [
        ShortcutActionName.SelectionLeft,
        () => {
          selectionMove(RangeDirection.Left);
        },
      ],
      [
        ShortcutActionName.SelectionRight,
        () => {
          selectionMove(RangeDirection.Right);
        },
      ],
      [
        ShortcutActionName.SelectionUpEdge,
        () => {
          selectionMove(RangeDirection.UpEdge);
        },
      ],
      [
        ShortcutActionName.SelectionDownEdge,
        () => {
          selectionMove(RangeDirection.DownEdge);
        },
      ],
      [
        ShortcutActionName.SelectionLeftEdge,
        () => {
          selectionMove(RangeDirection.LeftEdge);
        },
      ],
      [
        ShortcutActionName.SelectionRightEdge,
        () => {
          selectionMove(RangeDirection.RightEdge);
        },
      ],
      [
        ShortcutActionName.SelectionAll,
        () => {
          selectionMove(RangeDirection.All);
        },
      ],

      [ShortcutActionName.ToggleEditing, toggleEditing],
      [ShortcutActionName.ToggleNextEditing, () => toggleEditing(true)],
      [
        ShortcutActionName.ExitEditing,
        () => {
          exitEdit();
        },
      ],
      [ShortcutActionName.Focus, () => editorRef.current?.focus?.()],
      [ShortcutActionName.CellTab, rightShift],
      [ShortcutActionName.CellShiftTab, leftShift],

      [ShortcutActionName.AppendRow, appendNewRow],
    ]);
    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key as any, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });

  const selectionMove = (direction: RangeDirection) => {
    const state = store.getState();
    const depthBreakpoints = groupSketch.getDepthGroupBreakPoints() || [];
    const newRange = Range.bindModel(selectionRange).move(state, direction, depthBreakpoints);
    /**
     * 除了全选之外，选区的变化过程中，activeCell 一定是在 range 的一个顶点上。
     * 而用户前进的方向一定是 activeCell 在 range 中的对角线另一端的顶点。
     */
    // activeCell 在左上角, scrollTo 右下角
    if (activeCell && newRange) {
      const scroll2cell = Range.bindModel(newRange).getDiagonalCell(state, activeCell);
      if (scroll2cell) {
        const scrollProps = Selectors.getCellUIIndex(state, scroll2cell);
        scrollProps && props.scrollToItem(scrollProps);
      }
    }
    if (newRange) {
      dispatch(StoreActions.setSelection(newRange));
    }
  };

  const groupSketch = useMemo(() => new Group(groupInfo, groupBreakpoint), [groupBreakpoint, groupInfo]);

  /**
   * 目前只有在结束编辑时，根据分组来限制 cellMove，不会影响其它操作（如上下左右移动）
   * @param direction 方向
   * @param isCheckGroup 是否检查分组的边界
   */
  const cellMove = (direction: CellDirection, isCheckGroup = false) => {
    if (!activeCell) {
      return;
    }
    const state = store.getState();
    const depthBreakpoints = groupSketch.getDepthGroupBreakPoints() || [];
    const nextActiveCell = Cell.bindModel(activeCell).move(state, direction, depthBreakpoints);
    if (nextActiveCell == null) return;
    // 考虑分组边界
    if (depthBreakpoints.length && isCheckGroup) {
      const nextRowIndex = visibleRowsIndexMap.get(nextActiveCell.recordId);
      // 当下一个单元格是最深层级分组的起始位置时，不允许移动
      if (depthBreakpoints.findIndex(bp => bp === nextRowIndex) > -1) return;
    }
    const nextCellUIIndex = Selectors.getCellUIIndex(state, nextActiveCell);
    if (nextCellUIIndex) {
      props.scrollToItem(nextCellUIIndex);
    }
    updateActiveCell(nextActiveCell);
    // editorRef.current && editorRef.current.focus();
  };

  const updateActiveCell = (nextActiveCell: ICell) => {
    const state = store.getState();
    const isSideRecordOpen = state.space.isSideRecordOpen;

    cacheNextActiveCell(nextActiveCell);
    dispatch(StoreActions.setActiveCell(datasheetId, nextActiveCell));
    if (isSideRecordOpen) {
      expandRecordIdNavigate(nextActiveCell.recordId);
    }
  };

  const cacheNextActiveCell = (activeCell: ICell | null) => {
    activeCellRef.current = activeCell;
  };

  const handleCopy = (e: ClipboardEvent) => {
    if (editing || (!allowCopyDataToExternal && ConfigConstant.Role.Reader === role)) {
      return;
    }
    resourceService.instance!.clipboard.copy(e.nativeEvent);
  };

  const handleCut = (e: ClipboardEvent) => {
    if (editing || (!allowCopyDataToExternal && ConfigConstant.Role.Reader === role)) {
      return;
    }
    resourceService.instance!.clipboard.cut(e.nativeEvent);
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (editing) {
      return;
    }
    resourceService.instance!.clipboard.paste(e.nativeEvent);
  };

  const calcEditorRect = () => {
    if (!activeCell) {
      return;
    }

    const rect = rectCalculator ? rectCalculator(activeCell) : getCellRelativeRect(activeCell);
    if (rect) {
      const { x, y, width, height } = rect;
      setEditPositionInfo(prev => ({
        x: x || prev.x,
        y: y || prev.y,
        width: width || prev.width,
        height: height || prev.height,
      }));
    }
  };

  const onSave = useCallback(
    (value: ICellValue) => {
      if (!record || !field) {
        return;
      }
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        datasheetId,
        data: [
          {
            recordId: record.id,
            fieldId: field.id,
            value,
          },
        ],
      });

      // URL列开启识别，调用API加载meta信息并额外发起一次SetRecords
      if (field.type === FieldType.URL && field.property?.isRecogURLFlag && Array.isArray(value)) {
        const _value = value as IHyperlinkSegment[];
        const url = _value.reduce((acc: string, cur: IHyperlinkSegment) => (cur.text || '') + acc, '');

        const callback = (meta: IURLMeta) => {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetRecords,
            datasheetId,
            data: [
              {
                recordId: record.id,
                fieldId: field.id,
                value: value.map(v => ({
                  ...v,
                  type: SegmentType.Url,
                  title: meta?.title,
                  favicon: meta?.favicon,
                })),
              },
            ],
          });
        };

        if (isUrl(url)) {
          recognizeURLAndSetTitle({
            url,
            callback,
          });
        }
      }
    },
    [datasheetId, record, field],
  );

  const onSaveForDateCell = useCallback(
    (value: ICellValue, curAlarm: any) => {
      if (!record || !field) {
        return;
      }
      const alarm = Selectors.getDateTimeCellAlarmForClient(snapshot, record.id, field.id);
      // time 允许输入，如果 time 为空值，保存为 00:00
      const formatCurAlarm = curAlarm
        ? {
            ...curAlarm,
            time: curAlarm.time === '' ? '00:00' : curAlarm.time,
          }
        : undefined;

      if (
        // 处理单纯修改提醒，而没有操作日期的情况
        field.type === FieldType.DateTime &&
        isEqual(cellValue, value) &&
        !isEqual(alarm, formatCurAlarm)
      ) {
        resourceService.instance!.commandManager!.execute({
          cmd: CollaCommandName.SetDateTimeCellAlarm,
          recordId: record.id,
          fieldId: field.id,
          alarm: convertAlarmStructure(formatCurAlarm as IRecordAlarmClient) || null,
        });
        return;
      }

      // 考虑同时新增闹钟和日期单元格数据需要合并操作，在这个理处理闹钟逻辑
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        datasheetId,
        alarm: convertAlarmStructure(formatCurAlarm as IRecordAlarmClient),
        data: [
          {
            recordId: record.id,
            fieldId: field.id,
            value,
          },
        ],
      });
    },
    [datasheetId, field, record, cellValue, snapshot],
  );

  useMemo(
    calcEditorRect,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editing, activeCell, editorX, editorY, field],
  );
  // 单元格变化的时候重新计算 rect 要等内容先渲染完，用 useEffect
  useEffect(() => {
    setTimeout(() => {
      calcEditorRect();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellValue, record]);

  const { x, y, width, height } = editPositionInfo;
  const editorRect = useCellEditorVisibleStyle({ editing, width, height });

  const commonProps = {
    datasheetId,
    editable: recordEditable,
    field,
    height,
    width,
    editing,
    gridCellEditor: true,
    onSave,
  };

  function Editor() {
    if (!field || !record) {
      return <NoneEditor style={editorRect} ref={editorRef} {...commonProps} />;
    }
    switch (field.type) {
      case FieldType.Text:
      case FieldType.SingleText:
        return <TextEditor style={editorRect} ref={editorRef} {...commonProps} />;
      case FieldType.URL:
      case FieldType.Email:
      case FieldType.Phone:
        return <EnhanceTextEditor style={editorRect} ref={editorRef} {...commonProps} />;
      case FieldType.Rating:
        return <RatingEditor style={editorRect} ref={editorRef} cellValue={cellValue} {...commonProps} />;
      case FieldType.Checkbox:
        return <CheckboxEditor style={editorRect} ref={editorRef} {...commonProps} cellValue={cellValue} />;
      case FieldType.Attachment:
        return <AttachmentEditor style={editorRect} ref={editorRef} cellValue={cellValue} recordId={record.id} {...commonProps} />;
      case FieldType.SingleSelect:
      case FieldType.MultiSelect:
        return <OptionsEditor style={editorRect} ref={editorRef} recordId={record.id} toggleEditing={toggleEditing} {...commonProps} />;
      case FieldType.Number:
      case FieldType.Currency:
      case FieldType.Percent:
        return <NumberEditor style={editorRect} ref={editorRef} {...commonProps} />;
      case FieldType.DateTime:
        return (
          <DateTimeEditor
            style={editorRect}
            ref={ele => (editorRef.current = ele)}
            {...commonProps}
            recordId={record.id}
            field={field}
            showAlarm
            onSave={onSaveForDateCell}
          />
        );
      case FieldType.Link:
        return (
          <LinkEditor
            style={editorRect}
            ref={editorRef}
            {...commonProps}
            recordId={record.id}
            cellValue={cellValue}
            field={field}
            toggleEditing={toggleEditing}
          />
        );
      case FieldType.Member:
        const state = store.getState();
        const unitMap = Selectors.getUnitMap(state);
        const linkId = Selectors.getLinkId(state);
        return (
          <MemberEditor
            style={editorRect}
            ref={editorRef}
            {...commonProps}
            field={field}
            cellValue={cellValue}
            unitMap={unitMap}
            linkId={linkId}
            toggleEditing={toggleEditing}
            recordId={record.id}
          />
        );
      default:
        return <NoneEditor style={editorRect} ref={editorRef} {...commonProps} />;
    }
  }

  return (
    <div
      className={styles.editorContainer}
      id={EDITOR_CONTAINER}
      style={{ left: x, top: y }}
      onKeyDown={startEditByKeyDown}
      onCopy={handleCopy}
      onCut={handleCut}
      onPaste={handlePaste}
      onMouseDown={stopPropagation}
    >
      {Editor()}
    </div>
  );
};

export const PureEditorContainer = React.memo(forwardRef(EditorContainerBase));

export const EditorContainer = attachEventHoc(PureEditorContainer);
