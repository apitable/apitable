import { useMount } from 'ahooks';
import { getDingdingConfig } from 'pc/utils/get_config';
import { FC } from 'react';

// TODO: 钉钉扫码会生成一个iframe，外部样式无法控制，同时宽高也无法自定义，需调研
export const DingdingQrCode: FC = () => {
  const { appId, callbackUrl } = getDingdingConfig();

  useMount(() => {
    // eslint-disable-next-line max-len
    const goto = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=`;

    (window as any).DDLogin({
      id: 'dingtalk_qrcode',
      goto: encodeURIComponent(goto + callbackUrl),
      style: 'border:none;background-color:#FFFFFF;',
      width: '210', // 自定义无效
      height: '210', // 自定义无效
    });

    const handleMessage = event => {
      const origin = event.origin;
      if (origin == 'https://login.dingtalk.com') { //判断是否来自ddLogin扫码事件。
        const loginTmpCode = event.data;
        //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
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
