import { useState } from 'react';
import * as React from 'react';
import { Form } from 'antd';
import styles from 'pc/components/navigation/account_center_modal/basic_setting/modify_email_modal/style.module.less';
import { Api, ConfigConstant, hiddenMobile, StoreActions, Strings, t } from '@vikadata/core';
import { IdentifyingCodeInput, Message, NormalModal, WithTipWrapper } from 'pc/components/common';
import { useSetState } from 'pc/hooks';
import { useDispatch } from 'react-redux';
import { usePlatform } from 'pc/hooks/use_platform';

export type IUnbindType='mobile' | 'email';

interface IUnBindModalProps {
  unbindType: IUnbindType;
  setUnBindModal: React.Dispatch<React.SetStateAction<null | IUnbindType>>;
  data: {
    email: string;
    mobile: string;
    areaCode?: string;
  };
}

export const UnBindModal: React.FC<IUnBindModalProps> = (props) => {
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
        dispatch(
          StoreActions.updateUserInfo(info)
        );
        Message.success({
          content: t(Strings.un_bind_success)
        });
        handleCancel();
        return;
      }
      setErrMsg({ identifyingCodeErrMsg: message });
    });
  };

  const handleIdentifyingCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  return <NormalModal
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
            disabled={Boolean(
              !data.mobile ||
              errMsg.accountErrMsg ||
              errMsg.identifyingCodeErrMsg
            )}
          />
        </WithTipWrapper>
      </Form>
    </div>
  </NormalModal>;
};
