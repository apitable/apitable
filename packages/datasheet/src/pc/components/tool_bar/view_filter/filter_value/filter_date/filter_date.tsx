import { FieldType, FilterDuration, FOperator, IDateTimeField, ITimestamp, Selectors, getLanguage } from '@vikadata/core';
import classNames from 'classnames';
import { DateTimeEditor, DateTimeEditorBase } from 'pc/components/editors/date_time_editor/date_time_editor';
import { stopPropagation } from 'pc/utils';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styles from '../style.module.less';
import dayjs, { Dayjs } from 'dayjs';
import { IFilterDateProps } from '../../interface';
import { DateDuration, FilterDateDuration } from './filter_date_duration';
import { useClickOutside } from '@huse/click-outside';
import { useResponsive } from 'pc/hooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { DatePicker } from './date_picker';
import { LocalFormat } from './local_format';
import { DateRangePickerMobile } from 'pc/components/tool_bar/view_filter/filter_value/filter_date/date_range_picker_mobile';
import { NumberEditor } from 'pc/components/editors/number_editor';
import { IEditor } from 'pc/components/editors/interface';
import debounce from 'lodash/debounce';

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
  const numberRef = useRef<IEditor>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <RangePicker
              onChange={rangePickerChange}
              format="YYYY-MM-DD"
              className={styles.dateRange}
              allowClear={false}
              suffixIcon={null}
              value={dataValue as any}
              locale={lang === 'en' ? undefined : LocalFormat.getDefinedChineseLocal()}
            />
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
