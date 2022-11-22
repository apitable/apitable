import { Button } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
// @ts-ignore
import { ServiceQrCode } from 'enterprise';
import Image from 'next/image';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileBar } from 'pc/components/mobile_bar';
import { getEnvVariables, isHiddenQRCode } from 'pc/utils/env';
import { FC } from 'react';
import ServerErrorPng from 'static/icon/common/common_img_500.png';
import styles from './style.module.less';

export const ServerError: FC = () => {
  const refresh = () => {
    window.location.reload();
  };

  console.log('Settings.server_error_page_bg.value', getEnvVariables().SYSTEM_CONFIGURATION_SERVER_ERROR_BG_IMG);
  return (
    <div className={styles.serverPageWrapper}>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileBar />
        <div className={styles.serverError}>
          <div className={styles.container}>
            {isHiddenQRCode() ?
              <Image src={integrateCdnHost(getEnvVariables().SYSTEM_CONFIGURATION_SERVER_ERROR_BG_IMG!)} alt='server error' width={230} height={230} />
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
                <Image src={integrateCdnHost(getEnvVariables().SYSTEM_CONFIGURATION_SERVER_ERROR_BG_IMG!)} alt='server error' width={230} height={230} />
                :
                <>
                  <Image src={integrateCdnHost(getEnvVariables().SYSTEM_CONFIGURATION_SERVER_ERROR_BG_IMG!)} alt='server error' width={468}
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
