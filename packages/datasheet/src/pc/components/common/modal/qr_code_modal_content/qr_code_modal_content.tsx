import * as React from 'react';
import styles from './style.module.less';
import { Button } from '@vikadata/components';
import { ServiceQrCode } from 'pc/common/guide/ui/qr_code';
import { t, Strings } from '@vikadata/core';
import { store } from 'pc/store';
import { Provider } from 'react-redux';
import { upperFirst } from 'lodash';
interface IModalContentProps {
  content: string;
  onOk: () => void;
  modalButtonType: string;
  okText?: string;
}

enum ModalBottonType {
  Error = 'danger',
  Success = 'success',
  Warning = 'warning',
  Info = 'primary',
}

export const QRCodeModalContent: React.FC<IModalContentProps> = (props) => {
  const { content, onOk, modalButtonType, okText = t(Strings.refresh) } = props;
  
  return(
    <Provider store={store}>
      <div className={styles.modalContent}>
        <p className={styles.modalContentText}>{content}</p>
        <div className={styles.qrcodeContent} >
          <div className={styles.qrcode} >
            <ServiceQrCode />
          </div>
          <p>{ t(Strings.encounter_problems) }<br/>{ t(Strings.encounter_problems_message) }</p>
        </div>
        <div className={styles.modalbutton}>
          <Button
            color={ModalBottonType[upperFirst(modalButtonType)]}
            onClick={onOk}
            size="small"
          >
            {okText} 
          </Button>
        </div>
      </div>
    </Provider>
  );
};