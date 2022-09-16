import { FC } from 'react';
import { useSelector } from 'react-redux';
import domtoimage from 'dom-to-image';

import { IReduxState, Strings, t } from '@vikadata/core';
import { useThemeColors, rgba2hex, Typography, Button } from '@vikadata/components';
import { DownloadOutlined, LogoPurpleFilled } from '@vikadata/icons';

import { Avatar, AvatarType, Message } from 'pc/components/common';

import { GenerateQrCode } from './generate_qr_code';

import styles from './style.module.less';

const DOWNLOAD_QR_CODE_AREA = 'downloadQrCodeArea';

export interface IDownloadQrCodeProps {
    url: string;
    width: number;
    isMobile: boolean;
}

export const DownloadQrCode: FC<IDownloadQrCodeProps> = ({
  url,
  width,
  isMobile,
}) => {
  const colors = useThemeColors();
  const { spaceInfo, spaceId } = useSelector((state: IReduxState) => ({
    spaceInfo: state.space.curSpaceInfo,
    spaceId: state.space.activeId,
  }));

  if (!spaceInfo || !spaceId) {
    return null;
  }

  const downloadImage = () => {
    const downloadNode = document.querySelector(`.${DOWNLOAD_QR_CODE_AREA}`) as HTMLElement;
    if (!downloadNode) { return; }
    domtoimage.toPng(downloadNode, {
      width: downloadNode.offsetWidth + 48,
      height: downloadNode.offsetHeight + 48,
      style: {
        padding: '24px',
        backgroundColor: '#fff',
      },
      filter: node => {
        /** 过滤不必要的元素 */
        if (node instanceof Element && node.id === 'downloadInviteBtn') {
          return false;
        }
        return true;
      },
    }).then(dataUrl => {
      const link = document.createElement('a');
      link.download = `${spaceInfo.spaceName}.png`;
      link.href = dataUrl;
      link.click();
    }).catch(error => {
      Message.error({ content: 'generation image failed' });
    });
  };

  return (
    <>
      <div className={DOWNLOAD_QR_CODE_AREA}>
        <div className={styles.downloadQrCodeHeader}>
          <Avatar
            src={spaceInfo.spaceLogo}
            id={spaceId}
            title={spaceInfo.spaceName}
            style={{ borderRadius: '3px', width: '24px', height: '24px' }}
            type={AvatarType.Space}
          />
          <Typography variant="body2" className={styles.downloadQrCodeTitle}>{spaceInfo.spaceName}</Typography>
        </div>
        <div className={styles.downloadQrCodeImage} style={{ width: width + 20, height: width + 20 }}>
          <div className={styles.downloadQrCodeLogo}>
            <LogoPurpleFilled size={32} />
          </div>
          <GenerateQrCode url={url} color={rgba2hex(colors.staticDark1)} id="download_invite_code" width={width} />
        </div>
        <Typography variant="body3" className={styles.downloadQrCodeFooter}>{t(Strings.scan_code_to_join_team)}</Typography>
      </div>
      <Button
        color="primary"
        onClick={downloadImage}
        prefixIcon={<DownloadOutlined size={16} />}
        block
        id="downloadInviteBtn"
        size="small"
      >
        {isMobile ? t(Strings.download_image) : t(Strings.download_image)}
      </Button>
    </>
  );
};