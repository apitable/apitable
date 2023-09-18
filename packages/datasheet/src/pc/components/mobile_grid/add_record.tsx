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
import { ExecuteResult } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { appendRow } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { getEnvVariables } from 'pc/utils/env';
import { expandRecordIdNavigate } from '../expand_record';
import styles from './styles.module.less';

interface IAddRecordProps {
  recordId?: string;
  size?: 'large' | 'default';
}

export const AddRecord: React.FC<React.PropsWithChildren<IAddRecordProps>> = (props) => {
  const colors = useThemeColors();
  const { recordId, size = 'default' } = props;

  const onClick = async () => {
    const result = await appendRow({ recordId });
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
        background: getEnvVariables().ADD_RECORD_BUTTON_BG_COLOR,
        boxShadow: getEnvVariables().ADD_RECORD_BUTTON_BG_COLOR ? 'unset' : '',
      }}
    >
      <div className={styles.btnWrapper}>
        <AddOutlined size={innerSize} color={colors.black[50]} />
      </div>
    </div>
  );
};
