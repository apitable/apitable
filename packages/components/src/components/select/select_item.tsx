import classNames from 'classnames';
import { IOption, ISelectProps } from 'components/select/interface';
import { Typography } from 'components/typography';
import React from 'react';

type IRenderValue = Pick<ISelectProps, 'renderValue'>;

export const SelectItem: React.FC<{ item: IOption; isChecked?: boolean } & Required<IRenderValue>> = (props) => {
  const { item, children, renderValue, isChecked } = props;

  const getEllipsisConfig = () => {
    /**
     * If the disabled tip is directly masked, the reason for the disabled cannot be displayed, so the disabled is judged first.
     */
    if (!item.disabled) {
      return { tooltip: '' };
    }
    // Need to prompt disabled tips
    if (item.disabled && item.disabledTip) {
      return { tooltip: item.disabledTip };
    }

    // Show search results
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
