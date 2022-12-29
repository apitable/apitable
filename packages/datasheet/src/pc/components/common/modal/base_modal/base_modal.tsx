import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { FC } from 'react';
import classNames from 'classnames';
import { t, Strings } from '@apitable/core';
import styles from './style.module.less';
import { Modal } from '../modal/modal';
const config = {
  centered: true,
  maskClosable: false,
  visible: true,
};

export interface IBaseModalProps {
  showButton?: boolean;
}

export const BaseModal: FC<IModalProps & IBaseModalProps> = props => {
  const { className, cancelButtonProps, okButtonProps, cancelText = t(Strings.cancel),
    okText = t(Strings.submit), showButton = true, ...rest } = props;
  const buttonConfig: any = showButton ? {
    cancelButtonProps: { size: 'small', ...cancelButtonProps, className: 'subText' },
    okButtonProps: { size: 'small', ...okButtonProps },
  } : { footer: null };

  return (
    <Modal
      cancelText={cancelText}
      okText={okText}
      className={classNames(styles.baseModal, className)}
      {...config}
      {...buttonConfig}
      {...rest}
      maskClosable
    />
  );
};
