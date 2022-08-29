import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { Form } from 'antd';
import styles from './style.module.less';
import { useDispatch } from 'react-redux';
import {
  StoreActions,
  Api,
  ConfigConstant,
  Strings,
  t,
  isPhoneNumber,
  StatusCode,
} from '@vikadata/core';
import {
  Message,
  NormalModal,
  WithTipWrapper,
  IdentifyingCodeInput,
  PhoneInput,
} from 'pc/components/common';
import { useSetState } from 'pc/hooks';
import { Verify } from './verify';
import { usePlatform } from 'pc/hooks/use_platform';

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

export const ModifyMobileModal: FC<IModifyMobileModalProps> = (props) => {
  const [state, setState] = useSetState<{
    areaCode: string;
    account: string;
    identifyingCode: string;
  }>(defaultState);
  const { setMobileModal, data } = props;
  // 表示操作是验证原手机号还是更换手机号
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

  // 表示是否在加载中
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleCancel = () => {
    setMobileModal(false);
  };

  // 校验绑定手机操作的验证码
  const handleBindMobileCheck = () => {
    if (!isPhoneNumber(state.account, state.areaCode)) {
      setErrMsg({
        accountErrMsg:
          state.account === ''
            ? t(Strings.login_mobile_no_empty)
            : t(Strings.login_mobile_format_err),
      });
      return;
    } else if (state.account === data.mobile) {
      setErrMsg({ accountErrMsg: t(Strings.bind_phone_same) });
      return;
    }
    setErrMsg({ accountErrMsg: '', identifyingCodeErrMsg: '' });

    bindMobile();
  };

  // 校验解除绑定手机操作的验证码
  const handleUnBindMobileCheck = () => {
    smsCodeVerify();
  };
  // 校验验证码
  const smsCodeVerify = () => {
    setLoading(true);
    Api.smsVerify(state.areaCode, state.account, state.identifyingCode).then(
      (res) => {
        const { success, message } = res.data;
        if (success) {
          setIsChangeMobile(true);
          setLoading(false);
          dispatch(StoreActions.setHomeErr(null));
        } else {
          setErrMsg({ identifyingCodeErrMsg: message });
        }
        setLoading(false);
      }
    );
  };

  // 绑定新手机
  const bindMobile = () => {
    setLoading(true);
    Api.bindMobile(state.areaCode, state.account, state.identifyingCode).then(
      (res) => {
        const { success, code, message } = res.data;
        if (success) {
          dispatch(
            StoreActions.updateUserInfo({ mobile: state.account, areaCode: state.areaCode })
          );
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
      }
    );
  };

  // 手机号或区号改变
  const handlePhoneChange = (areaCode: string, phone: string) => {
    if (errMsg.accountErrMsg) {
      setErrMsg({ accountErrMsg: '' });
    }
    setState({ areaCode, account: phone });
  };

  const handleIdentifyingCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.trim();
    setState({ identifyingCode: value });
  };

  // 更换手机号页面
  const changeMobilePage = () => {
    return (
      <div className={styles.modifyNameWrapper}>
        <Form onFinish={handleBindMobileCheck} key={'changeMobilePage'}>
          <WithTipWrapper tip={errMsg.accountErrMsg}>
            <PhoneInput
              onChange={handlePhoneChange}
              error={Boolean(errMsg.accountErrMsg)}
              autoFocus
              block
            />
          </WithTipWrapper>
          <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
            <IdentifyingCodeInput
              data={{ areaCode: state.areaCode, account: state.account }}
              smsType={ConfigConstant.SmsTypes.BIND_MOBILE}
              onChange={handleIdentifyingCodeChange}
              setErrMsg={setErrMsg}
              error={Boolean(errMsg.identifyingCodeErrMsg)}
              disabled={Boolean(
                !state.account ||
                errMsg.accountErrMsg ||
                errMsg.identifyingCodeErrMsg
              )}
            />
          </WithTipWrapper>
        </Form>
      </div>
    );
  };

  // 验证手机号页面
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
