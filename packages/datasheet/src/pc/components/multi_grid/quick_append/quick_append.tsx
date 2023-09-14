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
import { AddOutlined } from '@apitable/icons';
import { appendRow, Direction } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { stopPropagation } from 'pc/utils';
import styles from './styles.module.less';

interface IQuickAppendProps {
  left: number;
  top: number;
  length: number;
  hoverRecordId?: string;
}

export const QuickAppend: React.FC<React.PropsWithChildren<IQuickAppendProps>> = React.memo((props) => {
  const { top, left, length, hoverRecordId } = props;

  const addNewRecord = async () => {
    await appendRow({ recordId: hoverRecordId, direction: Direction.Up });
  };
  return (
    <div
      className={styles.quickAppend}
      style={{
        top,
        left,
      }}
      onClick={addNewRecord}
      // This is to prevent constant state changes caused by multi_grid listening
      onMouseOver={stopPropagation}
    >
      <div className={styles.quickAppendToolsWrap}>
        <div className={styles.iconAddWrap}>
          <AddOutlined />
        </div>
        <div
          className={styles.quickAppendLine}
          style={{
            width: `calc(${length + 16}px - 100%)`,
          }}
        />
      </div>
    </div>
  );
});
