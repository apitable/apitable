import { Button } from '@vikadata/components';
import { integrateCdnHost, Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { ServiceQrCode } from 'pc/common/guide/ui/qr_code';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileBar } from 'pc/components/mobile_bar';
import { FC } from 'react';
import ServerErrorPng from 'static/icon/common/common_img_500.png';
import styles from './style.module.less';

export const ServerError: FC = () => {
  const refresh = () => {
    window.location.reload();
  };

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
            </div>
          </div>
        </div>
      </ComponentDisplay>

      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.serverError}>
          <div className={styles.container}>
            <div className={styles.imgContent}>
              <Image src={integrateCdnHost(t(Strings.server_error_page_bg))} alt="server error" layout={'fill'} />
              <div className={styles.qrcode}>
                <ServiceQrCode />
              </div>
            </div>
            <div className={styles.tip}>{t(Strings.server_error_tip)}</div>
            <div className={styles.button}>
              <Button color="primary" size="middle" block onClick={refresh}>
                {t(Strings.refresh)}
              </Button>
            </div>
          </div>
        </div>
      </ComponentDisplay>
    </div>
  );
};
