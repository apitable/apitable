import { FC } from 'react';
import { t, Strings } from '@vikadata/core';
import { Tooltip, IModalProps, Modal } from 'pc/components/common';
import styles from './style.module.less';
import classNames from 'classnames';
interface ISelectModalProps extends IModalProps {
  title: string;
  subTitle: string;
  handleCancel?: () => void;
  handleOk?: () => void;
  okBtnDisabled?: boolean;
  className?: string;
}

export const SelectModal: FC<ISelectModalProps> = props => {
  const { title, subTitle, handleCancel, handleOk, okBtnDisabled = false, className, ...rest } = props;
  return (
    <Modal
      visible
      onOk={handleOk}
      onCancel={handleCancel}
      className={classNames(styles.selectModal, className)}
      cancelText={t(Strings.cancel)}
      okText={t(Strings.submit)}
      width={640}
      style={{ maxWidth: '640px' }}
      cancelButtonProps={{ size: 'small', className: 'subText' }}
      okButtonProps={{ disabled: okBtnDisabled, size: 'small' }}
      centered
      maskClosable={false}
      {...rest}
      title={
        <>
          <div className={styles.bigTitle}>{title}</div>
          <Tooltip
            title={subTitle}
            placement="bottomLeft"
            textEllipsis
          >
            <div className={styles.subTitle}>
              {subTitle}
            </div>
          </Tooltip>
          <div className={styles.select}>
            <span>{t(Strings.select)}</span>
            <span>{t(Strings.selected)}</span>
          </div>
        </>
      }
    >
      <div className={styles.leftContent}>
        {props.children && props.children[0]}
      </div>
      <div className={styles.rightContent}>
        {props.children && props.children[1]}
      </div>
    </Modal>
  );
};
