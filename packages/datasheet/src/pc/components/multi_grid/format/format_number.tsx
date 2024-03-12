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

import { Input } from 'antd';
import { SelectValue } from 'antd/lib/select';
import debounce from 'lodash/debounce';
import { SetStateAction, useEffect, useMemo, useRef, Dispatch } from 'react';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Select, Switch } from '@apitable/components';
import {
  IField,
  INumberField,
  IPercentField,
  ICurrencyField,
  Selectors,
  t,
  Strings,
  FieldType,
  SymbolAlign,
  INumberFieldProperty,
  DefaultCommaStyle,
} from '@apitable/core';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Divider } from 'pc/components/common/divider';
import { IEditor } from 'pc/components/editors/interface';
import { NumberEditor } from 'pc/components/editors/number_editor';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './styles.module.less';

interface IFormateNumberProps {
  currentField: INumberField | IPercentField | ICurrencyField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  datasheetId?: string;
}

const optionData = [
  { value: 0, label: '1' },
  { value: 1, label: '1.0' },
  { value: 2, label: '1.00' },
  { value: 3, label: '1.000' },
  { value: 4, label: '1.0000' },
];

const symbolAlignOptions = [
  { value: SymbolAlign.left, label: t(Strings.currency_field_symbol_align_left) },
  { value: SymbolAlign.default, label: t(Strings.currency_field_symbol_align_default) },
  { value: SymbolAlign.right, label: t(Strings.currency_field_symbol_align_right) },
];

export const FormateNumber: React.FC<React.PropsWithChildren<IFormateNumberProps>> = (props: IFormateNumberProps) => {
  const datasheetId = useAppSelector((state) => props.datasheetId || Selectors.getActiveDatasheetId(state))!;
  const numberRef = useRef<IEditor | null>(null);
  const { currentField, setCurrentField } = props;
  const { property, type } = currentField;

  const isCurrency = type === FieldType.Currency;

  const formatOptions = useMemo(() => {
    if (type === FieldType.Percent) {
      return optionData;
    }

    const { symbolAlign, symbol, commaStyle } = property as INumberFieldProperty;

    const getOptions = (symbol?: string, symbolAlign?: SymbolAlign, commaStyle?: string) => {
      return optionData.map((item) => {
        let label: React.ReactNode | Element = item.label;
        if (commaStyle) {
          label = (label as string).replace('1', `1${DefaultCommaStyle}000`);
        }
        switch (symbolAlign) {
          case SymbolAlign.left:
            label = (
              <div className={styles.formatItemWrap}>
                <div className={styles.formatItemSymbol}>{symbol}</div>
                <div className={styles.formatItemPrecision}>{label}</div>
              </div>
            );
            break;
          case SymbolAlign.right:
            label = (
              <div className={styles.formatItemWrap} data-align="right">
                {label} {symbol}
              </div>
            );
            break;
          default:
            label = (
              <div className={styles.formatItemWrap} data-align="default">
                <div className={styles.formatItemSymbol}>{symbol}</div>
                <div className={styles.formatItemPrecision}>{label}</div>
              </div>
            );
            break;
        }
        return { value: item.value, label };
      });
    };

    if (type === FieldType.Number) {
      return getOptions(symbol, SymbolAlign.right, commaStyle);
    }

    if (type === FieldType.Currency || symbol) {
      return getOptions(symbol, symbolAlign);
    }

    return optionData;
  }, [property, type]);

  useEffect(() => {
    let defaultValue: string | undefined = currentField.property.defaultValue;
    defaultValue = defaultValue === '' ? undefined : defaultValue;

    numberRef.current!.onStartEdit(defaultValue);
    // eslint-disable-next-line
  }, []);

  const handleChangeSymbolAlign = ({ value }: any) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        symbolAlign: value as number,
      } as any,
    });
  };

  const handleSelectChange = ({ value }: { value: SelectValue }) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        precision: value as number,
      } as any,
    });
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        symbol: e.target.value as string,
      } as any,
    });
  };

  const handleChangeNumberFieldSymbol = (data: any) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        commaStyle: data ? DefaultCommaStyle : undefined,
      } as any,
    });
  };

  const debounceCommandNumberFn = debounce((value: string) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        defaultValue: value as string,
      } as any,
    });
  }, 500);

  function commandNumberFn(value: string) {
    debounceCommandNumberFn(value);
  }

  const commonProps = {
    width: 160,
    height: 35,
    editable: true,
    disabled: false,
    editing: true,
    datasheetId,
    field: currentField,
    record: null,
    commandFn: commandNumberFn,
    isFromFormat: true,
  };

  const precisionSelect = (
    <>
      <div className={styles.sectionTitle}>
        {currentField.type === FieldType.Percent ? t(Strings.currency_field_configuration_precision) : t(Strings.number_field_format)}
        {currentField.type === FieldType.Number && (
          <div className={styles.commaStyleSwitch}>
            <Switch size="small" checked={Boolean(currentField.property.commaStyle)} onChange={handleChangeNumberFieldSymbol} />
            <span className={styles.commaStyleText}>{t(Strings.comma_style)}</span>
          </div>
        )}
      </div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Select
          triggerCls={styles.customSelect}
          dropdownMatchSelectWidth
          value={currentField.property.precision}
          onSelected={handleSelectChange}
          options={formatOptions as any}
        />
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileSelect defaultValue={currentField.property.precision} optionData={formatOptions} onChange={(value) => handleSelectChange({ value })} />
      </ComponentDisplay>
    </>
  );

  const symbolAlginSelect = (
    <>
      <div className={styles.sectionTitle}>{t(Strings.currency_field_symbol_align)}</div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Select
          triggerCls={styles.customSelect}
          dropdownMatchSelectWidth={false}
          value={(currentField as unknown as ICurrencyField).property.symbolAlign || 0}
          onSelected={handleChangeSymbolAlign}
          options={symbolAlignOptions}
        />
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileSelect
          defaultValue={(currentField as unknown as ICurrencyField).property.symbolAlign || 0}
          optionData={symbolAlignOptions}
          onChange={(value) => handleChangeSymbolAlign({ value })}
        />
      </ComponentDisplay>
    </>
  );

  return (
    <div>
      {currentField.type !== FieldType.Percent && (
        <div className={styles.section}>
          {isCurrency ? (
            <div className={styles.sectionTitle}>{t(Strings.currency_field_configuration_symbol)}</div>
          ) : (
            <div className={styles.sectionTitle}>
              {t(Strings.number_field_configuration_symbol)}
              <span className={styles.optional}>（{t(Strings.field_configuration_optional)}）</span>
            </div>
          )}

          <Input
            value={currentField.property.symbol}
            onChange={handleSymbolChange}
            placeholder={isCurrency ? t(Strings.currency_field_symbol_placeholder) : t(Strings.number_field_symbol_placeholder)}
          />
        </div>
      )}
      <div className={styles.section}>
        {isCurrency ? (
          <div className={styles.selectWrap}>
            <div className={styles.alignSelectWrap}>{symbolAlginSelect}</div>
            <div className={styles.precisionSelectWrap}>{precisionSelect}</div>
          </div>
        ) : (
          precisionSelect
        )}
      </div>
      <Divider />
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {t(Strings.default)}
          <span className={styles.optional}>（{t(Strings.field_configuration_optional)}）</span>
        </div>
        <NumberEditor style={{}} ref={numberRef} {...commonProps} />
      </div>
    </div>
  );
};
