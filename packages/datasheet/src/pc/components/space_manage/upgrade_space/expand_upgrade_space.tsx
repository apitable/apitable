import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button, colorVars, IconButton, Typography } from '@apitable/components';
import { Navigation, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Router } from 'pc/components/route_manager/router';
import UpgradeSpace from 'pc/components/space_manage/upgrade_space/upgrade_space';
import { stopPropagation } from 'pc/utils/dom';
import styles from './style.module.less';

type IUpgradeSpaceProps = React.ComponentProps<typeof Modal>;

export const UpdateSpaceModal: React.FC<IUpgradeSpaceProps> = ({ onCancel, ...props }) => {
  return (
    <Modal
      visible
      wrapClassName={styles.modalWrapper}
      maskClosable={false}
      closeIcon={null}
      onCancel={onCancel}
      destroyOnClose
      width={'90%'}
      footer={null}
      centered
      zIndex={1100}
      {...props}
    >
      <div className={styles.header}>
        <Typography variant="h6">{t(Strings.upgrade)}</Typography>
        <Button />
        <IconButton icon={CloseOutlined} color={colorVars.fc3} onClick={() => (onCancel as any)()} />
      </div>
      <UpgradeSpace hideDetail />
    </Modal>
  );
};

export const expandUpgradeSpace = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    Router.push(Navigation.WORKBENCH, { clearQuery: true });
  };

  root.render(
    <div onMouseDown={stopPropagation}>
      <UpdateSpaceModal
        visible
        wrapClassName={styles.modalWrapper}
        maskClosable={false}
        closeIcon={null}
        onCancel={onModalClose}
        destroyOnClose
        width={'90%'}
        footer={null}
        centered
        zIndex={1100}
      />
    </div>,
  );
};
