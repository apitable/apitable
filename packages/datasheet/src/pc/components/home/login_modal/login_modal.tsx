import { FC } from 'react';
import { BaseModal, Logo } from 'pc/components/common';
import { Login } from 'pc/components/home/login';
import { ConfigConstant } from '@vikadata/core';
import { Provider } from 'react-redux';
import styles from './style.module.less';
import ReactDOM from 'react-dom';
import { store } from 'pc/store';
import { ThemeProvider } from '@vikadata/components';

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

export const openLoginModal = (opt: { afterLogin?: (data: string, loginMode: ConfigConstant.LoginMode) => void, onCancel?: () => void }) => {
  const { afterLogin, onCancel } = opt;
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  const show = () => {
    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider>
          <LoginModal onCancel={hidden} afterLogin={afterLogin} />
        </ThemeProvider>
      </Provider>, wrapper);
  };

  const hidden = () => {
    onCancel && onCancel();
    ReactDOM.unmountComponentAtNode(wrapper);
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  };
  show();
};
