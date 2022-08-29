import * as React from 'react';
import { t, Strings } from '@vikadata/core';
import styles from './style.module.less';
import { Popup } from 'pc/components/common/mobile/popup';
import { ViewSwitcher } from 'pc/components/tool_bar/mobile/view_switcher';

interface IViewMenu {
  visible: boolean;
  onClose: () => void;
}

export const ViewMenu: React.FC<IViewMenu> = props => {
  const {
    visible,
    onClose,
  } = props;

  return (
    <Popup
      className={styles.viewMenuDrawer}
      title={t(Strings.view_list)}
      visible={visible}
      onClose={onClose}
      height='auto'
      destroyOnClose
      bodyStyle={{ padding: '0 0 24px 24px' }}
    >
      <ViewSwitcher onClose={onClose} />
    </Popup>
  );
};
