import { Loading, Message } from '@apitable/components';
import { Api, integrateCdnHost, isPrivateDeployment, Settings, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IScriptRef, Script } from '../components/srcipt';
import styles from './styles.module.less';

interface IScanBindProps {
  corpId: string;
  agentId: string;
  configSha: string;
  domainName: string;
}

export const ScanBind: React.FC<IScanBindProps> = React.memo((props) => {
  const { corpId, agentId, configSha, domainName } = props;
  const [isLoadingScript, setIsLoadingScript] = useState(true);
  const scriptRef = useRef<IScriptRef>(null);
  const [isDomainChecked, setIsDomainChecked] = useState(false);
  const spaceId = useSelector(state => state.space.activeId!);

  useEffect(() => {
    if (domainName) {
      const checkDomain = () => Api.socialWecomDomainCheck(domainName).then(({ data: { success, data }}) => {
        if(success) {
          data ? setIsDomainChecked(true) : setTimeout(() => {
            checkDomain();
          }, 1000);
        }
      });
      checkDomain();
    }
  }, [domainName]);

  const generateQrCode = useCallback(() => {
    new WwLogin({
      id : 'loginQrCode',  
      appid : corpId,
      agentid : agentId,
      redirect_uri: encodeURIComponent(
        // eslint-disable-next-line max-len
        `${window.location.protocol}//${domainName}/user/wecom/integration/binding?configSha=${configSha}&corpId=${corpId}&domainName=${domainName}&spaceId=${spaceId}`
      ),
      href: !isPrivateDeployment() ? integrateCdnHost(Settings.wecom_qrcode_css.value) : undefined
    });
  }, [corpId, agentId, configSha, domainName, spaceId]);

  useEffect(() => {
    if (!isLoadingScript && corpId && agentId && configSha && domainName) {
      generateQrCode();
    }
  }, [isLoadingScript, corpId, agentId, configSha, domainName, generateQrCode]);

  if (!isDomainChecked) {
    return (
      <div className={styles.loadingWrap}>
        <Loading />
        <div className={styles.loadingText}>{t(Strings.wecom_integration_domain_check)}</div>
      </div>
    );
  }

  return (
    <>
      <div className={classNames(
        styles.scanBind,
        isPrivateDeployment() && styles.scanBindPrivate
      )}>
        <div className={styles.title}>{t(Strings.integration_app_wecom_step3_main_title)}</div>
        <div className={styles.desc}>{t(Strings.integration_app_wecom_step3_main_desc)}</div>
        <div id="loginQrCode" className={styles.qrCodeWrap}>
          {isLoadingScript && <Loading/>}
        </div>
      </div>
      <Script
        ref={scriptRef}
        src="https://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.4.js"
        onload={() => {
          setIsLoadingScript(false);
        }}
        onerror={() => {
          scriptRef?.current?.reload(() => {
            Message.error({ content: t(Strings.something_went_wrong) });
          });
        }}
      />
    </>
  );
});
