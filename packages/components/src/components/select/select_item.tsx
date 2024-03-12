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
import EllipsisText from '../ellipsis_text';

type IRenderValue = Pick<ISelectProps, 'renderValue'>;

export const SelectItem: React.FC<
  React.PropsWithChildren<
    {
      iconClassName?: string;
      item: IOption;
      isChecked?: boolean;
    } & Required<IRenderValue>
  >
> = (props) => {
  const { item, iconClassName, children, renderValue, isChecked } = props;

  return (
    <>
      <span
        className={classNames(
          {
            isChecked: isChecked,
          },
          'prefixIcon',
          iconClassName
        )}
      >
        {item.prefixIcon}
      </span>
      {item.disabled ? (
        <Typography
          variant={'body1'}
          className={classNames(
            {
              isChecked: isChecked,
            },
            'optionLabel'
          )}
          component={'span'}
        >
          {children || renderValue(item)}
        </Typography>
      ) : (
        <EllipsisText>
          <Typography
            variant={'body1'}
            className={classNames(
              {
                isChecked: isChecked,
              },
              'optionLabel'
            )}
            component={'span'}
          >
            {children || renderValue(item)}
          </Typography>
        </EllipsisText>
      )}

      <span className={'suffixIcon'}>{item.suffixIcon}</span>
    </>
  );
};
