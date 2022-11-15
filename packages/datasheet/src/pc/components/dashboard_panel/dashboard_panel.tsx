import { Selectors, StatusCode } from '@apitable/core';
import { Skeleton } from '@apitable/components';
import 'react-grid-layout/css/styles.css';
import { useSelector } from 'react-redux';
import { ServerError } from '../invalid_page/server_error';
import { NoPermission } from '../no_permission';
import { Dashboard } from './dashboard';
import styles from './style.module.less';

export const DashboardPanel = () => {
  const loading = useSelector(state => Boolean(Selectors.getDashboardLoading(state)));
  const dashboardErrCode = useSelector(Selectors.getDashboardErrCode);

  const isNoPermission = dashboardErrCode === StatusCode.NODE_NOT_EXIST ||
    dashboardErrCode === StatusCode.NOT_PERMISSION || dashboardErrCode === StatusCode.NODE_DELETED;
  if (loading) {
    return <div className={styles.skeletonWrapper}>
      <Skeleton height="24px" />
      <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
    </div>;
  }

  return <>
    {
      !dashboardErrCode ? <Dashboard /> : (isNoPermission ? <NoPermission /> : <ServerError />)
    }
  </>;
};