import { ChevronLeftOutlined } from '@vikadata/icons';
import { Button, Typography, useThemeColors } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import styles from './style.module.less';

export const Title: React.FC<{nodeName: string}> = (props) => {
  return (
    <div className={styles.title}>
      <Typography className={styles.titleFont} ellipsis variant='h6'>
        {t(Strings.move_to_modal_title, { name: props.nodeName })}
      </Typography>
    </div>
  );
};

export const MobileTitle: React.FC<{
  nodeName?: string;
  showBackIcon?: boolean;
  onClick: () => void;
}> = (props) => {
  const { nodeName, showBackIcon, onClick } = props;
  const colors = useThemeColors();
  return (
    <>
      {showBackIcon && <div className={styles.mobileTitleBack} onClick={onClick}>
        <ChevronLeftOutlined size={24} color={colors.textCommonTertiary}/>
      </div>}
      {nodeName}
    </>
  );
};

export const MobileFooter: React.FC<{
  onConfirm?: () => void;
  onCancel?: () => void;
}> = (props) => {
  const { onCancel, onConfirm } = props;
  return (
    <div className={styles.mobileFooter}>
      <Button variant="fill" size='large' onClick={onCancel}>{t(Strings.cancel)}</Button>
      <Button color='primary' size='large' onClick={onConfirm}>{t(Strings.move_to)}</Button>
    </div>
  );
};