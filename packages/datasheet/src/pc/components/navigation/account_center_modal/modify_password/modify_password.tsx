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
import classNames from 'classnames';
import { FC, useState } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { TextInput, Button } from '@apitable/components';
import { t, Strings, IReduxState, StoreActions, ConfigConstant, StatusCode, Api } from '@apitable/core';
import { IdentifyingCodeInput } from 'pc/components/common/input/identifying_code_input/identifying_code_input';
import { PasswordInput } from 'pc/components/common/input/password_input/password_input';
import { WithTipWrapper } from 'pc/components/common/input/with_tip_wrapper/with_tip_wrapper';
import { Message } from 'pc/components/common/message/message';
import { useRequest } from 'pc/hooks/use_request';
import { useSetState } from 'pc/hooks/use_set_state';
import { useUserRequest } from 'pc/hooks/use_user_request';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { getVerifyData, VerifyTypes, IChangePasswordConfig } from '../utils';
import styles from './style.module.less';

export interface IModifyPasswordProps {
  setActiveItem: React.Dispatch<React.SetStateAction<number>>;
}

const defaultData = {
  identifyingCode: '',
  password: '',
  confirmPassword: '',
};

export const ModifyPassword: FC<React.PropsWithChildren<IModifyPasswordProps>> = (props) => {
  const { setActiveItem } = props;
  const [data, setData] = useSetState<{
    identifyingCode: string;
    password: string;
  }>(defaultData);

  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
    passwordErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: '',
    passwordErrMsg: '',
  });

  const dispatch = useDispatch();
  const user = useAppSelector((state: IReduxState) => state.user.info)!;
  const { modifyPasswordReq } = useUserRequest();
  const { run: modifyPassword, loading } = useRequest(modifyPasswordReq, { manual: true });
  const env = getEnvVariables();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (errMsg.passwordErrMsg) {
      setErrMsg({ passwordErrMsg: '' });
    }

    setData({ password: value });
  };

  const handleSubmit = async () => {
    if (!data.identifyingCode.length) {
      setErrMsg({ identifyingCodeErrMsg: t(Strings.message_verification_code_empty) });
      return;
    }

    const type = user.mobile ? ConfigConstant.CodeTypes.SMS_CODE : ConfigConstant.CodeTypes.EMAIL_CODE;
    const result = await modifyPassword(data.password, data.identifyingCode, type);

    if (!result) {
      return;
    }

    const { success, code, message } = result;

    if (success) {
      (Strings.message_set_password_succeed || Strings.change_password_success) &&
        Message.success({ content: user!.needPwd ? t(Strings.message_set_password_succeed) : t(Strings.change_password_success) });
      setData(defaultData);
      dispatch(StoreActions.updateUserInfo({ needPwd: false }));
      setActiveItem(0);
      return;
    }

    switch (code) {
      case StatusCode.PASSWORD_ERR: {
        setErrMsg({ passwordErrMsg: message });
        break;
      }
      default:
        setErrMsg({ identifyingCodeErrMsg: message });
    }
  };

  const handleIdentifyingCodeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (errMsg.identifyingCodeErrMsg) {
        setErrMsg({ identifyingCodeErrMsg: '' });
      }

      const value = e.target.value.replace(/\s/g, '');
      setData({ identifyingCode: value });
    },
    [setErrMsg, errMsg.identifyingCodeErrMsg, setData],
  );

  const CodeContent = React.useMemo(() => {
    if (!user || !(user?.email || user?.mobile)) return null;

    const { codeMode, label, accountText, smsType, emailType, areaCode, verifyAccount, prefixIcon } = getVerifyData({
      key: VerifyTypes.CHANGE_PASSWORD,
    }) as IChangePasswordConfig;
    return (
      <>
        <div className={styles.item}>
          <div className={styles.label}>{label}:</div>
          <TextInput prefix={prefixIcon} value={accountText} disabled block />
        </div>
        <div className={styles.item}>
          <div className={styles.label}>{t(Strings.verification_code)}:</div>
          <div className={styles.content}>
            <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
              <IdentifyingCodeInput
                data={{ areaCode, account: verifyAccount }}
                smsType={smsType}
                emailType={emailType}
                mode={codeMode}
                onChange={handleIdentifyingCodeChange}
                setErrMsg={setErrMsg}
                error={Boolean(errMsg.identifyingCodeErrMsg)}
                disabled={Boolean(errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg)}
                value={data.identifyingCode}
              />
            </WithTipWrapper>
          </div>
        </div>
      </>
    );
  }, [user, setErrMsg, errMsg.identifyingCodeErrMsg, errMsg.accountErrMsg, handleIdentifyingCodeChange, data]);

  const btnDisabled = !(data.identifyingCode && data.password && !errMsg.accountErrMsg && !errMsg.identifyingCodeErrMsg && !errMsg.passwordErrMsg);

  const [buttonLoading, setButtonLoading] = useState(false);

  const handRest = () => {
    setButtonLoading(true);
    //@ts-ignore
    Api?.apitableChangePasswordEmail().then((res) => {
      setButtonLoading(false);
      const { success, message } = res.data;
      if (success) {
        Message.success({ content: t(Strings.reset_password_via_emai_success) });
      } else {
        Message.error({ content: t(Strings.reset_password_via_emai_failed, { error_message: message }) });
      }
      return;
    });
  };

  return (
    <div className={styles.modifyPasswordWrapper}>
      <div className={styles.title}>{user!.needPwd ? t(Strings.set_password) : t(Strings.change_password)}</div>
      {env.AUTH0_ENABLED ? (
        <div>
          <Button color="primary" size="middle" loading={buttonLoading} onClick={handRest}>
            {t(Strings.reset_password_via_email)}
          </Button>
        </div>
      ) : (
        <div className={styles.form}>
          <Form className={'modifyPassword'} autoComplete="off">
            {CodeContent}
            <div className={classNames([styles.item, styles.newPassword])}>
              <div className={styles.label}>{t(Strings.input_new_password)}:</div>
              <div className={styles.content}>
                <WithTipWrapper tip={errMsg.passwordErrMsg}>
                  <PasswordInput
                    value={data.password}
                    onChange={handlePasswordChange}
                    placeholder={t(Strings.password_rules)}
                    autoComplete="new-password"
                    error={Boolean(errMsg.passwordErrMsg)}
                    block
                  />
                </WithTipWrapper>
              </div>
            </div>
            <Button
              color="primary"
              className={styles.saveBtn}
              htmlType="submit"
              size="large"
              disabled={btnDisabled}
              loading={loading}
              onClick={handleSubmit}
              block
            >
              {t(Strings.save)}
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};
