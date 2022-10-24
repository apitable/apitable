import { IDateTimeField, Selectors } from '@apitable/core';
import debounce from 'lodash/debounce';
import { CheckboxEditor } from 'pc/components/editors/checkbox_editor';
import { IEditor } from 'pc/components/editors/interface';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { IFilterCheckboxProps } from '../interface';
import styles from './style.module.less';

export const FilterCheckbox: React.FC<Omit<IFilterCheckboxProps, 'execute'>> = props => {
  const { condition, onChange, field } = props;
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const checkboxRef = useRef<IEditor>(null);

  useEffect(() => {
    checkboxRef.current!.onStartEdit(condition.value != null ? condition.value : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounceCommandNumberFn = debounce((value: boolean) => {
    onChange(value);
  }, 500);

  function commandNumberFn(value: boolean) {
    debounceCommandNumberFn(value);
  }

  return (
    <div className={styles.checkboxContainer}>
      <CheckboxEditor
        style={{ boxShadow: 'none' }}
        ref={checkboxRef}
        editable
        editing
        width={160}
        datasheetId={datasheetId}
        height={35}
        field={field as IDateTimeField}
        commandFn={commandNumberFn}
      />
    </div>
  );
};
