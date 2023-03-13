import { FC } from 'react';
import { Modal } from 'pc/components/common/modal/modal/modal';
import styles from './style.module.less';
import { Typography, useThemeColors } from '@apitable/components';
import { QuestionCircleOutlined, SearchOutlined } from '@apitable/icons';

interface IModalWrapper {
  onCancel: () => void;
}

const Title = () => {
  const colors = useThemeColors();
  return (
    <div className={styles.modalHeader}>
      <SearchOutlined color={colors.textCommonPrimary} />
      <Typography variant='h6' color={colors.textCommonPrimary}>QuickSearch</Typography>
      <QuestionCircleOutlined color={colors.textCommonPrimary}/>
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
      width="800px"
      footer={null}
      centered
      zIndex={1000}
      title={<Title />}
    >
      {props.children}
    </Modal>
  );
};