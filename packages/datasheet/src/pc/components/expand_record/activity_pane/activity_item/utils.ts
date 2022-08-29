import { IField, IMemberField, IMultiSelectField, ISelectField } from '@vikadata/core';
import { find, get, has, values } from 'lodash';

interface ISelectFieldParam {
  cacheFieldOptions: object;
  fieldId: string;
  oiOrOd: string;
  field?: IField;
}
// 补全单选 op 中缺失的 field
export const supplySelectField = (props: ISelectFieldParam) => {
  const { cacheFieldOptions, fieldId, oiOrOd, field } = props;
  if (get(field, 'property.options', []).some(op => oiOrOd === op.id)) {
    return field;
  }
  const fieldOptionsMap = values(cacheFieldOptions[fieldId]) as ISelectField[];
  return find(fieldOptionsMap, fo => has(fo, 'property.options') && fo.property.options.some(op => oiOrOd === op.id)) || field;
};

interface IMultiSelectOrMemberFieldParam {
  cacheFieldOptions: object;
  fieldId: string;
  oiOrOd: string[];
  field?: IField;
}
// 补全多选 op 中缺失的 field
export const supplyMultiSelectField = (props: IMultiSelectOrMemberFieldParam) => {
  const { cacheFieldOptions, fieldId, oiOrOd, field } = props;
  if (get(field, 'property.options', []).some(op => oiOrOd[0] === op.id)) {
    return field;
  }
  const fieldOptionsMap = values(cacheFieldOptions[fieldId]) as IMultiSelectField[];
  return find(fieldOptionsMap, fo => has(fo, 'property.options') && fo.property.options.some(op => oiOrOd[0] === op.id)) || field;
};

// 补全成员中缺失的 field
export const supplyMemberField = (props: IMultiSelectOrMemberFieldParam) => {
  const { cacheFieldOptions, fieldId, oiOrOd, field } = props;
  if (get(field, 'property.unitIds', []).some(op => oiOrOd[0] === op.id)) {
    return field;
  }
  const fieldOptionsMap = values(cacheFieldOptions[fieldId]) as IMemberField[];
  return find(fieldOptionsMap,
    fo => (get(fo, 'property.unitIds', []) as string[]).some(unitId => oiOrOd[0] === unitId)
  ) || field;
};

interface IExtraFieldParam {
  cacheFieldOptions: object;
  fieldId: string;
  field?: IField;
  revision: number;
  isOi?: boolean;
}
// 补全评分、勾选、数字、日期、关联 op 中缺失的 field
// TODO 评分、勾选、数字改变 emoji 时，单元格实际数据没有变动
export const supplyExtraField = (props: IExtraFieldParam) => {
  const { cacheFieldOptions, fieldId, revision, isOi } = props;
  let { field } = props;
  const fieldOptionsMap = cacheFieldOptions[fieldId];
  const revisionKeys = fieldOptionsMap && Object.keys(fieldOptionsMap);
  let idx = 0;
  // 找到最接近并且大于或等于当前版本的 Field （后面版本的 od 操作丢失了 field）
  while(revisionKeys && idx < revisionKeys.length) {
    const curKey = revisionKeys[idx].split('_')[1];
    if (
      Number(curKey) >= revision &&
      (
        has(fieldOptionsMap, `${revisionKeys[idx]}.property.icon`) ||
        has(fieldOptionsMap, `${revisionKeys[idx]}.property.precision`) || 
        has(fieldOptionsMap, `${revisionKeys[idx]}.property.dateFormat`) ||
        has(fieldOptionsMap, `${revisionKeys[idx]}.property.foreignDatasheetId`) 
      )
    ) {
      // oi 版本相等的情况不取缓存 od 的 field
      if (isOi) {
        if (Number(curKey) !== revision) {
          field = fieldOptionsMap[revisionKeys[idx]];
          break;
        }
      } else {
        field = fieldOptionsMap[revisionKeys[idx]];
        break;
      }
    }
    idx++;
  }
  return field;
};

