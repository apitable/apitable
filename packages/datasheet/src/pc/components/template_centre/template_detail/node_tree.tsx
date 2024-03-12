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

import { Tree } from 'antd';
import { FC, ReactText } from 'react';
import { ILightOrDarkThemeColors, useThemeColors } from '@apitable/components';
import { ConfigConstant, IReduxState, ITemplateTree, Navigation, Selectors } from '@apitable/core';
import { TriangleDownFilled } from '@apitable/icons';
import { getNodeIcon } from 'pc/components/catalog/tree/node_icon';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { INodeTree } from 'pc/components/share/interface';
import { useResponsive, useSideBarVisible } from 'pc/hooks';

import { useAppSelector } from 'pc/store/react-redux';

const { DirectoryTree, TreeNode } = Tree;

interface INodeTreeProps {
  nodeTree: ITemplateTree;
}

export const NodeTree: FC<React.PropsWithChildren<INodeTreeProps>> = (props) => {
  const colors = useThemeColors();
  const { nodeTree } = props;
  const nodeId = useAppSelector((state) => Selectors.getNodeId(state))!;
  const { templateId, categoryId } = useAppSelector((state: IReduxState) => state.pageParams);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const { setSideBarVisible } = useSideBarVisible();

  if (!nodeTree) {
    return <></>;
  }

  function onSelect(selectedKeys: ReactText[]) {
    const [dsId] = selectedKeys;
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        templateId,
        categoryId,
        nodeId: dsId as string,
      },
    });
    isMobile && setSideBarVisible(false);
  }

  const renderNode = (node: INodeTree[] | undefined, colors: ILightOrDarkThemeColors) => {
    if (!node || !node.length) {
      return <></>;
    }
    return node!.map((item) => {
      const icon = getNodeIcon(item.icon, item.type, { size: 16, emojiSize: 18, actived: item.nodeId === nodeId, normalColor: colors.defaultBg });
      if (item.type === ConfigConstant.NodeType.FOLDER) {
        return (
          <TreeNode title={item.nodeName} key={item.nodeId} style={{ width: '100%' }} icon={icon}>
            {renderNode(item.children, colors)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.nodeName} key={item.nodeId} style={{ width: '100%' }} isLeaf icon={icon} />;
    });
  };
  return (
    <DirectoryTree
      defaultExpandAll
      onSelect={onSelect}
      switcherIcon={
        <span>
          <TriangleDownFilled size={12} />
        </span>
      }
      selectedKeys={[nodeId]}
      expandAction={false}
    >
      {renderNode([nodeTree], colors)}
    </DirectoryTree>
  );
};
