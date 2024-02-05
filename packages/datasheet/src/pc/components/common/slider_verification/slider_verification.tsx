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

import { useMount } from 'ahooks';
import { FC } from 'react';
import { Modal, Typography, colorVars } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import styles from './style.module.less';

export const SliderVerification: FC<React.PropsWithChildren<any>> = () => {
  useMount(() => {
    const env = getEnvVariables();
    if (!env.IS_SELFHOST) {
      window['nvc']?.getNC({
        renderTo: ConfigConstant.CaptchaIds.DEFAULT,
        upLang: {
          cn: {
            SLIDE: t(Strings.slider_verification_tips),
          },
        },
      });
    }
  });

  return <div id="nc" />;
};

export const openSliderVerificationModal = () => {
  Modal.confirm({
    className: styles.sliderVerificationModal,
    icon: '',
    title: t(Strings.safety_verification),
    content: (
      <div className={'vk-pb-6'}>
        <Typography variant="body2" color={colorVars.fc1} className={styles.tip}>
          {t(Strings.safety_verification_tip)}
        </Typography>
        <SliderVerification />
      </div>
    ),
    width: 388,
    cancelButtonProps: { style: { display: 'none' } },
    okButtonProps: { style: { display: 'none' } },
    closable: true,
    footer: null,
  });
};
