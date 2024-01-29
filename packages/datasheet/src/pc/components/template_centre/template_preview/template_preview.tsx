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

import { useRequest } from 'ahooks';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { ConfigConstant, IReduxState, IUserInfo, Navigation } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { CommonSide } from 'pc/components/common_side';
import { MobileBar } from 'pc/components/mobile_bar';
import { Router } from 'pc/components/route_manager/router';
import { useUserRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { isRenderServer } from 'pc/utils';
import { TemplateCategoryDetail } from '../template_category_detail';
import { TemplateChoice } from '../template_choice';
import { UsingTemplateModal } from '../using_template_modal';
// @ts-ignore
import { LoginModal } from 'enterprise/home/login_modal/login_modal';
import styles from './style.module.less';

export const TemplatePreview: FC<React.PropsWithChildren<unknown>> = () => {
  // Template ID to use
  const [usingTemplate, setUsingTemplate] = useState('');
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const userInfo = useAppSelector((state: IReduxState) => state.user.info);
  const spaceId = useAppSelector((state: IReduxState) => state.space.activeId);
  const { categoryId, templateId } = useAppSelector((state: IReduxState) => state.pageParams);
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest<IUserInfo | undefined, any[]>(getLoginStatusReq, { manual: true });

  // Is the current display the official template or the space site template
  const isOfficial = categoryId === 'tpcprivate';

  const templateCategory = useAppSelector((state: IReduxState) => state.templateCentre.category);
  useEffect(() => {
    if (usingTemplate && !spaceId && !userInfo) {
      Router.redirect(Navigation.LOGIN);
      return;
    }
    // Current user is logged in
    if (userInfo && userInfo.spaceId && usingTemplate && !spaceId) {
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId: usingTemplate, spaceId: userInfo!.spaceId } });
      return;
    }
    // eslint-disable-next-line
  }, [usingTemplate]);

  const afterLogin = async (data: string, loginMode: ConfigConstant.LoginMode) => {
    if (data) {
      if (loginMode === ConfigConstant.LoginMode.PHONE) {
        Router.push(Navigation.INVITATION_VALIDATION, { query: { token: data, reference: window.location.href } });
      } else if (loginMode === ConfigConstant.LoginMode.MAIL) {
        Router.push(Navigation.IMPROVING_INFO, { query: { token: data, reference: window.location.href } });
      }
    } else {
      const userInfo = (await getLoginStatus()) as any as IUserInfo;
      if (!userInfo) {
        return;
      }
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId: usingTemplate, spaceId: userInfo!.spaceId } });
    }
  };

  const MainComponent = (): React.ReactElement => (
    <>
      <div className={styles.templateList}>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileBar />
        </ComponentDisplay>
        {(categoryId === ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID && !templateId) || !categoryId ? (
          <TemplateChoice setUsingTemplate={setUsingTemplate} />
        ) : (
          <TemplateCategoryDetail isOfficial={isOfficial} templateCategory={templateCategory || []} setUsingTemplate={setUsingTemplate} />
        )}
      </div>
      {usingTemplate && userInfo && spaceId && <UsingTemplateModal templateId={usingTemplate!} onCancel={setUsingTemplate} />}
      {openLoginModal && LoginModal && <LoginModal onCancel={() => setOpenLoginModal(false)} afterLogin={afterLogin} />}
    </>
  );

  return (
    <div className={styles.templatePreview}>
      {
        /**
         * note: Here is prepared for SSR, that is, to facilitate the return of html template data for easy crawling,
         * the following content wrapped by ComponentDisplay, due to the need to determine the browser size.
         * It will not run on the server side.
         * The content rendered here will not be rendered on the page, so don't worry.
         */
        isRenderServer() && (
          <div style={{ display: 'none' }}>
            <CommonSide />
            {MainComponent()}
          </div>
        )
      }

      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <CommonSide />
        {MainComponent()}
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>{MainComponent()}</ComponentDisplay>
    </div>
  );
};
