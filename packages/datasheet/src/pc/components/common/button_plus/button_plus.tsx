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
import { FC } from 'react';
import { ButtonBase } from '../button_base/button_base';
import { IButtonBase } from '../button_base/button_base.interface';
import { ButtonPrefixCls } from '../button_base/constants';
import { IButtonGroup } from './button_plus.interface';

const IconButton: FC<React.PropsWithChildren<IButtonBase>> = (props) => {
  const { size = 'x-small', shape = 'circle', border = false, className, prefixCls, ...rest } = props;
  const classKey = prefixCls || ButtonPrefixCls.Btn;
  const cla = classNames([`${classKey}-plus-icon`], className);
  const data: IButtonBase = {
    size,
    shape,
    border,
    className: cla,
    ...rest,
  };
  return <ButtonBase {...data} />;
};

const FontButton: FC<React.PropsWithChildren<IButtonBase>> = (props) => {
  const { size = 'middle', shape = 'round', border = false, className, prefixCls, ...rest } = props;
  const classKey = prefixCls || ButtonPrefixCls.Btn;
  const cla = classNames([`${classKey}-plus-font`], className);
  const data: IButtonBase = {
    size,
    shape,
    border,
    className: cla,
    ...rest,
  };
  return <ButtonBase {...data} />;
};

const TranslucentButton: FC<React.PropsWithChildren<IButtonBase>> = (props) => {
  const { size = 'middle', shape = 'square', border = true, style, className, prefixCls, ...rest } = props;
  const classKey = prefixCls || ButtonPrefixCls.Btn;
  const cla = classNames([`${classKey}-plus-translucent`], className);
  const data: IButtonBase = {
    size,
    shape,
    border,
    style: { ...style },
    className: cla,
    prefixCls,
    ...rest,
  };
  return <ButtonBase {...data} />;
};

const ButtonGroup: FC<React.PropsWithChildren<IButtonGroup>> = (props) => {
  const { children, className, style } = props;

  return (
    <div className={classNames(`${ButtonPrefixCls.Btn}-group`, className)} style={style}>
      {children}
    </div>
  );
};

export const ButtonPlus = {
  Icon: IconButton,
  Font: FontButton,
  Translucent: TranslucentButton,
  Group: ButtonGroup,
};
