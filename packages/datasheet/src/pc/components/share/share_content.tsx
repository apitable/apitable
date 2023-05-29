import { findNode } from '@apitable/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { INodeTree } from './interface';
import dynamic from 'next/dynamic';

const MirrorRoute = dynamic(() => import('../mirror/mirror_route').then(module => module.MirrorRoute));
const DataSheetPane = dynamic(() => import('../datasheet_pane').then(module => module.DataSheetPane));
const FormPanel = dynamic(() => import('../form_panel').then(module => module.FormPanel));
const DashboardPanel = dynamic(() => import('../dashboard_panel').then(module => module.DashboardPanel));
const FolderShowcase = dynamic(() => import('../folder_showcase').then(module => module.FolderShowcase));

interface IShareContentProps {
  loading: boolean
  nodeTree?: INodeTree;
}

export const ShareContent: React.FC<IShareContentProps> = (props) => {
  const { nodeTree, loading } = props;
  const { datasheetId, folderId, formId, dashboardId, mirrorId } = useSelector(state => state.pageParams);
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);

  if (!nodeTree) {
    return null;
  }

  if (mirrorId) {
    return <MirrorRoute />;
  } else if (datasheetId) {
    return <DataSheetPane />;
  } else if (formId) {
    return <FormPanel loading={loading} />;
  } else if (dashboardId) {
    return <DashboardPanel />;
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
