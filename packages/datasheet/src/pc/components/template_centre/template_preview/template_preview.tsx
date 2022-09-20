import { ConfigConstant, IReduxState, IUserInfo, Navigation } from '@vikadata/core';
import { useRequest } from 'ahooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { CommonSide } from 'pc/components/common_side';
import { LoginModal } from 'pc/components/home/login_modal';
import { MobileBar } from 'pc/components/mobile_bar';
import { Router } from 'pc/components/route_manager/router';
import { useUserRequest } from 'pc/hooks';
import { isRenderServer } from 'pc/utils';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TemplateCategoryDetail } from '../template_category_detail';
import { TemplateChoice } from '../template_choice';
import { UsingTemplateModal } from '../using_template_modal';
import styles from './style.module.less';

export const TemplatePreview: FC = () => {
  // 要使用的模板ID
  const [usingTemplate, setUsingTemplate] = useState('');
  // 打开登录模态框
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const userInfo = useSelector((state: IReduxState) => state.user.info);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const categoryId = useSelector((state: IReduxState) => state.pageParams.categoryId);
  const { getLoginStatusReq } = useUserRequest();
  const { run: getLoginStatus } = useRequest<IUserInfo | undefined, any[]>(getLoginStatusReq, { manual: true });

  // 当前显示是的官方模板还是空间站模板
  const isOfficial = categoryId === 'tpcprivate';

  const templateCategory = useSelector((state: IReduxState) => state.templateCentre.category);
  useEffect(() => {
    if (usingTemplate && !spaceId && !userInfo) {
      setOpenLoginModal(true);
      return;
    }
    // 当前用户已登录时
    if (userInfo && userInfo.spaceId && usingTemplate && !spaceId) {
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId: usingTemplate, spaceId: userInfo!.spaceId }});
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingTemplate]);

  const afterLogin = async(data: string, loginMode: ConfigConstant.LoginMode) => {
    if (data) {
      if (loginMode === ConfigConstant.LoginMode.PHONE) {
        Router.push(Navigation.INVITATION_VALIDATION, { query: { token: data, reference: window.location.href }});
      } else if (loginMode === ConfigConstant.LoginMode.MAIL) {
        Router.push(Navigation.IMPROVING_INFO, { query: { token: data, reference: window.location.href }});
      }
    } else {
      const userInfo = ((await getLoginStatus()) as any) as IUserInfo;
      if (!userInfo) {
        return;
      }
      Router.push(Navigation.TEMPLATE, { params: { categoryId, templateId: usingTemplate, spaceId: userInfo!.spaceId }});
    }
  };

  const MainComponent = (): React.ReactElement => (
    <>
      <div className={styles.templateList}>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileBar />
        </ComponentDisplay>
        {categoryId === ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID || !categoryId ? (
          <TemplateChoice setUsingTemplate={setUsingTemplate} />
        ) : (
          <TemplateCategoryDetail isOfficial={isOfficial} templateCategory={templateCategory || []} setUsingTemplate={setUsingTemplate} />
        )}
      </div>
      {usingTemplate && userInfo && spaceId && <UsingTemplateModal templateId={usingTemplate!} onCancel={setUsingTemplate} />}
      {openLoginModal && <LoginModal onCancel={() => setOpenLoginModal(false)} afterLogin={afterLogin} />}
    </>
  );

  return (
    <div className={styles.templatePreview}>
      {/**
       * note: 这里是给 SSR 准备的，也就是方便返回 html 模板数据方便抓取，下面被 ComponentDisplay 包裹的内容，由于需要判断浏览器尺寸，
       * 在 server 端是不会运行的
       * 这里渲染的内容在页面上不会渲染出来，所以不用担心
       */
        isRenderServer() && (
          <div style={{ display: 'none' }}>
            <CommonSide />
            {MainComponent()}
          </div>
        )}

      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <CommonSide />
        {MainComponent()}
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>{MainComponent()}</ComponentDisplay>
    </div>
  );
};
