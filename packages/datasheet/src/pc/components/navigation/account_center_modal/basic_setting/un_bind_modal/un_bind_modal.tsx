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

import { Form } from 'antd';
import { useState } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Api, ConfigConstant, hiddenMobile, StoreActions, Strings, t } from '@apitable/core';
import { IdentifyingCodeInput } from 'pc/components/common/input/identifying_code_input/identifying_code_input';
import { WithTipWrapper } from 'pc/components/common/input/with_tip_wrapper/with_tip_wrapper';
import { Message } from 'pc/components/common/message/message';
import { NormalModal } from 'pc/components/common/modal/normal_modal/normal_modal';
import styles from 'pc/components/navigation/account_center_modal/basic_setting/modify_email_modal/style.module.less';
import { usePlatform } from 'pc/hooks/use_platform';
import { useSetState } from 'pc/hooks/use_set_state';

export type IUnbindType = 'mobile' | 'email';

interface IUnBindModalProps {
  unbindType: IUnbindType;
  setUnBindModal: React.Dispatch<React.SetStateAction<null | IUnbindType>>;
  data: {
    email: string;
    mobile: string;
    areaCode?: string;
  };
}

export const UnBindModal: React.FC<React.PropsWithChildren<IUnBindModalProps>> = (props) => {
  const { data, setUnBindModal, unbindType } = props;
  const [identifyingCode, setIdentifyingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>();
  const dispatch = useDispatch();
  const isUnbindMobile = unbindType === 'mobile';

  const handleCancel = () => {
    setUnBindModal(null);
  };

  const smsCodeVerify = () => {
    if (!data.areaCode || !data.mobile) {
      return;
    }
    setLoading(true);
    const apiMethod = isUnbindMobile ? Api.unBindMobile : Api.unBindEmail;
    apiMethod(identifyingCode).then((res) => {
      const { success, message } = res.data;
      setLoading(false);
      if (success) {
        const info = isUnbindMobile ? { mobile: '', areaCode: '' } : { email: '' };
        dispatch(StoreActions.updateUserInfo(info));
        Message.success({
          content: t(Strings.un_bind_success),
        });
        handleCancel();
        return;
      }
      setErrMsg({ identifyingCodeErrMsg: message });
    });
  };

  const handleIdentifyingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.trim();
    setIdentifyingCode(value);
  };

  const handleMobileCheck = () => {
    smsCodeVerify();
  };

  const modalTitle = isUnbindMobile ? t(Strings.un_bind_mobile) : t(Strings.un_bind_email);
  const { desktop } = usePlatform();

  return (
    <NormalModal
      title={modalTitle}
      className={styles.modifyEmail}
      maskClosable={false}
      onCancel={handleCancel}
      visible
      centered={desktop}
      onOk={handleMobileCheck}
      okButtonProps={{
        loading,
        disabled: Boolean(!identifyingCode || errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg),
      }}
    >
      <div>
        <Form onFinish={handleMobileCheck} key="unbind">
          <div className={styles.tip}>
            {t(Strings.send_verification_code_to, {
              mobile: isUnbindMobile ? `${data.areaCode} ${hiddenMobile(data.mobile)}` : data.email,
            })}
          </div>
          <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
            <IdentifyingCodeInput
              data={{ areaCode: data.areaCode, account: isUnbindMobile ? data.mobile : data.email }}
              mode={isUnbindMobile ? ConfigConstant.LoginMode.PHONE : ConfigConstant.LoginMode.MAIL}
              smsType={ConfigConstant.SmsTypes.UNBIND_MOBILE}
              emailType={ConfigConstant.EmailCodeType.COMMON}
              onChange={handleIdentifyingCodeChange}
              setErrMsg={setErrMsg}
              error={Boolean(errMsg.identifyingCodeErrMsg)}
              disabled={Boolean(!data.mobile || errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg)}
            />
          </WithTipWrapper>
        </Form>
      </div>
    </NormalModal>
  );
};
