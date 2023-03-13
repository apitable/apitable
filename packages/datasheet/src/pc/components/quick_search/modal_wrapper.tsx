import { FC } from 'react';
import { Modal } from 'pc/components/common/modal/modal/modal';
import styles from './style.module.less';
import { Typography, useThemeColors } from '@apitable/components';
import { SearchOutlined } from '@apitable/icons';
import { Strings, t } from '@apitable/core';

interface IModalWrapper {
  onCancel: () => void;
}

const Title = () => {
  const colors = useThemeColors();
  return (
    <div className={styles.modalHeader}>
      <SearchOutlined className={styles.titleSearchIcon} color={colors.textCommonPrimary} />
      <Typography variant='h6' color={colors.textCommonPrimary}>{t(Strings.quick_search_title)}</Typography>
    </div>
  );
};

export const ModalWrapper: FC<React.PropsWithChildren<IModalWrapper>> = (props) => {
  return (
    <Modal
      className={styles.modalWrapper}
      open
      onCancel={props.onCancel}
      closeIcon={null}
      destroyOnClose
      width="60%"
      footer={null}
      centered
      zIndex={1000}
      title={<Title />}
    >
      {props.children}
    </Modal>
  );
};