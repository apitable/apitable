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

import { Typography } from '@apitable/components';
import * as React from 'react';
import styles from './style.module.less';
import { Selectors, Strings, t } from '@apitable/core';
import { useSelector } from 'react-redux';

export const SyncViewTip: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties; content?: string }>> = ({ style, content }) => {
  const mirrorId = useSelector(state => state.pageParams.mirrorId);
  const { editable } = useSelector(Selectors.getPermissions);
  const snapshot = useSelector(Selectors.getSnapshot)!;
  const isViewSync = useSelector(state => {
    if (!state.labs.includes('view_manual_save')) {
      return true;
    }
    const { viewId, datasheetId } = state.pageParams;
    return Selectors.getCurrentViewBase(snapshot, viewId, datasheetId, undefined, Selectors.getMirror(state))?.autoSave;
  });
  let _content = t(Strings.view_sync_property_tip_close_auto_save);
  if (isViewSync && !mirrorId && editable) {
    _content = (content || t(Strings.view_sync_property_tip_open_auto_save));
  }

  return <div className={styles.closeSyncViewTip} style={style}>
    <Typography variant="body4" className={styles.text}>
      {_content}
    </Typography>
  </div>;
};
