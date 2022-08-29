import * as React from 'react';
import { Tooltip } from 'antd';
import { LockNonzeroOutlined } from '@vikadata/icons';
// import { useSelector } from 'react-redux';
import { IViewProperty, /* Selectors,  */Strings, t } from '@vikadata/core';
import { ViewSyncStatus } from 'pc/components/tab_bar/view_sync_switch';
import { useThemeColors } from '@vikadata/components';

export const ViewLockIcon: React.FC<{ viewId: string, view: IViewProperty }> = ({ viewId, view }) => {
  // const currentView = useSelector(Selectors.getCurrentView);
  const colors = useThemeColors();
  if (!view.lockInfo) {
    return <ViewSyncStatus viewId={view.id} />;
  }
  
  // if (!currentView || !currentView.lockInfo) {
  //   return <ViewSyncStatus viewId={viewId} />;
  // }

  return <Tooltip title={t(Strings.un_lock_view)} placement="bottom">
    <span style={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}>
      <LockNonzeroOutlined color={colors.primaryColor} />
    </span>
  </Tooltip>;
};
