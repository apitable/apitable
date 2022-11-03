import { Button } from '@vikadata/components';
import { Api, integrateCdnHost, IReduxState, Navigation, StoreActions, Strings, t, Settings } from '@apitable/core';
import { useUnmount, useUpdateEffect } from 'ahooks';
import Image from 'next/image';
import { ServiceQrCode } from 'modules/enterprise/guide/ui/qr_code';
import { Router } from 'pc/components/route_manager/router';
import { useSideBarVisible } from 'pc/hooks';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NoPermissionPng from 'static/icon/common/common_img_noaccess.png';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { MobileBar } from '../mobile_bar';
import styles from './style.module.less';
import { isHiddenQRCode } from 'pc/utils/env';

export const NoPermission: FC<{ desc?: string }> = ({ desc }) => {
  const pageParams = useSelector((state: IReduxState) => state.pageParams);
  const dispatch = useDispatch();
  const { setSideBarVisible } = useSideBarVisible();

  useUpdateEffect(() => {
    dispatch(StoreActions.updateIsPermission(true));
  }, [pageParams, dispatch]);

  useUnmount(() => {
    dispatch(StoreActions.updateIsPermission(true));
  });
  const returnHome = () => {
    Api.keepTabbar({});
    Router.redirect(Navigation.HOME);
  };

  return (
    <div className={styles.pageWrapper}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.noPermissionWrapper}>
          <div className={styles.content}>
            <div className={styles.imgContent}>
              {
                isHiddenQRCode() ?
                  <Image src={integrateCdnHost(Settings.no_permission_img_url.value)} width={230} height={200} />
                  :
                  <>
                    <Image src={integrateCdnHost(t(Strings.no_permission_img_url))} width={340} height={190} />
                    <div className={styles.imgContentQRcode}>
                      <ServiceQrCode />
                    </div>
                  </>
              }
              
            </div>
            <h6>{t(Strings.no_file_permission)}</h6>
            <div className={styles.tidiv}>{desc || t(Strings.no_file_permission_content)}</div>
            <div className={styles.helpText}>{t(Strings.qrcode_help)}</div>
            <div className={styles.backButton}>
              <Button color='primary' size='middle' block onClick={returnHome}>
                {t(Strings.back_workbench)}
              </Button>
            </div>
          </div>
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileBar />
        <div className={styles.noPermissionWrapper}>
          <div className={styles.content}>
            {
              isHiddenQRCode() ?
                <Image src={integrateCdnHost(Settings.no_permission_img_url.value)} width={230} height={200} />
                :
                <Image src={NoPermissionPng} alt={t(Strings.no_permission)} />
            }
            
            <div className={styles.tidiv}>{t(Strings.not_found_this_file)}</div>
            <div className={styles.tidiv}>{t(Strings.please_contact_admin_if_you_have_any_problem)}</div>
            <div className={styles.btnWrap}>
              <Button color='primary' onClick={() => setSideBarVisible(true)}>
                {t(Strings.open_workbench)}
              </Button>
            </div>
          </div>
        </div>
      </ComponentDisplay>
    </div>
  );
};
