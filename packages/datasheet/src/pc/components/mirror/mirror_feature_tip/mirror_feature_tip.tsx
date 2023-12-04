import React from 'react';
import { Button, Typography } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common/modal/modal/modal';
import ProtectIcon from 'static/icon/protect_img.png';
// @ts-ignore
import { addWizardNumberAndApiRun } from 'enterprise/guide/utils';
import styles from './style.module.less';

export const MirrorFeatureWarn: React.FC<{ onModalClose: () => void }> = ({ onModalClose }) => {
  return (
    <Modal
      visible
      wrapClassName={styles.modalWrapper}
      maskClosable={false}
      closeIcon={null}
      onCancel={onModalClose}
      destroyOnClose
      width={'480px'}
      footer={null}
      centered
      zIndex={1100}
    >
      <div className={styles.container}>
        <div className={styles.paint}>
          <img src={ProtectIcon.src} alt="" />
        </div>
        <div className={styles.textArea}>
          <Typography variant={'h5'} className={styles.header}>
            {t(Strings.create_mirror_guide_title)}
          </Typography>
          <Typography variant={'body2'}>
            <p dangerouslySetInnerHTML={{ __html: t(Strings.create_mirror_guide_content) }} />
          </Typography>
          <Button
            variant="fill"
            color="primary"
            onClick={() => {
              addWizardNumberAndApiRun?.(ConfigConstant.WizardIdConstant.CREATE_MIRROR_TIP);
              onModalClose();
            }}
          >
            {t(Strings.i_knew_it)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
