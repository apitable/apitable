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

import { useMount } from 'ahooks';
import * as React from 'react';
import { FC } from 'react';
import { Events, IReduxState, Player, Selectors } from '@apitable/core';
import { AutomationPanelWrapper } from 'pc/components/automation/modal/automation_panel_wrapper';
import { MirrorRoute } from 'pc/components/mirror/mirror_route';
import { useAppSelector } from 'pc/store/react-redux';
import { CustomPage } from '../custom_page/custom_page';
import { DashboardPanel } from '../dashboard_panel';
import { DataSheetPane } from '../datasheet_pane';
import { FolderShowcase } from '../folder_showcase';
import { FormPanel } from '../form_panel';
import { NoPermission } from '../no_permission';
import { Welcome } from '../workspace/welcome';
// @ts-ignore
import { ChatPage } from 'enterprise/chat/chat_page';

const WorkspaceRoute: FC<React.PropsWithChildren<unknown>> = () => {
  const nodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const activeNodePrivate = useAppSelector((state) =>
    state.catalogTree.treeNodesMap[nodeId]?.nodePrivate || state.catalogTree.privateTreeNodesMap[nodeId]?.nodePrivate
  );

  const activeNodeError = useAppSelector((state) => state.catalogTree.activeNodeError);
  const { datasheetId, folderId, automationId, formId, dashboardId, mirrorId, aiId, customPageId } = useAppSelector(
    (state: IReduxState) => state.pageParams,
  );
  const nodesMap = useAppSelector((state: IReduxState) => state.catalogTree[activeNodePrivate ? 'privateTreeNodesMap' : 'treeNodesMap']);

  useMount(() => {
    Player.doTrigger(Events.questionnaire_shown);
  });

  const getChildList = (folderId: string) => {
    const parentNode = nodesMap[folderId];
    let childNodes: any[] = [];
    if (parentNode && nodesMap[parentNode.nodeId].hasChildren && parentNode.children.length) {
      childNodes = parentNode.children.map((nodeId) => nodesMap[nodeId]);
    }
    return childNodes;
  };

  const MainComponent = (): React.ReactElement => {
    if (customPageId) {
      return <CustomPage key={customPageId} />;
    }
    if (automationId) {
      return <AutomationPanelWrapper automationId={automationId} />;
    }
    if (activeNodeError) {
      return <NoPermission />;
    }
    if (formId) {
      return <FormPanel />;
    }
    if (mirrorId) {
      return <MirrorRoute />;
    }
    if (datasheetId) {
      return <DataSheetPane />;
    }
    if (folderId) {
      return (
        <FolderShowcase
          nodeInfo={{
            id: nodeId!,
            name: nodesMap[nodeId!] ? nodesMap[nodeId!].nodeName : '',
            icon: nodesMap[nodeId!] ? nodesMap[nodeId!].icon : '',
            role: nodesMap[nodeId!] ? nodesMap[nodeId!].role : '',
            nodeFavorite: nodesMap[nodeId!] && nodesMap[nodeId!].nodeFavorite,
            permissions: nodesMap[nodeId!] && nodesMap[nodeId!].permissions,
          }}
          childNodes={getChildList(folderId)}
        />
      );
    }
    if (dashboardId) {
      return <DashboardPanel />;
    }

    if (aiId && ChatPage) {
      return <ChatPage />;
    }
    return <Welcome />;
  };

  return MainComponent();
};
export default WorkspaceRoute;
