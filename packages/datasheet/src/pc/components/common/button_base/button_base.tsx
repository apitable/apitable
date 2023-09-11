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
import * as React from 'react';
import { LoadingOutlined } from '@apitable/icons';
import { stylizeIcon } from 'pc/utils/dom';
import { IButtonBase } from './button_base.interface';
import { ButtonPrefixCls } from './constants';

const DEFAULT_ICON_SIZE = 16;

export const ButtonBase: React.FC<React.PropsWithChildren<IButtonBase>> = (props) => {
  const { size, loading, htmlType = 'button', className, shape, block, border, icon, children, prefixCls, shadow, ...rest } = props;
  const hasIcon = loading || icon;
  const isOnlyIcon = !children && children !== 0 && hasIcon;

  const classKey = prefixCls || ButtonPrefixCls.Btn;

  const classes = classNames(
    {
      [classKey]: true,
      [`${classKey}-block`]: block,
      [`${classKey}-padding`]: !isOnlyIcon,
      [`${classKey}-border`]: border,
      [`${classKey}-icon-only`]: isOnlyIcon,
      [`${classKey}-${size}`]: size,
      [`${classKey}-${shape}`]: shape,
      [`${classKey}-shadow`]: shadow,
    },
    className,
  );
  const finalIcon: any = stylizeIcon({
    icon,
    defaultSize: DEFAULT_ICON_SIZE,
  });
  const propsNode = finalIcon ? (
    <>
      <span className={`${classKey}-icon`}>{finalIcon}</span>
      <span>{children}</span>
    </>
  ) : (
    <>{children}</>
  );
  const finalKidsNode = loading ? (
    <>
      <span style={{ marginRight: finalIcon || children ? '4px' : '0px' }}>
        <LoadingOutlined className="circle-loading" />
      </span>
      {propsNode}
    </>
  ) : (
    <>{propsNode}</>
  );
  return (
    <button type={htmlType} className={classes} {...rest}>
      {finalKidsNode}
    </button>
  );
};
