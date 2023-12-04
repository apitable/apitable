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

import { useUnmount, useUpdateEffect } from 'ahooks';
import Image from 'next/image';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button, ThemeName } from '@apitable/components';
import { Api, IReduxState, integrateCdnHost, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { Router } from 'pc/components/route_manager/router';
import { useSideBarVisible } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import NoPermissionPng from 'static/icon/common/common_img_noaccess.png';
import restrictedAccessDark from 'static/icon/datasheet/restricted_access_dark.png';
import restrictedAccessLight from 'static/icon/datasheet/restricted_access_light.png';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { MobileBar } from '../mobile_bar';
import styles from './style.module.less';

export const NoPermission: FC<React.PropsWithChildren<{ desc?: string }>> = ({ desc }) => {
  const pageParams = useAppSelector((state: IReduxState) => state.pageParams);
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
  const env = getEnvVariables();
  const qrcodeVisible = !(env.IS_SELFHOST || env.IS_APITABLE);

  const themeName = useAppSelector((state) => state.theme);
  const RestrictedAccess = themeName === ThemeName.Light ? restrictedAccessLight : restrictedAccessDark;

  return (
    <div className={styles.pageWrapper}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.noPermissionWrapper}>
          <div className={styles.content}>
            <div className={styles.imgContent}>
              {qrcodeVisible ? (
                <>
                  <Image src={integrateCdnHost(t(Strings.no_permission_img_url))} width={340} height={190} alt="" />
                  <div className={styles.imgContentQRcode}>
                    {/*<ServiceQrCode />*/}
                  </div>
                </>
              ) : (
                <Image src={RestrictedAccess} width={200} height={150} alt="" />
              )}
            </div>
            <h6>{t(Strings.no_file_permission)}</h6>
            <div className={styles.tidiv}>{desc || t(Strings.no_file_permission_content)}</div>
            {qrcodeVisible ? (
              <div className={styles.helpText}>{t(Strings.qrcode_help)}</div>
            ) : (
              <div className={styles.helpText}>
                <a href={env.HELP_MENU_USER_COMMUNITY_URL} target="_blank" rel="noreferrer">
                  {t(Strings.join_discord_community)}
                </a>
              </div>
            )}
            {!pageParams.embedId && (
              <div className={styles.backButton}>
                <Button color="primary" size="middle" block onClick={returnHome}>
                  {t(Strings.back_workbench)}
                </Button>
              </div>
            )}
          </div>
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileBar />
        <div className={styles.noPermissionWrapper}>
          <div className={styles.content}>
            {qrcodeVisible ? (
              <Image src={NoPermissionPng} alt={t(Strings.no_permission)} />
            ) : (
              <Image src={RestrictedAccess} width={200} height={150} alt="" />
            )}

            <div className={styles.tidiv}>{t(Strings.not_found_this_file)}</div>
            {!pageParams.embedId && (
              <div className={styles.btnWrap}>
                <Button color="primary" onClick={() => setSideBarVisible(true)}>
                  {t(Strings.open_workbench)}
                </Button>
              </div>
            )}
          </div>
        </div>
      </ComponentDisplay>
    </div>
  );
};
