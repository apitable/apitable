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
import * as React from 'react';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Checkbox, Select, colorVars, Switch } from '@apitable/components';
import {
  DateFormat,
  TimeFormat,
  IDateTimeBaseField,
  t,
  Strings,
  FieldType,
  CollectType,
  ILastModifiedTimeFieldProperty,
  ILastModifiedTimeField,
  getUtcOptionList,
  IDateTimeBaseFieldProperty, Selectors, formatTimeZone,
} from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { MobileSelect, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useAppSelector } from 'pc/store/react-redux';
import settingStyles from '../../field_setting/styles.module.less';
import styles from '../styles.module.less';
import { CollectTypeSelect } from './collect_type_select';
import { FieldSelectModal } from './field_select_modal';

interface IFormatDateTime {
  currentField: IDateTimeBaseField;
  setCurrentField: Dispatch<SetStateAction<IDateTimeBaseField>>;
}

const optionDateFormatData = [
  { value: DateFormat['YYYY/MM/DD'], label: t(Strings.label_format_year_month_and_day_split_by_slash) },
  { value: DateFormat['YYYY-MM-DD'], label: t(Strings.label_format_year_month_and_day_split_by_dash) },
  { value: DateFormat['DD/MM/YYYY'], label: t(Strings.label_format_day_month_and_year_split_by_slash) },
  { value: DateFormat['YYYY-MM'], label: t(Strings.label_format_year_and_month_split_by_dash) },
  { value: DateFormat['MM-DD'], label: t(Strings.label_format_month_and_day_split_by_dash) },

  { value: DateFormat['YYYY'], label: t(Strings.label_format_year) },
  { value: DateFormat['MM'], label: t(Strings.label_format_month) },
  { value: DateFormat['DD'], label: t(Strings.label_format_day) },
];

const optionTimeFormatData = [
  { value: TimeFormat['hh:mm'], label: t(Strings.twelve_hour_clock) },
  { value: TimeFormat['HH:mm'], label: t(Strings.twenty_four_hour_clock) },
];

