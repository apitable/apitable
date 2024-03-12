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

import classNames from 'classnames';
import { omit } from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Checkbox, colorVars, Select, Switch } from '@apitable/components';
import {
  DateFormat,
  formatTimeZone,
  getUtcOptionList,
  IDateTimeFieldProperty,
  IField,
  Selectors,
  Strings,
  t,
  TimeFormat,
} from '@apitable/core';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Divider } from 'pc/components/common/divider';
import { useAppSelector } from 'pc/store/react-redux';
import settingStyles from '../../field_setting/styles.module.less';
import styles from '../styles.module.less';

interface IFormatDateTime {
  currentField: IField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

const optionData4Date = [
  { value: DateFormat['YYYY/MM/DD'], label: t(Strings.label_format_year_month_and_day_split_by_slash) },
  { value: DateFormat['YYYY-MM-DD'], label: t(Strings.label_format_year_month_and_day_split_by_dash) },
  { value: DateFormat['DD/MM/YYYY'], label: t(Strings.label_format_day_month_and_year_split_by_slash) },
  { value: DateFormat['YYYY-MM'], label: t(Strings.label_format_year_and_month_split_by_dash) },
  { value: DateFormat['MM-DD'], label: t(Strings.label_format_month_and_day_split_by_dash) },
  { value: DateFormat['YYYY'], label: t(Strings.label_format_year) },
  { value: DateFormat['MM'], label: t(Strings.label_format_month) },
  { value: DateFormat['DD'], label: t(Strings.label_format_day) },
];

const optionData4Time = [
  { value: TimeFormat['hh:mm'], label: t(Strings.twelve_hour_clock) },
  { value: TimeFormat['HH:mm'], label: t(Strings.twenty_four_hour_clock) },
];

export const LookUpFormatDateTime: React.FC<React.PropsWithChildren<IFormatDateTime>> = (props: IFormatDateTime) => {
  const formatting = props.currentField.property.formatting as IDateTimeFieldProperty;
  const { includeTime, dateFormat, timeFormat, timeZone = '', includeTimeZone } = formatting || {};
  const userTimeZone = useAppSelector(Selectors.getUserTimeZone)!;

  const handleDateFormatChange = (value: DateFormat) => {
    props.setCurrentField({
      ...props.currentField,
      property: {
        ...props.currentField.property,
        formatting: {
          ...formatting,
          dateFormat: value,
        },
      },
    });
  };

  const handleTimeZoneChange = ({ value }: any) => {
    props.setCurrentField({
      ...props.currentField,
      property: {
        ...props.currentField.property,
        formatting: {
          ...formatting,
          timeZone: value,
        },
      },
    });
  };

  const handleTimeFormatChange = (value: TimeFormat) => {
    props.setCurrentField({
      ...props.currentField,
      property: {
        ...props.currentField.property,
        formatting: {
          ...formatting,
          timeFormat: value,
        },
      } as any,
    });
  };

  const handleIncludeTimeChange = (checked: boolean) => {
    const omitFormatting = omit(formatting, ['timeZone', 'includeTimeZone']);
    props.setCurrentField({
      ...props.currentField,
      property: {
        ...props.currentField.property,
        formatting: {
          ...omitFormatting,
          includeTime: checked,
        },
      },
    });
  };

  const handleIncludeTimeZoneChange = (checked: boolean) => {
    props.setCurrentField({
      ...props.currentField,
      property: {
        ...props.currentField.property,
        formatting: {
          ...formatting,
          includeTimeZone: checked,
        },
      },
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{t(Strings.datetime_format)}</div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Select
          triggerCls={styles.customSelect}
          value={dateFormat}
          onSelected={(option) => {
            handleDateFormatChange(option.value as DateFormat);
          }}
          dropdownMatchSelectWidth={false}
          options={optionData4Date}
        />
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileSelect defaultValue={dateFormat} onChange={handleDateFormatChange} optionData={optionData4Date} />
      </ComponentDisplay>
      <section className={settingStyles.section} style={{ marginTop: 16 }}>
        <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
          {t(Strings.include_time)}
          <Switch size="small" checked={includeTime} onChange={handleIncludeTimeChange} />
        </div>
      </section>
      {includeTime && <Divider />}
      {includeTime && (
        <section className={settingStyles.section}>
          <div className={settingStyles.sectionTitle}>{t(Strings.time_format)}</div>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Select
              triggerCls={styles.customSelect}
              dropdownMatchSelectWidth={false}
              value={timeFormat}
              onSelected={(option) => handleTimeFormatChange(option.value as TimeFormat)}
              options={optionData4Time}
            />
            <Select
              triggerCls={styles.timeZoneSelect}
              dropdownMatchSelectWidth={false}
              value={timeZone}
              onSelected={handleTimeZoneChange}
              renderValue={(option) => {
                if (!option.value) {
                  return `${option.label} ${formatTimeZone(userTimeZone)}`;
                }
                return option.label;
              }}
              options={[
                {
                  label: t(Strings.follow_system_time_zone),
                  value: '',
                },
                ...getUtcOptionList(),
              ]}
              openSearch
              searchPlaceholder={t(Strings.search)}
              highlightStyle={{ backgroundColor: colorVars.primaryColor, color: colorVars.black[50] }}
            />
            <div className={styles.showTimeZone}>
              <Checkbox checked={includeTimeZone} size={14} onChange={handleIncludeTimeZoneChange}>
                {t(Strings.field_display_time_zone)}
              </Checkbox>
            </div>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <MobileSelect defaultValue={timeFormat} onChange={handleTimeFormatChange} optionData={optionData4Time} />
            <MobileSelect
              defaultValue={timeZone}
              onChange={(value) => handleTimeZoneChange({ value })}
              optionData={[
                {
                  label: t(Strings.follow_system_time_zone),
                  value: '',
                },
                ...getUtcOptionList(),
              ]}
            />
            <div className={styles.showTimeZone}>
              <Checkbox checked={includeTimeZone} size={14} onChange={handleIncludeTimeZoneChange}>
                {t(Strings.field_display_time_zone)}
              </Checkbox>
            </div>
          </ComponentDisplay>
        </section>
      )}
    </div>
  );
};
