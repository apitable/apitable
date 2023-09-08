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

import { Progress } from 'antd';
import { FC } from 'react';
import { useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import styles from './style.module.less';

interface IProcessing {
  percent: number;
  cancel: () => void;
  file: File | undefined;
}
export const Processing: FC<React.PropsWithChildren<IProcessing>> = ({ percent, cancel, file }) => {
  const colors = useThemeColors();
  const cancelImport = () => {
    Message.success({ content: t(Strings.upload_canceled) });
    cancel();
  };
  const fileName = file ? file.name : '';
  return (
    <div className={styles.processing}>
      <Progress type="circle" percent={percent - 1} width={80} strokeWidth={5} strokeColor={colors.primaryColor} />
      <div className={styles.fileName}>{fileName}</div>
      <div className={styles.cancelBtn} onClick={cancelImport}>
        {t(Strings.invite_outsider_import_cancel)}
      </div>
    </div>
  );
};
