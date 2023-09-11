import { FC } from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { SearchOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from '../common/component_display';
import styles from './style.module.less';

interface IModalWrapper {
  onCancel: () => void;
}

const Title = () => {
  const colors = useThemeColors();
  return (
    <div className={styles.modalHeader}>
      <SearchOutlined className={styles.titleSearchIcon} color={colors.textCommonPrimary} />
      <Typography variant="h6" color={colors.textCommonPrimary}>
        {t(Strings.quick_search_title)}
      </Typography>
    </div>
  );
};

export const ModalWrapper: FC<React.PropsWithChildren<IModalWrapper>> = (props) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  return (
    <Modal
      className={styles.modalWrapper}
      open
      onCancel={props.onCancel}
      closeIcon={null}
      destroyOnClose
      width={isMobile ? '90%' : '60%'}
      footer={null}
      centered
      zIndex={2004}
      title={<Title />}
    >
      {props.children}
    </Modal>
  );
};
