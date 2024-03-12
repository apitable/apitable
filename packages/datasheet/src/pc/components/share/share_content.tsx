import dynamic from 'next/dynamic';
import React from 'react';
import { findNode } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { AutomationPanelContent } from '../automation/content';
import { AutomationPanel } from '../automation/panel';
import { CustomPage } from '../custom_page/custom_page';
import { INodeTree } from './interface';

const MirrorRoute = dynamic(() => import('../mirror/mirror_route').then((module) => module.MirrorRoute));
const DataSheetPane = dynamic(() => import('../datasheet_pane').then((module) => module.DataSheetPane));
const FormPanel = dynamic(() => import('../form_panel').then((module) => module.FormPanel));
const DashboardPanel = dynamic(() => import('../dashboard_panel').then((module) => module.DashboardPanel));
const FolderShowcase = dynamic(() => import('../folder_showcase').then((module) => module.FolderShowcase));
// @ts-ignore
const AIPanel = dynamic(() => import('enterprise/chat/chat_page').then((module) => module.ChatPage));

interface IShareContentProps {
  loading: boolean;
  nodeTree?: INodeTree;
}

export const ShareContent: React.FC<IShareContentProps> = (props) => {
  const { nodeTree, loading } = props;
  const { datasheetId, folderId, formId, automationId, dashboardId, mirrorId, aiId, customPageId } = useAppSelector((state) => state.pageParams);
  const treeNodesMap = useAppSelector((state) => state.catalogTree.treeNodesMap);

  if (!nodeTree) {
    return null;
  }
  if (automationId) {
    return <AutomationPanel resourceId={automationId} />;
  } else if (mirrorId) {
    return <MirrorRoute />;
  } else if (datasheetId) {
    return <DataSheetPane />;
  } else if (formId) {
    return <FormPanel loading={loading} />;
  } else if (dashboardId) {
    return <DashboardPanel />;
  } else if (aiId) {
    return <AIPanel />;
  } else if (customPageId) {
    return <CustomPage />;
  } else if (folderId) {
    const parentNode = findNode([nodeTree], folderId);
    const childNodes = (parentNode && parentNode.children) ?? [];
    return (
      <FolderShowcase
        nodeInfo={{
          name: treeNodesMap[folderId]?.nodeName || '',
          id: folderId,
          icon: treeNodesMap[folderId]?.icon || '',
        }}
        childNodes={childNodes}
        readOnly
      />
    );
  }
  return null;
};