export const FormatDateTime: React.FC<React.PropsWithChildren<IFormatDateTime>> = (props: IFormatDateTime) => {
  const { currentField, setCurrentField } = props;
  const [isModalShow, setModalShow] = useState(false);
  const userTimeZone = useAppSelector(Selectors.getUserTimeZone)!;
  const handleDateFormatChange = ({ value }: any) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        dateFormat: value,
      },
    });
  };

  const handleTimeFormatChange = ({ value }: any) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        timeFormat: value,
      },
    });
  };

  const handleTimeZoneChange = ({ value }: any) => {
    let property: IDateTimeBaseFieldProperty;
    if (value) {
      property = {
        ...currentField.property,
        timeZone: value,
      };
    } else {
      property = omit(currentField.property, 'timeZone');
    }
    setCurrentField({
      ...currentField,
      property,
    });
  };

  const handleIncludeTimeChange = (checked: boolean) => {
    const omitProperty = omit(currentField.property, ['timeZone', 'includeTimeZone']);
    setCurrentField({
      ...currentField,
      property: {
        ...omitProperty,
        includeTime: checked,
      },
    });
  };

  const handleFillChange = (checked: boolean) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        autoFill: checked,
      },
    });
  };

  const handleIncludeTimeZoneChange = (checked: boolean) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        includeTimeZone: checked,
      },
    });
  };

  const handleCollectTypeChange = useCallback(
    (type: number) => {
      setCurrentField({
        ...currentField,
        property: {
          ...currentField.property,
          collectType: type,
        } as any,
      });
    },
    [currentField, setCurrentField],
  );

  const handleFieldIdCollectionChange = useCallback(
    (collection: string[]) => {
      setCurrentField({
        ...currentField,
        property: {
          ...currentField.property,
          fieldIdCollection: collection,
        } as any,
      });
    },
    [currentField, setCurrentField],
  );

  const handleCollectTypeSelectedChange = useCallback(
    (type: number) => {
      if (type === CollectType.SpecifiedFields) {
        setModalShow(true);
      }
      handleCollectTypeChange(type);
    },
    [handleCollectTypeChange],
  );

  const handleModalDataChange = useCallback(
    (collection: string[]) => {
      setModalShow(false);
      handleFieldIdCollectionChange(collection);
    },
    [handleFieldIdCollectionChange],
  );

  const handleModalDataCancel = useCallback(() => {
    setModalShow(false);
    if (!(currentField.property as ILastModifiedTimeFieldProperty).fieldIdCollection.length) {
      handleCollectTypeChange(CollectType.AllFields);
    }
  }, [handleCollectTypeChange, currentField]);

  const { includeTime, dateFormat, timeFormat, includeTimeZone, timeZone = '' } = currentField.property;

  const selectTriggerStyle: React.CSSProperties = {
    height: 40,
  };

  return (
    <div className={styles.section}>
      {currentField.type === FieldType.LastModifiedTime && (
        <CollectTypeSelect field={currentField as ILastModifiedTimeField} onChange={handleCollectTypeSelectedChange} />
      )}
      <div className={styles.sectionTitle}>{t(Strings.datetime_format)}</div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Select
          triggerCls={styles.customSelect}
          dropdownMatchSelectWidth={false}
          value={dateFormat}
          onSelected={handleDateFormatChange}
          options={optionDateFormatData}
        />
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileSelect
          defaultValue={dateFormat}
          optionData={optionDateFormatData}
          onChange={(value) => handleDateFormatChange({ value })}
          style={selectTriggerStyle}
        />
      </ComponentDisplay>
      <section className={settingStyles.section} style={{ marginTop: 16 }}>
        <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
          <div className={styles.timeTitle}>
            {t(Strings.field_incluede_time_and_time_zone_title)}
            <Tooltip title={t(Strings.date_setting_time_zone_tooltips)} trigger={'hover'}>
              <span className={classNames(settingStyles.sectionTitleTip, settingStyles.noCursor)}>
                <QuestionCircleOutlined size={16} color={colorVars.textCommonTertiary} />
              </span>
            </Tooltip>
          </div>
          <Switch size="small" checked={includeTime} onChange={handleIncludeTimeChange} />
        </div>
        {includeTime && (
          <>
            <ComponentDisplay minWidthCompatible={ScreenSize.md}>
              <Select
                triggerCls={styles.customSelect}
                dropdownMatchSelectWidth={false}
                value={timeFormat}
                onSelected={handleTimeFormatChange}
                options={optionTimeFormatData}
              />
              <Select
                triggerCls={styles.timeZoneSelect}
                dropdownMatchSelectWidth={false}
                value={timeZone}
                onSelected={handleTimeZoneChange}
                renderValue={(option) => {
                  if (!option.value) {
                    return `${option.label}: ${formatTimeZone(userTimeZone)}`;
                  }
                  return option.label;
                }}
                options={[
                  {
                    label: t(Strings.follow_user_time_zone),
                    value: '',
                  },
                  ...getUtcOptionList(),
                ]}
                openSearch
                searchPlaceholder={t(Strings.search)}
                highlightStyle={{ backgroundColor: colorVars.bgBrandLightDefault, color: 'inherit', borderRadius: '4px' }}
              />
              <div className={styles.showTimeZone}>
                <Checkbox checked={includeTimeZone} size={14} onChange={handleIncludeTimeZoneChange}>
                  {t(Strings.field_display_time_zone)}
                </Checkbox>
              </div>
            </ComponentDisplay>

            <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
              <MobileSelect
                defaultValue={timeFormat}
                optionData={optionTimeFormatData}
                onChange={(value) => handleTimeFormatChange({ value })}
                style={selectTriggerStyle}
              />
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
          </>
        )}
      </section>
      {currentField.type === FieldType.DateTime && (
        <section className={settingStyles.section}>
          <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
            {t(Strings.autofill_createtime)}
            <Switch size="small" checked={currentField.property.autoFill} onChange={handleFillChange} />
          </div>
        </section>
      )}
      {isModalShow && <FieldSelectModal field={currentField} onCancel={handleModalDataCancel} onOk={handleModalDataChange} />}
    </div>
  );
};
