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

import Image from 'next/image';
import { FC } from 'react';
import { Button } from '@apitable/components';
import { Strings, t } from '@apitable/core';
// @ts-ignore
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileBar } from 'pc/components/mobile_bar';
import { useContactUs } from 'pc/hooks/use_contact_us';
import ServerErrorPng from 'static/icon/common/common_img_500.png';
import styles from './style.module.less';

export const ServerError: FC<React.PropsWithChildren<unknown>> = () => {
  const refresh = () => {
    window.location.reload();
  };
  const contactUs = useContactUs();

  return (
    <div className={styles.serverPageWrapper}>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileBar />
        <div className={styles.serverError}>
          <div className={styles.container}>
            <Image src={ServerErrorPng} alt="server error" />
            <div className={styles.tip}>{t(Strings.server_error_tip)}</div>
            <div className={styles.button}>
              <Button color="primary" size="large" block onClick={refresh}>
                {t(Strings.refresh)}
              </Button>
              <Button variant="jelly" color="primary" block onClick={() => contactUs()}>
                {t(Strings.contact_us)}
              </Button>
            </div>
          </div>
        </div>
      </ComponentDisplay>

      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.serverError}>
          <div className={styles.container}>
            <div className={styles.imgContent}>
              <Image src={ServerErrorPng} alt="server error" width={300} height={230} />
            </div>
            <div className={styles.tip}>{t(Strings.server_error_tip)}</div>
            <div className={styles.button}>
              <Button color="primary" size="middle" block onClick={refresh}>
                {t(Strings.refresh)}
              </Button>
              <Button variant="jelly" color="primary" block onClick={() => contactUs()}>
                {t(Strings.contact_us)}
              </Button>
            </div>
          </div>
        </div>
      </ComponentDisplay>
    </div>
  );
};
