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
import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TextInput } from '@apitable/components';
import { StoreActions, Api, ConfigConstant, Strings, t } from '@apitable/core';
import { IdentifyingCodeInput } from 'pc/components/common/input/identifying_code_input/identifying_code_input';
import { WithTipWrapper } from 'pc/components/common/input/with_tip_wrapper/with_tip_wrapper';
import { Message } from 'pc/components/common/message/message';
import { NormalModal } from 'pc/components/common/modal/normal_modal/normal_modal';
import { usePlatform } from 'pc/hooks/use_platform';
import { useSetState } from 'pc/hooks/use_set_state';
import { Verify } from '../modify_mobile_modal/verify';
// @ts-ignore
import { addWizardNumberAndApiRun } from 'enterprise/guide/utils';
import styles from './style.module.less';

export interface IModifyEmailModalProps {
  setEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    email: string;
    mobile?: string;
    areaCode?: string;
  };
}

const defaultErrMsg = {
  accountErrMsg: '',
  identifyingCodeErrMsg: '',
};

export const ModifyEmailModal: FC<React.PropsWithChildren<IModifyEmailModalProps>> = (props) => {
  const { setEmailModal, data } = props;
  const [newEmail, setNewEmail] = useState('');
  const [identifyingCode, setIdentifyingCode] = useState('');
  // Indicates whether the operation is to bind the mailbox or modify the mailbox
  const [isBindEmail, setIsBindEmail] = useState(true);
  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.email) {
      setIsBindEmail(false);
    }
  }, [data]);

  const handleCancel = () => {
    setEmailModal(false);
  };

  const handleEmailCheck = () => {
    setIdentifyingCode('');
    if (newEmail === '') {
      setErrMsg({ accountErrMsg: t(Strings.error_email_empty) });
      return;
    }
    if (newEmail === data.email) {
      setErrMsg({ accountErrMsg: t(Strings.bind_email_same) });
      return;
    }
    setErrMsg(defaultErrMsg);
    bindEmail();
  };

  const handleMobileCheck = () => {
    smsCodeVerify();
  };

  const smsCodeVerify = () => {
    if (!data.areaCode || !data.mobile) return;
    setLoading(true);
    Api.emailCodeVerify(data.email, identifyingCode).then((res) => {
      const { success, message } = res.data;
      if (success) {
        setIsBindEmail(true);
        setLoading(false);
      } else {
        setErrMsg({ identifyingCodeErrMsg: message });
      }
      setLoading(false);
    });
  };

  const bindEmail = () => {
    setLoading(true);
    Api.bindEmail(newEmail, identifyingCode).then((res) => {
      const { code, success, message } = res.data;
      if (success) {
        dispatch(StoreActions.updateUserInfo({ email: newEmail }));
        if (isBindEmail) {
          addWizardNumberAndApiRun(ConfigConstant.WizardIdConstant.EMAIL_BIND);
        }
        Message.success({ content: t(Strings.message_bind_email_succeed) });
        setLoading(false);
        setEmailModal(false);
      } else {
        if (code == 500) {
          setErrMsg({ accountErrMsg: message });
        } else {
          setErrMsg({ identifyingCodeErrMsg: message });
        }

        setLoading(false);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newValue = value.replace(/\s/g, '');
    setNewEmail(newValue);
    setErrMsg(defaultErrMsg);
  };

  const handleIdentifyingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.replace(/\s/g, '');
    setIdentifyingCode(value);
  };

  const bindEmailPage = () => {
    return (
      <div className={styles.modifyNameWrapper}>
        <Form onFinish={handleEmailCheck} key="bindEmailPage">
          <WithTipWrapper tip={errMsg.accountErrMsg}>
            <TextInput
              onChange={handleChange}
              placeholder={t(Strings.placeholder_input_email)}
              error={Boolean(errMsg.accountErrMsg)}
              autoFocus
              block
            />
          </WithTipWrapper>
          <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
            <IdentifyingCodeInput
              data={{ account: newEmail }}
              mode={ConfigConstant.LoginMode.MAIL}
              emailType={ConfigConstant.EmailCodeType.BIND}
              onChange={handleIdentifyingCodeChange}
              setErrMsg={setErrMsg}
              error={Boolean(errMsg.identifyingCodeErrMsg)}
              disabled={Boolean(!newEmail || errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg)}
              value={identifyingCode}
            />
          </WithTipWrapper>
        </Form>
      </div>
    );
  };

  const checkEmailPage = () => {
    if (!data.email) return;
    return (
      <Verify
        onVerify={smsCodeVerify}
        data={data}
        onInputChange={handleIdentifyingCodeChange}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
        smsType={ConfigConstant.SmsTypes.MODIFY_EMAIL}
        emailType={ConfigConstant.EmailCodeType.COMMON}
        mode={ConfigConstant.LoginMode.MAIL}
      />
    );
  };
  const needSkipVerify = isBindEmail || !data.mobile;
  const { desktop } = usePlatform();

  return (
    <NormalModal
      title={needSkipVerify ? t(Strings.modal_title_bind_email) : t(Strings.modal_title_check_original_mail)}
      className={styles.modifyEmail}
      maskClosable={false}
      onCancel={handleCancel}
      visible
      centered={desktop}
      okText={needSkipVerify ? t(Strings.bind_email) : t(Strings.next_step)}
      onOk={needSkipVerify ? handleEmailCheck : handleMobileCheck}
      okButtonProps={{
        loading,
        disabled: Boolean(!identifyingCode || errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg),
      }}
    >
      {needSkipVerify ? bindEmailPage() : checkEmailPage()}
    </NormalModal>
  );
};
