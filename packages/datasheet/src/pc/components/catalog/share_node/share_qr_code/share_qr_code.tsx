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

import { useMount } from 'ahooks';
import domtoimage from 'dom-to-image';
import QRCode from 'qrcode';
import { FC } from 'react';
import { Button, IconButton } from '@apitable/components';
import { IUserInfo, Strings, t } from '@apitable/core';
import { DownloadOutlined, CloseOutlined } from '@apitable/icons';
import { Message, Avatar, AvatarSize } from 'pc/components/common';
import styles from './style.module.less';
export interface IShareQrCodeProps {
  url: string;
  user?: IUserInfo | null;
  nodeName: string;
  onClose?: () => void;
}

export const ShareQrCode: FC<React.PropsWithChildren<IShareQrCodeProps>> = ({ url, user, nodeName, onClose }) => {
  useMount(() => {
    QRCode.toCanvas(
      url,
      {
        errorCorrectionLevel: 'H',
        margin: 0,
        width: 176,
      },
      (err, canvas) => {
        if (err) {
          Message.error({ content: 'generation QrCode failed' });
          return;
        }
        const container = document.getElementById('shareQrCode');
        container?.appendChild(canvas);
      },
    );
  });

  const downloadImage = () => {
    const downloadNode = document.getElementById('downloadContainer');
    if (!downloadNode) {
      return;
    }
    domtoimage
      .toPng(downloadNode, {
        width: 288,
        height: 372,
        style: {
          marginLeft: '40px',
        },
        filter: (node) => {
          if (node instanceof Element && (node.id === 'closeBtn' || node.id === 'downloadBtn')) {
            return false;
          }
          return true;
        },
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${nodeName}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {
        Message.error({ content: 'generation image failed' });
      });
  };

  return (
    <div className={styles.downloadContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.mainContainer} id="downloadContainer">
          {onClose && <IconButton id="closeBtn" icon={() => <CloseOutlined />} className={styles.closeBtn} onClick={onClose} />}
          <div className={styles.user}>
            {user && (
              <>
                <Avatar
                  src={user.avatar}
                  title={user.nickName || user.memberName}
                  avatarColor={user.avatarColor}
                  id={user.memberId}
                  size={AvatarSize.Size24}
                  style={{ marginRight: 8 }}
                />
                <span className={styles.nickName}>{user.memberName}</span>
                {t(Strings.who_shares)}
              </>
            )}
          </div>
          <div className={styles.nodeName}>{nodeName}</div>
          <div className={styles.qrcode}>
            <div className={styles.shareQrCodeWrapper}>
              <div id="shareQrCode" className={styles.shareQrCode} />
            </div>
          </div>
          <div className={styles.tip}>{t(Strings.share_code_desc)}</div>
        </div>
        <div id="footer" className={styles.footer}>
          <div id="downloadBtn" className={styles.downloadBtn}>
            <Button
              size="small"
              color="primary"
              shape="round"
              onClick={downloadImage}
              style={{ borderRadius: 4 }}
              prefixIcon={<DownloadOutlined size="16" color="currentColor" />}
              block
            >
              {t(Strings.download_image)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
