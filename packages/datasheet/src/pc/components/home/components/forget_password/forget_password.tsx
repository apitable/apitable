import { useBoolean } from 'ahooks';
import { Form } from 'antd';
import { useState } from 'react';
import { Typography, useThemeColors, Button, TextInput, LinkButton } from '@apitable/components';
import { Strings, t, ConfigConstant } from '@apitable/core';
import { EmailFilled, EyeCloseOutlined, EyeOpenOutlined, LockFilled } from '@apitable/icons';
import { IdentifyingCodeInput } from 'pc/components/common/input';
import { WithTipWrapper } from 'pc/components/common/input/with_tip_wrapper/with_tip_wrapper';
import { Message } from 'pc/components/common/message';
import { useRequest } from 'pc/hooks/use_request';
import { useSetState } from 'pc/hooks/use_set_state';
import { useUserRequest } from 'pc/hooks/use_user_request';
import { execNoTraceVerification } from 'pc/utils/no_trace_verification';
import { ActionType } from '../../pc_home';
import styles from './style.module.less';
interface IForgetPasswordErrorMsg {
  accountErrMsg: string;
  identifyingCodeErrMsg: string;
  passwordErrMsg: string;
}

interface ISignUpProps {
  switchClick?: (actionType: ActionType) => void;
  email: string;
  setEmail: (email: string) => void;
}

const defaultData = {
  accountErrMsg: '',
  identifyingCodeErrMsg: '',
  passwordErrMsg: '',
};

export const ForgetPassword: React.FC<ISignUpProps> = (props) => {
  const { switchClick = () => {}, email, setEmail } = props;
  const colors = useThemeColors();
  const [account, setAccount] = useState<string>(email);
  const [password, setPassword] = useState<string>('');
  const [isVisible, { toggle }] = useBoolean(false);
  const [identifyingCode, setIdentifyingCode] = useState<string>('');
  const { retrievePwdReq, loginOrRegisterReq } = useUserRequest();
  const { run: retrievePwd, loading } = useRequest(retrievePwdReq, { manual: true });

  const [errMsg, setErrMsg] = useSetState<IForgetPasswordErrorMsg>(defaultData);
  const handleSubmit = async () => {
    if (!preCheckOnSubmit({ password, identifyingCode })) {
      return;
    }
    const result = await retrievePwd('', account, identifyingCode, password, ConfigConstant.CodeTypes.EMAIL_CODE);
    const { success, message } = result;
    if (success) {
      Message.success({ content: message });
      execNoTraceVerification((data?: string) => {
        loginOrRegisterReq({
          username: account,
          credential: password,
          type: ConfigConstant.LoginTypes.PASSWORD,
          areaCode: '',
          data,
        });
      });
    } else {
      Message.error({ content: message });
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errMsg.accountErrMsg) {
      setErrMsg({ accountErrMsg: '' });
    }
    setAccount(e.target.value.replace(/\s/g, ''));
    setEmail(e.target.value.replace(/\s/g, ''));
  };

  const handleIdentifyingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.replace(/\s/g, '');
    setIdentifyingCode(value);
  };
  const preCheckOnSubmit = (data: { password?: string; identifyingCode?: string }) => {
    const errorMsg: IForgetPasswordErrorMsg = {
      accountErrMsg: '',
      identifyingCodeErrMsg: '',
      passwordErrMsg: '',
    };
    const checkPassword = (): boolean => {
      if (!data.password) {
        errorMsg.passwordErrMsg = t(Strings.placeholder_input_password);
        return false;
      }

      return true;
    };

    const checkCode = (): boolean => {
      if (!data.identifyingCode) {
        errorMsg.identifyingCodeErrMsg = t(Strings.placeholder_message_code);
        return false;
      }
      return true;
    };
    setErrMsg(errorMsg);
    return checkCode() && checkPassword();
  };

  const handPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newValue = value.replace(/\s/g, '');

    setPassword(newValue);
  };

  return (
    <div className={styles.forgetPasswordWrap}>
      <Form onFinish={handleSubmit}>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant="body2" color={colors.textCommonPrimary}>
            {t(Strings.field_title_email)}
          </Typography>
          <WithTipWrapper tip={errMsg.accountErrMsg || ''}>
            <TextInput
              className={styles.input}
              value={account}
              onChange={handleAccountChange}
              prefix={<EmailFilled color={colors.textCommonPrimary} />}
              placeholder={t(Strings.email_placeholder)}
              error={Boolean(errMsg.accountErrMsg)}
              block
            />
          </WithTipWrapper>
        </div>
        <WithTipWrapper tip={errMsg.identifyingCodeErrMsg || ''}>
          <IdentifyingCodeInput
            smsType={ConfigConstant.SmsTypes.MODIFY_PASSWORD}
            emailType={ConfigConstant.EmailCodeType.COMMON}
            data={{ account }}
            onChange={handleIdentifyingCodeChange}
            setErrMsg={setErrMsg}
            error={Boolean(errMsg.identifyingCodeErrMsg)}
            mode={ConfigConstant.LoginMode.MAIL}
            value={identifyingCode}
          />
        </WithTipWrapper>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant="body2" color={colors.textCommonPrimary}>
            {t(Strings.input_new_password)}
          </Typography>
          <WithTipWrapper tip={errMsg.passwordErrMsg || ''}>
            <TextInput
              type={isVisible ? 'text' : 'password'}
              value={password}
              className={styles.input}
              onChange={handPasswordChange}
              prefix={<LockFilled color={colors.textCommonPrimary} />}
              suffix={
                <div className={styles.suffixIcon} onClick={() => toggle()} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  {isVisible ? <EyeOpenOutlined color={colors.textCommonTertiary} /> : <EyeCloseOutlined color={colors.textCommonTertiary} />}
                </div>
              }
              placeholder={t(Strings.placeholder_input_password)}
              error={Boolean(errMsg.passwordErrMsg)}
              block
            />
          </WithTipWrapper>
        </div>
      </Form>
      <Button className={styles.loginBtn} color="primary" size="large" loading={loading} block onClick={handleSubmit}>
        {t(Strings.apitable_forget_password_done)}
      </Button>
      <div className={styles.switchContent}>
        <p>{t(Strings.apitable_forget_password_text)}</p>
        <LinkButton underline={false} component="button" onClick={() => switchClick(ActionType.SignIn)} style={{ paddingRight: 0 }}>
          {t(Strings.apitable_sign_in)}
        </LinkButton>
      </div>
    </div>
  );
};
