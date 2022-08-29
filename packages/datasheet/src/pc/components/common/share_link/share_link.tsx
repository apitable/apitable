import { useState } from 'react';
import * as React from 'react';
import { Strings, t } from '@vikadata/core';
import styles from './style.module.less';
import { Popover } from 'antd';
import { Tooltip } from 'pc/components/common/tooltip';
import { Popconfirm } from 'pc/components/common/popconfirm';
import { Button, ButtonGroup, useThemeColors } from '@vikadata/components';
import CopyIcon from 'static/icon/datasheet/rightclick/datasheet_icon_copy.svg';
import ShareQrCodeIcon from 'static/icon/datasheet/datasheet_icon_share_qrcode.svg';
import SharePreview from 'static/icon/datasheet/datasheet_icon_share_preview.svg';
import classnames from 'classnames';
import { copy2clipBoard } from 'pc/utils';
// import { ShareQrCode } from 'pc/components/catalog/share_node/share_qr_code';
import DeleteIcon from 'static/icon/common/common_icon_delete.svg';
import { navigationToUrl } from 'pc/components/route_manager/use_navigation';

interface IShareLinkProps {
  /** 要分享的内容 */
  value: string;
  /** 控制按钮的显示 */
  btnConfig?: {
    deletable?: boolean;
    copyable?: boolean;
    shareable?: boolean;
    previewable?: boolean;
  }
  /** 复制时需要追加的内容 */
  copyText?: string;
  onDelete?: () => {};
}

export const ShareLink: React.FC<IShareLinkProps> = ({
  value,
  copyText = '',
  onDelete,
  btnConfig = { deletable: true, copyable: true, shareable: true, previewable: true }
}) => {
  const colors = useThemeColors();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  /** 控制删除确认框的显隐 */
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const previewHandler = () => {
    navigationToUrl(value);
  };

  const copyLinkHandler = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
    copy2clipBoard(`${value} ${copyText}`);
  };

  return (
    <div className={styles.shareLink}>
      <div className={styles.inputContainer}>
        <input
          type='text'
          className={classnames(styles.link, { [styles.highBorder]: isCopied })}
          value={value}
          readOnly
        />
        <div className={styles.tip}>{t(Strings.link_permanently_valid)}</div>
      </div>
      <ButtonGroup style={{ display: 'flex' }}>
        {btnConfig.copyable &&
          <Tooltip title={t(Strings.copy_link)} placement='top'>
            <Button onClick={copyLinkHandler}>
              <CopyIcon fill={colors.secondLevelText} />
            </Button>
          </Tooltip>
        }
        {btnConfig.previewable &&
          <Tooltip title={t(Strings.preview)} placement='top'>
            <Button onClick={previewHandler}>
              <SharePreview fill={colors.secondLevelText} />
            </Button>
          </Tooltip>
        }
        {btnConfig.shareable &&
          <Popover
            overlayClassName={styles.popQrCode}
            content={<div>dd</div>
              // <ShareQrCode
              //   url={value}
              //   // user={userInfo?.memberName ?? ''}
              //   // nodeName={shareName}
              //   user={''}
              //   nodeName={''}
              // />
            }
            trigger='click'
          >
            <Tooltip title={t(Strings.share_qr_code_tips)} placement='top'>
              <Button>
                <ShareQrCodeIcon fill={colors.secondLevelText} />
              </Button>
            </Tooltip>
          </Popover>
        }
        {btnConfig.deletable &&
          <Popconfirm
            onCancel={() => setDeleteConfirm(false)}
            onOk={() => onDelete && onDelete()}
            type='danger'
            title={t(Strings.del_invitation_link)}
            content={t(Strings.del_invitation_link_desc)}
            trigger='click'
            okText={t(Strings.delete)}
            visible={deleteConfirm}
            onVisibleChange={visble => setDeleteConfirm(visble)}
          >
            <Button><DeleteIcon fill={colors.secondLevelText} /></Button>
          </Popconfirm>
        }
      </ButtonGroup>
    </div>
  );
};
