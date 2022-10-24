import { ConfigConstant } from '@apitable/core';
import { BaseModal, Logo } from 'pc/components/common';
import { Login } from 'pc/components/home/login';
import { FC } from 'react';
import styles from './style.module.less';

export interface ILoginModalProps {
  afterLogin?: (data: string, loginMode: ConfigConstant.LoginMode) => void;
  onCancel: () => void;
}

export const LoginModal: FC<ILoginModalProps> = props => {
  const { afterLogin } = props;

  const onCancel = () => {
    props.onCancel();
  };

  return (
    <BaseModal
      onCancel={onCancel}
      showButton={false}
    >
      <div className={styles.loginModal}>
        <div className={styles.logo}>
          <Logo size="large" />
        </div>
        <Login afterLogin={afterLogin} />
      </div>
    </BaseModal>
  );
};
