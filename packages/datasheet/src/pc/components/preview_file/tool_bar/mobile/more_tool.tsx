import { useState } from 'react';
import * as React from 'react';
import IconMore from 'static/icon/common/common_icon_more_stand.svg';
import DeleteIcon from 'static/icon/common/common_icon_delete.svg';
import IconDownload from 'static/icon/datasheet/datasheet_icon_download.svg';
import style from './style.module.less';
import { Popover } from 'pc/components/common/mobile/popover';
import { Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { LinkButton, useThemeColors } from '@vikadata/components';
import { copy2clipBoard } from 'pc/utils';
import { ColumnUrlOutlined } from '@vikadata/icons';

interface IMoreToolProps {
  readonly: boolean;
  onDelete(): void;
  downloadSrc: string;
  disabledDownload?: boolean
}

export const MoreTool: React.FC<IMoreToolProps> = props => {
  const colors = useThemeColors();
  const {
    readonly,
    onDelete,
    downloadSrc,
    disabledDownload
  } = props;

  const content = (
    <div className={style.content}>
      {
        !disabledDownload && <div
          className={style.moreToolItem}
          onClick={() => {
            setVisible(false);

            const a = document.createElement('a');
            a.setAttribute('download', '');
            a.href = downloadSrc;
            a.click();
          }}
        >
          <LinkButton
            underline={false}
            className={style.moreToolBtn}
            prefixIcon={<IconDownload width={16} height={16} fill={colors.defaultBg} />}
          >
            <span className={style.toolName}>{t(Strings.download)}</span>
          </LinkButton>
        </div>
      }

      <div
        className={style.moreToolItem}
      >
        <LinkButton
          underline={false}
          className={style.moreToolBtn}
          prefixIcon={<ColumnUrlOutlined size={16} color={colors.defaultBg} />}
          onClick={() => {
            copy2clipBoard(downloadSrc, () => {
              Message.success({ content: t(Strings.preview_copy_attach_url_succeed) });
            });
            setVisible(false);
          }}
          disabled={readonly}
        >
          <span className={style.toolName}>{t(Strings.preview_copy_attach_url)}</span>
        </LinkButton>
      </div>
      <div
        className={style.moreToolItem}
        onClick={() => {
          if (!readonly) {
            onDelete();
            setVisible(false);
          }
        }}
      >
        <LinkButton
          underline={false}
          className={style.moreToolBtn}
          prefixIcon={<DeleteIcon width={16} height={16} fill={colors.defaultBg} />}
          disabled={readonly}
        >
          <span className={style.toolName}>{t(Strings.delete)}</span>
        </LinkButton>
      </div>

    </div>
  );

  const [visible, setVisible] = useState(false);

  return (
    <Popover
      content={content}
      popupVisible={visible}
      onPopupVisibleChange={visible => setVisible(visible)}
    >
      <div
        className={style.trigger}
      >
        <IconMore width={16} height={16} fill={colors.defaultBg} />
      </div>
    </Popover>
  );
};
