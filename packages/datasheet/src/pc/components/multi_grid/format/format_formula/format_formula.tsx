/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import type { InputRef } from 'antd';
import { Input } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { BasicValueType, expressionTransform, IField, IFormulaField, parse, Selectors, Strings, t } from '@apitable/core';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { assignDefaultFormatting } from '../format_lookup';
import { LookUpFormatDateTime } from '../format_lookup/lookup_format_datetime';
import { LookUpFormatNumber } from '../format_lookup/lookup_format_number';
import formatStyles from '../styles.module.less';
import { openFormulaModal } from './open_formula_modal';
import styles from './styles.module.less';

interface IFormatFormulaProps {
  from?: string;
  currentField: IFormulaField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  datasheetId?: string;
}

export const FormatFormula: React.FC<React.PropsWithChildren<IFormatFormulaProps>> = (props: IFormatFormulaProps) => {
  const { from, currentField, setCurrentField, datasheetId: propDatasheetId } = props;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, propDatasheetId || state.pageParams.datasheetId!))!;
  const fieldPermissionMap = useAppSelector((state) => Selectors.getFieldPermissionMap(state, propDatasheetId));
  const datasheetId = useAppSelector((state) => propDatasheetId || Selectors.getActiveDatasheetId(state))!;
  const inputRef = useRef<InputRef>(null);
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

    setCurrentField(
      assignDefaultFormatting(showFormatType, {
        ...currentField,
        property: { ...currentField.property, datasheetId, expression: value },
      }),
    );
    inputRef.current && inputRef.current.focus();
  };

  useEffect(() => {
    if (from === 'cell') {
      openFormulaModal({
        field: currentField,
        expression: currentField.property.expression,
        onSave: handleChange,
        datasheetId,
      });
    }
    // eslint-disable-next-line
  }, [from]);

  return (
    <>
      <div className={classNames(styles.formatFormula, formatStyles.section)}>
        <div className={formatStyles.sectionTitle}>{t(Strings.field_name_formula)}</div>
        <Input
          ref={inputRef}
          className="code"
          placeholder={t(Strings.input_formula)}
          value={transformedExp}
          onClick={() =>
            openFormulaModal({
              field: currentField,
              expression: currentField.property.expression,
              onSave: handleChange,
              datasheetId,
            })
          }
        />
      </div>
      {showFormatType === BasicValueType.DateTime && <LookUpFormatDateTime currentField={currentField} setCurrentField={setCurrentField} />}
      {showFormatType === BasicValueType.Number && <LookUpFormatNumber currentField={currentField} setCurrentField={setCurrentField} />}
    </>
  );
};
