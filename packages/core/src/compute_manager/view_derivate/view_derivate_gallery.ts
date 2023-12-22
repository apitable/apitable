
import {
  IReduxState, IViewDerivation, IViewProperty, IViewRow,
} from 'exports/store/interfaces';
import { getFieldMap } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { Field } from 'model/field';
import { ViewDerivateBase } from './view_derivate_base';

export class ViewDerivateGallery extends ViewDerivateBase {
  constructor(protected override state: IReduxState, public override datasheetId: string) {
    super(state, datasheetId);
  }

  private getGalleryGroupedRows(view: IViewProperty, rows: IViewRow[]) {
    const state = this.state;
    const datasheetId = this.datasheetId;
    const groupInfo = view.groupInfo || [];
    const groupedRows: string[][] = [];
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet?.snapshot;
    if (!groupInfo || !datasheetId || !snapshot) {
      return groupedRows;
    }
    if (groupInfo && groupInfo.length === 0) {
      return groupedRows;
    }
    const fieldMap = getFieldMap(state, datasheetId)!;
    const fieldId = groupInfo[0]!.fieldId;
    const field = fieldMap[fieldId];
    let preRecordId: string = '';
    let tempGroupedRows: string[] = [];
    for (let index = 0; index < rows.length; index++) {
      const record = rows[index]!;
      const recordId = record.recordId;
      if (index === 0) {
        tempGroupedRows.push(record.recordId);
      } else {
        if (
          field &&
          Field.bindContext(field, state).compare(
            getCellValue(state, snapshot, preRecordId, fieldId),
            getCellValue(state, snapshot, recordId, fieldId),
          )
        ) {
          groupedRows.push(tempGroupedRows);
          tempGroupedRows = [record.recordId];
        } else {
          tempGroupedRows.push(record.recordId);
        }
      }
      preRecordId = recordId;
      if (index === rows.length - 1) {
        groupedRows.push(tempGroupedRows);
        break;
      }
    }
    return groupedRows;
  }

  override getViewDerivation(view?: IViewProperty): IViewDerivation {
    const baseViewDerivation = super.getViewDerivation(view);
    const galleryGroupedRows = this.getGalleryGroupedRows(view!, baseViewDerivation.visibleRows);

    return {
      ...baseViewDerivation,
      // Grouped rows of data for gallery view.
      galleryGroupedRows,
    };
  }

  /**
   * Get computationally derived data containing search results.
   *
   * Used to do calculations when searching for updates.
   */
  override getViewDerivationWithSearch(view: IViewProperty, rowsWithoutSearch: IViewRow[]) {
    const baseViewDerivation = super.getViewDerivationWithSearch(view, rowsWithoutSearch);
    const galleryGroupedRows = this.getGalleryGroupedRows(view!, baseViewDerivation.visibleRows);
    return {
      ...baseViewDerivation,
      // Grouped rows of data for gallery view
      galleryGroupedRows,
    };
  }
}
