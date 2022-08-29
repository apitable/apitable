import { Select } from 'antd';
import { SelectValue, SelectProps } from 'antd/lib/select';
import classNames from 'classnames';
import { useThemeColors } from '@vikadata/components';
import { useCallback } from 'react';
import * as React from 'react';
import IconArrow from 'static/icon/common/common_icon_pulldown_line.svg';
import styles from './style.module.less';
import { t, Strings } from '@vikadata/core';
const { Option } = Select;

interface ICustomSelect extends SelectProps<any> {
  optionData?: any[];
  children?: React.ReactNode;
}

const CustomSelectBase: React.FC<ICustomSelect> = ({ optionData, className, ...rest }) => {
  const colors = useThemeColors();
  const onChange = useCallback(
    (value: SelectValue, options?) => {
      rest.onChange && rest.onChange(value, options);
    },
    [rest],
  );

  return (
    <Select
      className={classNames(styles.customSelect, className)}
      onChange={onChange}
      dropdownClassName={styles.dropdown}
      notFoundContent={t(Strings.no_option)}
      suffixIcon={<IconArrow width={16} height={16} fill={colors.fourthLevelText} />}
      {...rest}
    >
      {rest.children ? rest.children : optionData && optionData.map(item => {
        return (
          <Option value={item.value} key={item.value}>{item.label}</Option>
        );
      })}
    </Select>
  );
};

export const CustomSelect = React.memo(CustomSelectBase);
