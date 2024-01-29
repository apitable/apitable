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
import { TextInput, Button } from '@apitable/components';
import { Api, IReduxState, t, Strings } from '@apitable/core';
import { WithTipWrapper, IdentifyingCodeInput } from 'pc/components/common';
import { getVerifyData, IChangeMainAdminConfig, VerifyTypes } from 'pc/components/navigation/account_center_modal/utils';
import { useRequest, useSetState } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

interface IVerifyAdminProps {
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}
export const VerifyAdmin: FC<React.PropsWithChildren<IVerifyAdminProps>> = (props) => {
  const [identifyingCode, setIdentifyingCode] = useState('');
  const mainAdminInfo = useAppSelector((state: IReduxState) => state.spacePermissionManage.mainAdminInfo);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: '',
  });
  const { run: submit, loading } = useRequest(
    (areaCode, mobile, email, code) => {
      return mobile ? Api.smsVerify(areaCode, mobile, code) : Api.emailCodeVerify(email, code);
    },
    {
      manual: true,
      onSuccess: (res) => {
        const { success, message } = res.data;
        if (success) {
          props.setCurrent(1);
          return;
        }
        setErrMsg({ identifyingCodeErrMsg: message });
      },
    },
  );

  const handleIdentifyingCodeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (errMsg.identifyingCodeErrMsg) {
        setErrMsg({ identifyingCodeErrMsg: '' });
      }

      const value = e.target.value.trim();
      setIdentifyingCode(value);
    },
    [setErrMsg, errMsg.identifyingCodeErrMsg],
  );

  const shouldVerify = React.useMemo(() => Boolean(mainAdminInfo?.mobile || mainAdminInfo?.email), [mainAdminInfo]);

  const VerifyContent = React.useMemo(() => {
    if (!shouldVerify || !mainAdminInfo) return null;
    const { codeMode, inputText, verifyAccount, smsType, emailType, areaCode } = getVerifyData({
      key: VerifyTypes.CHANGE_MAIN_ADMIN,
    }) as IChangeMainAdminConfig;
    return (
      <>
        <div className={classNames(styles.label, styles.top)}>
          {mainAdminInfo.mobile ? t(Strings.primary_admin_phone) : t(Strings.primary_admin_email)}
        </div>
        <TextInput value={inputText} disabled block />
        <div className={classNames(styles.label, styles.top)}>{t(Strings.verification_code)}</div>
        <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
          <IdentifyingCodeInput
            data={{ account: verifyAccount, areaCode }}
            smsType={smsType}
            onChange={handleIdentifyingCodeChange}
            setErrMsg={setErrMsg}
            emailType={emailType}
            mode={codeMode}
            error={Boolean(errMsg.identifyingCodeErrMsg)}
            disabled={Boolean(errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg)}
          />
        </WithTipWrapper>
      </>
    );
  }, [mainAdminInfo, shouldVerify, errMsg.accountErrMsg, setErrMsg, errMsg.identifyingCodeErrMsg, handleIdentifyingCodeChange]);

  const handleClick = () => {
    if (!shouldVerify || !mainAdminInfo) {
      props.setCurrent(1);
      return;
    }
    submit(mainAdminInfo.areaCode, mainAdminInfo.mobile, mainAdminInfo.email, identifyingCode);
  };

  const btnDisabled = React.useMemo(() => {
    if (!mainAdminInfo || !mainAdminInfo.mobile) return false;
    return loading || !identifyingCode;
  }, [loading, identifyingCode, mainAdminInfo]);

  const title =
    getSocialWecomUnitName?.({
      name: mainAdminInfo?.name,
      isModified: mainAdminInfo?.isMemberNameModified,
      spaceInfo,
    }) || mainAdminInfo?.name;

  return (
    <div style={{ width: '306px' }}>
      <Form>
        <div className={styles.label}>{t(Strings.primary_admin_nickname)}</div>
        {typeof title === 'string' ? (
          <TextInput value={mainAdminInfo ? mainAdminInfo.name : ''} disabled block />
        ) : (
          <div className={styles.name}>{title}</div>
        )}
        {VerifyContent}
        <Button color="primary" onClick={handleClick} style={{ marginTop: '30px' }} block size="large" loading={loading} disabled={btnDisabled}>
          {t(Strings.next_step)}
        </Button>
      </Form>
    </div>
  );
};
