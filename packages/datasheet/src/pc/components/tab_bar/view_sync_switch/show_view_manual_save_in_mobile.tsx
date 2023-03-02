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

import { colorVars, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { CloseOutlined, InfoCircleFilled } from '@apitable/icons';
import { createRoot } from 'react-dom/client';
import styles from './style.module.less';

const VIEW_MANUAL_SAVE_TIP = 'VIEW_MANUAL_SAVE_TIP';

export const showViewManualSaveInMobile = () => {
  if (document.querySelector(`.${VIEW_MANUAL_SAVE_TIP}`)) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add(VIEW_MANUAL_SAVE_TIP);
  document.body.appendChild(container);
  const root= createRoot(container);
  const modalClose = () => {
    root.unmount();
    container.parentElement?.removeChild(container);
  };

  root.render((
    <div className={styles.mobileTip}>
      <span className={styles.infoIcon}>
        <InfoCircleFilled />
      </span>
      <Typography variant={'body2'}>
        {t(Strings.mbile_manual_setting_tip)}
      </Typography>
      <span onClick={modalClose}>
        <CloseOutlined color={colorVars.primaryColor} />
      </span>
    </div>
  ));
};
