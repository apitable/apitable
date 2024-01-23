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
import { useThemeColors } from '@apitable/components';
import { ViewType } from '@apitable/core';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import styles from './style.module.less';

export const View: React.FC<React.PropsWithChildren<{ 
  id: string,
  active?: boolean, 
  viewType: ViewType,
  onClick?(id: string): void
}>> = props => {
  const { 
    children, 
    id, 
    active,
    viewType, 
    onClick,
  } = props;
  const colors = useThemeColors();
  return (
    <div className={styles.nodeContainerWrapper}>
      <div 
        className={classNames(styles.nodeContainer, styles.viewNodeContainer, {
          [styles.active]: active,
        })}
        onClick={() => onClick && onClick(id)}
      >
        <ViewIcon viewType={viewType} color={active ? colors.primaryColor : colors.fourthLevelText} />
        <span className={classNames(styles.text, styles.rightText)}>{children}</span>
      </div>
    </div>
  );
};