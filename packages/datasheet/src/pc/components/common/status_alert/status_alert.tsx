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

import styles from './style.module.less';
import { DefaultFilled } from '@apitable/icons';
import { Typography } from '@apitable/components';
import * as React from 'react';

interface IStatusAlertProps {
  content: string;
  style?: React.CSSProperties;
}

export const StatusAlert: React.FC<React.PropsWithChildren<IStatusAlertProps>> = (props) => {
  const { style, content } = props;
  return <div className={styles.closeSyncViewTip} style={style}>
    <DefaultFilled />
    <Typography variant="body4" className={styles.text} ellipsis={{ tooltip: content }}>
      {content}
    </Typography>
  </div>;
};
