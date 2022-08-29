import { Typography } from '@vikadata/components';
import * as React from 'react';
import styles from './style.module.less';
import { Selectors, Strings, t } from '@vikadata/core';
import { useSelector } from 'react-redux';

export const SyncViewTip: React.FC<{ style?: React.CSSProperties; content?: string }> = ({ style, content }) => {
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
