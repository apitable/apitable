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

import { contextMenuHideAll } from '@apitable/components';
import {
  CellType,
  DATASHEET_ID,
  Field,
  FieldOperateType,
  IGridViewProperty,
  IReduxState,
  RecordMoveType,
  RowHeight,
  RowHeightLevel,
  Selectors,
  StoreActions,
} from '@apitable/core';
import classNames from 'classnames';
import { clamp, debounce, throttle } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { appendRow } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { EXPAND_RECORD } from 'pc/components/expand_record';
import { ScrollContext } from 'pc/context';
import { ButtonOperateType, FIELD_HEAD_CLASS, getElementDataset, getParentNodeByClass, OPERATE_BUTTON_CLASS } from 'pc/utils';
import { checkPointInContainer, getClickCellId } from 'pc/utils/dom';
import { isWindowsOS } from 'pc/utils/os';
import { dispatch } from 'pc/worker/store';
import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { EditorContainer } from '../editors';
import { ScrollBarHorizon } from '../scroll_bar/scroll_bar_horizon';
import { ScrollBarVertical } from '../scroll_bar/scroll_bar_vertical';
import { attachSelection } from '../selection_wrapper';
import { OPERATE_COLUMN_WIDTH } from './cell';
import { GROUP_HEIGHT } from './cell/virtual_cell/cell_group_tab/constant';
import { GRID_VIEW_BLANK_HEIGHT } from './constant';
import { ContextMenu } from './context_menu/context_menu';
import { Drag } from './drag';
import { FieldDesc } from './field_desc';
import { FieldSetting } from './field_setting';
import { GridRef, GridReg, GridViews, GROUP_OFFSET, HEADER_ROW_FIXED_COUNT, HEADER_ROW_HEIGHT, IGridViewsHandle } from './grid_views';
import { IMultiGridOwnProps, IMultiGridOwnStateProps, IMultiGridProps, IMultiGridStateProps, IScrollToItemParams } from './interface';
import { QuickAppend } from './quick_append';
import { RecordWillMoveTips } from './record_will_move_tips/record_will_move_tips';
import { ShallowLine } from './shallow_line';
import styles from './styles.module.less';

const { setHoverRecordId, setActiveFieldState, setHoverRowOfAddRecord, setGridViewHoverFieldId } = StoreActions;

export class MultiGridsBase extends React.PureComponent<IMultiGridProps, IMultiGridOwnStateProps> {
  gridRef: React.RefObject<IGridViewsHandle> = React.createRef();
  static override contextType = ScrollContext;
  eventBundle: Map<ShortcutActionName, () => void> | null = null;
  cacheScrollDomInfo = {
    maxScrollLeft: 0,
    maxScrollTop: 0,
    lastUpdateTime: 0,
  };

  constructor(props: IMultiGridProps) {
    super(props);
    this.state = {
      quickAppendBtnTop: 0,
      quickAppendToolLength: 0,
      scrolling: false,
      scrollLeft: 0,
      scrollTop: 0,
    };
    (window as any).MultiGridsScroll = this.columnScroll;
  }

