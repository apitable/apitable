import React, { useCallback, useState } from 'react';
import { FilterDuration } from '@apitable/core';
import { IFilterDateProps } from '../interface';
import { FilterDateDuration } from './filter_date_duration';
import { FilterDateWrap, DateEditorWrap } from './styled';
import { EditorNumber } from '../editor/editor_number';
import { Dayjs } from 'dayjs';
import { DatePicker, LocalFormat } from './date_picker';
import { getLanguage } from 'utils';

const { RangePicker } = DatePicker;

type IDateRangeValue= (Dayjs | null)[] | null;

export const FilterDate: React.FC<IFilterDateProps> = (props) => {
  const { value, operator, onChange } = props;
  const [filterDuration, date] = value || [];
  const [range, setRange] = useState<IDateRangeValue>();
  const lang = getLanguage().split('-')[0];

  const filterDurationChange = (val: any) => {
    onChange([val]);
  };

  const filterValueChange = useCallback((val: any) => {
    const oldV = value || [];
    oldV[1] = val;
    onChange(oldV);
  }, [onChange, value]);

  const rangePickerChange = (value: IDateRangeValue) => {
    if (!value) {
      return;
    }
    const startDate = value[0]?.startOf('date').valueOf();
    const endDate = value[1]?.endOf('date').valueOf();
    if (!startDate || !endDate) {
      return;
    }
    setRange(value);
    filterValueChange(`${startDate}-${endDate}`);
  };

  const getDateEditor = () => {
    if (filterDuration === FilterDuration.DateRange) {
      return (
        <RangePicker
          onChange={rangePickerChange}
          format='YYYY-MM-DD'
          allowClear={false}
          suffixIcon={null}
          value={range as any}
          locale={lang === 'en' ? undefined : LocalFormat.getDefinedChineseLocal()}
        />
      );
    }
    if (filterDuration === FilterDuration.ExactDate) {
      return (
        <DatePicker
          placeholder='YYYY-MM-DD'
          allowClear={false}
          suffixIcon={null}
          format='YYYY-MM-DD'
          onChange={filterValueChange}
          locale={lang === 'en' ? undefined : LocalFormat.getDefinedChineseLocal()}
        />
      );
    }
    if (filterDuration === FilterDuration.SomeDayBefore || filterDuration === FilterDuration.SomeDayAfter) {
      return <EditorNumber value={date} onChange={(v) => filterValueChange(v)} validate/>;
    }
    return null;
  };

  const dateEditor = getDateEditor();

  return (
    <FilterDateWrap>
      <FilterDateDuration value={filterDuration as FilterDuration} operator={operator} onChange={filterDurationChange}/>
      {filterDuration && Boolean(dateEditor) && <DateEditorWrap>
        {dateEditor}
      </DateEditorWrap>}
    </FilterDateWrap>
  );
};
