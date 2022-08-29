import { FC } from 'react';
import { Form } from 'antd';
import styles from './style.module.less';
import {
  hiddenMobile,
  ConfigConstant,
  Strings,
  t,
} from '@vikadata/core';

import {
  WithTipWrapper,
  IdentifyingCodeInput,
} from 'pc/components/common';

export interface IVerifyProps {
  onVerify: () => void;
  onInputChange: (e: any) => void;
  errMsg: any;
  setErrMsg: (errMsg: any) => void;
  data: {
    email: string;
    mobile?: string | undefined;
    areaCode?: string | undefined;
  };
  smsType?: ConfigConstant.SmsTypes;
  emailType?: ConfigConstant.EmailCodeType;
  mode?: ConfigConstant.LoginMode;
}

export const Verify: FC<IVerifyProps> = ({
  onVerify,
  onInputChange,
  errMsg,
  setErrMsg,
  data,
  smsType,
  emailType,
  mode,
}) => {

  const isMobileType = emailType === undefined;

  return (
    <div>
      <Form onFinish={onVerify} key='verify'>
        <div className={styles.tip}>
          {t(Strings.send_verification_code_to, {
            mobile: `${isMobileType ? data.areaCode : ''} ${isMobileType ? hiddenMobile(data.mobile!) : data.email}`,
          })}
        </div>
        <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
          <IdentifyingCodeInput
            data={{ areaCode: data.areaCode, account: isMobileType ? data.mobile! : data.email! }}
            mode={mode}
            smsType={smsType}
            emailType={emailType}
            onChange={onInputChange}
            setErrMsg={setErrMsg}
            error={Boolean(errMsg.identifyingCodeErrMsg)}
            // disabled={Boolean(
            //   errMsg.accountErrMsg ||
            //   errMsg.identifyingCodeErrMsg
            // )}
          />
        </WithTipWrapper>
      </Form>
    </div>
  );
};
