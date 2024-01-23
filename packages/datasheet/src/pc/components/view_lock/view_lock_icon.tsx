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

import { Tooltip } from 'antd';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { IReduxState, IViewProperty, Selectors, Strings, t } from '@apitable/core';
import { LockOutlined } from '@apitable/icons';
import { ViewSyncStatus } from 'pc/components/tab_bar/view_sync_switch';

import { useAppSelector } from 'pc/store/react-redux';

export const ViewLockIcon: React.FC<
  React.PropsWithChildren<{
    viewId: string;
    view: IViewProperty;
  }>
> = ({ view, viewId }) => {
  const colors = useThemeColors();

  const isViewModified = useAppSelector((state) => {
    if (!viewId) {
      return false;
    }
    return Selectors.getDatasheetClient(state)?.operateViewIds?.includes?.(viewId);
  });

  const labs = useAppSelector((state: IReduxState) => state.labs);

  if (isViewModified && labs.includes('view_manual_save') && Boolean(view.lockInfo)) {
    return <ViewSyncStatus viewId={view.id} />;
  }

  if (!view.lockInfo) {
    return <ViewSyncStatus viewId={view.id} />;
  }

  return (
    <Tooltip title={t(Strings.un_lock_view)} placement="bottom">
      <span style={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}>
        <LockOutlined color={colors.primaryColor} />
      </span>
    </Tooltip>
  );
};
