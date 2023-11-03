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
import { MirrorRoute } from 'pc/components/mirror/mirror_route';
import { DashboardPanel } from '../dashboard_panel';
import { DataSheetPane } from '../datasheet_pane';
import { FolderShowcase } from '../folder_showcase';
import { FormPanel } from '../form_panel';
import { NoPermission } from '../no_permission';
import { Welcome } from '../workspace/welcome';
// @ts-ignore
import { ChatPage } from 'enterprise';
import {AutomationPanelWrapper} from "pc/components/automation/modal/automation_panel_wrapper";

import {useAppSelector} from "pc/store/react-redux";

const WorkspaceRoute: FC<React.PropsWithChildren<unknown>> = () => {
  const nodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const activeNodeError = useAppSelector((state) => state.catalogTree.activeNodeError);
  const { datasheetId, folderId, automationId, formId, dashboardId, mirrorId, aiId } = useAppSelector((state: IReduxState) => state.pageParams);
  const treeNodesMap = useAppSelector((state: IReduxState) => state.catalogTree.treeNodesMap);

  useMount(() => {
    Player.doTrigger(Events.questionnaire_shown_after_sign);
    Player.doTrigger(Events.questionnaire_shown);
  });

  const getChildList = (folderId: string) => {
    const parentNode = treeNodesMap[folderId];
    let childNodes: any[] = [];
    if (parentNode && treeNodesMap[parentNode.nodeId].hasChildren && parentNode.children.length) {
      childNodes = parentNode.children.map((nodeId) => treeNodesMap[nodeId]);
    }
    return childNodes;
  };

  const MainComponent = (): React.ReactElement => {
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
            name: treeNodesMap[nodeId!] ? treeNodesMap[nodeId!].nodeName : '',
            icon: treeNodesMap[nodeId!] ? treeNodesMap[nodeId!].icon : '',
            role: treeNodesMap[nodeId!] ? treeNodesMap[nodeId!].role : '',
            nodeFavorite: treeNodesMap[nodeId!] && treeNodesMap[nodeId!].nodeFavorite,
            permissions: treeNodesMap[nodeId!] && treeNodesMap[nodeId!].permissions,
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
