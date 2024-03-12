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

import { Typography, useThemeColors } from '@apitable/components';
import { FolderNormalFilled } from '@apitable/icons';
import { Emoji } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import styles from './style.module.less';

export const FolderItem: React.FC<
  React.PropsWithChildren<{
    folderId: string;
    folderName: string;
    icon: string;
    onClick: (folderId: string, nodePrivate?: boolean) => void;
    level?: string;
    nodePrivate?: boolean;
  }>
> = (props) => {
  const { folderId, folderName, icon, onClick, level, nodePrivate } = props;
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const iconSize = isMobile ? 24 : 16;
  const fontVariant = isMobile ? 'body1' : 'body3';
  const levelVariant = isMobile ? 'body3' : 'body4';
  const Icon = icon ? (
    <Emoji emoji={icon} size={iconSize} className={styles.folderItemIcon} />
  ) : (
    <FolderNormalFilled size={iconSize} className={styles.folderItemIcon} />
  );
  return (
    <div className={styles.folderItem} onClick={() => onClick(folderId, nodePrivate)}>
      <div className={styles.folderItemContent}>
        {Icon}
        <Typography className={styles.folderName} variant={fontVariant} ellipsis>
          <span dangerouslySetInnerHTML={{ __html: folderName }} />
        </Typography>
      </div>
      {level && (
        <Typography color={colors.textCommonTertiary} variant={levelVariant} ellipsis>
          {level}
        </Typography>
      )}
    </div>
  );
};
