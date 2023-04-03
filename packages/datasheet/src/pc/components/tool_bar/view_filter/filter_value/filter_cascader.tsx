import { CascaderEditor } from '../../../editors/cascader_editor';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Selectors } from '@apitable/core';

export const FilterCascader = (props: any) => {
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const { field, onChange } = props;
  const [editing, toggleEditing] = useState(true);
  return (
    <CascaderEditor
      field={field}
      editing={editing}
      toggleEditing={() => toggleEditing(!editing)}
      onSave={onChange}
      datasheetId={datasheetId}
      editable
      width={100}
      height={40}
      style={{}}
      recordId={''}
    />
  );
};