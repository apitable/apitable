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

import { ThemeName } from '@apitable/components';
import { IShareInfo, Navigation, StoreActions, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import Head from 'next/head';
import { Message } from 'pc/components/common/message';
import { Tooltip } from 'pc/components/common/tooltip';
import { Router } from 'pc/components/route_manager/router';
import { getPageParams, usePageParams, useSideBarVisible } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { getEnvVariables, isIframe } from 'pc/utils/env';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { FormPanel } from '../form_panel';
import { ShareMenu } from '../share/share_menu';
import { IShareSpaceInfo } from './interface';
import { ShareFail } from './share_fail';
import { ShareMobile } from './share_mobile/share_mobile';
import styles from './style.module.less';
// @ts-ignore
import { isEnterprise } from 'enterprise';
import apitableLogoDark from 'static/icon/datasheet/APITable_brand_dark.png';
import apitableLogoLight from 'static/icon/datasheet/APITable_brand_light.png';
import vikaLogoDark from 'static/icon/datasheet/vika_logo_brand_dark.png';
import vikaLogoLight from 'static/icon/datasheet/vika_logo_brand_light.png';
import Image from 'next/image';
import { Collapse2OpenOutlined, Collapse2Outlined } from '@apitable/icons';
import { useRouter } from 'next/router';
import { ShareContent } from './share_content';
import { ShareContentWrapper } from './share_content_wrapper';
import { useMountShare } from './use_mount_share';

const _SplitPane: any = SplitPane;

export const ShareContext = React.createContext({} as { shareInfo: IShareSpaceInfo });

interface IShareProps {
  shareInfo: Required<IShareInfo> | undefined;
}

const Share: React.FC<React.PropsWithChildren<IShareProps>> = ({ shareInfo }) => {
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const { shareId, nodeId, formId } = useSelector(state => state.pageParams);
  const userInfo = useSelector(state => state.user.info);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const themeName = useSelector(state => state.theme);
  const {
    nodeTree,
    shareSpace,
    shareClose,
    spaceList,
    spaceListLoading,
    loading,
    getSpaceList,
    getLoginStatus,
  } = useMountShare(shareInfo);

  usePageParams();

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sideBarVisible]);

  const configRouter = () => {
    if (!shareInfo) {
      return;
    }

    const {
      nodeId, viewId, recordId, widgetId
    } = getPageParams(router.asPath);

    setTimeout(() => {
      Router.push(Navigation.SHARE_SPACE, {
        params: {
          shareId: shareInfo.shareId,
          nodeId: nodeId || shareInfo.shareNodeTree.nodeId,
          viewId,
          recordId,
          widgetId
        },
      });
    }, 0);
  };

  useEffect(() => {
    configRouter();
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
                  spaceId: shareSpace ? shareSpace.spaceId : ''
                }
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
  const applicationJoinAlertVisible = (
    allowApply &&
    !loading &&
    !spaceListLoading &&
    (!realSpaceId || (spaceList.every(({ spaceId }: { spaceId: string }) => spaceId !== shareSpaceId))) &&
    !isIframe()
  );

  const singleFormShare = formId && nodeTree?.nodeId === formId;

  const isIframeShowShareMenu = nodeTree?.children?.length === 0 && isIframe();
  const { IS_APITABLE } = getEnvVariables();
  const LightLogo = IS_APITABLE ? apitableLogoLight : vikaLogoLight;
  const DarkLogo = IS_APITABLE ? apitableLogoDark : vikaLogoDark;
  const localSize = localStorage.getItem('splitPos');
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

  const shareContent = <ShareContentWrapper
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
  </ShareContentWrapper>;

  return (
    <ShareContext.Provider value={{ shareInfo: shareSpace }}>
      <Head>
        <meta property='og:title' content={shareInfo?.shareNodeTree?.nodeName || t(Strings.og_site_name_content)} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:site_name' content={t(Strings.og_site_name_content)} />
        <meta property='og:description' content={t(Strings.og_product_description_content)} />
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
              split='vertical'
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
                  <ShareMenu shareSpace={shareSpace} shareNode={nodeTree} visible={visible} setVisible={setVisible}
                    loading={loading} />
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
          ) : shareContent
          }
        </ComponentDisplay>
        {isIframe() && !formId && <div className={styles.brandContainer}>
          <Image src={themeName === ThemeName.Light ? LightLogo : DarkLogo} width={IS_APITABLE ? 111 : 75} height={20}
            alt="" />
        </div>}
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
