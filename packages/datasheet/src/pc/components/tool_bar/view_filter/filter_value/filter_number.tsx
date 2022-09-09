import { FieldType, Selectors, IField } from '@vikadata/core';
import debounce from 'lodash/debounce';
import { ScreenSize } from 'pc/components/common/component_display';
import { IEditor } from 'pc/components/editors/interface';
import { useResponsive } from 'pc/hooks';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { NumberEditor } from '../../../editors/number_editor/number_editor';
import { IFilterNumberProps } from '../interface';
import styles from './style.module.less';

export const FilterNumber: React.FC<Omit<IFilterNumberProps, 'execute'>> = props => {
  const { condition, onChange, field } = props;
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const numberRef = useRef<IEditor>(null);
  const defaultValue = condition.value;

  useEffect(() => {
    numberRef.current && numberRef.current.onStartEdit(defaultValue ? defaultValue[0] : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debounceCommandNumberFn = debounce((value: string) => {
    onChange(value ? [value] : null);
  }, 500);

  function commandNumberFn(value: string) {
    debounceCommandNumberFn(value);
  }

  function getFieldTypeByProperty(field: IField) {
    const { formatType } = field.property;

    if (formatType === FieldType.Currency) {
      return FieldType.Currency;
    } else if (formatType === FieldType.Percent) {
      return FieldType.Percent;
    }
    return field.type;
  }

  const fieldType = getFieldTypeByProperty(field);
  const numberTypes = new Set([FieldType.Number, FieldType.Currency, FieldType.Percent, FieldType.AutoNumber]);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const editorHeight = isMobile ? 48 : 40;

  return (
    <div className={styles.numberContainer}>
      {numberTypes.has(fieldType) && (
        <NumberEditor
          style={{}}
          ref={numberRef}
          editable
          editing
          width={160}
          datasheetId={datasheetId}
          height={editorHeight}
          field={field}
          commandFn={commandNumberFn}
        />
      )}
    </div>
  );
};
