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
import { useThemeColors } from '@apitable/components';
import { FolderNormalFilled } from '@apitable/icons';
import ArrowIcon from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import styles from './style.module.less';

// richContent: Search results are returned as rich text tags for display highlighting
export const Folder: React.FC<React.PropsWithChildren<{ id: string; onClick?: (id: string) => void; richContent?: boolean }>> = (props) => {
  const { children, id, richContent, onClick } = props;
  const colors = useThemeColors();
  return (
    <div className={styles.nodeContainerWrapper}>
      <div className={styles.nodeContainer} onClick={() => onClick && onClick(id)}>
        <FolderNormalFilled className={styles.leftIcon} color={colors.fourthLevelText} />
        {richContent ? (
          <span className={styles.text} dangerouslySetInnerHTML={{ __html: children as string }} />
        ) : (
          <span className={styles.text}>{children}</span>
        )}
        <ArrowIcon className={styles.rightIcon} fill={colors.thirdLevelText} />
      </div>
    </div>
  );
};
