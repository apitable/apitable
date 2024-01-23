import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DatasheetApi,
  Field,
  FieldType,
  ICascaderField,
  ICascaderNode,
  IField,
  ILinkedField,
  ILinkField,
  LookUpField,
  Selectors
} from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { ICascaderOption, mapTreeNodesRecursively } from '../../../../utils';
import { Cascader } from '../../../cascader';
import styles from './style.module.less';

interface IFilterCascader {
  field: ICascaderField;
  onChange: (val: any) => void;
  value: string[];
  disabled?: boolean;
  linkedFieldId?: string;
  primaryField: IField;
}

export const FilterCascader = (props: IFilterCascader) => {
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state))!;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId));
  const { field, disabled, onChange, value, linkedFieldId, primaryField } = props;
  const lookUpFieldInfo = primaryField.type === FieldType.LookUp ?
    (Field.bindModel(primaryField) as any as LookUpField).getLookUpEntityFieldInfo() : null;
  const linkedDatasheetId = lookUpFieldInfo?.field.type === FieldType.Cascader ? lookUpFieldInfo.datasheetId :
    linkedFieldId ? (fieldMap?.[linkedFieldId] as ILinkField)?.property.foreignDatasheetId : '';
  const [options, setOptions] = useState<ICascaderOption[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadTreeSnapshot = useCallback(async () => {
    setLoading(true);
    const res = await DatasheetApi.getCascaderSnapshot({
      datasheetId: linkedDatasheetId || datasheetId,
      fieldId: field.id,
      linkedFieldIds: field.property.linkedFields.map((linkedField: ILinkedField) => linkedField.id),
    });

    const nodes: ICascaderNode[] = res?.data?.data?.treeSelectNodes || [];

    const options = mapTreeNodesRecursively<ICascaderNode>(nodes, 'text');

    setOptions(options);
    setLoading(false);
  }, [datasheetId, linkedDatasheetId, field.id, field.property.linkedFields]);

  useEffect(() => {
    loadTreeSnapshot();
  }, [loadTreeSnapshot]);
  return (
    <div className={styles.cascaderEditorContainer} ref={containerRef}>
      <Cascader
        loading={loading}
        disabled={disabled}
        onChange={(val) => {
          if (disabled) {
            return;
          }
          onChange(val);
        }}
        options={options}
        style={{
          height: '40px',
          lineHeight: '40px',
        }}
        displayRender={(label) => {
          return field.property.showAll ? label.join('/') : label[label.length - 1];
        }}
        value={value?.map((cv) => cv.split('/'))}
      />
    </div>
  );
};
