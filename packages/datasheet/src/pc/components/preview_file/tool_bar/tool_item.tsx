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

import { Tooltip } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { IIconProps } from '@apitable/icons';
import styles from './style.module.less';

export interface IPreviewToolItem {
  visible?: boolean;
  component?: React.ReactNode | (() => React.ReactNode);
  icon?: React.FC<React.PropsWithChildren<IIconProps>>;
  onClick?: () => void;
  tip?: string | (() => string);
  group?: IPreviewToolItem[];
  className?: string;
  style?: React.CSSProperties;
  divider?: boolean;
}

export const PreviewToolItem: React.FC<React.PropsWithChildren<IPreviewToolItem>> = (props) => {
  const { visible = true, component, tip, group, onClick, style, className, divider, icon } = props;

  if (!visible) {
    return null;
  }

  return (
    <>
      {group && (
        <div
          className={classNames(styles.group, {
            [styles.borderRight]: divider,
          })}
        >
          {group?.map((toolItemProps, index) => <PreviewToolItem key={index} {...toolItemProps} />)}
        </div>
      )}
      {component ? (
        <Tooltip title={typeof tip === 'function' ? tip() : tip} placement="bottom">
          <div className={classNames(styles.componentWrapper, className)} onClick={onClick} style={style}>
            {typeof component === 'function' ? component() : component}
          </div>
        </Tooltip>
      ) : (
        <Tooltip title={typeof tip === 'function' ? tip() : tip} placement="bottom">
          <div className={classNames(styles.componentWrapper, className)} onClick={onClick} style={{ alignItems: 'inherit' }}>
            {icon && React.createElement(icon)}
          </div>
        </Tooltip>
      )}
    </>
  );
};
