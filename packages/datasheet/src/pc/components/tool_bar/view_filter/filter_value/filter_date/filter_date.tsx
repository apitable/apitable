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

import { FieldType, FilterDuration, FOperator, getLanguage, IDateTimeField, ITimestamp, Selectors } from '@apitable/core';
import { useClickOutside } from '@huse/click-outside';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash/debounce';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { DateTimeEditor, DateTimeEditorBase } from 'pc/components/editors/date_time_editor/date_time_editor';
import { IEditor } from 'pc/components/editors/interface';
import { NumberEditor } from 'pc/components/editors/number_editor';
import { DateRangePickerMobile } from 'pc/components/tool_bar/view_filter/filter_value/filter_date/date_range_picker_mobile';
import { useResponsive } from 'pc/hooks';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { IFilterDateProps } from '../../interface';
import styles from '../style.module.less';
import { DatePicker } from './date_picker';
import { DateDuration, FilterDateDuration } from './filter_date_duration';
import { LocalFormat } from './local_format';

const { RangePicker } = DatePicker;

export const FilterDate: React.FC<IFilterDateProps> = props => {
  const { changeFilter, condition, field, conditionIndex, onChange } = props;
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const defaultValue = condition.value;
  let durationValue = defaultValue ? defaultValue[0] : FilterDuration.ExactDate;
  const dateEditorRef = useRef<DateTimeEditorBase>(null);
  let dataValue: null | number | [dayjs.Dayjs, dayjs.Dayjs] = null;
  const operator: FOperator = condition.operator;
  if (operator === FOperator.IsLess || operator === FOperator.IsGreater) {
    if (!DateDuration.includes(durationValue)) {
      durationValue = FilterDuration.Today;
    }
  }
  let noDateProperty;
  const ref = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<IEditor>(null);

  const [showRangeCalendar, setShowRangeCalendar] = useState(false);

  useEffect(() => {
    if (condition.value[0] !== FilterDuration.DateRange) return;
    setShowRangeCalendar(true);
  }, [condition.value]);

  if (field.type === FieldType.DateTime) {
    noDateProperty = {
      ...field,
      property: {
        dateFormat: field.property.dateFormat,
        timeFormat: field.property.timeFormat,
        includeTime: false,
        autoFill: false,
      },
    };
  }

  if (defaultValue && durationValue === FilterDuration.ExactDate && defaultValue[1]) {
    dataValue = new Date(defaultValue[1]!).getTime();
  }

  if (defaultValue && durationValue === FilterDuration.DateRange && defaultValue[1]) {
    const [startDate, endDate] = defaultValue[1]!.split('-');
    dataValue = [dayjs(Number(startDate)), dayjs(Number(endDate))];
  }

  useEffect(() => {
    if (defaultValue && (durationValue === FilterDuration.SomeDayBefore || durationValue === FilterDuration.SomeDayAfter) && defaultValue[1]) {
      const dataValue = defaultValue[1] as number;
      numberRef.current && numberRef.current.onStartEdit(dataValue ? dataValue : null);
    }
  }, [defaultValue, durationValue]);

  useEffect(() => {
    if (typeof dataValue !== 'number') {
      return;
    }
    dateEditorRef.current?.setValue(dataValue);
    // eslint-disable-next-line
  }, []);

  function commandDateFn(date: ITimestamp | null) {
    if (date == null) {
      onChange([defaultValue[0], null]);
      return;
    }
    onChange([defaultValue[0], dayjs(date).valueOf()]);
  }

  useClickOutside(ref, () => {
    if (isMobile) {
      return;
    }
    dateEditorRef.current?.onEndEdit(true, false);
  });

  const rangePickerChange = (date: (Dayjs | null)[] | null) => {
    if (!date) {
      return;
    }
    const startDate = date[0]?.startOf('date').valueOf();
    const endDate = date[1]?.endOf('date').valueOf();
    if (!startDate || !endDate) {
      return;
    }
    onChange([defaultValue[0], `${startDate}-${endDate}`]);
  };

  const debounceCommandNumberFn = debounce((value: number) => {
    onChange(typeof value === 'number' ? [defaultValue[0], value] : null);
  }, 500);

  const commandNumberFn = (value: string) => {
    debounceCommandNumberFn(Number(value));
  };

  const editorHeight = isMobile ? 48 : 40;

  const getDateValueComponent = () => {
    if (!condition.value) {
      return null;
    }
    if (condition.value[0] === FilterDuration.ExactDate) {
      return (
        <DateTimeEditor
          style={{ position: 'unset' }}
          ref={dateEditorRef}
          editable
          editing
          width={160}
          datasheetId={datasheetId}
          height={35}
          field={noDateProperty as IDateTimeField}
          commandFn={commandDateFn}
          dataValue={dataValue}
        />
      );
    }
    if (condition.value[0] === FilterDuration.DateRange) {
      const lang = getLanguage().split('-')[0];
      return (
        <>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div ref={divRef}>
              {
                divRef.current && showRangeCalendar && ReactDOM.render(<RangePicker
                  onChange={(value) => {rangePickerChange(value);}}
                  format='YYYY-MM-DD'
                  className={styles.dateRange}
                  allowClear={false}
                  suffixIcon={null}
                  value={dataValue as any}
                  locale={lang === 'en' ? undefined : LocalFormat.getDefinedChineseLocal()}
                  getPopupContainer={() => divRef.current!}
                />, divRef.current)
              }
            </div>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <DateRangePickerMobile {...props} rangePickerChange={rangePickerChange} dataValue={dataValue} />
          </ComponentDisplay>
        </>
      );
    }
    if (condition.value[0] === FilterDuration.SomeDayBefore || condition.value[0] === FilterDuration.SomeDayAfter) {
      return (
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
      );
    }
    return null;
  };

  const dom = getDateValueComponent();

  return (
    <div className={classNames(styles.filterDate, 'filterDate')} onClick={stopPropagation} ref={ref}>
      {operator !== FOperator.IsEmpty && operator !== FOperator.IsNotEmpty && (
        <FilterDateDuration changeFilter={changeFilter} condition={condition} conditionIndex={conditionIndex} />
      )}
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>{dom}</ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>{Boolean(dom) && <div className={styles.wrapper}>{dom}</div>}</ComponentDisplay>
    </div>
  );
};
