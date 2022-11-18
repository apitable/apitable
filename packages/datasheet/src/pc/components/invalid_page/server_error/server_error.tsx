import { Button } from '@apitable/components';
import { integrateCdnHost, Strings, t, Settings } from '@apitable/core';
import Image from 'next/image';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileBar } from 'pc/components/mobile_bar';
import { FC } from 'react';
import ServerErrorPng from 'static/icon/common/common_img_500.png';
import styles from './style.module.less';
import { isHiddenQRCode } from 'pc/utils/env';
// @ts-ignore
import { ServiceQrCode } from 'enterprise';

export const ServerError: FC = () => {
  const refresh = () => {
    window.location.reload();
  };

  console.log('Settings.server_error_page_bg.value', Settings.system_configuration_server_error_bg_img.value);
  return (
    <div className={styles.serverPageWrapper}>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileBar />
        <div className={styles.serverError}>
          <div className={styles.container}>
            {isHiddenQRCode() ?
              <Image src={integrateCdnHost(Settings.system_configuration_server_error_bg_img.value)} alt='server error' width={230} height={230} />
              :
              <Image src={ServerErrorPng} alt='server error' />
            }
            <div className={styles.tip}>{t(Strings.server_error_tip)}</div>
            <div className={styles.button}>
              <Button color='primary' size='large' block onClick={refresh}>
                {t(Strings.refresh)}
              </Button>
            </div>
          </div>
        </div>
      </ComponentDisplay>

      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.serverError}>
          <div className={styles.container}>
            <div className={styles.imgContent}>
              {isHiddenQRCode() ?
                <Image src={integrateCdnHost(Settings.system_configuration_server_error_bg_img.value)} alt='server error' width={230} height={230} />
                :
                <>
                  <Image src={integrateCdnHost(Settings.system_configuration_server_error_bg_img.value)} alt='server error' width={468}
                    height={362} />
                  <div className={styles.qrcode}>
                    <ServiceQrCode />
                  </div>
                </>
              }
            </div>
            <div className={styles.tip}>{t(Strings.server_error_tip)}</div>
            <div className={styles.button}>
              <Button color='primary' size='middle' block onClick={refresh}>
                {t(Strings.refresh)}
              </Button>
            </div>
          </div>
        </div>
      </ComponentDisplay>
    </div>
  );
};
