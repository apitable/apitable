import { IAttachmentValue, IUserInfo, Settings, Strings, t } from '@apitable/core';
import { useThemeColors } from '@apitable/components';
import { FileType, getDownloadSrc, stopPropagation } from 'pc/utils';
import * as React from 'react';
import { NoSupport } from '../no_support';
import { Loading } from './loading';
import styles from './styles.module.less';

interface IPreviewDoc {
  file: IAttachmentValue;
  icon: React.ReactNode;
  previewEnable?: boolean;
  userInfo: IUserInfo | null;
  spaceId?: string;
  onClose?: () => void;
  previewUrl: string | null;
  disabledDownload: boolean;
}

export const PreviewDoc: React.FC<IPreviewDoc> = ({
  file,
  icon,
  previewEnable,
  userInfo,
  spaceId,
  onClose,
  previewUrl,
  disabledDownload
}) => {
  const colors = useThemeColors();
  const isMainAdmin = userInfo?.isMainAdmin;

  if (!previewEnable) {
    return (
      <NoSupport
        disabledDownload={disabledDownload}
        downloadUrl={getDownloadSrc(file)}
        fileName={file.name}
        type={FileType.Doc}
        icon={icon}
        isMainAdmin={isMainAdmin}
        footer={(
          <a
            style={{
              color: colors.secondLevelText,
              textDecoration: 'underline',
              fontSize: 12,
            }}
            href={Settings.link_preview_office_cms.value}
            target='_blank' rel="noreferrer"
          >
            {t(Strings.preview_see_more)}
          </a>
        )}
        spaceId={spaceId}
        onClose={onClose}
      />
    );
  }

  if (previewUrl === null) {
    return (
      <div className={styles.loading} onMouseDown={stopPropagation}>
        <Loading tip={t(Strings.preview_doc_type_attachment_loading)} />
      </div>
    );
  }

  return (
    <iframe
      allow="clipboard-read; clipboard-write"
      src={previewUrl as string}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: colors.defaultBg,
      }}
      onMouseDown={stopPropagation}
    />
  );
};

