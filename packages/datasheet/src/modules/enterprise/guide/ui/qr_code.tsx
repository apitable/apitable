import { FC, useEffect } from 'react';
import QRCode from 'qrcode';
import { isSocialPlatformEnabled, isDingtalkFunc, isWecomFunc, isLarkFunc } from 'pc/components/home/social_platform';
import { Message } from '@apitable/components';
import { useSelector } from 'react-redux';
import { IReduxState, Settings, integrateCdnHost, ConfigConstant } from '@apitable/core';

export const ServiceQrCode: FC = () => {
 
  const spaceInfo = useSelector((state: IReduxState) => state.space.curSpaceInfo);
  
  // Get configuration of the customer service QR code
  const config = Settings.error_message_qrcode.value;
  const codeConfig = JSON.parse(config);
  const { feishu, dingtalk, wecom, website } = codeConfig;

  // Distinguish between platforms using different QR codes
 
  const isBindDingTalk = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.DINGTALK) || isDingtalkFunc();
  const isBindWecom = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.WECOM) || isWecomFunc();
  const isBindFeishu = spaceInfo && isSocialPlatformEnabled(spaceInfo, ConfigConstant.SocialType.FEISHU) || isLarkFunc();
  
  const platformImg = isBindDingTalk ? dingtalk : isBindWecom ? wecom : website;
  
  useEffect(() => {
    if (!isBindFeishu || !feishu) return;
    QRCode.toCanvas(feishu,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 86,
      },
      (err, canvas) => {
        if (err) {
          Message.error({ content: 'Generate QrCode failed' });
        }
        const container = document.getElementById('shareQrCodeFeishu');
        if(container?.childNodes[0]) {
          container?.removeChild(container?.childNodes[0]);
        }
        container?.appendChild(canvas);
      });
  }, [isBindFeishu, feishu, spaceInfo]);

  return (
    <>
      { isBindFeishu ?
        <div id="shareQrCodeFeishu" />
        :
        <img src={integrateCdnHost(platformImg)} alt="" />
      }
    </>
  );
};