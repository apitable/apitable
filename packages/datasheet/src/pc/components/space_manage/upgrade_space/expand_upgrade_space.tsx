import React from 'react';
import { createRoot } from 'react-dom/client';
import { colorVars, Typography } from '@apitable/components';
import { Navigation, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import UpgradeSpace from 'pc/components/space_manage/upgrade_space/upgrade_space';
import { stopPropagation } from 'pc/utils';
import styles from './style.module.less';
import { Router } from 'pc/components/route_manager/router';

export const expandUpgradeSpace = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    Router.push(Navigation.WORKBENCH, { clearQuery:true });
  };

  root.render(
    <div onMouseDown={stopPropagation}>
      <Modal
        visible
        wrapClassName={styles.modalWrapper}
        maskClosable={false}
        closeIcon={null}
        onCancel={onModalClose}
        destroyOnClose
        width={'1200px'}
        footer={null}
        centered
        zIndex={1100}
      >
        <div className={styles.header}>
          <Typography variant="h6">{t(Strings.upgrade)}</Typography>
          <CloseOutlined color={colorVars.fc3} size={16} onClick={onModalClose} />
        </div>
        <UpgradeSpace />
      </Modal>
    </div>,
  );
};
