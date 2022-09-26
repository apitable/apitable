import { SetStateAction, Dispatch, useMemo, useRef } from 'react';
import * as React from 'react';
import { IField, IFormulaField, expressionTransform, Selectors, t, Strings, BasicValueType, parse } from '@vikadata/core';
import classNames from 'classnames';
import styles from './styles.module.less';
import formatStyles from '../styles.module.less';
import { Input } from 'antd';
import { useSelector } from 'react-redux';
import { openFormulaModal } from './open_formula_modal';
import { LookUpFormatDateTime } from '../format_lookup/lookup_format_datetime';
import { LookUpFormatNumber } from '../format_lookup/lookup_format_number';
import { assignDefaultFormatting } from '../format_lookup';
import { useEffect } from 'react';
import { store } from 'pc/store';

interface IFormatFormulaProps {
  from?: string;
  currentField: IFormulaField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  datasheetId?: string;
}

export const FormatFormula: React.FC<IFormatFormulaProps> = (props: IFormatFormulaProps) => {
  const { from, currentField, setCurrentField, datasheetId: propDatasheetId } = props;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, propDatasheetId || state.pageParams.datasheetId!))!;
  const fieldPermissionMap = useSelector(state => Selectors.getFieldPermissionMap(state, propDatasheetId));
  const datasheetId = useSelector(state => propDatasheetId || Selectors.getActiveDatasheetId(state))!;
  const inputRef = useRef<Input>(null);
  const transformedExp = useMemo(() => {
    try {
      return expressionTransform(currentField.property.expression, { fieldMap, fieldPermissionMap }, 'name');
    } catch (e) {
      return currentField.property.expression;
    }
  }, [currentField.property.expression, fieldMap, fieldPermissionMap]);

  const getExpValueType = (exp: string) => {
    const fExp = parse(exp, { field: currentField, fieldMap, state: store.getState() });
    if ('error' in fExp) {
      return BasicValueType.String;
    }

    if (fExp && fExp.ast.valueType) {
      if (fExp.ast.valueType === BasicValueType.Array) {
        return fExp.ast.innerValueType || BasicValueType.String;
      }
      return fExp.ast.valueType;
    }
    return BasicValueType.String;
  };
  const showFormatType = getExpValueType(currentField.property.expression);

  const handleChange = (value: string) => {
    const showFormatType = getExpValueType(value);

    setCurrentField(assignDefaultFormatting(showFormatType, {
      ...currentField,
      property: { ...currentField.property, datasheetId, expression: value },
    }));
    inputRef.current && inputRef.current.focus();
  };

  useEffect(() => {
    if (from === 'cell') {
      openFormulaModal({
        field: currentField, expression: currentField.property.expression, onSave: handleChange, datasheetId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  return (
    <>
      <div className={classNames(styles.formatFormula, formatStyles.section)}>
        <div className={formatStyles.sectionTitle}>{t(Strings.field_name_formula)}</div>
        <Input
          ref={inputRef}
          className='code'
          placeholder={t(Strings.input_formula)}
          value={transformedExp}
          onClick={() => openFormulaModal({
            field: currentField, expression: currentField.property.expression, onSave: handleChange, datasheetId
          })}
        />
      </div>
      {
        showFormatType === BasicValueType.DateTime && <LookUpFormatDateTime
          currentField={currentField}
          setCurrentField={setCurrentField}
        />
      }
      {
        showFormatType === BasicValueType.Number && <LookUpFormatNumber
          currentField={currentField}
          setCurrentField={setCurrentField}
        />
      }
    </>
  );
};
