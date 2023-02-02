import { colorVars } from '@apitable/components';
import { CloseMiddleOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import UpgradeSpace from 'pc/components/space_manage/upgrade_space/upgrade_space';
import { stopPropagation } from 'pc/utils';
import React from 'react';
import { createRoot } from 'react-dom/client';
import styles from './style.module.less';

export const expandUpgradeSpace = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    location.search ='';
  };

  root.render(
    <div onMouseDown={stopPropagation}>
      <Modal
        visible
        wrapClassName={styles.modalWrapper}
        maskClosable={false}
        closeIcon={<CloseMiddleOutlined color={colorVars.fc3} size={8} />}
        onCancel={onModalClose}
        destroyOnClose
        width={'1200px'}
        footer={null}
        centered
        zIndex={1100}
      >
        <UpgradeSpace />
      </Modal>
    </div>,
  );
};
