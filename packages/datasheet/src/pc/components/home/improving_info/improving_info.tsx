/* eslint-disable react-hooks/exhaustive-deps */
import { ApiInterface, ConfigConstant, Strings, t ,StoreActions} from '@apitable/core';
import parser from 'html-react-parser';
import { Wrapper } from 'pc/components/common';
import { useDispatch, useQuery, useUserRequest } from 'pc/hooks';
import { FC, useEffect } from 'react';
import { IdentifyingCodeLogin, ISubmitRequestParam } from '../login';
import styles from './style.module.less';

const ImprovingInfo: FC = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const inviteLinkToken = query.get('inviteLinkToken') || '';

  useEffect(() => {
    // When invite link, should valid link and update invite state cache.
    if (inviteLinkToken) {
      dispatch(StoreActions.verifyLink(inviteLinkToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteLinkToken]);

  // 微信公众号token
  const mpToken = query.get('token') || '';
  const { loginOrRegisterReq } = useUserRequest();
  const mobileModLogin = (data: ISubmitRequestParam) => {
    const loginData: ApiInterface.ISignIn = {
      areaCode: data.areaCode,
      username: data.account,
      type: data.type,
      credential: data.credential,
      data: data.nvcVal,
      token: mpToken,
    };
    return loginOrRegisterReq(loginData);
  };

  return (
    <Wrapper>
      <div className={styles.improvingInfoWrapper}>
        <div className={styles.improvingInfo}>
          <div className={styles.title}>{t(Strings.improving_info)}</div>
          <div className={styles.tip}>{t(Strings.improving_info_tip)}</div>
          <IdentifyingCodeLogin
            mode={ConfigConstant.LoginMode.PHONE}
            submitRequest={mobileModLogin}
            smsType={ConfigConstant.SmsTypes.LOGIN_ACCOUNT}
            submitText={t(Strings.confirm)}
            footer={parser(t(Strings.old_user_turn_to_home))}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default ImprovingInfo;
