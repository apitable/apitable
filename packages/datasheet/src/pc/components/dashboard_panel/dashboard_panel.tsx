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

import { Skeleton } from '@apitable/components';
import { Selectors, StatusCode } from '@apitable/core';
import 'react-grid-layout/css/styles.css';
import { useAppSelector } from 'pc/store/react-redux';
import { ServerError } from '../invalid_page/server_error';
import { NoPermission } from '../no_permission';
import { Dashboard } from './dashboard';
import styles from './style.module.less';

export const DashboardPanel = () => {
  const loading = useAppSelector((state) => Boolean(Selectors.getDashboardLoading(state)));
  const dashboardErrCode = useAppSelector(Selectors.getDashboardErrCode);
  const dashboardPack = useAppSelector(Selectors.getDashboardPack);

  const isNoPermission =
    dashboardErrCode === StatusCode.NODE_NOT_EXIST || dashboardErrCode === StatusCode.NOT_PERMISSION || dashboardErrCode === StatusCode.NODE_DELETED;

  if (loading || !dashboardPack) {
    return (
      <div className={styles.skeletonWrapper}>
        <Skeleton height="24px" />
        <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
      </div>
    );
  }

  return <>{!dashboardErrCode ? <Dashboard /> : isNoPermission ? <NoPermission /> : <ServerError />}</>;
};
