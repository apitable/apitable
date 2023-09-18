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
import { IOption, ISelectProps } from 'components/select/interface';
import { Typography } from 'components/typography';
import React from 'react';

type IRenderValue = Pick<ISelectProps, 'renderValue'>;

export const SelectItem: React.FC<React.PropsWithChildren<{
  iconClassName?: string,
  item: IOption; isChecked?: boolean } & Required<IRenderValue>>> = (props) => {
    const { item, iconClassName, children, renderValue, isChecked } = props;

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
        }, 'prefixIcon', iconClassName)}
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
