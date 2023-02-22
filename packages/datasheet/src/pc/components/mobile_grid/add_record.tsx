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

import { appendRow } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import * as React from 'react';
import styles from './styles.module.less';
import AddIcon from 'static/icon/common/common_icon_add_content.svg';
import { useThemeColors } from '@apitable/components';
import { ExecuteResult } from '@apitable/core';
import { expandRecordIdNavigate } from '../expand_record';

interface IAddRecordProps {
  recordId?: string;
  size?: 'large' | 'default';
}

export const AddRecord: React.FC<React.PropsWithChildren<IAddRecordProps>> = props => {
  const colors = useThemeColors();
  const {
    recordId,
    size = 'default',
  } = props;

  const onClick = () => {
    const result = appendRow({ recordId });
    if (result.result === ExecuteResult.Success) {
      const _recordId = result.data && result.data[0];
      expandRecordIdNavigate(_recordId);
    }
  };

  const outerSize = size === 'large' ? 60 : 48;
  const innerSize = size === 'large' ? 24 : 16;

  return (
    <div
      className={styles.addRecordContainer}
      onClick={onClick}
      style={{
        width: outerSize,
        height: outerSize,
      }}
    >
      <div className={styles.btnWrapper}>
        <AddIcon width={innerSize} height={innerSize} fill={colors.black[50]} />
      </div>
    </div>
  );
};