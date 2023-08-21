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

import * as React from 'react';
import { Drawer } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useThemeColors } from '@apitable/components';
import style from './style.module.less';
import classNames from 'classnames';
import { CloseOutlined } from '@apitable/icons';
import { useMemo } from 'react';

export const Popup: React.FC<React.PropsWithChildren<DrawerProps>> = props => {
  const { headerStyle, className, ...rest } = props;
  const colors = useThemeColors();
  const _headerStyle: React.CSSProperties = useMemo(() => {
    const titleStyle = props.title ? {} : { padding: 0 };
    return headerStyle ? { ...headerStyle, ...titleStyle } : titleStyle;
  }, [headerStyle, props.title]);

  return (
    <Drawer
      closeIcon={(
        <div className={style.closeIconWrapper}>
          <CloseOutlined color={colors.secondLevelText} size={16} />
        </div>
      )}
      push={{ distance: 0 }}
      placement='bottom'
      {...rest}
      className={classNames(style.drawerPopup, className)}
      headerStyle={_headerStyle}
    >
      {props.children}
    </Drawer>
  );
};
