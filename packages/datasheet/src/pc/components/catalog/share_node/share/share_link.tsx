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

import classnames from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { Button, ButtonGroup, useThemeColors } from '@apitable/components';
import { IUserInfo, Navigation, Strings, t } from '@apitable/core';
import { CopyOutlined, NewtabOutlined, QrcodeOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/modal/modal/modal';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common/tooltip';
import { Router } from 'pc/components/route_manager/router';
import { copy2clipBoard } from 'pc/utils';
import { ShareQrCode } from '../share_qr_code';
import styles from './style.module.less';

interface IShareLinkProps {
  shareSettings: { [key: string]: any };
  userInfo: IUserInfo | null;
  shareName: string;
}

export const ShareLink: React.FC<React.PropsWithChildren<IShareLinkProps>> = (props) => {
  const shareHost = `${window.location.protocol}//${window.location.host}/share/`;
  const colors = useThemeColors();
  const { shareSettings, userInfo, shareName } = props;
  // Control the display of modal boxes for sharing QR codes
  const [shareCodeVisible, setShareCodeVisible] = useState(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const previewHandler = () => {
    Router.newTab(Navigation.SHARE_SPACE, { params: { shareId: shareSettings.shareId } });
  };

  const copyLinkHandler = () => {
    if (!shareSettings) {
      return;
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
    const shareText = t(Strings.workbench_share_link_template, {
      nickName: userInfo!.memberName || t(Strings.friend),
      nodeName: shareSettings.nodeName,
    });
    copy2clipBoard(`${shareHost}${shareSettings.shareId} ${shareText}`);
  };

  return (
    <>
      <div className={styles.shareLink}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={classnames(styles.link, { [styles.highBorder]: isCopied })}
            value={shareHost + shareSettings.shareId}
            id={shareSettings.shareId}
            readOnly
          />
        </div>
        <ButtonGroup style={{ display: 'flex' }}>
          <Tooltip title={t(Strings.copy_link)} placement="top">
            <Button onClick={copyLinkHandler}>
              <CopyOutlined color={colors.secondLevelText} className={styles.iconOffset} />
            </Button>
          </Tooltip>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Tooltip title={t(Strings.preview)} placement="top">
              <Button onClick={previewHandler}>
                <NewtabOutlined color={colors.secondLevelText} className={styles.iconOffset} />
              </Button>
            </Tooltip>
            <Tooltip title={t(Strings.share_qr_code_tips)} placement="top">
              <Button onClick={() => setShareCodeVisible(true)}>
                <QrcodeOutlined color={colors.secondLevelText} className={styles.iconOffset} />
              </Button>
            </Tooltip>
          </ComponentDisplay>
        </ButtonGroup>
      </div>
      {shareCodeVisible && (
        <Modal className={styles.shareCodeModal} closable={false} footer={null} visible centered onCancel={() => setShareCodeVisible(false)}>
          <ShareQrCode url={`${shareHost}${shareSettings.shareId}`} user={userInfo} nodeName={shareName} onClose={() => setShareCodeVisible(false)} />
        </Modal>
      )}
    </>
  );
};
