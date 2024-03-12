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

import { message } from 'antd';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { IAttachmentValue, Strings, t } from '@apitable/core';
import { DownloadOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { bulkDownload } from './util';
// @ts-ignore
import { SubscribeGrade, SubscribeLabel } from 'enterprise/subscribe_system/subscribe_label/subscribe_label';
import styles from './style.module.less';

interface IBulkDownloadProps {
  files: IAttachmentValue[];
  datasheetId: string;
  className?: string;
}

export const BulkDownload: FC<React.PropsWithChildren<IBulkDownloadProps>> = ({ files, className }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={classNames(styles.download, className)}>
      <div
        className={styles.btn}
        onClick={async () => {
          if (loading) {
            return;
          }
          setLoading(true);
          Message.loading({
            content: t(Strings.downloading_attachments),
            duration: 0,
          });

          try {
            await bulkDownload(files);
          } catch (error: any) {
            message.error({ content: error.toString() });
          }
          Message.destroy();
          setLoading(false);
        }}
      >
        <DownloadOutlined currentColor size={14} />
        <div style={{ marginRight: 2 }} />
        {t(Strings.download_all)}
      </div>
      {SubscribeLabel && (
        <div className={styles.suffix}>
          <SubscribeLabel grade={SubscribeGrade.Silver} />
        </div>
      )}
    </div>
  );
};
