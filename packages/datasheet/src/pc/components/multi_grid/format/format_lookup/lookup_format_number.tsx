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
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Select, Switch } from '@apitable/components';
import { DefaultCommaStyle, FieldType, IField, INumberFormatFieldProperty, Strings, t } from '@apitable/core';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import styles from '../styles.module.less';

interface IFormateNumberProps {
  currentField: IField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

const optionData4Number = [
  { value: FieldType.Number, label: t(Strings.field_title_number) },
  { value: FieldType.Currency, label: t(Strings.field_title_currency) },
  { value: FieldType.Percent, label: t(Strings.field_title_percent) },
];

const optionData4Precision = [
  { value: 0, label: '1' },
  { value: 1, label: '1.0' },
  { value: 2, label: '1.00' },
  { value: 3, label: '1.000' },
  { value: 4, label: '1.0000' },
];

export const LookUpFormatNumber: React.FC<React.PropsWithChildren<IFormateNumberProps>> = (props: IFormateNumberProps) => {
  const { currentField, setCurrentField } = props;

  const onChange = (newFormatting: Object) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        formatting: {
          ...currentField.property.formatting,
          ...newFormatting,
        },
      },
    });
  };

  const { formatType, precision, symbol, commaStyle } = (currentField.property.formatting as INumberFormatFieldProperty) || {};

  return (
    <div className={styles.sectionWrapper}>
      <div className={classNames(styles.section, styles.sectionLeft)} style={{ marginRight: 12 }}>
        <div className={styles.sectionTitle}>{t(Strings.field_configuration_numerical_value_format)}</div>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <Select
            triggerCls={styles.customSelect}
            dropdownMatchSelectWidth={false}
            value={formatType}
            onSelected={({ value }) => onChange({ formatType: value as number })}
            options={optionData4Number}
          />
        </ComponentDisplay>

        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileSelect defaultValue={formatType} optionData={optionData4Number} onChange={(value) => onChange({ formatType: value as number })} />
        </ComponentDisplay>
      </div>
      <div className={classNames(styles.section, formatType === FieldType.Currency ? styles.sectionCenter : styles.sectionRight)}>
        <div className={styles.sectionTitle}>{t(Strings.precision)}</div>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <Select
            triggerCls={styles.customSelect}
            dropdownMatchSelectWidth={false}
            value={precision}
            onSelected={({ value }) => onChange({ precision: value as number })}
            options={optionData4Precision}
          />
        </ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileSelect defaultValue={precision} onChange={(value) => onChange({ precision: value as number })} optionData={optionData4Precision} />
        </ComponentDisplay>
        {formatType === FieldType.Number && (
          <div className={styles.commaStyleSwitch}>
            <Switch
              size="small"
              checked={Boolean(commaStyle)}
              onChange={(value) => onChange({ commaStyle: value ? DefaultCommaStyle : undefined })}
            />
            <span className={styles.commaStyleText}>{t(Strings.comma_style)}</span>
          </div>
        )}
      </div>
      {formatType === FieldType.Currency && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>{t(Strings.currency_field_configuration_symbol)}</div>
          <Input style={{ width: 70 }} value={symbol} onChange={(e) => onChange({ symbol: e.target.value as string })} />
        </div>
      )}
    </div>
  );
};
