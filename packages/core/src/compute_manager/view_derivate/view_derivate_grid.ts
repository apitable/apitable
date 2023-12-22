import produce from 'immer';
import { Field } from 'model/field';
import { ViewFilterDerivate } from './slice/view_filter_derivate';
import { ViewGroupDerivate } from './slice/view_group_derivate';

import {
  IActiveRowInfo,
  IRecordSnapshot, IReduxState,
  IViewDerivation, IViewProperty, IViewRow, Role,
} from 'exports/store/interfaces';
import {
  getActiveRecordId, getActiveRowInfo, getActiveViewFilterInfo,
  getCellValue, getFieldMap, getFieldRoleByFieldId,
  getActiveViewSortInfo, getGroupFields, getIsSearching, getRecordSnapshot, getCurrentView,
} from 'modules/database/store/selectors/resource/datasheet';
import { RecordMoveType, WhyRecordMoveType } from 'modules/shared/store/constants';
import { handleEmptyCellValue } from 'model/utils';
import { ViewDerivateBase } from './view_derivate_base';

export class ViewDerivateGrid extends ViewDerivateBase {
  override viewFilterDerivate: ViewFilterDerivate;
  viewGroupDerivate: ViewGroupDerivate;

  constructor(protected override state: IReduxState, public override datasheetId: string) {
    super(state, datasheetId);
    this.viewFilterDerivate = new ViewFilterDerivate(state, datasheetId);
    this.viewGroupDerivate = new ViewGroupDerivate(state, datasheetId);
  }

  // including the visibleRows of the pre-sorted results, the original getVisibleRowsInner.
  getVisibleRowsWithLazySort(
    visibleRows: IViewRow[], recordMoveType: RecordMoveType, activeRowInfo: IActiveRowInfo | undefined,
  ) {
    const snapshot = this.state.datasheetMap[this.datasheetId]!.datasheet!.snapshot;
    const recordMap = snapshot.recordMap;

    if (!visibleRows) {
      return [];
    }
    if (!activeRowInfo) {
      return visibleRows;
    }
    const { positionInfo: { recordId, visibleRowIndex } } = activeRowInfo;
    const nextVisibleRows = produce(visibleRows, draftVisibleRows => {
      if ([RecordMoveType.OutOfView, RecordMoveType.WillMove].includes(recordMoveType)) {
        if (RecordMoveType.WillMove === recordMoveType) {
          const nextVisibleRowIndex = draftVisibleRows.findIndex(row => row.recordId === recordId);
          draftVisibleRows.splice(nextVisibleRowIndex, 1);
        }
        // Insert it only when the record still exists.
        if (recordId in recordMap) {
          draftVisibleRows.splice(visibleRowIndex, 0, { recordId });
        }
      }
      return draftVisibleRows;
    });
    return nextVisibleRows;
  }

