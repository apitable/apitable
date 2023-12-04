
import { Field } from 'model/field';
import { ViewFilterDerivate } from './slice/view_filter_derivate';
import {
  IReduxState, ISearchResult, IViewDerivation, IViewProperty, IViewRow,
} from 'exports/store/interfaces';
import {
  getCellValue, getCurrentView, getGroupFields, getSearchKeyword, getStringifyCellValue, sortRowsBySortInfo,
} from 'modules/database/store/selectors/resource/datasheet';
import { FieldType } from 'types/field_types';

export class ViewDerivateBase {
  viewFilterDerivate: ViewFilterDerivate;

  constructor(protected state: IReduxState, public datasheetId: string) {
    this.viewFilterDerivate = new ViewFilterDerivate(state, datasheetId);
  }

  private getSortRowsByGroup(view: IViewProperty, rows: IViewRow[]) {
    const state = this.state;
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;
    if (!view || !snapshot) {
      return [];
    }
    const fieldMap = snapshot.meta.fieldMap;
    if (!view.groupInfo) {
      return rows;
    }
    const fieldPermissionMap = this.state.datasheetMap[this.datasheetId]?.fieldPermissionMap;
    const groups = getGroupFields(view, snapshot.meta.fieldMap, fieldPermissionMap);
    if (!groups.length) {
      return rows;
    }
    const descOrders = view.groupInfo.reduce((acc, gp) => {
      if (fieldMap[gp.fieldId]) {
        acc.push(gp.desc);
      }
      return acc;
    }, [] as Boolean[]);
    const fieldInstanceMap = {};
    const cacheSortRes = {};

    // rows sorted by group
    return rows.sort((row1, row2) => {
      return groups.reduce((prev, field, index) => {
        if (prev !== 0) {
          return prev;
        }
        let fieldInstance = fieldInstanceMap[field.id];
        if (!fieldInstance) {
          fieldInstance = Field.bindContext(field, state);
          fieldInstanceMap[field.id] = fieldInstance;
        }
        const cv1 = getCellValue(state, snapshot, row1.recordId, field.id);
        const cv2 = getCellValue(state, snapshot, row2.recordId, field.id);
        const key = `${cv1}${cv2}`;
        let res = 0;
        if (key in cacheSortRes) {
          res = cacheSortRes[key];
        } else {
          res = fieldInstance.compare(cv1, cv2);
          typeof cv1 !== 'object' && typeof cv2 !== 'object' && (cacheSortRes[key] = res);
        }
        const sign = descOrders[index] ? -1 : 1;

        return res * sign;
      }, 0) || 1;
    });
  }

  private getSortRows(view: IViewProperty, rows: IViewRow[]) {
    if (!view?.sortInfo || !view.sortInfo.keepSort) {
      return rows;
    }
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;
    if (!snapshot) {
      return [];
    }
    return sortRowsBySortInfo(this.state, rows, view.sortInfo.rules, snapshot);
  }

  protected getSearchRows(rows: IViewRow[], view: IViewProperty | undefined): { visibleRows: IViewRow[], searchResults?: ISearchResult } {
    const searchKeyword = getSearchKeyword(this.state);
    if (!searchKeyword) {
      return { visibleRows: rows };
    }
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;
    if (!snapshot) {
      return { visibleRows: rows };
    }
    const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
    const searchResults: ISearchResult = [];
    const visibleColumns = !view?.columns ? [] : view.columns.filter(item => !item.hidden).map(item => item.fieldId);
    const visibleRows = rows.filter(row => {
      const { recordId } = row;
      let isRecordDataMatchKeyword = false;
      visibleColumns.forEach(fieldId => {
        let cellValue = getStringifyCellValue(this.state, snapshot, recordId, fieldId);
        const field = snapshot.meta.fieldMap[fieldId];
        // currency and number fields ignore units when searching
        if (field && (field.type === FieldType.Currency || field.type === FieldType.Number)) {
          const cv = getCellValue(this.state, snapshot, row.recordId, fieldId);
          cellValue = Field.bindContext(field, this.state).cellValueToString(cv, { hideUnit: true });
        }
        if (cellValue && cellValue.toLowerCase().includes(lowerCaseSearchKeyword)) {
          searchResults.push([recordId, fieldId]);
          isRecordDataMatchKeyword = true;
        }
      });
      return isRecordDataMatchKeyword;
    });
    return { visibleRows, searchResults };
  }

  /**
   * An array in order after filtering and sorting by view properties.
   * @param view view properties
   */
  protected getRowsAfterViewQuery(view?: IViewProperty): IViewRow[] {
    if (!view) {
      return [];
    }
    // where exact match by field
    const filteredRows = this.viewFilterDerivate.getFilteredRows(view).filter(item => !item.hidden);
    // order by
    const sortedRows = this.getSortRows(view, filteredRows);
    // group by
    return this.getSortRowsByGroup(view, sortedRows);
  }

  /**
   * View Calculation of Derived Data
   *
   * For views that do not require custom view-derived data,
   * you can call this method directly to return it, otherwise you need to override it.
   */
  getViewDerivation(view?: IViewProperty): IViewDerivation {
    view = view || getCurrentView(this.state);

    if (!view || !view.rows) {
      throw new Error("View not loaded, can't get view data");
    }

    const rowsInView = this.getRowsAfterViewQuery(view);

    return {
      rowsWithoutSearch: rowsInView,
      ...this.getViewDerivationWithSearch(view, rowsInView)
    };
  }

  /**
   * Get computationally derived data containing search results.
   *
   * Used to do calculations when searching for updates.
   */
  getViewDerivationWithSearch(view: IViewProperty, rowsWithoutSearch: IViewRow[]) {
    if (!view || !view.rows) {
      throw new Error("View not loaded, can't get view data");
    }

    const { visibleRows, searchResults } = this.getSearchRows(rowsWithoutSearch, view);
    const visibleRowsIndexMap = new Map(visibleRows.map((item, index) => [item.recordId, index]));

    return {
      // Raw rows of data, grouped without any filtering sorting.
      rowsIndexMap:  new Map(view.rows.map((item, index) => [item.recordId, index])),

      // Excluding pre-sorted row data, including filtered sorted grouped search.
      pureVisibleRows: visibleRows,

      // Map of the row-order data after view property calculation
      pureVisibleRowsIndexMap: visibleRowsIndexMap,

      // Visible row data, including filtering sorting grouping search [pre-sorting],
      // Kanban view does not have pre-sorting, so it is the same as pureVisibleRows.
      visibleRows,

      // A map with recordId as key and order as value.
      visibleRowsIndexMap: visibleRowsIndexMap,

      searchResults
    };
  }
}
