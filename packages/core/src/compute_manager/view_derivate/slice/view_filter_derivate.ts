import { sortBy } from 'lodash';

import { ICellValue } from 'model/record';
import { Field } from 'model/field';
import { DatasheetActions } from 'commands_actions/datasheet';

import { IRecord, IRecordMap, IReduxState, IViewProperty, IViewRow } from 'exports/store/interfaces';
import { findRealField, getCellValue, getFilterInfoExceptInvalid } from 'modules/database/store/selectors/resource/datasheet';
import { FilterConjunction, FOperator, IFilterCondition, IFilterInfo } from 'types/view_types';
import { BasicValueType, FieldType, IField, ILinkIds, RollUpFuncType } from 'types/field_types';

export class ViewFilterDerivate {
  constructor(private state: IReduxState, public datasheetId: string) {}

  /**
   * Filter out duplicate cellValue, return the de-duplicated rows,
   * only allow adding one with duplicate conditions
   *
   * TODO: Repeat is not quite in line with the logic of "filtering",
   * it should be a separate function, and the following calculation is not rigorous, it needs to be rewritten.
   */
  findRepeatRowOrRecords(rows: (IViewRow | string)[], fieldId: string, isAnd?: boolean) {
    const map = new Map();
    const state = this.state;
    const snapshot = this.state.datasheetMap[this.datasheetId]!.datasheet!.snapshot;
    const field = snapshot.meta.fieldMap[fieldId]!;
    const fieldMethod = Field.bindContext(field, this.state);

    const values = DatasheetActions.getCellValuesByFieldId(state, snapshot, field.id, undefined, true);
    if (values?.length) {
      for (const row of rows) {
        const recordId = typeof row === 'string' ? row : row.recordId;
        const needTranslate = [
          FieldType.Currency,
          FieldType.SingleText,
          FieldType.Text,
          FieldType.URL,
          FieldType.Phone,
          FieldType.Email,
          FieldType.DateTime,
          FieldType.CreatedTime,
          FieldType.LastModifiedTime,
          FieldType.Number,
          FieldType.Percent,
        ];
        let cellValue = getCellValue(state, snapshot, recordId, field.id);
        const lookUpField = findRealField(state, field);
        const rollUpType = field.property?.rollUpType || RollUpFuncType.VALUES;
        const isNeedSort =
          Array.isArray(cellValue) &&
          ((field.type === FieldType.LookUp && rollUpType === RollUpFuncType.VALUES) ||
            [FieldType.MultiSelect, FieldType.Member].includes(field.type) ||
            field.type === FieldType.Link);
        if (isNeedSort) {
          cellValue = sortBy(cellValue as any[], o => (typeof o === 'object' ? o.text : o)) as ICellValue;
        }
        // Do you need to call cellValueToString to convert to string form.
        if (
          needTranslate.includes(field.type) ||
          (FieldType.LookUp === field.type &&
            lookUpField &&
            ![FieldType.SingleSelect, FieldType.MultiSelect, FieldType.Link].includes(lookUpField.type))
        ) {
          cellValue = fieldMethod.cellValueToString(cellValue, { hideUnit: true }) || '';
        }
        cellValue = cellValue?.toString().trim() || '';
        if (!map.has(cellValue)) {
          map.set(cellValue, [recordId]);
          continue;
        }
        map.set(cellValue, [...map.get(cellValue), recordId]);
      }
    }
    const result: string[] = [];
    map.forEach(value => {
      if (value.length > 1) {
        result.push(...value);
      }
    });
    if (isAnd) {
      const recordIdMap = new Map(result.map((value, key) => [value, key]));
      return rows.filter(row => recordIdMap.has(typeof row === 'string' ? row : row.recordId));
    }
    return result;
  }

  doFilter(condition: IFilterCondition, field: IField, cellValue: ICellValue) {
    const fieldMethod = Field.bindContext(field, this.state);
    /**
     *  isEmpty, isNotEmpty call generic logic
     */
    if (condition.operator === FOperator.IsEmpty || condition.operator === FOperator.IsNotEmpty) {
      return fieldMethod.isEmptyOrNot(condition.operator, cellValue);
    }

    /**
     *  In the non-isEmpty || isNotEmpty condition, if the value is not filled in, no filtering is done.
     */
    if (condition.value == null && fieldMethod.basicValueType !== BasicValueType.Number && condition.operator !== FOperator.IsRepeat) {
      return true;
    }

    /**
     * Call the field's own operator calculation function to calculate.
     */
    return fieldMethod.isMeetFilter(condition.operator, cellValue, condition.value);
  }

  private doFilterOperations(condition: IFilterCondition, record: IRecord, repeatRows?: string[]) {
    /**
     * or condition to have repeatRows
     * or condition on the presence or absence of repeatRows
     */
    if (repeatRows?.includes(record.id)) {
      return true;
    }
    // If the condition is isRepeat, and no duplicate records are hit, return false early
    if (condition.operator === FOperator.IsRepeat) {
      return false;
    }
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;
    if (!snapshot) {
      return false;
    }
    const { fieldId } = condition;
    const field = snapshot.meta.fieldMap[fieldId]!;

    // currently, we don't filter data by the columns without permission,
    // so we need to ignore the permission check when get `cellValue`
    const cellValue = getCellValue(this.state, snapshot, record.id, fieldId, undefined, undefined, true);
    try {
      return this.doFilter(condition, field, cellValue);
    } catch (error) {
      // FIXME: calc fields transform cause filter match error
      return false;
    }
  }

