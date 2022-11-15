import { CloseMiddleOutlined } from '@apitable/icons';
import { useThemeColors } from '@apitable/components';
import { FC } from 'react';
import styles from './style.module.less';

interface IProps {
  width?: number | string;
  onClick?: () => void;
}

export const Model: FC<IProps> = (props) => {
  const colors = useThemeColors();
  const { width, children, onClick } = props;
  return (
    <div className={styles.modelRoot}>
      <div className={styles.content} style={{ width }}>
        <div className={styles.closeBtn} onClick={ () => { onClick && onClick(); } }>
          <CloseMiddleOutlined size={24} color={colors.defaultBg} />
        </div>
        { children }
      </div>
    </div>
  );
};