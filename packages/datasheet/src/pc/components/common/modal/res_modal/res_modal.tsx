import { FC } from 'react';
import { Modal } from 'antd';
import styles from './style.module.less';
import SuccessIcon from 'static/icon/common/common_icon_tips.svg';
import { Button, useThemeColors } from '@vikadata/components';
import { t, Strings } from '@vikadata/core';
interface IResModal {
  title: string;
  desc: string;
  okClick?: () => void;
  okText?: string;
}
const locationReload = () => {
  window.location.reload();
};
export const ResModal: FC<IResModal> = props => {
  const { title, desc, okClick = locationReload, okText = t(Strings.submit) } = props;
  const colors = useThemeColors();
  return (
    <Modal
      visible
      footer={null}
      width={390}
      maskClosable={false}
      bodyStyle={{ padding: '24px' }}
      centered
      closable={false}
    >
      <div className={styles.resModal}>
        <SuccessIcon width={70} height={70} fill={colors.successColor} />
        <div className={styles.title}>{title}</div>
        <div className={styles.tip}>{desc}</div>
        <Button
          onClick={okClick}
          block
          color="primary"
          className={styles.okBtn}
          size="large"
        >
          {okText}
        </Button>
      </div>
    </Modal>
  );
};
