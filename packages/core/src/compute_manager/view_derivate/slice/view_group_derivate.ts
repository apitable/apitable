import { Field } from 'model/field';

import {
  ILinearRow, IReduxState, IViewProperty, IViewRow,
} from 'exports/store/interfaces';
import {
  getActiveRecordId, getActiveRowInfo, getGroupingCollapseIds, getField,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { CellType, RecordMoveType } from 'modules/shared/store/constants';
import { handleEmptyCellValue } from 'model/utils';
import { Group } from 'model/view/group';

export class ViewGroupDerivate {

  constructor(private state: IReduxState, public datasheetId: string) {
  }

  private getFixedCellValue(recordMoveType: RecordMoveType, recordId: string, fieldId: string) {
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet?.snapshot;

    if (!recordId || !snapshot) {
      return null;
    }
    const state = this.state;
    const activeRecordId = getActiveRecordId(state);
    const _cv = getCellValue(state, snapshot, recordId, fieldId);
    if (activeRecordId !== recordId) {
      return _cv;
    }

    if ([RecordMoveType.OutOfView, RecordMoveType.WillMove].includes(recordMoveType)) {
      const activeRowInfo = getActiveRowInfo(state);
      if (activeRowInfo) {
        const { recordSnapshot } = activeRowInfo;
        let cv = recordSnapshot.recordMap[recordId]?.data[fieldId];
        const field = getField(state, fieldId, this.datasheetId);
        cv = handleEmptyCellValue(cv, Field.bindContext(field, state).basicValueType);
        return cv;
      }
    }
    return getCellValue(state, snapshot, recordId, fieldId);
  }

  private getLinearRowsAndGroup(view: IViewProperty, visibleRows: IViewRow[], recordMoveType: RecordMoveType) {
    const state = this.state;
    const groupInfo = view.groupInfo || [];
    const linearRows: ILinearRow[] = [];
    // init groupBreakpoint
    const groupSketch = new Group(groupInfo);
    const groupLevel = groupInfo.length;
    let preRow: IViewRow = { recordId: '' };
    const lastRow: IViewRow = { recordId: '' };
    // Displays the line number in front of the record and resets when grouping occurs.
    let displayRowIndex = 0;
    let groupHeadRecordId = '';
    // Presence of grouping, nothing, add station line.
    if (!visibleRows.length && groupInfo.length) {
      linearRows.push({
        type: CellType.Blank,
        depth: 0,
        recordId: '',
      });
      linearRows.push({
        type: CellType.Add,
        depth: 0,
        recordId: '',
      });
    }

    for (const [index, row] of [...visibleRows, lastRow].entries()) {
      let shouldGenGroupLinearRows = false;
      groupInfo.forEach((groupItem, groupItemIndex) => {
        const fieldId = groupItem.fieldId;
        const field = getField(state, fieldId, this.datasheetId);
        const cv1 = this.getFixedCellValue(recordMoveType, preRow.recordId, fieldId);
        const cv2 = this.getFixedCellValue(recordMoveType, row.recordId, fieldId);
        if (
          !row.recordId ||
          !preRow.recordId ||
          !(Field.bindContext(field, state).compare(cv1, cv2) === 0)
        ) {
          shouldGenGroupLinearRows = true;
          // Because the breakpoint of the upper layer must be the breakpoint of the lower layer,
          // so here we have to iterate through them and add a line to each one.
          groupInfo.slice(groupItemIndex).forEach((groupItem, subIndex) => {
            groupSketch.addBreakpointAndSetGroupTab(groupItem.fieldId, index, row.recordId, subIndex + groupItemIndex);
          });
        }
      });
      if (shouldGenGroupLinearRows) {
        groupHeadRecordId = row.recordId;
        const groupLinearRows = groupSketch.genGroupLinearRows(
          index, row.recordId, preRow.recordId,
        );
        linearRows.push(...groupLinearRows);
        displayRowIndex = 0;
      }
      preRow = row;
      if (row.recordId) {
        displayRowIndex++;
        linearRows.push({
          type: CellType.Record,
          depth: groupLevel,
          recordId: row.recordId,
          displayIndex: displayRowIndex,
          groupHeadRecordId,
        });
      }
      if (!groupLevel && !row.recordId) {
        linearRows.push({
          type: CellType.Add,
          depth: 0,
          recordId: '',
        });
      }
    }
    groupSketch.cacheGroupBreakpoint();

    return {
      linearRows: linearRows,
      groupSketch,
    };
  }

  /**
   * Remove collapsed groups
   * blank_0
   * tab_A_0 (Folded)
   *   tab_A_1
   *     recA_2
   *     recB_2
   *     add_2
   *   blank_1
   *   tab_C_1
   *     recC_2
   *     add_2
   *   blank_1
   * blank_0 (End of folding)
   * tab_D_0
   *   tab_D_1
   *     recD_2
   *     add_2
   *   blank_1
   *
   * As shown in the above diagram, as long as we find the head of the collapsed group until
   * we meet a blank with the same depth as it, anything in between can be ignored.
   */
  getLinearRowsAndGroupAfterCollapse(linearRows: ILinearRow[], groupingCollapseIds: string[] | undefined) {
    if (!groupingCollapseIds) {
      return linearRows;
    }
    const groupingCollapseSet: Set<string> = new Set(groupingCollapseIds);

    const res = linearRows.reduce<{collapsedLinearRows: ILinearRow[], skip: boolean, depth: number}>((ctx, linearRow) => {
      if (ctx.skip) {
        // A black with the same level as the skipped group is encountered, indicating that the group has ended
        if (
          linearRow.type === CellType.Blank &&
          linearRow.depth === ctx.depth
        ) {
          // Resetting the collapsed state
          ctx.depth = Infinity;
          ctx.skip = false;
          ctx.collapsedLinearRows.push(linearRow);
        }
        return ctx;
      }

      // Enable skip mode by if the grouping header hits the fold.
      if (linearRow.type === CellType.GroupTab &&
        groupingCollapseSet.has(linearRow.recordId + '_' + linearRow.depth)
      ) {
        ctx.skip = true;
        ctx.depth = linearRow.depth;
      }

      ctx.collapsedLinearRows.push(linearRow);
      return ctx;
    }, { collapsedLinearRows: [], skip: false, depth: Infinity });

    return res.collapsedLinearRows;
  }

  getGroupDerivation(view: IViewProperty, rowsWithLazySort: IViewRow[], recordMoveType: RecordMoveType) {
    const groupingCollapseIds = getGroupingCollapseIds(this.state, this.datasheetId);

    const { linearRows: pureLinearRows, groupSketch } = this.getLinearRowsAndGroup(view, rowsWithLazySort, recordMoveType);

    const visibleLinearRows = this.getLinearRowsAndGroupAfterCollapse(pureLinearRows, groupingCollapseIds);

    return {
      // Grouping breakpoint data
      /**
      * groupBreakpoint
      * field1 Grouping Breakpoints 0---------10---------20
      * field2 level Grouping Breakpoints 0--3-5-6--10----15---20
      *
      * field1: [0, 10, 20]
      * field2: [0, 3, 5, 6, 10, 15, 20]
      */
      groupBreakpoint: groupSketch.groupBreakpoint,
      /**
      * Guide the grid view to draw the structured data of the table,
      * with the hierarchical structure reflected by depth.
      * [
      *    Blank 0
      *    GroupTab 0
      *      GroupTab 1
      *        GroupTab 2
      *          Record 3
      *        Add 2
      *        Blank 2
      *      Blank 1
      *    Blank 0
      * ]
      */
      linearRows: visibleLinearRows,

      /**
      * [`${row.type}_${row.recordId}`, index]
      */
      linearRowsIndexMap: new Map(pureLinearRows.map((row, index) => [`${row.type}_${row.recordId}`, index])),

      // Gantt Chart view of ui row information
      pureLinearRows,
    };
  }
}
