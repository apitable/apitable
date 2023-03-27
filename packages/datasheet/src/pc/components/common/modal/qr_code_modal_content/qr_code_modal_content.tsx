/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import styles from './style.module.less';
import { Button } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { store } from 'pc/store';
import { Provider } from 'react-redux';
import { upperFirst } from 'lodash';
// @ts-ignore
import { ServiceQrCode } from 'enterprise';
import { getEnvVariables } from 'pc/utils/env';

interface IModalContentProps {
  content: string;
  onOk: () => void | Promise<void>;
  modalButtonType: string;
  okText?: string;
}

enum ModalBottonType {
  Error = 'danger',
  Success = 'success',
  Warning = 'warning',
  Info = 'primary',
}

export const QRCodeModalContent: React.FC<React.PropsWithChildren<IModalContentProps>> = (props) => {
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

export const getModalConfig = (props: any) => {
  const { isShowQrcode = true, title, content, onOk, okText, modalButtonType } = props;
  const qrcodeVisible = getEnvVariables().ERROR_PAGE_CUSTOMER_SERVICE_QRCODE_VISIBLE;

  if(isShowQrcode && qrcodeVisible) {
    return {
      title,
      content: QRCodeModalContent({
        content,
        onOk,
        okText,
        modalButtonType,
      }) ,
      footer: null,
      maskClosable: false,
    };
  }
  return {
    ...props
  };
};

