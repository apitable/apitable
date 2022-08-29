import * as React from 'react';
import { FilterConjunction as CoreFilterConjunction, FilterConjunctionDescMap, IFilterInfo, Strings, t } from '@vikadata/core';
import styles from './style.module.less';
import { ExecuteFilterFn } from '../interface';
import produce from 'immer';
import { MobileSelect } from 'pc/components/common';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { Select } from '@vikadata/components';

interface IConjunctionProps {
  conjunction: string;
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
}

export const FilterConjunction: React.FC<IConjunctionProps> = props => {
  const { conjunction, conditionIndex, changeFilter } = props;

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  if (conditionIndex === 0) {
    return (
      <div className={styles.junction} style={{ paddingLeft: '10px' }}>
        { t(Strings.where) }
      </div>
    );
  }

  if (conditionIndex !== 1) {
    return (
      <div className={styles.junction} style={{ paddingLeft: '10px' }}>
        {FilterConjunctionDescMap[conjunction]}
      </div>
    );
  }

  function onChange(value: CoreFilterConjunction) {
    changeFilter((filterInfo: IFilterInfo) => {
      return produce(filterInfo, draft => {
        draft.conjunction = value;
        return draft;
      });
    });
  }

  if (isMobile) {
    return (
      <MobileSelect
        defaultValue={conjunction}
        optionData={Object.values(CoreFilterConjunction).map(item => {
          return {
            label: FilterConjunctionDescMap[item],
            value: item,
          };
        })}
        onChange={onChange}
        title={t(Strings.please_choose)}
        style={{ marginRight: 8, background: 'none', width: '100%', padding: '12px 8px' }}
      />
    );
  }

  return (
    <Select
      triggerCls={styles.junction}
      value={conjunction}
      options={Object.values(CoreFilterConjunction).map(item => {
        return {
          label: FilterConjunctionDescMap[item],
          value: item,
        };
      })}
      onSelected={option => onChange(option.value as CoreFilterConjunction)}
      openSearch={false}
      dropdownMatchSelectWidth={false}
    />
  );
};
