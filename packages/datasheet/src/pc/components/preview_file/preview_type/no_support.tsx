import styles from './style.module.less';
import { FC } from 'react';
import * as React from 'react';
import { stopPropagation, Typography, Button, LinkButton } from '@vikadata/components';
import { Navigation, SpacePathType, Strings, t } from '@vikadata/core';
import IconDownload from 'static/icon/datasheet/datasheet_icon_download.svg';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { FileType } from 'pc/utils';
import { directDownload } from '../tool_bar';

interface INoSupportProps {
  icon?: React.ReactNode;
  downloadUrl: string;
  isMainAdmin?: boolean;
  footer?: React.ReactNode;
  spaceId?: string;
  onClose?: () => void;
  type: FileType;
  fileName: string;
  disabledDownload?: boolean;
}

const getExt = fileName => {
  const matchedStr = fileName?.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
  return matchedStr === '.' ? null : matchedStr;
};

export const NoSupport: FC<INoSupportProps> = props => {
  const { icon, downloadUrl, isMainAdmin, footer, spaceId, onClose, fileName, type, disabledDownload } = props;
  const navigationTo = useNavigation();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const Notice = {
    [FileType.Other]: {
      error: `.${getExt(fileName)} ${t(Strings.preview_cannot_preview)}`,
      tip: t(Strings.please_download_to_view_locally),
    },
    [FileType.Doc]: {
      error: isMainAdmin ? t(Strings.preview_doc_error_no_support_in_this_station) : t(Strings.preview_guide_open_office_preview),
      tip: isMobile ? ' ' : isMainAdmin ? t(Strings.preview_guide_enable_it) : t(Strings.preview_tip_contact_main_admin),
    },
    [FileType.Image]: {
      error: t(Strings.preview_the_image_not_support_yet),
      tip: t(Strings.please_download_to_view_locally),
    },
  };

  const handleDownload = () => {
    directDownload(downloadUrl!, fileName!);
  };

  return (
    <div className={styles.noSupport} onMouseDown={stopPropagation}>
      <main>
        <div className={styles.iconWrapper}>{icon}</div>
        <Typography variant="h5" className={styles.error}>
          {Notice[type].error}
        </Typography>

        {Notice[type].tip && (
          <Typography variant="body4" className={styles.tip}>
            {Notice[type].tip}
          </Typography>
        )}
        {isMainAdmin && (
          <div className={styles.btnGroup}>
            {!isMobile && (
              <Button
                color="primary"
                block
                onClick={() => {
                  navigationTo({
                    path: Navigation.SPACE_MANAGE,
                    params: {
                      spaceId,
                      pathInSpace: SpacePathType.MARKETING,
                    },
                  });
                  onClose?.();
                }}
              >
                {t(Strings.enable)}
              </Button>
            )}
            {!disabledDownload && (
              <div className={styles.download} onClick={handleDownload}>
                {isMobile ? (
                  <Button color="primary">{t(Strings.download)}</Button>
                ) : (
                  <LinkButton underline={false} component="button" style={{ width: '100%' }}>
                    {t(Strings.download)}
                  </LinkButton>
                )}
              </div>
            )}
          </div>
        )}
        {!isMainAdmin &&
          !disabledDownload && (
          <div className={styles.download} onClick={handleDownload}>
            <Button color="primary" block>
              <IconDownload fill="currentColor" />
              <span style={{ marginLeft: 4 }}>{t(Strings.download)}</span>
            </Button>
          </div>
        )}
        <footer>{footer}</footer>
      </main>
    </div>
  );
};
