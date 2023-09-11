import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { DatasheetApi, ICascaderField, ICascaderNode, ILinkField, ILinkedField, Selectors } from '@apitable/core';
import { ICascaderOption, mapTreeNodesRecursively } from '../../../../utils';
import { Cascader } from '../../../cascader';
import styles from './style.module.less';

interface IFilterCascader {
  field: ICascaderField;
  onChange: (val: any) => void;
  value: string[];
  disabled?: boolean;
  linkedFieldId?: string;
}

export const FilterCascader = (props: IFilterCascader) => {
  const datasheetId = useSelector((state) => Selectors.getActiveDatasheetId(state))!;
  const fieldMap = useSelector((state) => Selectors.getFieldMap(state, datasheetId));
  const { field, disabled, onChange, value, linkedFieldId } = props;
  const linkedDatasheetId = linkedFieldId ? (fieldMap?.[linkedFieldId] as ILinkField)?.property.foreignDatasheetId : '';
  const [options, setOptions] = useState<ICascaderOption[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadTreeSnapshot = useCallback(async() => {
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
