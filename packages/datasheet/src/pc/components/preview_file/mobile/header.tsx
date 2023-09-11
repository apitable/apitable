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
import { CloseOutlined } from '@apitable/icons';
import { MoreTool } from '../tool_bar/mobile/more_tool';
import styles from './style.module.less';

interface IHeader {
  fileName: string;
  readonly: boolean;
  downloadSrc: string;
  onDelete(): void;
  onClose(): void;
  disabledDownload?: boolean;
}

export const Header: React.FC<React.PropsWithChildren<IHeader>> = (props) => {
  const { fileName, readonly, downloadSrc, onDelete, onClose, disabledDownload } = props;
  const colors = useThemeColors();
  return (
    <header className={styles.previewHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.toolClose} onClick={onClose}>
          <CloseOutlined color={colors.staticWhite0} size={16} />
        </div>
      </div>
      <span className={styles.fileName}>{fileName}</span>
      <div className={styles.headerRight}>
        <MoreTool readonly={readonly} onDelete={onDelete} downloadSrc={downloadSrc} disabledDownload={disabledDownload} />
      </div>
    </header>
  );
};
