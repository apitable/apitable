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
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StoreActions, Api, ConfigConstant, Strings, t, isPhoneNumber, StatusCode } from '@apitable/core';
import { IdentifyingCodeInput } from 'pc/components/common/input/identifying_code_input/identifying_code_input';
import { PhoneInput } from 'pc/components/common/input/phone_input/phone_input';
import { WithTipWrapper } from 'pc/components/common/input/with_tip_wrapper/with_tip_wrapper';
import { Message } from 'pc/components/common/message/message';
import { NormalModal } from 'pc/components/common/modal/normal_modal/normal_modal';
import { usePlatform } from 'pc/hooks/use_platform';
import { useSetState } from 'pc/hooks/use_set_state';
import { Verify } from './verify';
import styles from './style.module.less';

export interface IModifyMobileModalProps {
  setMobileModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    email: string;
    mobile?: string;
    areaCode?: string;
  };
}

const defaultState = {
  areaCode: '',
  account: '',
  identifyingCode: '',
};

export const ModifyMobileModal: FC<React.PropsWithChildren<IModifyMobileModalProps>> = (props) => {
  const [state, setState] = useSetState<{
    areaCode: string;
    account: string;
    identifyingCode: string;
  }>(defaultState);
  const { setMobileModal, data } = props;
  // Indicates whether the operation is to verify the original cell phone number or to change the cell phone number
  const [isChangeMobile, setIsChangeMobile] = useState(false);
  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: '',
  });

  useEffect(() => {
    setState(defaultState);
  }, [isChangeMobile, setState]);

  useEffect(() => {
    setState({ areaCode: data.areaCode, account: data.mobile });
  }, [data, setState]);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleCancel = () => {
    setMobileModal(false);
  };

  const handleBindMobileCheck = () => {
    if (!isPhoneNumber(state.account, state.areaCode)) {
      setErrMsg({
        accountErrMsg: state.account === '' ? t(Strings.login_mobile_no_empty) : t(Strings.login_mobile_format_err),
      });
      return;
    } else if (state.account === data.mobile) {
      setErrMsg({ accountErrMsg: t(Strings.bind_phone_same) });
      return;
    }
    setErrMsg({ accountErrMsg: '', identifyingCodeErrMsg: '' });

    bindMobile();
  };

  // Verify the verification code for unbinding cell phone operation
  const handleUnBindMobileCheck = () => {
    smsCodeVerify();
  };
  const smsCodeVerify = () => {
    setLoading(true);
    Api.smsVerify(state.areaCode, state.account, state.identifyingCode).then((res) => {
      const { success, message } = res.data;
      if (success) {
        setIsChangeMobile(true);
        setLoading(false);
        dispatch(StoreActions.setHomeErr(null));
      } else {
        setErrMsg({ identifyingCodeErrMsg: message });
      }
      setLoading(false);
    });
  };

  const bindMobile = () => {
    setLoading(true);
    Api.bindMobile(state.areaCode, state.account, state.identifyingCode).then((res) => {
      const { success, code, message } = res.data;
      if (success) {
        dispatch(StoreActions.updateUserInfo({ mobile: state.account, areaCode: state.areaCode }));
        Message.success({
          content: t(Strings.binding_success),
        });
        setLoading(false);
        setMobileModal(false);
        return;
      }
      setLoading(false);
      switch (code) {
        case StatusCode.SMS_CHECK_ERR:
          setErrMsg({ identifyingCodeErrMsg: message });
          break;
        case StatusCode.PHONE_COMMON_ERR:
          setErrMsg({ accountErrMsg: message });
          break;
        default:
          break;
      }
    });
  };

  // Cell phone number or area code change
  const handlePhoneChange = (areaCode: string, phone: string) => {
    if (errMsg.accountErrMsg) {
      setErrMsg({ accountErrMsg: '' });
    }
    const newValue = phone.replace(/\D/g, '');
    setState({ areaCode, account: newValue });
  };

  const handleIdentifyingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.replace(/\s/g, '');
    setState({ identifyingCode: value });
  };

  const changeMobilePage = () => {
    return (
      <div className={styles.modifyNameWrapper}>
        <Form onFinish={handleBindMobileCheck} key={'changeMobilePage'}>
          <WithTipWrapper tip={errMsg.accountErrMsg}>
            <PhoneInput onChange={handlePhoneChange} error={Boolean(errMsg.accountErrMsg)} autoFocus block value={state.account} />
          </WithTipWrapper>
          <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
            <IdentifyingCodeInput
              data={{ areaCode: state.areaCode, account: state.account }}
              smsType={ConfigConstant.SmsTypes.BIND_MOBILE}
              onChange={handleIdentifyingCodeChange}
              setErrMsg={setErrMsg}
              error={Boolean(errMsg.identifyingCodeErrMsg)}
              disabled={Boolean(!state.account || errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg)}
              value={state.identifyingCode}
            />
          </WithTipWrapper>
        </Form>
      </div>
    );
  };

  const checkMobilePage = () => {
    if (!data.mobile) {
      return;
    }
    return (
      <Verify
        onVerify={smsCodeVerify}
        data={data}
        onInputChange={handleIdentifyingCodeChange}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
        smsType={ConfigConstant.SmsTypes.UNBIND_MOBILE}
      />
    );
  };

  const modalTitle = React.useMemo(() => {
    if (!data.mobile) {
      return t(Strings.modal_title_check_new_phone);
    }
    return isChangeMobile ? t(Strings.button_change_phone) : t(Strings.modal_title_check_original_phone);
  }, [data.mobile, isChangeMobile]);

  const okText = React.useMemo(() => {
    if (!data.mobile) {
      return t(Strings.button_bind_now);
    }
    return isChangeMobile ? t(Strings.change_phone) : t(Strings.next_step);
  }, [data, isChangeMobile]);

  const needSkipVerify = isChangeMobile || !data.mobile;

  const { desktop } = usePlatform();

  return (
    <NormalModal
      title={modalTitle}
      className={styles.modifyEmail}
      maskClosable={false}
      onCancel={handleCancel}
      visible
      centered={desktop}
      okText={okText}
      onOk={needSkipVerify ? handleBindMobileCheck : handleUnBindMobileCheck}
      okButtonProps={{ loading, disabled: !(state.areaCode && state.areaCode && state.identifyingCode) || loading }}
    >
      {needSkipVerify ? changeMobilePage() : checkMobilePage()}
    </NormalModal>
  );
};
