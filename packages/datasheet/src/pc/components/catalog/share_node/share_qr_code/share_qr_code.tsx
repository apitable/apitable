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

import { Button, IconButton, useThemeColors, ThemeName } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import domtoimage from 'dom-to-image';
import { Message } from 'pc/components/common';
import { getEnvVariables } from 'pc/utils/env';
import QRCode from 'qrcode';
import { FC } from 'react';
import QrCodePng from 'static/icon/datasheet/share/qrcode/datasheet_img_qr_bj.png';
import GapBgPngLight from 'static/icon/datasheet/share/qrcode/datasheet_img_share_qrcode_light.png';
import GapBgPngDark from 'static/icon/datasheet/share/qrcode/datasheet_img_share_qrcode_dark.png';
import FooterBgPng from 'static/icon/datasheet/share/qrcode/datasheet_img_qr_down.png';
import DuckPng from 'static/icon/datasheet/share/qrcode/datasheet_img_qr_top.png';
import MainBgPng from 'static/icon/datasheet/share/qrcode/datasheet_img_qr_up.png';
import styles from './style.module.less';
import { useSelector } from 'react-redux';
import { CloseOutlined, DownloadOutlined } from '@apitable/icons';
export interface IShareQrCodeProps {
  url: string;
  user: string;
  nodeName: string;
  onClose: () => void;
}

export const ShareQrCode: FC<React.PropsWithChildren<IShareQrCodeProps>> = ({ url, user, nodeName, onClose }) => {
  const colors = useThemeColors();
  useMount(() => {
    QRCode.toCanvas(url,
      {
        errorCorrectionLevel: 'H',
        margin: 0,
        width: 128,
        color: {
          dark: colors.primaryColor,
        },
      },
      (err, canvas) => {
        if (err) {
          Message.error({ content: 'generation QrCode failed' });
          return;
        }
        const container = document.getElementById('shareQrCode');
        container?.appendChild(canvas);
      });
  });

  const themeName = useSelector(state => state.theme);
  const GapBgPng = themeName === ThemeName.Light ? GapBgPngLight : GapBgPngDark;

  const downloadImage = () => {
    const downloadNode = document.getElementById('downloadContainer');
    if (!downloadNode) { return; }
    domtoimage.toPng(downloadNode, {
      width: 400,
      height: 620,
      style: {
        marginLeft: '40px',
      },
      filter: node => {
        if (node instanceof Element && (node.id === 'closeBtn' || node.id === 'downloadBtn')) {
          return false;
        }
        return true;
      },
    }).then(dataUrl => {
      const link = document.createElement('a');
      link.download = `${nodeName}.png`;
      link.href = dataUrl;
      link.click();
    }).catch(() => {
      Message.error({ content: 'generation image failed' });
    });
  };

  return (
    <div id="downloadContainer" className={styles.downloadContainer}>
      <div className={styles.contentContainer}>
        {
          !(getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE) && <div className={styles.mascot}>
            <img src={DuckPng.src} alt="vika mascot" />
          </div>
        }
        <div className={styles.mainContainer} style={{ position:'relative', backgroundImage: `url(${MainBgPng.src})` }}>
          <IconButton id="closeBtn" icon={() => <CloseOutlined />} className={styles.closeBtn} onClick={onClose} />
          <div className={styles.user}>{t(Strings.who_shares, { userName: user })}</div>
          <div className={styles.nodeName}>《{nodeName}》</div>
          <div className={styles.qrcode}>
            <div className={styles.shareQrCodeWrapper}>
              <img src={QrCodePng.src} alt="qrcode background" />
              <div id="shareQrCode" className={styles.shareQrCode} />
            </div>
          </div>
          <div className={styles.tip}>{t(Strings.share_code_desc)}</div>
        </div>
        <div className={styles.gapBg}>
          <img src={GapBgPng.src} alt="gap background" />
        </div>
        <div id="footer" className={styles.footer} style={{ backgroundImage: `url(${FooterBgPng.src})` }}>
          <div id="downloadBtn" className={styles.downloadBtn}>
            <Button
              color="primary"
              shape="round"
              onClick={downloadImage}
              prefixIcon={<DownloadOutlined size="16" color="currentColor" />}
              block
            >
              {t(Strings.download_image)}
            </Button>
          </div>
          <div className={styles.useTips}>{t(Strings.share_card_tips)}</div>
        </div>
      </div>
    </div>
  );
};
