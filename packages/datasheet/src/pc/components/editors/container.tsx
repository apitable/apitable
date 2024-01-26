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

import { useUnmount } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, isEqual, noop, omit } from 'lodash';
import * as React from 'react';
import { ClipboardEvent, forwardRef, KeyboardEvent, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Message } from '@apitable/components';
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
  IDateTimeField,
  IField,
  IHyperlinkSegment,
  IRange,
  IRecord,
  IRecordAlarmClient,
  ISelection,
  isUrl,
  Range,
  RangeDirection,
  SegmentType,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { ContextName, ShortcutActionManager, ShortcutActionName, ShortcutContext } from 'modules/shared/shortcut_key';
import { appendRow } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { autoTaskScheduling } from 'pc/components/gantt_view/utils/auto_task_line_layout';
import { useDispatch } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { IURLMeta, printableKey, recognizeURLAndSetTitle, stopPropagation } from 'pc/utils';
import { EDITOR_CONTAINER } from 'pc/utils/constant';
import { expandRecordIdNavigate } from '../expand_record';
import { IEditorContainerOwnProps } from './attach_event_hoc';
import { AttachmentEditor } from './attachment_editor';
import { CascaderEditor } from './cascader_editor';
import { CheckboxEditor } from './checkbox_editor';
import { DateTimeEditor } from './date_time_editor';
import { setEndEditCell } from './end_edit_cell';
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
import { TextEditor } from './text_editor';
import { WorkdocEditor } from './workdoc_editor/workdoc_editor';
// @ts-ignore
import { convertAlarmStructure } from 'enterprise/alarm/date_time_alarm/utils';
import styles from './style.module.less';

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

