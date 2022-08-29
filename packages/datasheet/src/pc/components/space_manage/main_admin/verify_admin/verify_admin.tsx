import { FC, useState } from 'react';
import * as React from 'react';
import {
  WithTipWrapper,
  IdentifyingCodeInput,
} from 'pc/components/common';
import { Form } from 'antd';
import { useSelector } from 'react-redux';
import {
  Api,
  IReduxState,
  t,
  Strings,
} from '@vikadata/core';
import styles from './style.module.less';
import { TextInput, Button } from '@vikadata/components';
import classNames from 'classnames';
import { useRequest } from 'pc/hooks';
import { useSetState } from 'pc/hooks';
import { getVerifyData, IChangeMainAdminConfig, VerifyTypes } from 'pc/components/navigation/account_center_modal/utils';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
interface IVerifyAdminProps {
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}
export const VerifyAdmin: FC<IVerifyAdminProps> = (props) => {
  const [identifyingCode, setIdentifyingCode] = useState('');
  const mainAdminInfo = useSelector(
    (state: IReduxState) => state.spacePermissionManage.mainAdminInfo
  );
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: '',
  });
  const { run: submit, loading } = useRequest(
    (areaCode, mobile, email, code) => {
      return mobile ?
        Api.smsVerify(areaCode, mobile, code) :
        Api.emailCodeVerify(email, code);
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
    }
  );
  
  const handleIdentifyingCodeChange = React.useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.trim();
    setIdentifyingCode(value);
  },[setErrMsg, errMsg.identifyingCodeErrMsg]);

  const shouldVerify = React.useMemo(()=> Boolean(mainAdminInfo?.mobile || mainAdminInfo?.email), [mainAdminInfo]);
  
  const VerifyContent = React.useMemo(() => {
    if (!shouldVerify || !mainAdminInfo) return null;
    const { codeMode, inputText, verifyAccount, smsType, emailType, areaCode } =
      getVerifyData({ key: VerifyTypes.CHANGE_MAIN_ADMIN }) as IChangeMainAdminConfig;
    return (
      <>
        <div className={classNames(styles.label, styles.top)}>
          {mainAdminInfo.mobile ? t(Strings.primary_admin_phone) : t(Strings.primary_admin_email)}
        </div>
        <TextInput
          value={inputText}
          disabled
          block
        />
        <div className={classNames(styles.label, styles.top)}>
          {t(Strings.verification_code)}
        </div>
        <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
          <IdentifyingCodeInput
            data={{ account: verifyAccount, areaCode }}
            smsType={smsType}
            onChange={handleIdentifyingCodeChange}
            setErrMsg={setErrMsg}
            emailType={emailType}
            mode={codeMode}
            error={Boolean(errMsg.identifyingCodeErrMsg)}
            disabled={Boolean(
              errMsg.accountErrMsg ||
              errMsg.identifyingCodeErrMsg
            )}
          />
        </WithTipWrapper>
      </>
    );
  }, [mainAdminInfo, shouldVerify, errMsg.accountErrMsg,
    setErrMsg, errMsg.identifyingCodeErrMsg, handleIdentifyingCodeChange]);
  
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

  const title = getSocialWecomUnitName({
    name: mainAdminInfo?.name,
    isModified: mainAdminInfo?.isMemberNameModified,
    spaceInfo
  });

  return (
    <div style={{ width:'306px' }}>
      <Form>
        <div className={styles.label}>{t(Strings.primary_admin_nickname)}</div>
        {typeof title === 'string' ? (
          <TextInput
            value={mainAdminInfo ? mainAdminInfo.name : ''}
            disabled
            block
          />) : <div className={styles.name}>
          {title}
        </div>}
        {VerifyContent}
        <Button
          color="primary"
          onClick={handleClick}
          style={{ marginTop: '30px' }}
          block
          size="large"
          loading={loading}
          disabled={btnDisabled}
        >
          {t(Strings.next_step)}
        </Button>
      </Form>
    </div>
  );
};
