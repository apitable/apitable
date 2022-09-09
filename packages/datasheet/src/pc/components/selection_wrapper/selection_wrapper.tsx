import {
  CollaCommandName, DATASHEET_ID, ExecuteResult, Field, FieldType, FillDirection, handleEmptyCellValue, ICell, IRange, Range, Selectors, StoreActions,
  Strings, t,
} from '@vikadata/core';
import { zip } from 'lodash';
import { notify } from 'pc/components/common/notify';
import { IMultiGridProps } from 'pc/components/multi_grid/interface';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { CELL_CLASS, getParentNodeByClass } from 'pc/utils';
import { getClickCellId } from 'pc/utils/dom';
import * as React from 'react';
import { NotifyKey } from '../common/notify/notify.interface';
import { MultiGridsBase } from '../multi_grid';

const { setSelection, setFillHandleStatus } = StoreActions;

export enum MouseDownType {
  Left,
  Center,
  Right,
}

export interface ISelectionProps extends IMultiGridProps {
  selection: IRange[]; // IRange[] | ICurrentOperate[];
}

export const attachSelection = WrappedComponent => {
  return class extends React.Component<ISelectionProps> {
    gridRef = React.createRef<HTMLElement>();
    wrappedComponentRef = React.createRef<MultiGridsBase>();
    shouldScroll = false;
    isDrag = false;
    isDown = false;
    originPageX = 0;
    mouseOffset = {
      row: 0,
      column: 0,
    };

    // 单元格按下
    // 这里的操作限定和直接和选取相关的，亦直接对cell的操作，除此以外像是列宽和拖动都不在这里处理
    mouseDown = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const element = getParentNodeByClass(target, CELL_CLASS);
      const client = Selectors.getDatasheetClient(store.getState());
      if (client && client.gridViewActiveFieldState.fieldId) {
        return;
      }
      if (!element && !(target.id === DATASHEET_ID.FILL_HANDLE_AREA)) {
        return;
      }
      if (e.button !== MouseDownType.Left) {
        return;
      }
      this.isDown = true;
    };

    // 单元格上拖动事件
    // Note: 目前在视图区域所有涉及操作的 mouseDown 事件，统一设置 isDown 为 true，
    // 因此 mousemove 事件中需要对不同的情况加以处理，适当的提前返回程序
    // TODO:  拆分出对于不同事件，不同的 mousemove 处理逻辑，目前的有些混乱
    mouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const isDown = this.isDown;
      if (!(isDown && this.gridRef.current && this.wrappedComponentRef.current)) {
        return;
      }
      this.wrappedComponentRef.current.scrollWhenHitViewEdg(e);
      const { activeCell } = this.props;
      const { fieldId, recordId } = getClickCellId(e.target as HTMLElement);
      const hoverCell = { fieldId: fieldId!, recordId: recordId! };
      if (!recordId || !fieldId) {
        return;
      }
      if (!activeCell) {
        return;
      }
      const { fillHandleStatus } = this.props;
      const isFillHandleActive = Boolean(fillHandleStatus && fillHandleStatus.isActive);

      // 按下填充把手后，选区不再改变
      if (isFillHandleActive) {
        return store.dispatch(setFillHandleStatus({
          isActive: true,
          hoverCell,
        }));
      }

      return store.dispatch(setSelection({
        start: activeCell,
        end: hoverCell,
      }));
    };

    // 单元格上松开事件
    mouseUp = async() => {
      const state = store.getState();
      this.wrappedComponentRef.current!.columnScrollHandler.stopScroll();
      const selectRanges = Selectors.getSelectRanges(state);
      if (!this.isDown) {
        return;
      }
      this.isDown = false;
      const { fillHandleStatus } = this.props;
      // 填充选区结束
      if (fillHandleStatus && fillHandleStatus.isActive && fillHandleStatus.fillRange) {
        await this.preFetchUnitMapIfNeed(
          selectRanges, fillHandleStatus.fillRange, fillHandleStatus.direction,
        );
        const { result } = resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.FillDataToCells,
          selectionRange: this.props.selection,
          fillRange: fillHandleStatus.fillRange,
          direction: fillHandleStatus.direction,
        });
        if (result !== ExecuteResult.Fail) {
          const range = Range.bindModel(selectRanges[0]).combine(state, fillHandleStatus.fillRange!);
          if (range) {
            store.dispatch(setSelection(range));
          }
          store.dispatch(setFillHandleStatus({
            isActive: false,
          }));
          notify.open({
            message: t(Strings.toast_cell_fill_success),
            key: NotifyKey.FillCell,
          });
          return;
        }
      }
    };

    onContextMenu = () => {
      this.isDown = false;
    };

    componentDidMount() {
      document.addEventListener('mouseup', this.onContextMenu);
    }

    componentWillUnmount() {
      document.removeEventListener('mouseup', this.onContextMenu);
    }

    // 横向填充之前，
    preFetchUnitMapIfNeed(
      selectionRange: IRange[], fillRange?: IRange, direction?: FillDirection
    ) {
      const state = store.getState();
      const snapshot = Selectors.getSnapshot(state)!;
      if (direction !== FillDirection.Left && direction !== FillDirection.Right) {
        return;
      }
      if (!fillRange || !selectionRange) {
        return;
      }
      const selectionRangeCells = Selectors.getCellMatrixFromRange(state, selectionRange[0]);
      const fillRangeCells = Selectors.getCellMatrixFromRange(state, fillRange);
      if (!selectionRangeCells || !fillRangeCells) {
        return;
      }
      const needLoadMemberNames: string[] = [];
      const selectCells = zip(...selectionRangeCells).flat() as ICell[];
      const fillCells = zip(...fillRangeCells).flat() as ICell[];
      if (direction === FillDirection.Left) {
        selectCells.reverse();
        fillCells.reverse();
      }
      for (let i = 0; i < fillCells.length; i++) {
        const cellIndex = i % selectCells.length;
        const selectCell = selectCells[cellIndex];
        const fillCell = fillCells[i];
        const fieldId = fillCell.fieldId;
        const field = Selectors.getField(state, fieldId, snapshot.datasheetId);
        const selectField = Selectors.getField(state, selectCell.fieldId, snapshot.datasheetId);
        if (field.type === FieldType.Member) {
          let cv = Selectors.getCellValue(state, snapshot, selectCell.recordId, selectCell.fieldId);
          cv = handleEmptyCellValue(cv, Field.bindModel(field).basicValueType);
          const stdVal = Field.bindModel(selectField).cellValueToStdValue(cv);
          stdVal.data[0] && needLoadMemberNames.push(stdVal.data[0].text);
        }
      }
      if (needLoadMemberNames.length) {
        const linkId = Selectors.getLinkId(store.getState());
        return store.dispatch(StoreActions.loadLackUnitMap(needLoadMemberNames.join(','), linkId) as any);
      }
    }

    render() {
      const props = { ...this.props, refs: this.gridRef };
      return (
        <WrappedComponent
          ref={this.wrappedComponentRef}
          onMouseMove={this.mouseMove}
          onMouseDown={this.mouseDown}
          onMouseUp={this.mouseUp}
          onContextMenu={this.onContextMenu}
          {...props}
        />
      );
    }
  };
};
