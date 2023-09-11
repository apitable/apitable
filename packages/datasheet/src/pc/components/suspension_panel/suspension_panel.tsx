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

import { FC } from 'react';
import { DATASHEET_ID } from '@apitable/core';
import { ReportWeb } from '../feedback';
import styles from './style.module.less';

interface IProps {
  shareId?: string;
  datasheetId?: string;
}

export const SuspensionPanel: FC<React.PropsWithChildren<IProps>> = ({ shareId, datasheetId }) => {
  return (
    <div className={styles.suspensionPanel}>
      <div id={DATASHEET_ID.APPLICATION_JOIN_SPACE_BTN} />
      {shareId && datasheetId && <ReportWeb nodeId={datasheetId} />}
      <div id={DATASHEET_ID.ADD_RECORD_BTN} />
    </div>
  );
};
