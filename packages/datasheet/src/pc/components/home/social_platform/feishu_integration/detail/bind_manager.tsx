import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { Loading, Message } from '@vikadata/components';
import classNames from 'classnames';
import { Strings, t } from '@vikadata/core';
import { IScriptRef, Script } from '../../wecom_integration/components/srcipt';

import styles from './styles.module.less';
import { IFeishuConfigParams } from '../feishu_integration_config';

enum STATUS {
  Scan = 1,
  Success = 2,
  Error = 3,
}

interface IBindManage {
  config: IFeishuConfigParams;
  step: number;
}

export const BindManager: React.FC<IBindManage> = (props) => {
  const { config, step } = props;
  const [status, setStatus] = useState<STATUS>(STATUS.Scan);
  const [isLoadingScript, setIsLoadingScript] = useState(true);
  const scriptRef = useRef<IScriptRef>(null);

  useEffect(() => {
    setStatus(STATUS.Scan);
  }, []);

  useEffect(() => {
    if (isLoadingScript || !config.appId || step !== 5) {
      return;
    }
    const appId = config.appId;
    const redirectUrl = encodeURIComponent(config.redirectUrl);
    const id = 'lark_integration_qr_code';
    const goto =
      `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUrl}&response_type=code&state=adminScan`;
    const qrLoginObj = QRLogin({
      id,
      goto,
      width: '250',
      height: '257',
      style: 'outline: none; border: none;'
    });
    const handleMessage = (event) => {
      const origin = event.origin;
      // 使用 matchOrigin 方法来判断 message 是否来自飞书页面
      if(qrLoginObj.matchOrigin(origin) ) {
        const loginTmpCode = event.data;
        // 在授权页面地址上拼接上参数 tmp_code，并跳转
        window.location.href = `${goto}&tmp_code=${loginTmpCode}`;
      }
    };
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [isLoadingScript, config.appId, config.redirectUrl, step]);

  const renderScan = () => {
    if (isLoadingScript) {
      return <Loading />;
    }
    return (
      <div className={styles.bindManagerScanArea}>
        <div className={styles.bindManagerTitle}>{t(Strings.lark_integration_step6_title)}</div>
        <div
          className={classNames(styles.bindManagerDesc)}
        >
          <p>{t(Strings.lark_integration_step6_content)}</p>
        </div>
        {step === 5 && <div id="lark_integration_qr_code" className={styles.larkIntegrationQrCode} />}
      </div>
    );
  };

  return (
    <div className={styles.bindManager}>
      {status === STATUS.Scan && renderScan()}
      <Script
        ref={scriptRef}
        src="https://sf3-cn.feishucdn.com/obj/static/lark/passport/qrcode/LarkSSOSDKWebQRCode-1.0.1.js"
        onload={() => {
          setIsLoadingScript(false);
        }}
        onerror={() => {
          scriptRef?.current?.reload(() => {
            Message.error({ content: t(Strings.something_went_wrong) });
          });
        }}
      />
    </div>
  );
};
