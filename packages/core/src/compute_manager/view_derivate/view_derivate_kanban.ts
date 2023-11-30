
import {
  IRecord, IReduxState, IViewDerivation, IViewProperty, IViewRow, Role,
} from 'exports/store/interfaces';
import {
  getCurrentView,
  getKanbanFieldId,
} from 'modules/database/store/selectors/resource/datasheet/calc';
import { getFieldRoleByFieldId } from 'modules/database/store/selectors/resource/datasheet/base';
import { UN_GROUP, ViewType } from 'modules/shared/store/constants';
import { FieldType, IField, IMemberField, IUnitIds } from 'types/field_types';
import { ViewDerivateBase } from './view_derivate_base';
import { polyfillOldData } from 'model/field/const';

export class ViewDerivateKanban extends ViewDerivateBase {
  constructor(protected override state: IReduxState, public override datasheetId: string) {
    super(state, datasheetId);
  }

  private getGroupValueMap(field: IField) {
    let sourceData: string[] = [];
    if (field.type === FieldType.SingleSelect) {
      sourceData = field.property.options.map(item => item.id);
    } else {
      sourceData = (field as IMemberField).property.unitIds || [];
    }
    return sourceData.reduce<{ [key: string]: IRecord[] }>((map, item) => {
      map[item] = [];
      return map;
    }, { [UN_GROUP]: [] });
  }

  private getKanbanGroupMap(rows: IViewRow[], kanbanFieldId?: string | null) {
    const snapshot = this.state.datasheetMap[this.datasheetId]!.datasheet!.snapshot;
    const fieldPermissionMap = this.state.datasheetMap[this.datasheetId]?.fieldPermissionMap;
    if (!kanbanFieldId || !snapshot) {
      return {};
    }

    const recordMap = snapshot.recordMap;
    const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);

    const fieldMap = snapshot.meta.fieldMap;
    const field = fieldMap[kanbanFieldId];
    if (fieldRole === Role.None || !field) {
      return {
        UN_GROUP: rows.map(row => {
          return recordMap[row.recordId]!;
        }),
      };
    }

    const groupMap = this.getGroupValueMap(field);

    for (const { recordId } of rows) {
      const record = recordMap[recordId];
      if (!record) {
        console.warn('! ' + `${recordId} is not exist,check kanban data`);
        continue;
      }
      const fieldData = record.data[kanbanFieldId];

      if (fieldData == null) {
        groupMap[UN_GROUP]!.push(record);
        continue;
      }
      try {

        if (field.type === FieldType.Member) {
          const id = polyfillOldData(fieldData as IUnitIds)?.[0];
          id && groupMap[id]!.push(record);

          continue;
        }

        groupMap[fieldData as string]!.push(record);
      } catch (e) {
        console.warn('! ' + `${fieldData} is not exist,check kanban data`);
      }
    }

    return groupMap;
  }

  // Sorting under Kanban view.
  private getSortRowsByKanbanGroup(view: IViewProperty, rows: IViewRow[], kanbanGroupMap: { [key: string]: IRecord[] } | undefined) {
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;
    if (!view || view.type !== ViewType.Kanban || !snapshot) {
      return rows;
    }

    const kanbanFieldId = view?.style.kanbanFieldId;
    if (!kanbanFieldId) {
      return rows;
    }

    const field = snapshot.meta.fieldMap![kanbanFieldId];
    if (!field) {
      return rows;
    }

    const fieldPermissionMap = this.state.datasheetMap[this.datasheetId]?.fieldPermissionMap;

    if (getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId) === Role.None) {
      // kanbanFieldId Permissions have been set and are not visible to the current user,
      // there is no need to handle the following logic.
      return rows;
    }

    if (!kanbanGroupMap) {
      return rows;
    }
    const groupIds = field.type === FieldType.SingleSelect
      ? field.property.options.map(item => item.id)
      : (field as IMemberField).property.unitIds;
    if (!Array.isArray(groupIds)) {
      return rows;
    }
    const flatRows = [UN_GROUP, ...groupIds].map(groupId => {
      const kanbanGroup = kanbanGroupMap[groupId];
      if (!kanbanGroup) {
        return [];
      }
      return kanbanGroup.map(record => ({ recordId: record.id }));
    }).flat();
    return flatRows;
  }

  override getViewDerivation(view?: IViewProperty): IViewDerivation {
    view = view || getCurrentView(this.state);
    const { rowsWithoutSearch } = super.getViewDerivation(view);
    const viewDerivationWithSearch = this.getViewDerivationWithSearch(view!, rowsWithoutSearch);
    return {
      rowsWithoutSearch,
      ...viewDerivationWithSearch
    };
  }

  override getViewDerivationWithSearch(view: IViewProperty, rowsWithoutSearch: IViewRow[]) {
    const kanbanGroupMapWithoutSearch = this.getKanbanGroupMap(rowsWithoutSearch, getKanbanFieldId(this.state));

    rowsWithoutSearch = this.getSortRowsByKanbanGroup(view!, rowsWithoutSearch, kanbanGroupMapWithoutSearch);

    const { visibleRows, searchResults } = this.getSearchRows(rowsWithoutSearch, view);
    const kanbanGroupMap = this.getKanbanGroupMap(visibleRows, getKanbanFieldId(this.state));
    const visibleRowsIndexMap = new Map(visibleRows.map((item, index) => [item.recordId, index]));

    return {
      // Raw rows of data, grouped without any filtering sorting.
      rowsIndexMap:  new Map(view!.rows!.map((item, index) => [item.recordId, index])),

      // Excluding pre-sorted row data, including filtered sorted grouped search
      pureVisibleRows: visibleRows,

      // Map of the row-order data after view property calculation
      pureVisibleRowsIndexMap: visibleRowsIndexMap,

      // Visual row data, including filtering sorting grouping search pre-sorting
      visibleRows,

      // A map with recordId as key and order as value
      visibleRowsIndexMap: visibleRowsIndexMap,

      // Kanban middle properties
      kanbanGroupMap,

      searchResults,
    };
  }
}
