import { Button, ButtonGroup, useThemeColors } from '@apitable/components';
import { IUserInfo, Navigation, Strings, t } from '@apitable/core';
import { NewtabOutlined } from '@apitable/icons';
import classnames from 'classnames';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Tooltip } from 'pc/components/common/tooltip';
import { Router } from 'pc/components/route_manager/router';
import { copy2clipBoard } from 'pc/utils';
import * as React from 'react';
import { useState } from 'react';
import ShareQrCodeIcon from 'static/icon/datasheet/datasheet_icon_share_qrcode.svg';
import CopyIcon from 'static/icon/datasheet/rightclick/datasheet_icon_copy.svg';
import { ShareQrCode } from '../share_qr_code';
import styles from './style.module.less';

interface IShareLinkProps {
  shareSettings: { [key: string]: any };
  userInfo: IUserInfo | null;
  shareName: string;
}

export const ShareLink: React.FC<IShareLinkProps> = props => {
  const shareHost = `${window.location.protocol}//${window.location.host}/share/`;
  const colors = useThemeColors();
  const { shareSettings, userInfo, shareName } = props;
  // Control the display of modal boxes for sharing QR codes
  const [shareCodeVisible, setShareCodeVisible] = useState(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const previewHandler = () => {
    Router.newTab(Navigation.SHARE_SPACE, { params: { shareId: shareSettings.shareId }});
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
            type='text'
            className={classnames(styles.link, { [styles.highBorder]: isCopied })}
            value={shareHost + shareSettings.shareId}
            id={shareSettings.shareId}
            readOnly
          />
        </div>
        <ButtonGroup style={{ display: 'flex' }}>
          <Tooltip title={t(Strings.copy_link)} placement='top'>
            <Button onClick={copyLinkHandler}>
              <CopyIcon fill={colors.secondLevelText} />
            </Button>
          </Tooltip>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Tooltip title={t(Strings.preview)} placement='top'>
              <Button onClick={previewHandler}>
                <NewtabOutlined color={colors.secondLevelText} />
              </Button>
            </Tooltip>
            <Tooltip title={t(Strings.share_qr_code_tips)} placement='top'>
              <Button onClick={() => setShareCodeVisible(true)}>
                <ShareQrCodeIcon fill={colors.secondLevelText} />
              </Button>
            </Tooltip>
          </ComponentDisplay>
        </ButtonGroup>
      </div>
      {shareCodeVisible && (
        <Modal className={styles.shareCodeModal} closable={false} footer={null} visible centered onCancel={() => setShareCodeVisible(false)}>
          <ShareQrCode
            url={`${shareHost}${shareSettings.shareId}`}
            user={userInfo?.memberName ?? ''}
            nodeName={shareName}
            onClose={() => setShareCodeVisible(false)}
          />
        </Modal>
      )}
    </>
  );
};
