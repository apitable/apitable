import { Strings, t } from '@vikadata/core';
import { Modal } from 'antd';
import { StatusIconFunc } from 'pc/components/common';
import { FooterBtnInModal } from 'pc/components/common/modal/components/footer_btn';
import ReactDOM from 'react-dom';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import styles from './style.module.less';

interface IModalConfig {
  onOk: () => void;
  onCancel: () => void;
}
export const ShowDeleteMemberModal = (config: IModalConfig ) => {
  const { onOk, onCancel } = config;

  const div = document.createElement('div');
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }
  const finalOnOk = () => {
    onOk();
    destroy();
  };
  const finalOnCancel = () => {
    onCancel();
    destroy();
  };
  const FooterBtnConfig = {
    onOk: finalOnOk, onCancel: finalOnCancel, okButtonProps: { color: 'danger' },
    okText: t(Strings.remove_members_button), cancelText: t(Strings.remove_from_the_team),
  };
  function render() {
    setTimeout(() => {
      ReactDOM.render(
        (
          <Modal
            className={styles.delModal}
            visible
            footer={<FooterBtnInModal {...FooterBtnConfig}/>}
            onCancel={destroy}
            closeIcon={<CloseIcon />}
            maskClosable
            centered
            width={416}
          >
            <div className={styles.body}>
              <div className={styles.iconWrapper}><StatusIconFunc type="danger" /></div>
              <div className={styles.text}>
                <div className={styles.title}>{t(Strings.confirm_delete)}</div>
                <div className={styles.content}>
                  {t(Strings.remove_member_from_space_or_team_select_content)}
                </div>
              </div>
            </div>
          </Modal >
        ),
        div,
      );
    });
  }

  render();
};
