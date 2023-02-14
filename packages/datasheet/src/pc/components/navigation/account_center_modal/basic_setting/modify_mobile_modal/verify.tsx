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

import { FC } from 'react';
import { Form } from 'antd';
import styles from './style.module.less';
import {
  hiddenMobile,
  ConfigConstant,
  Strings,
  t,
} from '@apitable/core';

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

export const Verify: FC<React.PropsWithChildren<IVerifyProps>> = ({
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
