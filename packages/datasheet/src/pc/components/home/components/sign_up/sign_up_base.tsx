import { useBoolean } from 'ahooks';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { Button, LinkButton, TextInput, Typography, useThemeColors } from '@apitable/components';
import { isEmail, Strings, t } from '@apitable/core';
import { EmailFilled, EyeCloseOutlined, EyeOpenOutlined, LockFilled } from '@apitable/icons';
import { WithTipWrapper } from 'pc/components/common/input/with_tip_wrapper/with_tip_wrapper';
import { ActionType } from '../../pc_home';
import styles from './style.module.less';

interface ILoginErrorMsg {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

interface ISignUpProps {
  switchClick?: (actionType: ActionType) => void;
  email?: string;
  loading: boolean;
  buttonStr?: string;

  signUp(username: string, password: string): Promise<void>;
}

export const SignUpBase: React.FC<ISignUpProps> = (props) => {
  const { switchClick, email, loading, signUp, buttonStr } = props;
  const colors = useThemeColors();

  const [errorMsg, setErrorMsg] = useState<ILoginErrorMsg>({});
  const [username, setUsername] = useState<string | undefined>(email);
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();

  const [isVisible, { toggle }] = useBoolean(false);
  const [isVisibleConfirm, { toggle: toggleConfirm }] = useBoolean(false);
  const emailDisable = Boolean(email);

  useEffect(() => {
    setErrorMsg({});
  }, [username, password]);

  useEffect(() => {
    if (!email) return;
    setUsername(email);
  }, [email]);

  const handleSubmit = () => {
    if (!username) return;
    if (!preCheckOnSubmit({ username, password, confirmPassword })) {
      return;
    }
    signUp(username, password!);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.replace(/\s/g, ''));
  };

  const preCheckOnSubmit = (data: { username?: string; password?: string; confirmPassword?: string }) => {
    const errorMsg: ILoginErrorMsg = {};
    const checkPassword = (): boolean => {
      const regex = new RegExp('^.{8,24}$');
      if (!data.password) {
        errorMsg.password = t(Strings.placeholder_input_password);
        return false;
      }

      if (!data.confirmPassword) {
        errorMsg.confirmPassword = t(Strings.placeholder_input_password);
        return false;
      }

      if (!regex.test(data.password)) {
        errorMsg.password = t(Strings.placeholder_set_password);
        return false;
      }

      if (data.password.length !== data.confirmPassword.length) {
        errorMsg.confirmPassword = t(Strings.password_not_identical_err);
        return false;
      }

      if (data.password !== data.confirmPassword) {
        errorMsg.confirmPassword = t(Strings.password_not_identical_err);
        return false;
      }

      return true;
    };

    const checkUsername = () => {
      if (!data.username) {
        errorMsg.username = t(Strings.email_placeholder);
        return false;
      }

      if (!isEmail(data.username)) {
        errorMsg.username = t(Strings.email_err);
        return false;
      }
      return true;
    };

    const verifyUsername = checkUsername();
    const verifyPassword = checkPassword();
    setErrorMsg(errorMsg);
    return verifyUsername && verifyPassword;
  };

  return (
    <div className={styles.loginWrap}>
      <Form onFinish={handleSubmit}>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant="body2" color={colors.textCommonPrimary}>
            {t(Strings.field_title_email)}
          </Typography>
          <WithTipWrapper tip={errorMsg.username || ''}>
            <TextInput
              className={styles.input}
              value={username}
              onChange={handleUsernameChange}
              prefix={<EmailFilled color={colors.textCommonPrimary} />}
              placeholder="Please enter your email address"
              error={Boolean(errorMsg.username)}
              block
              disabled={emailDisable}
            />
          </WithTipWrapper>
        </div>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant="body2" color={colors.textCommonPrimary}>
            {t(Strings.input_new_password)}
          </Typography>
          <WithTipWrapper tip={errorMsg.password || ''}>
            <TextInput
              type={isVisible ? 'text' : 'password'}
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<LockFilled color={colors.textCommonPrimary} />}
              suffix={
                <div className={styles.suffixIcon} onClick={() => toggle()} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  {isVisible ? <EyeOpenOutlined color={colors.textCommonTertiary} /> : <EyeCloseOutlined color={colors.textCommonTertiary} />}
                </div>
              }
              placeholder={t(Strings.apitable_password_input_placeholder)}
              error={Boolean(errorMsg.password)}
              block
            />
          </WithTipWrapper>
        </div>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant="body2" color={colors.textCommonPrimary}>
            {t(Strings.apitable_confirm_password)}
          </Typography>
          <WithTipWrapper tip={errorMsg.confirmPassword || ''}>
            <TextInput
              type={isVisibleConfirm ? 'text' : 'password'}
              value={confirmPassword}
              className={styles.input}
              onChange={(e) => setConfirmPassword(e.target.value)}
              prefix={<LockFilled color={colors.textCommonPrimary} />}
              suffix={
                <div
                  className={styles.suffixIcon}
                  onClick={() => toggleConfirm()}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  {isVisibleConfirm ? <EyeOpenOutlined color={colors.textCommonTertiary} /> : <EyeCloseOutlined color={colors.textCommonTertiary} />}
                </div>
              }
              placeholder={t(Strings.confirmation_password_reminder)}
              error={Boolean(errorMsg.confirmPassword)}
              block
            />
          </WithTipWrapper>
        </div>
      </Form>
      <Button className={styles.loginBtn} color="primary" size="large" block loading={loading} onClick={handleSubmit}>
        {buttonStr || t(Strings.apitable_sign_up)}
      </Button>
      {switchClick && (
        <div className={styles.switchContent}>
          <p>{t(Strings.apitable_sign_up_text)}</p>
          <LinkButton underline={false} component="button" onClick={() => switchClick?.(ActionType.SignIn)} style={{ paddingRight: 0 }}>
            {t(Strings.apitable_sign_in)}
          </LinkButton>
        </div>
      )}
    </div>
  );
};
