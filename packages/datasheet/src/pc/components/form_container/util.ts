import dayjs from 'dayjs';
import { compact, find } from 'lodash';
import qs from 'qs';
import { Field, FieldType, IFieldMap, IFieldPermissionMap, Selectors, string2Segment } from '@apitable/core';
import { IFormData, IFormQuery } from './interface';

export const FORM_FIELD_TYPE = {
  select: [FieldType.SingleSelect, FieldType.MultiSelect],
  primary: [FieldType.Member, FieldType.Link, FieldType.OneWayLink],
  number: [FieldType.Rating, FieldType.Percent, FieldType.Currency, FieldType.Number, FieldType.Phone],
  bool: [FieldType.Checkbox],
  datetime: [FieldType.DateTime],
  filter: [FieldType.Attachment, FieldType.Cascader, FieldType.WorkDoc],
};

export const string2Query = () => {
  const search = window.location.search.slice(1);
  return qs.parse(search) as IFormQuery;
};

export const query2formData = (query: IFormQuery, fieldMap: IFieldMap, fieldPermissionMap?: IFieldPermissionMap) => {
  const res: IFormData = {};
  for (const key in query) {
    const value = query[key];
    const field = fieldMap[key];
    if (field) {
      const fieldAccessible = Selectors.getFormSheetAccessibleByFieldId(fieldPermissionMap, key);
      if (fieldAccessible) {
        // select match item's id or value，exam: ['val1', 'val2'] or ['opt-xxx1', 'opt-xxx2']
        if (FORM_FIELD_TYPE.select.includes(field.type)) {
          // filter invalid item opt item
          if (value[0].startsWith('opt')) {
            res[key] = compact((value as string[]).map((v) => find(field.property.options, { id: v })?.id));
          } else {
            // filter invalid item name item
            res[key] = compact((value as string[]).map((v) => find(field.property.options, { name: v })?.id));
          }
          if (field.type === FieldType.SingleSelect) {
            res[key] = res[key]?.[0];
          }
        } else if ([FieldType.SingleText, FieldType.Text].includes(field.type)) {
          res[key] = string2Segment(value as string);
        } else if (FORM_FIELD_TYPE.number.includes(field.type)) {
          // only number type is valid
          const _value = Number(value);
          if (!isNaN(_value)) {
            res[key] = Number(value);
          }
        } else if (FORM_FIELD_TYPE.bool.includes(field.type)) {
          if (value === 'true') {
            res[key] = true;
          }
          if (value === 'false') {
            res[key] = false;
          }
        } else if (FORM_FIELD_TYPE.datetime.includes(field.type)) {
          const _value = value as string;
          const isValidDate = dayjs.tz(_value).isValid();
          if (isValidDate) {
            // only valid date valid, exam: 2023-10-30 or 1692028800000
            const isTimestamp = Field.bindModel(field).validateCellValue(_value);
            res[key] = isTimestamp.error ? dayjs.tz(_value).tz(field.property.timeZone).valueOf() : value;
          }
        } else if (!FORM_FIELD_TYPE.filter.includes(field.type)) {
          res[key] = value;
        }
      }
    }
  }
  return res;
};