  getRecordMoveType(
    view: IViewProperty, visibleRowsIndexMap: Map<string, number>,
    activeRecordId: string | undefined, activeRowInfo: IActiveRowInfo | undefined
  ) {
    const datasheetId = this.datasheetId;
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;

    // getPureVisibleRows gets the latest visibleRows.
    const NOT_MOVE = RecordMoveType.NotMove;
    if (!snapshot || !activeRecordId) {
      return NOT_MOVE;
    }

    if (!activeRowInfo) {
      return NOT_MOVE;
    }

    const { positionInfo, type = WhyRecordMoveType.UpdateRecord } = activeRowInfo;
    const nextVisibleRowIndex = visibleRowsIndexMap.get(activeRecordId);
    if (positionInfo.isInit) {
      return NOT_MOVE;
    }
    if (type === WhyRecordMoveType.NewRecord) {
      if (!visibleRowsIndexMap.has(activeRecordId)) {
        // does not exist in the current view,
        // but the recordMap exists, indicating that it is filtered
        if (activeRecordId in snapshot.recordMap) {
          return RecordMoveType.OutOfView;
        }
        // The current view does not exist and the recordMap does not exist,
        // indicating that it is deleted.
        return NOT_MOVE;
      }
      if (nextVisibleRowIndex !== positionInfo.visibleRowIndex) {
        return RecordMoveType.WillMove;
      }
    }
    // Reduce unnecessary calculations by judging ahead of time
    if (nextVisibleRowIndex === positionInfo.visibleRowIndex) {
      return NOT_MOVE;
    }
    const { recordSnapshot } = activeRowInfo;
    const nextRecordSnapshot = getRecordSnapshot(this.state, datasheetId, activeRecordId);
    // Records are deleted
    if (!nextRecordSnapshot) {
      return RecordMoveType.Deleted;
    }

    const fieldMap = getFieldMap(this.state)!;
    const fieldPermissionMap = this.state.datasheetMap[this.datasheetId]?.fieldPermissionMap;
    const groupField = getGroupFields(view, fieldMap, fieldPermissionMap);
    const filterInfo = getActiveViewFilterInfo(this.state);
    const sortInfo = getActiveViewSortInfo(this.state);
    const isSearching = getIsSearching(this.state);

    const isRecordEffectPositionCellValueChanged = (
      recordSnapshot: IRecordSnapshot,
    ) => {
      // Whether the record is pre-sorted is determined by the group, filter,
      // and sort fields that have auto-sorting turned on.
      const fieldsWhichMakeRecordMove: string[] = groupField.map(field => field.id);
      if (sortInfo?.keepSort) {
        sortInfo?.rules.forEach(rule => fieldsWhichMakeRecordMove.push(rule.fieldId));
      }
      filterInfo?.conditions.forEach(cond => fieldsWhichMakeRecordMove.push(cond.fieldId));
      const _fieldsWhichMakeRecordMove = [...new Set(fieldsWhichMakeRecordMove)].filter(fieldId => {
        const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, fieldId);
        return fieldRole !== Role.None;
      });
      return _fieldsWhichMakeRecordMove.some(fieldId => {
        /**
        * The recordSnapshot passed in by getCellValue will not work for the formula,
        * which is always up-to-date.
        * So store the value of the calculated field in the old recordSnapshot.
        * Used to handle the case of pre-sorted calculated fields.
        */
        const field = fieldMap[fieldId]!;
        let cv1 = recordSnapshot.recordMap[activeRecordId]?.data[fieldId] ?? null;
        cv1 = handleEmptyCellValue(cv1, Field.bindContext(field!, this.state).basicValueType);
        const cv2 = getCellValue(this.state, snapshot, activeRecordId, fieldId);
        return !Field.bindContext(field, this.state).eq(cv1, cv2);
      });
    };
    // Non-search state, and the specified field data changes before causing pre-sorting.
    if (!isSearching && !isRecordEffectPositionCellValueChanged(recordSnapshot)) {
      return NOT_MOVE;
    }
    if (nextVisibleRowIndex == null && nextRecordSnapshot) {
      return RecordMoveType.OutOfView;
    }
    if (nextVisibleRowIndex !== positionInfo.visibleRowIndex) {
      return RecordMoveType.WillMove;
    }
    return NOT_MOVE;
  }

  /**
   * Incrementally update view-derived data when pre-sorting behavior changes
   *
   * @returns viewDerivationPatch partial derivation data
   */
  getViewDerivationPatchByLazySort(
    view: IViewProperty, prevViewDerivation: IViewDerivation, activeRowInfo: IActiveRowInfo | undefined
  ): Partial<IViewDerivation> {
    const activeRecordId = getActiveRecordId(this.state);
    const recordMoveType = this.getRecordMoveType(view, prevViewDerivation.pureVisibleRowsIndexMap, activeRecordId, activeRowInfo);
    const visibleRows = this.getVisibleRowsWithLazySort(prevViewDerivation.pureVisibleRows, recordMoveType, activeRowInfo);

    const { groupBreakpoint, linearRows, pureLinearRows } =
      this.viewGroupDerivate.getGroupDerivation(view, visibleRows, recordMoveType);

    return {
      visibleRows,
      visibleRowsIndexMap: new Map(visibleRows.map((item, index) => [item.recordId, index])),
      recordMoveType,
      groupBreakpoint,
      linearRows,
      linearRowsIndexMap: new Map(linearRows.map((row, index) => [`${row.type}_${row.recordId}`, index])),
      pureLinearRows,
    };
  }

  override getViewDerivation(view?: IViewProperty): IViewDerivation {
    view = view || getCurrentView(this.state);
    const { rowsWithoutSearch } = super.getViewDerivation(view);
    return {
      rowsWithoutSearch,
      ...this.getViewDerivationWithSearch(view!, rowsWithoutSearch)
    };
  }

  override getViewDerivationWithSearch(view: IViewProperty, rowsWithoutSearch: IViewRow[]) {
    const { visibleRows: rowsWithoutLazyShort, searchResults } = this.getSearchRows(rowsWithoutSearch, view);
    const rowsWithoutLazyShortIndexMap = new Map(rowsWithoutLazyShort.map((item, index) => [item.recordId, index]));
    const activeRecordId = getActiveRecordId(this.state);
    const activeRowInfo = getActiveRowInfo(this.state);

    const recordMoveType = this.getRecordMoveType(view!, rowsWithoutLazyShortIndexMap, activeRecordId, activeRowInfo);
    const visibleRows = this.getVisibleRowsWithLazySort(rowsWithoutLazyShort, recordMoveType, activeRowInfo);

    const { groupBreakpoint, linearRows, pureLinearRows } =
      this.viewGroupDerivate.getGroupDerivation(view!, visibleRows, recordMoveType);

    return {
      // Raw rows of data, grouped without any filtering sorting.
      rowsIndexMap:  new Map(view!.rows!.map((item, index) => [item.recordId, index])),

      // Excluding pre-sorted row data, including filtered sorted grouped search
      pureVisibleRows: rowsWithoutLazyShort,

      // Map of the row-order data after view property calculation
      pureVisibleRowsIndexMap: rowsWithoutLazyShortIndexMap,

      // Visual row data, including filtering sorting grouping search pre-sorting
      visibleRows,

      // A map with recordId as key and order as value
      visibleRowsIndexMap: new Map(visibleRows.map((item, index) => [item.recordId, index])),

      // Pre-sorted or delayed sorted move types
      recordMoveType,

      searchResults,

      // Grouping breakpoint data
      /**
      * groupBreakpoint
      * field1 Grouping Breakpoints 0---------10---------20
      * field2 level Grouping Breakpoints 0--3-5-6--10----15---20
      *
      * field1: [0, 10, 20]
      * field2: [0, 3, 5, 6, 10, 15, 20]
      */
      groupBreakpoint,

      /**
      * Guide the table view to draw the structured data of the table,
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
      linearRows,

      /**
      * [`${row.type}_${row.recordId}`, index]
      */
      linearRowsIndexMap: new Map(linearRows.map((row, index) => [`${row.type}_${row.recordId}`, index])),

      // Gantt Chart view of ui row information
      pureLinearRows,
    };
  }
}
