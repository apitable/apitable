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

import { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import domtoimage from 'dom-to-image';

import { IReduxState, Strings, t } from '@apitable/core';
import { useThemeColors, rgba2hex, Typography, Button, Loading } from '@apitable/components';
import { DownloadOutlined, LogoPurpleFilled } from '@apitable/icons';

import { Avatar, AvatarType, Message } from 'pc/components/common';

import { GenerateQrCode } from './generate_qr_code';

import styles from './style.module.less';
import { generateInviteLink, ROOT_TEAM_ID } from '../utils';
import { useInviteRequest } from 'pc/hooks/use_invite_request';

const DOWNLOAD_QR_CODE_AREA = 'downloadQrCodeArea';

export interface IDownloadQrCodeProps {
  nodeId: string;
  width: number;
  isMobile: boolean;
}

export const DownloadQrCode: FC<IDownloadQrCodeProps> = ({
  nodeId,
  width,
  isMobile,
}) => {
  const colors = useThemeColors();
  const { generateLinkReq } = useInviteRequest();
  const { userInfo, spaceInfo, spaceId } = useSelector((state: IReduxState) => ({
    userInfo: state.user.info,
    spaceInfo: state.space.curSpaceInfo,
    spaceId: state.space.activeId,
  }));
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<string>();

  const fetchLink = useCallback(async() => {
    const token = await generateLinkReq(ROOT_TEAM_ID, nodeId);
    if (token) {
      const _link = generateInviteLink(userInfo, token, nodeId);
      setLink(_link);
    }
    setLoading(false);
  }, [generateLinkReq, nodeId, userInfo]);

  useEffect(() => {
    fetchLink();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!spaceInfo || !spaceId || !link) {
    return (
      <div className={styles.error}>
        {t(Strings.resource_load_failed)}
      </div>
    );
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
        return !(node instanceof Element && node.id === 'downloadInviteBtn');
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
          <GenerateQrCode url={link} color={rgba2hex(colors.staticDark1)} id="download_invite_code" width={width} />
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