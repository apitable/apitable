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

import { useBoolean, useInterval } from 'ahooks';
import { FC, useEffect, useState } from 'react';
import { Button, ITextInputProps, TextInput } from '@apitable/components';
import { ConfigConstant, StatusCode, Strings, t } from '@apitable/core';
import { ShieldCheckFilled } from '@apitable/icons';
import { Message } from 'pc/components/common/message/message';
import { useNoTraceVerification } from 'pc/hooks/use_no_trace_verification';
import { useRequest } from 'pc/hooks/use_request';
import { useUserRequest } from 'pc/hooks/use_user_request';
import styles from './style.module.less';

export interface IIdentifyingCodeInputProps extends ITextInputProps {
  mode?: ConfigConstant.LoginMode;
  data: {
    areaCode?: string;
    account: string;
  };
  smsType?: ConfigConstant.SmsTypes;
  emailType?: ConfigConstant.EmailCodeType;
  disabled?: boolean;
  setErrMsg: (
    data:
      | Partial<{
          accountErrMsg: string;
          identifyingCodeErrMsg: string;
        }>
      | ((prevState: { accountErrMsg: string; identifyingCodeErrMsg: string }) => Partial<{
          accountErrMsg: string;
          identifyingCodeErrMsg: string;
        }>),
  ) => void;
  checkAccount?: () => boolean;
}

export const IdentifyingCodeInput: FC<React.PropsWithChildren<IIdentifyingCodeInputProps>> = ({
  mode = ConfigConstant.LoginMode.PHONE,
  data,
  disabled = false,
  smsType,
  emailType,
  setErrMsg,
  checkAccount,
  ...rest
}) => {
  const [second, setSecond] = useState(60);
  const [isRunning, { setTrue: startTime, setFalse: closingTime }] = useBoolean(false);
  const [btnDisabled, setBtnDisabled] = useState(disabled);
  const { getSmsCodeReq, getEmailCodeReq } = useUserRequest();
  const { run: getSmsCode, loading: smsLoading } = useRequest(getSmsCodeReq, {
    manual: true,
  });
  const { run: getEmailCode, loading: emailLoading } = useRequest(getEmailCodeReq, {
    manual: true,
  });

  useEffect(() => {
    setBtnDisabled(disabled);
  }, [disabled]);

  const { executeWithVerification, CaptchaElement } = useNoTraceVerification();

  useInterval(
    () => {
      if (second === 0) {
        reset();
        return;
      }
      setBtnDisabled(true);
      setSecond(second - 1);
    },
    isRunning ? 1000 : undefined,
  );

  const sendIdentifyingCodeRequest = async (nvcVal?: string) => {
    let result: {
      success: boolean;
      code: number;
      message: string;
    } | null = null;
    const { account, areaCode } = data;
    if (mode === ConfigConstant.LoginMode.PHONE && areaCode && smsType) {
      result = await getSmsCode(areaCode, account, smsType, nvcVal);
    } else if (mode === ConfigConstant.LoginMode.MAIL && emailType) {
      result = await getEmailCode(account, emailType);
    }

    if (!result) {
      return;
    }

    const { success, code, message } = result;
    if (success) {
      startTime();
      return;
    }
    switch (code) {
      case StatusCode.SMS_GET_ERR:
      case StatusCode.SMS_CHECK_ERR:
        setErrMsg({ identifyingCodeErrMsg: message });
        break;
      case StatusCode.SECONDARY_VALIDATION:
      case StatusCode.NVC_FAIL:
        break;
      case StatusCode.COMMON_ERR:
        Message.error({ content: message });
        break;
      default:
        setErrMsg({ accountErrMsg: message });
    }
  };

  const handleGainIdentifyingCode = () => {
    executeWithVerification(
      () => !checkAccount || checkAccount(),
      sendIdentifyingCodeRequest
    );
  };

  const reset = () => {
    setSecond(60);
    closingTime();
    setBtnDisabled(false);
  };

  const isLoading = smsLoading || emailLoading;

  return (
    <>
      <div className={styles.identifyingCodeInput}>
        <TextInput
          maxLength={6}
          prefix={<ShieldCheckFilled />}
          placeholder={t(Strings.placeholder_enter_your_verification_code)}
          className={styles.input}
          block
          {...rest}
        />
        <Button
          className={styles.btn}
          color="primary"
          variant="jelly"
          onClick={handleGainIdentifyingCode}
          disabled={isLoading || btnDisabled}
          loading={isLoading}
        >
          {isRunning
            ? t(Strings.how_many_seconds, {
              seconds: second,
            })
            : isLoading
              ? ''
              : t(Strings.message_code)}
        </Button>
        <CaptchaElement />
      </div>
    </>
  );
};