  /**
   * Check if a record meets the conditions in filterCondition
   */
  private checkConditions(record: IRecord, filterInfo: IFilterInfo, repeatRows?: string[]) {
    const conditions = filterInfo.conditions;
    if (!record) {
      return false;
    }

    if (filterInfo.conjunction === FilterConjunction.And) {
      return conditions.every(condition => this.doFilterOperations(condition, record, undefined));
    }

    if (filterInfo.conjunction === FilterConjunction.Or) {
      return conditions.some(condition => this.doFilterOperations(condition, record, repeatRows));
    }

    // never happen
    return false;
  }

  getFilterRowsBase(props: { filterInfo: IFilterInfo | undefined; rows: IViewRow[]; recordMap: IRecordMap }) {
    let filterInfo = props.filterInfo;
    const recordMap = props.recordMap;
    let rows = props.rows;
    if (!filterInfo) {
      return rows;
    }

    const isRepeatCondition = filterInfo.conditions.find(condition => condition.operator === FOperator.IsRepeat);
    const isAnd = filterInfo.conjunction === FilterConjunction.And;
    let repeatRows: string[] | undefined;

    if (isRepeatCondition) {
      if (isAnd) {
        rows = this.findRepeatRowOrRecords(rows, isRepeatCondition.fieldId, true) as IViewRow[];
        const filteredConditions = filterInfo.conditions.filter(condition => condition.operator !== FOperator.IsRepeat);
        filterInfo = {
          ...filterInfo,
          conditions: filteredConditions,
        };
      } else {
        repeatRows = this.findRepeatRowOrRecords(rows, isRepeatCondition.fieldId) as string[];
      }
    }
    const result = rows.filter(row => {
      return this.checkConditions(recordMap[row.recordId]!, filterInfo!, repeatRows);
    });
    return result;
  }

  // TODO: mirrorFilter is no longer a direct source view filter.
  getFilteredRows(view: IViewProperty) {
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;

    if (!view.rows || !snapshot) {
      return [];
    }

    const recordMap = snapshot.recordMap;

    // TODO: empty data filter, subsequent data repair should be able to delete
    const rows = view.rows.filter(row => recordMap[row.recordId]);

    const filterInfo = getFilterInfoExceptInvalid(this.state, this.datasheetId, view.filterInfo);
    const viewRows = this.getFilterRowsBase({ filterInfo, rows, recordMap });

    const mirrorId = this.state.pageParams.mirrorId!;
    const mirrorFilter = this.state.mirrorMap[mirrorId]?.mirror?.temporaryView?.filterInfo;
    const mirrorSourceDatasheetId = this.state.mirrorMap[mirrorId]?.mirror?.sourceInfo?.datasheetId;
    if (!mirrorFilter || snapshot.datasheetId !== mirrorSourceDatasheetId) {
      return viewRows;
    }

    /**
     * Filter again in the presence of mirror
     */
    return this.getFilterRowsBase({ filterInfo: mirrorFilter, rows: viewRows, recordMap });
  }

  /**
   * Currently only to lookup with, TODO: change the method to lookup, the follow-up to go deprecated
   * @param data
   */
  getFilteredRecords = (data: { linkFieldRecordIds: ILinkIds; filterInfo?: IFilterInfo }) => {
    const { linkFieldRecordIds, filterInfo } = data;
    const snapshot = this.state.datasheetMap[this.datasheetId]?.datasheet!.snapshot;
    if (!linkFieldRecordIds || !snapshot) {
      return [];
    }
    const recordMap = snapshot.recordMap;
    let _filterInfo = getFilterInfoExceptInvalid(this.state, this.datasheetId, filterInfo);

    if (!_filterInfo) {
      return linkFieldRecordIds;
    }

    let _linkFieldRecordIds = linkFieldRecordIds;
    const isRepeatCondition = _filterInfo.conditions.find(condition => condition.operator === FOperator.IsRepeat);
    const isAnd = _filterInfo.conjunction === FilterConjunction.And;
    let repeatRecords: string[] | undefined;
    if (isRepeatCondition) {
      if (isAnd) {
        _linkFieldRecordIds = this.findRepeatRowOrRecords(linkFieldRecordIds, isRepeatCondition.fieldId, true) as ILinkIds;
        const filteredConditions = _filterInfo.conditions.filter(condition => condition.operator !== FOperator.IsRepeat);
        _filterInfo = {
          ..._filterInfo,
          conditions: filteredConditions,
        };
      } else {
        repeatRecords = this.findRepeatRowOrRecords(linkFieldRecordIds, isRepeatCondition.fieldId) as string[];
      }
    }

    const result = _linkFieldRecordIds.filter(linkFieldRecordId => {
      const record = recordMap[linkFieldRecordId];
      return this.checkConditions(record!, _filterInfo!, repeatRecords);
    });
    return result;
  };
}
