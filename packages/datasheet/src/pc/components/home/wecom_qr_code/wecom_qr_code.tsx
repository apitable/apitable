import { Loading } from '@vikadata/components';
import { integrateCdnHost, Settings, t, Strings } from '@apitable/core';
import { useQuery } from 'pc/hooks';
import { getWecomConfig } from 'pc/utils/get_config';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Script } from '../social_platform/wecom_integration/components/srcipt';
import styles from './styles.module.less';

export const WecomQrCode: React.FC = () => {
  const [isLoadingScript, setIsLoadingScript] = useState(true);
  const query = useQuery();

  const { callbackUrl } = getWecomConfig();

  const { agentId, corpId } = useSelector(state => state.space.envs?.weComEnv || { agentId: query.get('agentId'), corpId: query.get('corpId') });

  useEffect(() => {
    if (!isLoadingScript && corpId && agentId) {
      new WwLogin({
        id : 'wecomLoginQrCode',  
        appid : corpId,
        agentid : agentId,
        redirect_uri: encodeURIComponent(
          // eslint-disable-next-line max-len
          `${callbackUrl}?agentId=${agentId}&corpId=${corpId}`
        ),
        href: integrateCdnHost(Settings.wecom_qrcode_css.value)
      });
    }
  }, [isLoadingScript, corpId, agentId, callbackUrl]);

  return (
    <div className={styles.wecomQrCode}>
      <div id="wecomLoginQrCode" className={styles.wecomQrCodeWrap}>
        { isLoadingScript && <Loading />}
      </div>
      <div className={styles.wecomQrCodeTips}>{t(Strings.wecom_login_btn_text)}</div>
      <Script
        src="https://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.4.js"
        onload={() => {
          setIsLoadingScript(false);
        }}
      />
    </div>
  );
};
