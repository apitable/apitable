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

import * as React from 'react';
import { FC } from 'react';
import { Button, LinkButton, stopPropagation, Typography } from '@apitable/components';
import { Navigation, SpacePathType, Strings, t } from '@apitable/core';
import { DownloadOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive } from 'pc/hooks';
import { FileType } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { directDownload } from '../tool_bar';
// @ts-ignore
import { Marketing } from 'enterprise/marketing/marketing';
import styles from './style.module.less';

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

const getExt = (fileName: string) => {
  const matchedStr = fileName?.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
  return matchedStr === '.' ? null : matchedStr;
};

export const NoSupport: FC<React.PropsWithChildren<INoSupportProps>> = (props) => {
  const { icon, downloadUrl, isMainAdmin, footer, spaceId, onClose, fileName, type, disabledDownload } = props;
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

        {Boolean(Marketing) && Notice[type].tip && (
          <Typography variant="body4" className={styles.tip}>
            {Notice[type].tip}
          </Typography>
        )}
        {Boolean(Marketing) && isMainAdmin && getEnvVariables().INTEGRATIONS_YOZOSOFT_VISIBLE && (
          <div className={styles.btnGroup}>
            {!isMobile && (
              <Button
                color="primary"
                block
                onClick={() => {
                  Router.push(Navigation.SPACE_MANAGE, {
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
        {!isMainAdmin && !disabledDownload && (
          <div className={styles.download} onClick={handleDownload}>
            <Button color="primary" block>
              <DownloadOutlined color="currentColor" />
              <span style={{ marginLeft: 4 }}>{t(Strings.download)}</span>
            </Button>
          </div>
        )}
        <footer>{footer}</footer>
      </main>
    </div>
  );
};
