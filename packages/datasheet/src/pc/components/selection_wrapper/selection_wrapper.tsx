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
  CollaCommandName, DATASHEET_ID, ExecuteResult, Field, FieldType, FillDirection, handleEmptyCellValue, ICell, IRange, Range, Selectors, StoreActions,
  Strings, t,
} from '@apitable/core';
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

export const attachSelection = (WrappedComponent: any) => {
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

    // The operation here is limited and directly related to the selection, and also directly to the cell operation, 
    // except for the column width and dragging are not handled here
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

    // Note: Currently, all mouseDown events in the view area involving operations are set to true, 
    // so the mousemove event needs to handle different cases and return to the program in advance, as appropriate.
    // TODO:  Split out the mousemove processing logic for different events, the current one is a bit confusing
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

      // When the fill handle is pressed, the selection is no longer changed
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

    mouseUp = async() => {
      const state = store.getState();
      this.wrappedComponentRef.current!.columnScrollHandler.stopScroll();
      const selectRanges = Selectors.getSelectRanges(state);
      if (!this.isDown) {
        return;
      }
      this.isDown = false;
      const { fillHandleStatus } = this.props;
      // End of fill selection
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

    override componentDidMount() {
      document.addEventListener('mouseup', this.onContextMenu);
    }

    override componentWillUnmount() {
      document.removeEventListener('mouseup', this.onContextMenu);
    }

    // Before horizontal filling
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

    override render() {
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