// TODO: Distinguish between SimpleEditor and customEditor
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
  const collaborators = useAppSelector((state) => Selectors.collaboratorSelector(state));
  const userTimeZone = useAppSelector(Selectors.getUserTimeZone)!;
  const snapshot = useAppSelector((state) => Selectors.getSnapshot(state)!);
  const cellValue = useAppSelector((state) => {
    if (field && !Field.bindModel(field).isComputed && record) {
      return Selectors.getCellValue(state, snapshot, record.id, field.id);
    }
    return null;
  });
  const viewId = useAppSelector((state) => Selectors.getActiveViewId(state))!;
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state))!;
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const recordEditable = field ? Field.bindModel(field).recordEditable() : false;
  // workdoc cellValue not empty can expand and read
  const isWorkdoc = field?.type === FieldType.WorkDoc && !isEmpty(cellValue);
  const isRecordExpanded = useAppSelector((state) => Boolean(state.pageParams.recordId));
  const previewModalVisible = useAppSelector((state) => state.space.previewModalVisible);
  const allowCopyDataToExternal = useAppSelector((state) => {
    const _allowCopyDataToExternal = state.space.spaceFeatures?.allowCopyDataToExternal || state.share.allowCopyDataToExternal;
    return Boolean(_allowCopyDataToExternal);
  });
  const role = useAppSelector((state) => Selectors.getDatasheet(state, datasheetId)!.role);
  const { groupInfo, groupBreakpoint, visibleRowsIndexMap } = useAppSelector(
    (state) => ({
      groupInfo: Selectors.getActiveViewGroupInfo(state),
      groupBreakpoint: Selectors.getGroupBreakpoint(state),
      visibleRowsIndexMap: Selectors.getPureVisibleRowsIndexMap(state),
    }),
    shallowEqual,
  );

  const activeView = useAppSelector((state) => Selectors.getCurrentView(state));
  const visibleRows = useAppSelector((state) => Selectors.getVisibleRows(state));

  // FIXME: Here we are still using the component's internal editing control state, using redux's isEditing state, the edit box will blink a little.
  const [editing, setEditing] = useState(false);
  const editorX = !editing ? 0 : -scrollLeft!;
  const editorY = !editing ? 0 : -scrollTop!;
  const editorRef = useRef<IEditor | null>(null);
  /**
   * activeCellRef exists to address single-multi-select, member fields that are interacted with via pop-up components,
   * notable for their ability to switch between editing and !
   * The flow is such that clicking on a different cell saves the data of the previous cell -> activates the next cell,
   * clicking on itself should not change it
   * Another special feature of single-multi-selection is that the editing component is not hovered over the corresponding cell,
   * so that every click on the cell triggers the normal flow described above,
   * the editing state switch is broken and the component can never be displayed properly.
   * So you need a value to remember who the 'last' cell was, so that for single and multiple selections,
   * you can tell if you are clicking on the same cell again and stop the editing state switching from being broken
   *
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
    // workdoc field editing should disable datasheet shortcut
    if (editing && field.type === FieldType.WorkDoc) {
      return;
    }
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
   * @description Putting the current selection into edit mode
   * Here, if keepValue is true, it means that the data stored in the current store needs to be kept and edited on this basis
   * is false, it means that the store is not used even if the data is saved and the editing is completely restarted
   *
   */
  const startEdit = (keepValue = false) => {
    if (!recordEditable && !isWorkdoc) {
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

  const endEdit = useCallback(
    (cancel = false) => {
      if (!editing) {
        return;
      }
      const editorRefCurrent = editorRef.current!;
      editorRefCurrent.onEndEdit && editorRefCurrent.onEndEdit(cancel);
      setEditing(false);
      dispatch(StoreActions.setEditStatus(datasheetId, null));
    },
    [datasheetId, dispatch, editing],
  );

  // Exposing endEdit
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
    if (selection?.ranges || selection?.recordRanges) {
      focus();
    }
    // eslint-disable-next-line
  }, [selection]);

  useEffect(() => {
    /**
     *
     * sendCursor > room-server > broadcast ENGAGEMENT_CURSOR >
     * client on ENGAGEMENT_CURSOR > handleCursor > dispatch(cursorMove)
     */

    if (!field || !record) {
      return;
    }
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

  const getCellRelativeRect = (cell: ICell) => {
    const containerDom = document.getElementById(DATASHEET_ID.DOM_CONTAINER);

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
          if (delta < containerSize - selfSize) {
            return delta;
          }

          return containerSize - selfSize - safeBorder;
        }
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
    if (!recordEditable && !isWorkdoc) {
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

  const appendNewRow = async () => {
    await appendRow();
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
   * Currently, cellMove is only restricted by grouping at the end of editing and does not affect other operations
   *  (e.g. moving up, down, left, right, left)
   * @param direction
   * @param isCheckGroup
   */
  const cellMove = (direction: CellDirection, isCheckGroup = false) => {
    if (!activeCell) {
      return;
    }
    const state = store.getState();
    const depthBreakpoints = groupSketch.getDepthGroupBreakPoints() || [];
    const nextActiveCell = Cell.bindModel(activeCell).move(state, direction, depthBreakpoints);
    if (nextActiveCell == null) return;
    // Consider group boundaries
    if (depthBreakpoints.length && isCheckGroup) {
      const nextRowIndex = visibleRowsIndexMap.get(nextActiveCell.recordId);
      // No movement is allowed when the next cell is the starting position of the deepest level grouping
      if (depthBreakpoints.findIndex((bp) => bp === nextRowIndex) > -1) return;
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
      setEditPositionInfo((prev) => ({
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

      // URL column recognition is turned on, the API is called to load the meta information and initiate an additional SetRecords
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
                value: value.map((v: any) => ({
                  ...v,
                  type: SegmentType.Url,
                  title: meta?.title,
                  favicon: meta?.favicon,
                })),
              },
            ],
          });
        };

        if (isUrl(url) && cellValue?.[0].text !== (value[0] as any)?.text) {
          recognizeURLAndSetTitle({
            url,
            callback,
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datasheetId, record, field],
  );

  const onSaveForDateCell = useCallback(
    (value: ICellValue, curAlarm: any) => {
      if (!record || !field) {
        return;
      }
      const alarm = Selectors.getDateTimeCellAlarmForClient(snapshot, record.id, field.id);

      let formatCurAlarm = curAlarm;

      if (curAlarm) {
        const subtractMatch = curAlarm?.subtract?.match(/^([0-9]+)(\w{1,2})$/);
        if (!curAlarm?.subtract || (subtractMatch[2] !== 'm' && subtractMatch[2] !== 'h')) {
          const noChange = curAlarm?.alarmAt && !curAlarm?.time;
          if (!noChange && cellValue) {
            const timeZone = (field as IDateTimeField).property.timeZone || userTimeZone;
            let alarmAt = timeZone ? dayjs.tz(cellValue).tz(timeZone) : dayjs.tz(cellValue);
            if (subtractMatch) {
              alarmAt = alarmAt.subtract(Number(subtractMatch[1]), subtractMatch[2]);
            }
            const time = curAlarm?.time || (timeZone ? dayjs.tz(curAlarm?.alarmAt).tz(timeZone) : dayjs.tz(curAlarm?.alarmAt)).format('HH:mm');
            alarmAt = dayjs.tz(`${alarmAt.format('YYYY-MM-DD')} ${time}`, timeZone);
            formatCurAlarm = {
              ...omit(formatCurAlarm, 'time'),
              alarmAt: alarmAt.valueOf(),
            };
          }
        }
      }

      if (field.type === FieldType.DateTime && isEqual(cellValue, value) && !isEqual(alarm, formatCurAlarm) && convertAlarmStructure) {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetDateTimeCellAlarm,
          recordId: record.id,
          fieldId: field.id,
          alarm: convertAlarmStructure(formatCurAlarm as IRecordAlarmClient) || null,
        });
      } else {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetRecords,
          datasheetId,
          alarm: convertAlarmStructure ? convertAlarmStructure(formatCurAlarm as IRecordAlarmClient) : undefined,
          data: [
            {
              recordId: record.id,
              fieldId: field.id,
              value,
            },
          ],
        });
      }

      if (activeView && activeView.type === ViewType.Gantt) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { linkFieldId, endFieldId } = activeView?.style;
        if (!(linkFieldId && endFieldId === field.id)) return;
        const sourceRecordData = {
          recordId: record!.id,
          endTime: value as number | null,
        };
        const commandDataArr = autoTaskScheduling(visibleRows, activeView.style, sourceRecordData);
        resourceService.instance?.commandManager.execute({
          cmd: CollaCommandName.SetRecords,
          data: commandDataArr,
        });
      }
    },
    [datasheetId, field, record, cellValue, snapshot, activeView, visibleRows],
  );

  useMemo(
    calcEditorRect,
    // eslint-disable-next-line
    [editing, activeCell, editorX, editorY, field],
  );
  useEffect(() => {
    setTimeout(() => {
      calcEditorRect();
    }, 0);
    // eslint-disable-next-line
  }, [cellValue, record]);

  useEffect(() => {
    const onUnload = () => endEdit();
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [endEdit]);

  const { x, y, width, height } = editPositionInfo;
  const editorRect = useCellEditorVisibleStyle({ editing, width, height });

  const commonProps = {
    datasheetId,
    editable: recordEditable,
    disabled: !recordEditable,
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
      case FieldType.Cascader:
        return <CascaderEditor style={editorRect} ref={editorRef} {...commonProps} field={field} toggleEditing={toggleEditing} />;
      case FieldType.URL:
      case FieldType.Email:
      case FieldType.Phone:
        return <EnhanceTextEditor style={editorRect} ref={editorRef} recordId={record.id} setEditing={setEditing} {...commonProps} />;
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
            ref={(ele) => (editorRef.current = ele)}
            {...commonProps}
            recordId={record.id}
            field={field}
            showAlarm
            onSave={onSaveForDateCell}
          />
        );
      case FieldType.Link:
      case FieldType.OneWayLink:
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
      case FieldType.WorkDoc:
        return <WorkdocEditor ref={editorRef} toggleEditing={toggleEditing} recordId={record.id} cellValue={cellValue} {...commonProps} />;
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
