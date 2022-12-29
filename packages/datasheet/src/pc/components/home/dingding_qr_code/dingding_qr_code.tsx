import { useMount } from 'ahooks';
import { getDingdingConfig } from 'pc/utils/get_config';
import { FC } from 'react';

export const DingdingQrCode: FC = () => {
  const { appId, callbackUrl } = getDingdingConfig();

  useMount(() => {
    // eslint-disable-next-line max-len
    const goto = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=`;

    (window as any).DDLogin({
      id: 'dingtalk_qrcode',
      goto: encodeURIComponent(goto + callbackUrl),
      style: 'border:none;background-color:#FFFFFF;',
      width: '210', 
      height: '210',
    });

    const handleMessage = event => {
      const origin = event.origin;
      if (origin == 'https://login.dingtalk.com') {
        const loginTmpCode = event.data;
        window.location.href = goto + callbackUrl + '&loginTmpCode=' + loginTmpCode;
      }
    };
    if (typeof window.addEventListener != 'undefined') {
      window.addEventListener('message', handleMessage, false);
    }
  });

  return (
    <div id="dingtalk_qrcode" />
  );
};
