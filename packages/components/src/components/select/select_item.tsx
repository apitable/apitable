import classNames from 'classnames';
import { IOption, ISelectProps } from 'components/select/interface';
import { Typography } from 'components/typography';
import React from 'react';

type IRenderValue = Pick<ISelectProps, 'renderValue'>;

export const SelectItem: React.FC<{ item: IOption; isChecked?: boolean } & Required<IRenderValue>> = (props) => {
  const { item, children, renderValue, isChecked } = props;

  const getEllipsisConfig = () => {
    /**
     * https://git.vika.ltd/fe/datasheet/-/commit/ec01a66
     * 如果直接屏蔽 disabledTip，会导致 disabled 的原因无法显示，所以这里改成先判断 disabled
     */
    if (!item.disabled) {
      return { tooltip: '' };
    }
    // 需要提示 disabled 的理由
    if (item.disabled && item.disabledTip) {
      return { tooltip: item.disabledTip };
    }

    // 显示搜索结果
    if (children) {
      return { rows: 1, tooltip: item.label };
    }

    return true;
  };

  return <>
    <span
      className={classNames({
        isChecked: isChecked
      }, 'prefixIcon')}
    >
      {
        item.prefixIcon
      }
    </span>
    <Typography
      variant={'body1'}
      ellipsis={getEllipsisConfig()}
      className={classNames({
        isChecked: isChecked
      }, 'optionLabel')}
      component={'span'}
    >
      {
        children || renderValue(item)
      }
    </Typography>

    <span className={'suffixIcon'}>
      {
        item.suffixIcon
      }
    </span>
  </>;
};
