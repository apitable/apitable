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
import { Drawer } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { findNode, Selectors, Strings, t } from '@apitable/core';
import { AutomationPanel } from 'pc/components/automation';
import { CustomPage } from 'pc/components/custom_page/custom_page';
import { DashboardPanel } from 'pc/components/dashboard_panel';
import { DataSheetPane } from 'pc/components/datasheet_pane';
import { FolderShowcase } from 'pc/components/folder_showcase';
import { FormPanel } from 'pc/components/form_panel';
import { MirrorRoute } from 'pc/components/mirror/mirror_route';
import { ViewListBox } from 'pc/components/mobile_bar/view_list_box';
import { useSideBarVisible } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import IconWechatGuide from 'static/icon/common/common_tip_guide.png';
import { RenderModal } from '../../tab_bar/description_modal/description_modal';
import { ApplicationJoinSpaceAlert } from '../application_join_space_alert';
import { IShareMenu } from '../share_menu';
import { ShareMenu } from '../share_menu/share_menu';
import styles from './style.module.less';

// @ts-ignore
const AIPanel = dynamic(() => import('enterprise/chat/chat_page').then((module) => module.ChatPage));

export interface IShareMobileProps extends IShareMenu {
  applicationJoinAlertVisible: boolean;
}

export const ShareMobile: React.FC<React.PropsWithChildren<IShareMobileProps>> = (props) => {
  const { shareId, datasheetId, folderId, formId, dashboardId, mirrorId, automationId, aiId, customPageId } = useAppSelector(
    (state) => state.pageParams,
  );
  const [viewListStatus, setViewListStatus] = useState(false);
  const [shareGuideStatus, setShareGuideStatus] = useState(false);
  const [descModalStatus, setDescModal] = useState(false);
  const datasheetName = useAppSelector((state) => {
    const treeNodesMap = state.catalogTree.treeNodesMap;
    const datasheet = Selectors.getDatasheet(state);
    if (shareId) {
      return datasheet ? datasheet.name : null;
    }
    if (datasheetId && treeNodesMap[datasheetId]) {
      return treeNodesMap[datasheetId].nodeName;
    }
    if (datasheet && datasheet.name) {
      return datasheet.name;
    }
    return null;
  });
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();

  useEffect(() => {
    setSideBarVisible(false);
  }, [datasheetId, setSideBarVisible]);

  const getComponent = () => {
    const { shareNode } = props;
    if (!shareNode) {
      return;
    }
    if (automationId) {
      return <AutomationPanel resourceId={automationId} />;
    } else if (mirrorId) {
      return <MirrorRoute />;
    } else if (datasheetId) {
      return <DataSheetPane />;
    } else if (formId) {
      return <FormPanel loading={props.loading} />;
    } else if (dashboardId) {
      return <DashboardPanel />;
    } else if (customPageId) {
      return <CustomPage />;
    } else if (aiId) {
      return <AIPanel />;
    } else if (folderId) {
      const parentNode = findNode([shareNode], folderId);
      const childNodes = (parentNode && parentNode.children) ?? [];
      return (
        <FolderShowcase
          nodeInfo={{
            name: shareNode.nodeName,
            id: shareNode.nodeId,
            icon: shareNode.icon,
          }}
          childNodes={childNodes}
          readOnly
        />
      );
    }
    return null;
  };

  function renderSide() {
    return (
      <Drawer
        width={'80%'}
        visible={sideBarVisible}
        onClose={() => {
          setSideBarVisible(false);
        }}
        placement="left"
        closable={false}
        className={styles.mobileShareDrawer}
        push={{ distance: -800 }}
      >
        <div className={styles.side}>
          {/* <span className={styles.shareButton} onClick={showShareGuide}>
           {t(Strings.share)}
           </span> */}
          {/* <span className={styles.shareReport}>
           <IconFeed width={24} height={24} fill={colors.secondLevelText} />
           </span> */}
          <ShareMenu {...props} />
        </div>
      </Drawer>
    );
  }

  return (
    <div className={styles.mobile}>
      {getComponent()}
      {!aiId && renderSide()}
      {props.applicationJoinAlertVisible && (
        <ApplicationJoinSpaceAlert
          spaceId={props.shareSpace.spaceId}
          spaceName={props.shareSpace.spaceName}
          defaultVisible={props.shareSpace.allowApply}
        />
      )}
      <ViewListBox
        displayState={viewListStatus}
        hideViewList={() => {
          setViewListStatus(false);
        }}
      />
      {shareGuideStatus && (
        <div className={styles.wechatShareGuide} onClick={() => setShareGuideStatus(false)}>
          <div className={styles.box}>
            <Image alt="" src={IconWechatGuide} width={41} height={78} style={{ position: 'absolute', top: -90, right: 0 }} />
            <span className={styles.tip}>{t(Strings.click_top_right_to_share)}</span>
          </div>
        </div>
      )}
      {descModalStatus && datasheetId && (
        <RenderModal
          visible={descModalStatus}
          onClose={() => setDescModal(false)}
          activeNodeId={datasheetId}
          datasheetName={datasheetName ? datasheetName : 'null'}
          modalStyle={{ top: 60 }}
          isMobile
        />
      )}
    </div>
  );
};
