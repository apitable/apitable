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
import { useContext, useMemo, useState } from 'react';
import { Button, LinkButton, useThemeColors } from '@apitable/components';
import { Api, ConfigConstant, Navigation, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { NormalModal } from 'pc/components/common/modal/normal_modal/normal_modal';
import { Router } from 'pc/components/route_manager/router';
import { usePlatform } from 'pc/hooks/use_platform';
import { useSetState } from 'pc/hooks/use_set_state';
import { ChooseAccountType } from '../choose_account_type/choose_account_type';
import { ConfirmAgainModal } from '../confirm_again_modal';
import { Verify } from '../modify_mobile_modal/verify';
import { Reading } from '../reading';
import { AccountType, StepStatus } from './enum';
import { StepContext } from './step_context';
import styles from './styles.module.less';

export interface IErrorMsg {
  accountErrMsg: string;
  identifyingCodeErrMsg: string;
}

export const Step: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { step, setStep, userData } = useContext(StepContext);
  const colors = useThemeColors();

  const [errMsg, setErrMsg] = useSetState<IErrorMsg>();
  const [loading, setLoading] = useState(false);
  const [identifyingCode, setIdentifyingCode] = useState('');
  const [verifyAccountType, setVerifyAccountType] = useState<AccountType>();
  const [confirmText, setConfirmText] = useState('');

  const { desktop } = usePlatform();

  const handleVerify = async () => {
    if (verifyAccountType === AccountType.MOBILE && (!userData.areaCode || !userData.mobile)) return;
    if (verifyAccountType === AccountType.EMAIL && !userData.email) return;

    setLoading(true);
    const resp =
      verifyAccountType === AccountType.EMAIL
        ? await Api.emailCodeVerify(userData.email, identifyingCode)
        : await Api.smsVerify(userData.areaCode!, userData.mobile!, identifyingCode);

    const { success, message } = resp.data;
    if (success) {
      setStep(StepStatus.ConfirmAgain);
    } else {
      setErrMsg({ identifyingCodeErrMsg: message });
    }
    setLoading(false);
  };

  const handleIdentifyingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.trim();
    setIdentifyingCode(value);
  };

  const StepContent = useMemo(() => {
    const isEmailType = verifyAccountType === AccountType.EMAIL;
    switch (step) {
      case StepStatus.Reading:
        return <Reading />;
      case StepStatus.ChooseAccountType:
        return <ChooseAccountType accountType={verifyAccountType} setAccountType={setVerifyAccountType} />;
      case StepStatus.VerifyAccount:
        return (
          <Verify
            onVerify={handleVerify}
            data={userData}
            onInputChange={handleIdentifyingCodeChange}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
            smsType={ConfigConstant.SmsTypes.GENERAL_VALIDATION}
            emailType={isEmailType ? ConfigConstant.EmailCodeType.COMMON : undefined}
            mode={isEmailType ? ConfigConstant.LoginMode.MAIL : ConfigConstant.LoginMode.PHONE}
          />
        );
      case StepStatus.ConfirmAgain:
        return <ConfirmAgainModal confirmText={confirmText} setConfirmText={setConfirmText} />;
      default:
        return null;
    }
    // eslint-disable-next-line
  }, [step, verifyAccountType, errMsg, confirmText]);

  const Footer = useMemo(() => {
    const btnPropsMap = {
      [StepStatus.Reading]: {
        disabled: false,
        onClick: () => setStep(StepStatus.ChooseAccountType),
        okBtnText: t(Strings.next_step),
      },
      [StepStatus.ChooseAccountType]: {
        disabled: verifyAccountType == null,
        onClick: () => setStep(StepStatus.VerifyAccount),
        okBtnText: t(Strings.next_step),
      },
      [StepStatus.VerifyAccount]: {
        disabled: Boolean(!identifyingCode || errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg),
        onClick: handleVerify,
        okBtnText: t(Strings.next_step),
      },
      [StepStatus.ConfirmAgain]: {
        disabled: !confirmText || confirmText !== t(Strings.confirm_logout),
        onClick: () => {
          setLoading(true);
          Api.logout()
            .then((res) => {
              setLoading(false);
              setStep(StepStatus.Done);
              const { success, message } = res.data;
              if (success) {
                Message.success({ content: t(Strings.log_out_succeed) });
                Router.push(Navigation.APPLY_LOGOUT);
              } else {
                Message.error({ content: message });
              }
            })
            .catch((err) => {
              setLoading(false);
              Message.error({ content: err.toString() });
            });
        },
        okBtnText: t(Strings.confirm_logout),
        color: 'danger',
      },
    };

    switch (step) {
      case StepStatus.Reading:
        const getNextStep = () => {
          if (userData.email && userData.mobile) {
            return StepStatus.ChooseAccountType;
          }
          // If you don't have both email and mobile number, you will be redirected to the confirmation page
          if (!userData.email && !userData.mobile) {
            return StepStatus.ConfirmAgain;
          }
          return StepStatus.VerifyAccount;
        };
        return (
          <Button
            color="primary"
            onClick={() => {
              setStep(getNextStep());
              if (!userData.email) {
                setVerifyAccountType(AccountType.MOBILE);
              } else if (!userData.mobile) {
                setVerifyAccountType(AccountType.EMAIL);
              } else {
                setVerifyAccountType(undefined);
              }
            }}
            block
          >
            {t(Strings.already_know_that)}
          </Button>
        );
      case StepStatus.ChooseAccountType:
      case StepStatus.VerifyAccount:
      case StepStatus.ConfirmAgain:
        let lastStep = step - 1;
        if (step === StepStatus.VerifyAccount && !(userData.email && userData.mobile)) {
          lastStep = StepStatus.Reading;
        }
        return (
          <div className={styles.footer}>
            <LinkButton color={colors.fc3} onClick={() => setStep(lastStep)} underline={false}>
              {t(Strings.last_step)}
            </LinkButton>
            <Button color="primary" loading={loading} type="submit" {...btnPropsMap[step]}>
              {btnPropsMap[step].okBtnText}
            </Button>
          </div>
        );
      default:
        return null;
    }
    // eslint-disable-next-line
  }, [step, verifyAccountType, confirmText, identifyingCode, loading, errMsg]);

  if (step === StepStatus.None || step === StepStatus.Done) {
    return null;
  }

  const titleMap = {
    [StepStatus.Reading]: null,
    [StepStatus.ChooseAccountType]: t(Strings.user_log_out),
    [StepStatus.VerifyAccount]: t(Strings.verify_account_title),
    [StepStatus.ConfirmAgain]: t(Strings.confirm_logout_title),
  };

  return (
    <NormalModal
      className={styles.stepWrapper}
      title={titleMap[step]}
      maskClosable={false}
      centered={desktop}
      onCancel={() => setStep(-1)}
      footer={Footer}
    >
      {StepContent}
    </NormalModal>
  );
};
