import { CloseMiddleOutlined } from '@apitable/icons';
import { useThemeColors } from '@apitable/components';
import { FC } from 'react';
import styles from './style.module.less';

interface IMobileModalProps {
  onClose?: (...args: any) => void,
}

export const MobileModal: FC<IMobileModalProps> = (props) => {
  const colors = useThemeColors();
  const { children, onClose } = props;
  return (
    <div className={styles.mobileModal}>
      <div className={styles.mask} />
      <div className={styles.content}>
        <div className={styles.body}>
          { children }
        </div>
        <div className={styles.closeBtn} onClick={() => { onClose && onClose(); }}>
          <CloseMiddleOutlined size={16} color={colors.textStaticPrimary} />
        </div>
      </div>
    </div>
  );
};