  override componentDidMount = () => {
    const eventBundle = new Map([
      [
        ShortcutActionName.PageDown,
        () => {
          this.pageUpOrPageDown(true);
        },
      ],
      [
        ShortcutActionName.PageUp,
        () => {
          this.pageUpOrPageDown(false);
        },
      ],
      [
        ShortcutActionName.PageRight,
        () => {
          this.pageLeftOrPageRight(true);
        },
      ],
      [
        ShortcutActionName.PageLeft,
        () => {
          this.pageLeftOrPageRight(false);
        },
      ],
    ]);

    this.eventBundle = eventBundle;

    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key, cb);
    });
    const cacheScroll = this.getCacheScrollPosition();
    if (cacheScroll && (cacheScroll.scrollLeft || cacheScroll.scrollTop)) {
      this.setState(cacheScroll);
    }
  };

  override componentDidUpdate = (preProps: { viewId: string; datasheetId: string; }) => {
    const { viewId, datasheetId } = this.props;
    if (preProps.viewId !== viewId && preProps.datasheetId !== datasheetId) {
      const cacheScroll = this.getCacheScrollPosition();
      cacheScroll && this.setState(cacheScroll);
    }
  };

  getCacheScrollPosition = () => {
    const { viewId, datasheetId } = this.props;
    // @ts-ignore
    const cacheScrollMap = this.context?.cacheScrollMap.current;
    if (!cacheScrollMap) {
      return;
    }
    const cacheScroll = cacheScrollMap[`${datasheetId},${viewId}`];
    let scrollLeft = 0;
    let scrollTop = 0;
    if (cacheScroll) {
      scrollLeft = cacheScroll.scrollLeft;
      scrollTop = cacheScroll.scrollTop;
    }
    return {
      scrollLeft,
      scrollTop,
    };
  };

  override componentWillUnmount = () => {
    if (!this.eventBundle) {
      return;
    }
    this.eventBundle.forEach((_cb, key) => {
      ShortcutActionManager.unbind(key);
    });
  };

  scrollProcessDebounce = debounce(() => {
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    const bottomRightReg = gridRef.getReg(GridReg.BottomRightReg);
    if (!bottomRightReg) {
      return;
    }
    this.setState(
      {
        scrolling: false,
        scrollTop: bottomRightReg.scrollTop,
        scrollLeft: bottomRightReg.scrollLeft,
      },
      () => {
        // @ts-ignore
        this.context.changeCacheScroll && this.context.changeCacheScroll(
          {
            scrollTop: this.state.scrollTop,
            scrollLeft: this.state.scrollLeft,
          },
          this.props.datasheetId,
          this.props.viewId,
        );
      },
    );
  }, 300);

  updateCacheDomInfo = (dom: Element) => {
    const now = Date.now();
    if (now - this.cacheScrollDomInfo.lastUpdateTime > 200) {
      this.cacheScrollDomInfo.maxScrollLeft = dom.scrollWidth - dom.clientWidth;
      this.cacheScrollDomInfo.maxScrollTop = dom.scrollHeight - dom.clientHeight;
      this.cacheScrollDomInfo.lastUpdateTime = now;
    }
  };

  scrollProcess = (scrollData: { scrollTop: number; scrollLeft: number }) => {
    this.scrollProcessDebounce();
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    this.setState({ ...scrollData, scrolling: true });
    gridRef.changeScroll(GridReg.BottomLeftReg, { ...scrollData, scrollLeft: 0 });
    gridRef.changeScroll(GridReg.BottomRightReg, scrollData);
    gridRef.changeScroll(GridReg.UpperRightReg, { ...scrollData, scrollTop: 0 });
    gridRef.changeScroll(GridReg.GroupStatRightReg, { ...scrollData, scrollTop: 0 });
  };

  columnScroll = (e: React.WheelEvent) => {
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    const bottomRightReg = gridRef.getReg(GridReg.BottomRightReg);
    if (!bottomRightReg) {
      return;
    }
    if (!this.state.scrolling) {
      contextMenuHideAll();
    }
    this.updateCacheDomInfo(bottomRightReg);
    const deltaY = e.shiftKey && isWindowsOS() ? 0 : e.deltaY;
    const deltaX = e.shiftKey && isWindowsOS() ? e.deltaY : e.deltaX;
    const scrollLeft = clamp(this.state.scrollLeft + deltaX, 0, this.cacheScrollDomInfo.maxScrollLeft);
    const scrollTop = clamp(this.state.scrollTop + deltaY, 0, this.cacheScrollDomInfo.maxScrollTop);
    this.scrollProcess({
      scrollLeft,
      scrollTop,
    });
  };

  pageUpOrPageDown = (down: boolean) => {
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    const bottomRightReg = gridRef.getReg(GridReg.BottomRightReg);
    if (!bottomRightReg) {
      return;
    }
    const top = bottomRightReg.scrollTop;
    const { height } = this.props;
    const unFixedRowHeight = height - HEADER_ROW_HEIGHT * HEADER_ROW_FIXED_COUNT - 48;
    if (down) {
      this.columnScrollProcess(top + unFixedRowHeight);
      return;
    }
    this.columnScrollProcess(top - unFixedRowHeight);
  };

  pageLeftOrPageRight = (right: boolean) => {
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    const bottomRightReg = gridRef.getReg(GridReg.BottomRightReg);
    if (!bottomRightReg) {
      return;
    }
    const left = bottomRightReg.scrollLeft;
    const { width, frozenColumns } = this.props;
    const fixedColumnWidth = frozenColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), OPERATE_COLUMN_WIDTH);
    const unFixedRowHeight = width - fixedColumnWidth;
    if (right) {
      this.rowScroll(left + unFixedRowHeight);
      return;
    }
    this.rowScroll(left - unFixedRowHeight);
  };

  columnScrollProcess = (dist: number) => {
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    const bottomRightReg = gridRef.getReg(GridReg.BottomRightReg);
    this.updateCacheDomInfo(bottomRightReg);
    this.scrollProcess({
      scrollTop: clamp(dist, 0, this.cacheScrollDomInfo.maxScrollTop),
      scrollLeft: this.state.scrollLeft,
    });
  };

  rowScroll = (dist: number) => {
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    const bottomRightReg = gridRef.getReg(GridReg.BottomRightReg);
    this.updateCacheDomInfo(bottomRightReg);
    this.scrollProcess({
      scrollTop: this.state.scrollTop,
      scrollLeft: clamp(dist, 0, this.cacheScrollDomInfo.maxScrollLeft),
    });
  };

  scrollWhenHitViewEdg = (e: MouseEvent) => {
    const gridRef = this.gridRef.current;
    if (!gridRef) {
      return;
    }
    const bottomRightRect = gridRef.getReg(GridReg.BottomRightReg).getBoundingClientRect();
    if (!bottomRightRect) {
      return;
    }
    const scrollObj = checkPointInContainer({ x: e.clientX, y: e.clientY }, bottomRightRect!, 70);
    if (scrollObj.shouldScroll) {
      this.columnScrollHandler.columnScrollByValue(scrollObj);
    } else {
      this.columnScrollHandler.stopScroll();
    }
  };

  columnScrollHandler = (() => {
    let _stopScroll = false;
    let _scrollObj: any;
    const columnScrollByValue = () => {
      const gridRef = this.gridRef.current;
      if (_stopScroll || !gridRef) {
        return;
      }
      const upperRightRegLeft = gridRef.getReg(GridReg.UpperRightReg).scrollLeft;
      const groupStatRightRefLeft = gridRef.getReg(GridReg.GroupStatRightReg).scrollLeft;
      const bottomRightRegLeft = gridRef.getReg(GridReg.BottomRightReg).scrollLeft;
      const bottomLeftRegTop = gridRef.getReg(GridReg.BottomLeftReg).scrollTop;
      const bottomRightRegTop = gridRef.getReg(GridReg.BottomRightReg).scrollTop;
      gridRef.changeScroll(GridReg.UpperRightReg, { scrollLeft: upperRightRegLeft + _scrollObj.rowSpeed, scrollTop: 0 });
      gridRef.changeScroll(GridReg.GroupStatRightReg, { scrollLeft: groupStatRightRefLeft + _scrollObj.rowSpeed, scrollTop: 0 });
      gridRef.changeScroll(GridReg.BottomRightReg, {
        scrollLeft: bottomRightRegLeft + _scrollObj.rowSpeed,
        scrollTop: bottomRightRegTop + _scrollObj.columnSpeed,
      });
      gridRef.changeScroll(GridReg.BottomLeftReg, { scrollTop: bottomLeftRegTop + _scrollObj.columnSpeed, scrollLeft: 0 });
      // @ts-ignore
      this.context.changeCacheScroll && this.context.changeCacheScroll(
        {
          scrollTop: bottomRightRegTop + _scrollObj.columnSpeed,
          scrollLeft: bottomRightRegLeft + _scrollObj.rowSpeed,
        },
        this.props.datasheetId,
        this.props.viewId,
      );
      window.requestAnimationFrame(columnScrollByValue);
    };

    const stopScroll = () => {
      _stopScroll = true;
    };

    return {
      columnScrollByValue: (scrollObj: any) => {
        _stopScroll = false;
        _scrollObj = scrollObj;
        columnScrollByValue();
      },
      stopScroll,
      getStopType() {
        return _stopScroll;
      },
    };
  })();

  clickFieldHead = (target: HTMLElement, type?: string | null): void => {
    const { datasheetId, permissions } = this.props;
    const headerEle = getParentNodeByClass(target, FIELD_HEAD_CLASS);
    if (!headerEle) {
      return;
    }
    const fieldId = getElementDataset(headerEle, 'fieldId');
    const columnIndex = getElementDataset(headerEle, 'columnIndex');
    if (!columnIndex) {
      return;
    }
    const field = this.props.snapshot.meta.fieldMap[fieldId!];

    if (field && !Field.bindModel(field).propertyEditable()) {
      return;
    }

    if (!field && !permissions.fieldCreatable) {
      return;
    }

    const fieldRect = headerEle.getBoundingClientRect();
    const bottom = fieldRect.bottom;
    const left = fieldRect.left;
    const isOperatingFieldSet = type === ButtonOperateType.OpenFieldSetting || type === ButtonOperateType.AddField;
    const { scrollLeft = 0 } = this.state;
    dispatch(
      setActiveFieldState(datasheetId, {
        fieldId: fieldId || ButtonOperateType.AddField,
        fieldRectLeft: left,
        fieldRectBottom: bottom,
        clickLogOffsetX: scrollLeft,
        fieldIndex: parseInt(columnIndex, 10),
        operate: isOperatingFieldSet ? FieldOperateType.FieldSetting : FieldOperateType.FieldDesc,
      }),
    );
  };

  onClick = async(e: React.MouseEvent<HTMLDivElement>): Promise<void> => {
    const { permissions } = this.props;
    const target = e.target as HTMLElement;
    const element = getParentNodeByClass(target, OPERATE_BUTTON_CLASS);

    if (!element) {
      return;
    }
    const operateType = getElementDataset(element, 'operateType');

    if (operateType === ButtonOperateType.AddRecord && permissions.rowCreatable) {
      const recordId = getElementDataset(element, 'recordId');
      await appendRow({ recordId: recordId || '' });
      return;
    }
    return this.clickFieldHead(element.parentNode as HTMLElement, operateType);
  };

  onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onMouseDown && this.props.onMouseDown(e);
  };

  onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onMouseMove && this.props.onMouseMove(e);
  };

  onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.props.permissions.fieldPropertyEditable) {
      return;
    }
    const target = e.target as HTMLElement;
    const element = getParentNodeByClass(target, FIELD_HEAD_CLASS);
    if (element) {
      e.nativeEvent.stopImmediatePropagation();
      this.clickFieldHead(element, ButtonOperateType.OpenFieldSetting);
      return;
    }
  };

  scrollToItem = (props: IScrollToItemParams) => {
    const gridRef = this.gridRef.current!;
    if (!gridRef) {
      return;
    }
    const { frozenColumns } = this.props;
    this.updateScrollOffset(gridRef);
    /**
     * No special judgments are needed if you don't move columns
     */
    if (props.columnIndex == null) {
      gridRef.scrollToItem(GridRef.BottomLeftRef, props);
      gridRef.scrollToItem(GridRef.BottomRightRef, props);
      return;
    }
    /**
     * If you need to display the columns in the frozen area, 
     * the index of the columns in the non-frozen area should be subtracted from the columns 
     * in the frozen area to match the target columns with the columns in the component
     */
    if (props.columnIndex >= frozenColumns.length) {
      gridRef.scrollToItem(GridRef.BottomLeftRef, props);
      gridRef.scrollToItem(GridRef.BottomRightRef, { ...props, columnIndex: props.columnIndex - frozenColumns.length });
      gridRef.scrollToItem(GridRef.UpperRightRef, { ...props, columnIndex: props.columnIndex - frozenColumns.length });
      return;
    }
    /**
     * If the column to be moved is in the freeze zone, the column is ignored and only the row is moved
     */
    gridRef.scrollToItem(GridRef.BottomLeftRef, { align: props.align, rowIndex: props.rowIndex });
    gridRef.scrollToItem(GridRef.BottomRightRef, { align: props.align, rowIndex: props.rowIndex });
  };

  updateScrollOffset = (gridRef: IGridViewsHandle) => {
    const bottomRightReg = gridRef.getReg(GridReg.BottomRightReg);
    if (!bottomRightReg) {
      return;
    }
    const top = bottomRightReg.scrollTop;
    const left = bottomRightReg.scrollLeft;
    this.scrollProcess({ scrollLeft: left, scrollTop: top });
  };

  getBottomRightTop = () => {
    const bottomRightReg = this.gridRef.current?.getReg(GridReg.BottomRightReg);
    if (!bottomRightReg) {
      return 0;
    }
    return bottomRightReg.getBoundingClientRect().top;
  };

  showQuickAppendRows = (recordId: string) => {
    const targetRow = document.querySelectorAll(`[data-record-id="${recordId}"]`);
    const lastColumnTarget = targetRow[targetRow.length - 1] as HTMLDivElement;
    if (!lastColumnTarget) {
      return;
    }
    const lastColumnRect = lastColumnTarget.getBoundingClientRect();
    const lastColumnWidth = lastColumnTarget.offsetWidth;
    const lastColumnLeft = lastColumnRect.left;
    const firstColumnRect = (targetRow[0] as HTMLDivElement).getBoundingClientRect();
    const quickAppendToolLength = lastColumnLeft + lastColumnWidth - firstColumnRect.left;
    this.setState({
      quickAppendBtnTop: firstColumnRect.top,
      quickAppendToolLength,
    });
  };

  getHoverRowOfAddRecord = (target: HTMLElement) => {
    const element = getParentNodeByClass(target, [OPERATE_BUTTON_CLASS]);
    return getElementDataset(element, 'operateType') === ButtonOperateType.AddRecord ? getElementDataset(element, 'path') : null;
  };

  updateHoverInfo = throttle((target: HTMLElement) => {
    const { recordId, fieldId } = getClickCellId(target);
    const hoverAddRecord = this.getHoverRowOfAddRecord(target);

    if (recordId && recordId === this.props.gridViewDragState.hoverRecordId && fieldId && fieldId === this.props.gridViewHoverFieldId) {
      return;
    }

    const datasheetId = this.props.datasheetId;
    dispatch(
      batchActions([
        setHoverRecordId(datasheetId, recordId || null),
        setGridViewHoverFieldId(fieldId || null, datasheetId),
        setHoverRowOfAddRecord(datasheetId, hoverAddRecord || null),
      ]),
    );

    recordId && this.showQuickAppendRows(recordId);
  }, 50);

  /**
   * @description Listening to the current mouse hover row
   * Dragging in will prevent the event from occurring
   * @memberof MultiGridsBase
   */
  onMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    // When dragging action is in progress, block listening to the current action
    if (this.state.scrolling) {
      return;
    }
    const target = e.target as HTMLElement;
    this.updateHoverInfo(target);
  };

  onMouseLeave = () => {
    const datasheetId = this.props.datasheetId;
    dispatch(
      batchActions([setHoverRecordId(datasheetId, null), setGridViewHoverFieldId(null, datasheetId), setHoverRowOfAddRecord(datasheetId, null)]),
    );
  };

  onMouseUp = (e: React.MouseEvent) => {
    this.props.onMouseUp && this.props.onMouseUp(e);
  };

  onContextMenu = () => {
    this.props.onContextMenu && this.props.onContextMenu();
  };

  calcTotalRowHeight = () => {
    const { rows, rowHeight, view, linearRows } = this.props;
    // The bottom of the view will have 150 pixels of height holding up a portion of the blank area
    if (view.groupInfo && view.groupInfo.length) {
      return (
        linearRows.reduce((height, cur) => {
          if (cur.type === CellType.Record) {
            height += rowHeight;
          }
          if (cur.type === CellType.GroupTab) {
            height += GROUP_HEIGHT;
          }
          if (cur.type === CellType.Blank) {
            height += 10;
          }
          if (cur.type === CellType.Add) {
            height += RowHeight.Short;
          }
          return height;
        }, 0) + GRID_VIEW_BLANK_HEIGHT
      );
    }
    return rows.length * rowHeight + GRID_VIEW_BLANK_HEIGHT;
  };

  setScrollState = (props: { scrollLeft?: number; scrollTop?: number }) => {
    this.setState({
      ...this.state,
      ...props,
    });
  };

  override render() {
    const {
      height,
      width,
      frozenColumns,
      exceptFrozenColumns,
      linearRows,
      rowHeight,
      activeFieldId,
      view,
      activeFieldOperateType,
      permissions,
      isEditing,
      gridViewDragState,
      recordMoveType,
    } = this.props;
    const showTips = recordMoveType && [RecordMoveType.WillMove, RecordMoveType.OutOfView].includes(recordMoveType);
    const { quickAppendBtnTop, quickAppendToolLength, scrolling, scrollLeft, scrollTop } = this.state;

    const fixedRowHeight = HEADER_ROW_HEIGHT * HEADER_ROW_FIXED_COUNT;
    const fixedColumnWidth = frozenColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), OPERATE_COLUMN_WIDTH);
    const unFixedRowHeight = height - fixedRowHeight;
    const unFixedColumnWidth = width - fixedColumnWidth;
    const scrollWidth = exceptFrozenColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), 0);
    const scrollHeight = this.calcTotalRowHeight();
    const groupOffset = view.groupInfo ? (view.groupInfo.length - 1) * GROUP_OFFSET : 0;
    const { hoverRecordId, dragTarget } = gridViewDragState;
    const BOTTOM_RIGHT_TOP = this.getBottomRightTop();
    const { editable } = permissions;
    const showQuickAppendTool = Boolean(
      !scrolling &&
        hoverRecordId &&
        // No display when dragging rows
        !dragTarget.recordId &&
        quickAppendBtnTop >= BOTTOM_RIGHT_TOP &&
        editable,
    );
    // TODO: Group states are aligned with the normal state border
    const offsetY = BOTTOM_RIGHT_TOP - fixedRowHeight - (groupOffset > 0 ? 1 : 0);

    return (
      <Fragment>
        <div
          id={DATASHEET_ID.DOM_CONTAINER}
          className={classNames(styles.multiGrid, { isEditing })}
          data-scrolling={scrolling}
          onMouseDown={this.onMouseDown}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          onContextMenu={this.onContextMenu}
          onWheel={this.columnScroll}
          ref={this.props.refs}
          style={{ height: '100%', width: '100%', position: 'relative' }}
        >
          {showQuickAppendTool && (
            <QuickAppend hoverRecordId={hoverRecordId!} top={quickAppendBtnTop - offsetY} left={groupOffset} length={quickAppendToolLength} />
          )}
          <GridViews
            ref={this.gridRef}
            frozenColumns={frozenColumns}
            exceptFrozenColumns={exceptFrozenColumns}
            rowHeight={rowHeight}
            rows={linearRows}
            fixedRowHeight={fixedRowHeight}
            fixedColumnWidth={fixedColumnWidth}
            unFixedColumnWidth={unFixedColumnWidth}
            unFixedRowHeight={unFixedRowHeight}
            scrollLeft={this.state.scrollLeft}
            scrollTop={this.state.scrollTop}
            setScrollState={this.setScrollState}
          />

          <EditorContainer scrollToItem={this.scrollToItem} parentRef={this.props.refs} scrollLeft={scrollLeft} scrollTop={scrollTop} />

          {showTips && <RecordWillMoveTips rowHeight={rowHeight} />}
        </div>
        <ScrollBarVertical
          scrollTop={scrollTop}
          gridVisibleLength={height}
          scrollAreaLength={height - fixedRowHeight}
          dataTotalLength={scrollHeight}
          onGridScroll={this.columnScrollProcess}
        />
        <ScrollBarHorizon
          scrollLeft={scrollLeft}
          gridVisibleLength={width - 20}
          dataTotalLength={scrollWidth + 200}
          scrollAreaLength={width - fixedColumnWidth - 30}
          onGridScroll={this.rowScroll}
        />
        {activeFieldId && activeFieldOperateType === FieldOperateType.FieldSetting && !document.querySelector(`.${EXPAND_RECORD}`) && (
          <FieldSetting scrollToItem={this.scrollToItem} />
        )}
        {activeFieldId && activeFieldOperateType === FieldOperateType.FieldDesc && !document.querySelector(`.${EXPAND_RECORD}`) && (
          <FieldDesc fieldId={activeFieldId} readOnly={!permissions.descriptionEditable} datasheetId={this.props.datasheetId} />
        )}
        <ContextMenu parentRef={this.props.refs} />
        <Drag height={height} width={width} rowHeight={rowHeight} gridRef={this.props.refs} scrollWhenHitViewEdg={this.scrollWhenHitViewEdg} />
        <ShallowLine scrollLeft={scrollLeft} groupOffset={groupOffset} frozenColumns={frozenColumns} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state: IReduxState): IMultiGridStateProps => {
  const view = Selectors.getCurrentView(state)! as IGridViewProperty;
  const { fieldId, operate } = Selectors.gridViewActiveFieldState(state);
  const recordMoveType = Selectors.getRecordMoveType(state);

  return {
    view,
    snapshot: Selectors.getSnapshot(state)!,
    datasheetId: Selectors.getActiveDatasheetId(state)!,
    viewId: Selectors.getActiveViewId(state)!,
    selection: Selectors.getSelectRanges(state),
    fillHandleStatus: Selectors.getFillHandleStatus(state),
    columnCount: Selectors.getVisibleColumnCount(state),
    columns: Selectors.getVisibleColumns(state),
    frozenColumns: Selectors.getFrozenColumns(state),
    exceptFrozenColumns: Selectors.getExceptFrozenColumns(state),
    rowHeight: Selectors.getRowHeightFromLevel(view && view.rowHeightLevel ? view.rowHeightLevel : RowHeightLevel.Short),
    gridViewDragState: Selectors.getGridViewDragState(state),
    activeFieldId: fieldId,
    activeFieldOperateType: operate,
    activeCell: Selectors.getActiveCell(state),
    recordMoveType,
    fieldRanges: Selectors.getFieldRanges(state),
    permissions: Selectors.getPermissions(state),
    isEditing: Boolean(Selectors.getEditingCell(state)),
    gridViewHoverFieldId: Selectors.getGridViewHoverFieldId(state),
  };
};

// eslint-disable-next-line
export const GridViewContainer: any = connect<IMultiGridStateProps, {}, IMultiGridOwnProps, IReduxState>(
  mapStateToProps,
  {},
)(attachSelection(MultiGridsBase));
