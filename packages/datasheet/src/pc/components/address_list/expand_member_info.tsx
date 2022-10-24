import { Drawer } from 'antd';
import ReactDOM from 'react-dom';
import { MemberInfo } from './member_info';
import { Provider } from 'react-redux';
import { Strings, t } from '@apitable/core';
import { store } from 'pc/store';
import IconBack from 'static/icon/datasheet/datasheet_icon_calender_left.svg';
import styles from './style.module.less';

export const expandMemberInfo = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function close() {
    setTimeout(() => {
      destroy();
    }, 0);
  }

  function render() {
    setTimeout(() => {
      ReactDOM.render(
        (
          <Provider store={store}>
            <div className={styles.memberInfoDrawer}>
              <Drawer
                placement="right"
                height={'100%'}
                width={'100%'}
                visible
                closable={false}
              >
                <div className={styles.mobileBack} onClick={close}>
                  <IconBack fill="currentColor" />
                  <span>{t(Strings.back)}</span>
                </div>
                <MemberInfo />
              </Drawer>
            </div>
          </Provider>
        ),
        div,
      );
    });
  }
  render();
};
