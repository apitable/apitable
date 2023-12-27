import React from 'react';
import { DropdownSelect as Select } from '@apitable/components';
import { FilterDuration, FOperator, Strings, t } from '@apitable/core';

const DurationStringsMap = {
  [FilterDuration.ExactDate]: t(Strings.exact_date),
  [FilterDuration.DateRange]: t(Strings.date_range),
  [FilterDuration.Today]: t(Strings.today),
  [FilterDuration.Tomorrow]: t(Strings.tomorrow),
  [FilterDuration.Yesterday]: t(Strings.yesterday),
  [FilterDuration.ThisWeek]: t(Strings.this_week),
  [FilterDuration.PreviousWeek]: t(Strings.previous_week),
  [FilterDuration.ThisMonth]: t(Strings.this_month),
  [FilterDuration.PreviousMonth]: t(Strings.previous_month),
  [FilterDuration.ThisYear]: t(Strings.this_year),
  [FilterDuration.SomeDayBefore]: t(Strings.some_day_before),
  [FilterDuration.SomeDayAfter]: t(Strings.some_day_after),
  [FilterDuration.TheLastWeek]: t(Strings.the_last_week),
  [FilterDuration.TheNextWeek]: t(Strings.the_next_week),
  [FilterDuration.TheLastMonth]: t(Strings.the_last_month),
  [FilterDuration.TheNextMonth]: t(Strings.the_next_month),
};

export const DateDuration = [
  FilterDuration.ExactDate,
  FilterDuration.Today,
  FilterDuration.Yesterday,
  FilterDuration.Tomorrow,
  FilterDuration.SomeDayBefore,
  FilterDuration.SomeDayAfter,
];

interface IFilterDateDurationProps {
  value: FilterDuration;
  operator?: FOperator;
  onChange: (value: FilterDuration) => void;
}

export const FilterDateDuration: React.FC<IFilterDateDurationProps> = (props) => {
  const { value, onChange, operator } = props;

  function createOptionData() {
    let filterDuration = Object.values(FilterDuration).filter((item) => {
      return item !== FilterDuration.SomeDayAfter && item !== FilterDuration.SomeDayBefore;
    });

    if (
      operator === FOperator.IsLess ||
      operator === FOperator.IsLessEqual ||
      operator === FOperator.IsGreater ||
      operator === FOperator.IsGreaterEqual
    ) {
      filterDuration = DateDuration;
    }

    return filterDuration.map((item) => {
      return {
        label: DurationStringsMap[item],
        value: item,
      };
    });
  }

  return (
    <Select
      dropDownOptions={{
        placement: 'bottom-start',
      }}
      panelOptions={{
        maxWidth: '300px',
      }}
      dropdownMatchSelectWidth={false}
      placeholder={t(Strings.pick_one_option)}
      value={value}
      options={createOptionData()}
      onSelected={(option) => onChange(option.value as FilterDuration)}
      openSearch={false}
      triggerStyle={{ width: 100 }}
    />
  );
};
