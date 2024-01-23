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

import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import { ThemeName } from '@apitable/components';
import { integrateCdnHost, IShareInfo, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { Collapse2OpenOutlined, Collapse2Outlined } from '@apitable/icons';
import { Message } from 'pc/components/common/message';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common/tooltip';
import { Router } from 'pc/components/route_manager/router';
import { getPageParams, usePageParams, useSideBarVisible } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables, isIframe } from 'pc/utils/env';
import apitableLogoDark from 'static/icon/datasheet/APITable_brand_dark.png';
import apitableLogoLight from 'static/icon/datasheet/APITable_brand_light.png';
import vikaLogoDark from 'static/icon/datasheet/vika_logo_brand_dark.png';
import vikaLogoLight from 'static/icon/datasheet/vika_logo_brand_light.png';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { FormPanel } from '../form_panel'; // trace
import { ShareMenu } from '../share/share_menu';
import { IShareSpaceInfo } from './interface';
import { ShareContent } from './share_content';
import { ShareContentWrapper } from './share_content_wrapper';
import { ShareFail } from './share_fail';
import { ShareMobile } from './share_mobile/share_mobile';
import { useMountShare } from './use_mount_share';
import styles from './style.module.less';

const _SplitPane: any = SplitPane;

export const ShareContext = React.createContext({} as { shareInfo: IShareSpaceInfo });

interface IShareProps {
  shareInfo: Required<IShareInfo> | undefined;
}

