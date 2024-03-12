import Joi from 'joi';
import { Strings, t } from '../../exports/i18n';
import { ICellValue } from 'model/record';
import { createSelector } from 'reselect';
import { IReduxState } from '../../exports/store/interfaces';
import { ISnapshot } from '../../exports/store/interfaces';
import { getCellValue } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { getCurrentView, getFieldMap }from 'modules/database/store/selectors/resource/datasheet/calc';
import { getDatasheet, getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { getRowsIndexMap }from 'modules/database/store/selectors/resource/datasheet/rows_calc';
import { FOperator, IAPIMetaOneWayLinkFieldProperty, IFilterCondition, IFilterText } from 'types';
import { BasicValueType, FieldType, IOneWayLinkField, IOneWayLinkFieldProperty, IStandardValue } from 'types/field_types';
import { ArrayValueField } from './array_field';
import { Field } from './field';
import { StatType } from './stat';
import { ILinkFieldOpenValue } from 'types/field_types_open';
import { isNullValue } from 'model/utils';
import { Conversion, IAddOpenMagicLinkFieldProperty, IUpdateOpenMagicLinkFieldProperty } from 'types/open/open_field_write_types';
import { enumToArray } from './validate_schema';
import { IOpenOneWayLinkFieldProperty } from 'types/open/open_field_read_types';
import { IOpenFilterValueString } from 'types/open/open_filter_types';
import { TextBaseField } from './text_base_field';
import { getFieldDefaultProperty } from './const';
export const getTextRecordMap =
  createSelector<IReduxState, string | void, IReduxState | undefined, ISnapshot | undefined, { [text: string]: string }>(
    [state => state, (state, datasheetId?: string | void) => getSnapshot(state, datasheetId)], (state, snapshot) => {
      if (!snapshot) {
        return {};
      }
      const fieldId = snapshot.meta.views[0]!.columns[0]!.fieldId;
      const field = snapshot.meta.fieldMap[fieldId]!;
      const textRecordMap = {};
      Object.values(snapshot.recordMap).forEach(record => {
        const value = getCellValue(state!, snapshot, record.id, fieldId);
        const text = Field.bindContext(field, state!).cellValueToString(value);
        if (text) {
          textRecordMap[text] = record.id;
        }
      });
      return textRecordMap;
    });

export class OneWayLinkField extends ArrayValueField {
  constructor(public override field: IOneWayLinkField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    foreignDatasheetId: Joi.custom((foreignDatasheetId, helpers) => {
      const foreignDatasheet = getDatasheet(helpers.prefs['context']?.['reduxState'], foreignDatasheetId);
      // If foreignDatasheet is not loaded, the relationship has been destroyed.
      if (!foreignDatasheet) {
        return helpers.message({ en: t(Strings.one_way_link_data_error) });
      }
      return foreignDatasheetId;
    }).required(),
    limitToView: Joi.string().pattern(/^viw.+/, 'viewId'),
    limitSingleRecord: Joi.boolean(),
  }).required();

  static cellValueSchema = Joi.array().items(Joi.string().pattern(/^rec.+/).required()).allow(null).required();

  static openWriteValueSchema = Joi.array().custom((value: ILinkFieldOpenValue[] | string[] | null, helpers) => {
    if (
      (value as any).map((item: string | ILinkFieldOpenValue) => (
        /^rec.+/.test((item as ILinkFieldOpenValue).recordId || (item as string))
      ))
    ) {
      return value;
    }
    return helpers.error('valid date');
  }).allow(null).required();

  static defaultProperty(): Omit<IOneWayLinkFieldProperty, 'foreignDatasheetId'> {
    return getFieldDefaultProperty(FieldType.OneWayLink) as Omit<IOneWayLinkFieldProperty, 'foreignDatasheetId'>;
  }

  get apiMetaProperty(): IAPIMetaOneWayLinkFieldProperty {
    const { limitToView, foreignDatasheetId, limitSingleRecord } = this.field.property;
    return {
      foreignDatasheetId,
      limitToViewId: limitToView,
      limitSingleRecord,
    };
  }

  get openValueJsonSchema() {
    return {
      title: this.field.name,
      type: 'array',
      items: {
        type: 'object',
        properties: {
          recordId: {
            type: 'string',
            title: t(Strings.robot_variables_join_linked_record_IDs),
          },
          title: {
            type: 'string',
            title: t(Strings.robot_variables_join_linked_record_titles),
          }
        }
      }
    };
  }

  override get statTypeList(): StatType[] {
    return [
      StatType.None,
      StatType.Empty,
      StatType.Filled,
      StatType.PercentEmpty,
      StatType.PercentFilled,
    ];
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.Array;
  }

  override get innerBasicValueType() {
    return BasicValueType.String;
  }

  override get acceptFilterOperators(): FOperator[] {
    return [
      FOperator.Contains,
      FOperator.DoesNotContain,
      FOperator.IsEmpty,
      FOperator.IsNotEmpty,
      FOperator.IsRepeat,
    ];
  }

  filterRecordIds(value: any): string[] {
    const snapshot = getSnapshot(this.state, this.field.property.foreignDatasheetId);
    if (!snapshot) {
      return [];
    }
    const archivedRecordIds = snapshot.meta.archivedRecordIds || [];
    if (Array.isArray(value)) {
      return value.filter(recordId => snapshot.recordMap[recordId] || archivedRecordIds.includes(recordId));
    }
    return [];
  }

  validate(value: any): value is string[] {
    const snapshot = getSnapshot(this.state, this.field.property.foreignDatasheetId);
    if (!snapshot) {
      return false;
    }
    const archivedRecordIds = snapshot.meta.archivedRecordIds || [];
    if (Array.isArray(value)) {
      return value.every(recordId => {
        return !!(snapshot.recordMap[recordId] || archivedRecordIds.includes(recordId));

      });
    }
    return false;
  }

  validateProperty() {
    return OneWayLinkField.propertySchema.validate(this.field.property, { context: { reduxState: this.state } });
  }

  validateCellValue(cellValue: ICellValue) {
    return OneWayLinkField.cellValueSchema.validate(cellValue);
  }

  validateOpenWriteValue(owv: string[] | ILinkFieldOpenValue[] | null) {
    return OneWayLinkField.openWriteValueSchema.validate(owv);
  }

  getForeignPrimaryField() {
    const foreignDatasheetId = this.field.property.foreignDatasheetId;
    const view = getCurrentView(this.state, foreignDatasheetId);
    if (!view) {
      return;
    }
    const fieldId = view.columns[0]!.fieldId;
    const foreignPrimaryField = getFieldMap(this.state, foreignDatasheetId)!;
    return foreignPrimaryField[fieldId];
  }

  getLinkedCellValue(recordId: string | null): ICellValue {
    if (!recordId) {
      return null;
    }

    const field = this.getForeignPrimaryField();
    const snapshot = getSnapshot(this.state, this.field.property.foreignDatasheetId);
    if (!snapshot || !field) {
      return null;
    }
    const cellValue = getCellValue(this.state, snapshot, recordId, field.id);
    return cellValue;
  }

  cellValue2TextArray(cellValue: string[] | null) {
    return cellValue ? cellValue.map(recordId => this.getLinkedRecordCellString(recordId) || '') : [];
  }

  /**
   * @orderInCellValueSensitive {boolean} optional parameter,
   * to determine whether to only do normal sorting for the associated field, without preprocessing the cell content
   */
  override compare(
    cellValue1: string[] | null,
    cellValue2: string[] | null,
    orderInCellValueSensitive?: boolean,
  ): number {
    const rowIndexMap = getRowsIndexMap(this.state, this.field.property.foreignDatasheetId);
    if (!orderInCellValueSensitive) {
      cellValue1 = this.sortValueByForeignRowOrder(cellValue1, rowIndexMap);
      cellValue2 = this.sortValueByForeignRowOrder(cellValue2, rowIndexMap);
    }
    return super.compare(cellValue1, cellValue2);
  }

  override isMeetFilter(
    operator: FOperator,
    cellValue: string[] | null,
    conditionValue: Exclude<IFilterText, null>,
  ): boolean {
    if (operator === FOperator.IsEmpty) {
      return cellValue == null;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cellValue != null;
    }
    const cellTextArray = this.cellValue2TextArray(cellValue);
    const [filterValue] = conditionValue;

    switch (operator) {
      case FOperator.Contains: {
        return cellValue != null && cellTextArray.some(text => this.stringInclude(text, filterValue));
      }

      case FOperator.DoesNotContain: {
        return cellValue == null || !cellTextArray.some(text => this.stringInclude(text, filterValue));
      }

      default: {
        return super.isMeetFilter(operator, cellValue, conditionValue);
      }
    }
  }

  // Sort the relation records according to their order in view.rows specified by the relation table.
  sortValueByForeignRowOrder(value: string[] | null, rowIndexMap: Map<string, number>) {
    if (!value) {
      return null;
    }
    return Array.from(value).sort((id1, id2) => {
      return (rowIndexMap.get(id1) ?? 0) - (rowIndexMap.get(id2) ?? 0);
    });
  }

  stdValueToCellValue(stdValue: IStandardValue): ICellValue {

    // If it is data from the current field, write it directly.
    if (stdValue.data[0] && stdValue.data[0].datasheetId === this.field.property.foreignDatasheetId) {
      return stdValue.data.map(val => {
        return (val as {text:string,recordId:string}).recordId;
      });
    }

    // Try to find the same value as the primary key text from the association table, if found, create the association.
    const textRecordMap = getTextRecordMap(this.state, this.field.property.foreignDatasheetId);
    let texts = [stdValue.data.map(d => d.text).join(', ')];
    // Determine whether the current configuration item allows adding multiple associated records,
    // and if it is allowed, cut it according to ","
    if (!this.field.property.limitSingleRecord) {
      const splitText = texts[0]!.split(/, ?/);
      if (splitText.length > 1) {
        // Both before and after the split are added to the candidate array to try to match
        texts = [texts[0]!, ...splitText];
      }
    }
    const cellValue = texts.reduce<string[]>((pre, text) => {
      const recordId = textRecordMap[text];
      if (recordId) {
        pre.push(recordId);
      }
      return pre;
    }, []);

    return cellValue.length ? Array.from(new Set(cellValue)) : null;
  }

  cellValueToStdValue(recordIds: string[] | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: FieldType.Link,
      data: [],
    };

    if (recordIds) {
      stdVal.data = recordIds.map(recordId => {
        const text = this.getLinkedRecordCellString(recordId) || t(Strings.record_unnamed);
        return {
          text,
          recordId,
          datasheetId: this.field.property.foreignDatasheetId,
        };
      });
    }

    return stdVal;
  }

  /**
   * Obtains the content of the first column in the associated table through the `recordId` recorded in the associated field cell,
   * and the content is processed by cellValue2String.
   * @param {(string[] | null)} recordIds
   * @returns {(string[] | null)}
   */
  cellValueToArray(recordIds: string[] | null): string[] | null {
    const _filter = this.filterRecordIds(recordIds);
    return _filter.map(recordId => {
      return this.getLinkedRecordCellString(recordId) || t(Strings.record_unnamed);
    });
  }

  /**
   * @description concatenates the strings obtained by recordId.
   * Several records may be associated with one associated cell at the same time
   * @param {(any[] | null)} cellValues
   * @returns
   */
  arrayValueToString(cellValues: any[] | null) {
    return cellValues && cellValues.length ? cellValues.join(', ') : null;
  }

  cellValueToString(recordIds: string[] | null): string | null {
    if (!recordIds) {
      return null;
    }
    return this.arrayValueToString(this.cellValueToArray([recordIds].flat()));
  }

  getLinkedRecordCellString(recordId: string) {
    const field = this.getForeignPrimaryField();
    if (!field) {
      return null;
    }
    return Field.bindContext(field, this.state).cellValueToString(this.getLinkedCellValue(recordId));
  }

  defaultValueForCondition(_condition: IFilterCondition): any {
    return null;
  }

  cellValueToApiStandardValue(recordIds: string[] | null): string[] | null {
    return recordIds;
  }

  cellValueToApiStringValue(recordIds: string[] | null): string | null {
    return this.cellValueToString(recordIds);
  }

  cellValueToOpenValue(recordIds: string[] | null): ILinkFieldOpenValue[] | null {
    const _filter = this.filterRecordIds(recordIds);
    return _filter.map(recordId => {
      return {
        recordId,
        title: this.getLinkedRecordCellString(recordId) || t(Strings.record_unnamed)
      };
    });
  }

  openWriteValueToCellValue(openWriteValue: string[] | ILinkFieldOpenValue[] | null): string[] | null {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    const isSimple = openWriteValue.length && typeof openWriteValue[0] === 'string';
    return (isSimple ? openWriteValue : (openWriteValue as ILinkFieldOpenValue[]).map(v => v.recordId)) as string[];
  }

  static openUpdatePropertySchema = Joi.object({
    foreignDatasheetId: Joi.string().required(),
    limitToViewId: Joi.string().pattern(/^viw.+/, 'viewId'),
    limitSingleRecord: Joi.boolean(),
    conversion: Joi.valid(...enumToArray(Conversion))
  }).required();

  static openAddPropertySchema = Joi.object({
    foreignDatasheetId: Joi.string().required(),
    limitToViewId: Joi.string().pattern(/^viw.+/, 'viewId'),
    limitSingleRecord: Joi.boolean()
  }).required();

  override get openFieldProperty(): IOpenOneWayLinkFieldProperty {
    const { limitToView: limitToViewId, foreignDatasheetId, limitSingleRecord } = this.field.property;
    return {
      foreignDatasheetId,
      limitToViewId,
      limitSingleRecord,
    };
  }

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenMagicLinkFieldProperty) {
    return OneWayLinkField.openUpdatePropertySchema.validate(updateProperty);
  }

  validateOpenAddFieldProperty(addProperty: IAddOpenMagicLinkFieldProperty) {
    return OneWayLinkField.openAddPropertySchema.validate(addProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenMagicLinkFieldProperty): IOneWayLinkFieldProperty {
    const { foreignDatasheetId, limitToViewId: limitToView, limitSingleRecord } = openFieldProperty;
    return {
      foreignDatasheetId,
      limitToView,
      limitSingleRecord
    };
  }

  override filterValueToOpenFilterValue(value: IFilterText): IOpenFilterValueString {
    return TextBaseField._filterValueToOpenFilterValue(value);
  }

  override openFilterValueToFilterValue(value: IOpenFilterValueString): IFilterText {
    return TextBaseField._openFilterValueToFilterValue(value);
  }

  override validateOpenFilterValue(value: IOpenFilterValueString) {
    return TextBaseField._validateOpenFilterValue(value);
  }
}