const Share: React.FC<React.PropsWithChildren<IShareProps>> = ({ shareInfo }) => {
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const { shareId, nodeId, formId } = useAppSelector((state) => state.pageParams);
  const userInfo = useAppSelector((state) => state.user.info);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const themeName = useAppSelector((state) => state.theme);
  const { nodeTree, shareSpace, shareClose, spaceList, spaceListLoading, loading, getSpaceList, getLoginStatus } = useMountShare(shareInfo);

  usePageParams();

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sideBarVisible]);

  const configRouter = () => {
    if (!shareInfo) {
      return;
    }

    const { nodeId, viewId, recordId, widgetId } = getPageParams(router.asPath);

    if (nodeId?.startsWith('mir')) return;

    setTimeout(() => {
      /**
       * This redirect page should not be recorded in the browsing history.
       * @see https://github.com/vikadata/vikadata/issues/5795
       */
      Router.replace(Navigation.SHARE_SPACE, {
        params: {
          shareId: shareInfo.shareId,
          nodeId: nodeId || shareInfo.shareNodeTree.nodeId,
          viewId,
          recordId,
          widgetId,
        },
      });
    }, 0);
  };

  useEffect(() => {
    configRouter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  useEffect(() => {
    if (!shareSpace) {
      return;
    }

    if (!shareSpace.hasLogin) {
      dispatch(StoreActions.setLoading(false));
      return;
    }
    getLoginStatus({ spaceId: shareSpace.spaceId }, true);
    // eslint-disable-next-line
  }, [shareSpace]);

  useEffect(() => {
    if (shareSpace?.hasLogin) {
      getSpaceList();
    }
  }, [shareSpace?.hasLogin, getSpaceList]);

  if (shareClose) {
    return <ShareFail />;
  }

  const judgeAllowEdit = () => {
    if (shareSpace && (shareSpace.hasLogin || !shareSpace.allowEdit)) {
      return;
    }
    Message.destroy();
    Message.warning({
      content: (
        <>
          {t(Strings.share_edit_tip)}
          <i
            onClick={() => {
              Router.push(Navigation.LOGIN, {
                query: {
                  reference: window.location.href,
                  spaceId: shareSpace ? shareSpace.spaceId : '',
                },
              });
            }}
          >
            {t(Strings.login)}
          </i>
        </>
      ),
    });
  };

  const handleClick = () => {
    setSideBarVisible(!sideBarVisible);
  };

  if (!shareSpace) {
    dispatch(StoreActions.setLoading(false));
    return <></>;
  }

  const { spaceId: shareSpaceId, spaceName: shareSpaceName, allowApply } = shareSpace;
  const realSpaceId = userInfo?.spaceId;

  // Control the display of the application to join the space
  const applicationJoinAlertVisible =
    allowApply &&
    !loading &&
    !spaceListLoading &&
    (!realSpaceId || spaceList.every(({ spaceId }: { spaceId: string }) => spaceId !== shareSpaceId)) &&
    !isIframe();

  const singleFormShare = formId && nodeTree?.nodeId === formId;

  const isIframeShowShareMenu = nodeTree?.children?.length === 0 && isIframe();
  const { IS_APITABLE, IS_AITABLE, LONG_DARK_LOGO, LONG_LIGHT_LOGO } = getEnvVariables();
  const LightLogo = IS_AITABLE ? integrateCdnHost(LONG_LIGHT_LOGO!) : IS_APITABLE ? apitableLogoLight : vikaLogoLight;
  const DarkLogo = IS_AITABLE ? integrateCdnHost(LONG_DARK_LOGO!) : IS_APITABLE ? apitableLogoDark : vikaLogoDark;
  let localSize: string | null = null;
  try {
    localSize = localStorage.getItem('splitPos');
  } catch (e) {}
  const defaultSize = localSize ? parseInt(localSize, 10) : 320;
  const closeBtnClass = classNames({
    [styles.closeBtn]: true,
    [styles.isPanelClose]: !sideBarVisible,
  });

  const closeBtnStyles: React.CSSProperties = {};
  if (shareId) {
    closeBtnStyles.top = '26px';
    if (!sideBarVisible) {
      closeBtnStyles.left = '-8px';
    }
  }

  const shareContent = (
    <ShareContentWrapper
      isIframeShowShareMenu={isIframeShowShareMenu}
      shareId={shareId}
      sideBarVisible={sideBarVisible}
      judgeAllowEdit={judgeAllowEdit}
      shareSpaceId={shareSpaceId}
      applicationJoinAlertVisible={applicationJoinAlertVisible}
      shareSpace={shareSpace}
      shareSpaceName={shareSpaceName}
    >
      <ShareContent loading={loading} nodeTree={nodeTree} />
    </ShareContentWrapper>
  );
  return (
    <ShareContext.Provider value={{ shareInfo: shareSpace }}>
      <Head>
        <meta property="og:title" content={shareInfo?.shareNodeTree?.nodeName || t(Strings.og_site_name_content)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content={t(Strings.og_site_name_content)} />
        <meta property="og:description" content={t(Strings.og_product_description_content)} />
      </Head>
      <div
        className={classNames(styles.share, {
          [styles.hiddenCatalog]: !sideBarVisible,
          [styles.formShare]: formId && nodeTree?.nodeId !== formId, // The form is shared through a folder
          [styles.iframeShare]: !isIframe(),
          [styles.iframeShareContainer]: isIframe(),
        })}
      >
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          {singleFormShare ? (
            <FormPanel loading={loading} />
          ) : !isIframeShowShareMenu ? (
            <_SplitPane
              split="vertical"
              minSize={320}
              defaultSize={defaultSize}
              maxSize={640}
              style={{ overflow: 'none' }}
              size={sideBarVisible ? defaultSize : 0}
              allowResize={sideBarVisible}
              onChange={() => {
                window.dispatchEvent(new Event('resize'));
              }}
              pane2Style={{ overflow: 'hidden' }}
              resizerStyle={{ backgroundColor: 'transparent', minWidth: 'auto' }}
            >
              <div className={styles.splitLeft}>
                {sideBarVisible && (
                  <ShareMenu shareSpace={shareSpace} shareNode={nodeTree} visible={visible} setVisible={setVisible} loading={loading} />
                )}
                <Tooltip
                  title={!sideBarVisible ? t(Strings.expand_pane) : t(Strings.hide_pane)}
                  placement={!sideBarVisible ? 'right' : 'bottom'}
                  offset={[0, 0]}
                >
                  <div className={closeBtnClass} style={closeBtnStyles} onClick={handleClick}>
                    {!sideBarVisible ? <Collapse2OpenOutlined size={16} /> : <Collapse2Outlined size={16} />}
                  </div>
                </Tooltip>
              </div>
              {shareContent}
            </_SplitPane>
          ) : (
            shareContent
          )}
        </ComponentDisplay>
        {isIframe() && !formId && (
          <div className={styles.brandContainer}>
            <Image
              src={themeName === ThemeName.Light ? LightLogo : DarkLogo}
              width={IS_AITABLE ? 132 : IS_APITABLE ? 111 : 75}
              height={IS_AITABLE ? 29 : 20}
              alt=""
            />
          </div>
        )}
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <ShareMobile
            shareSpace={shareSpace}
            shareNode={nodeTree}
            visible={visible}
            setVisible={setVisible}
            applicationJoinAlertVisible={applicationJoinAlertVisible}
            loading={loading}
          />
        </ComponentDisplay>
      </div>
    </ShareContext.Provider>
  );
};

export default Share;
