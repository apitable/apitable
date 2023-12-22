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

import Image from 'next/image';
import * as React from 'react';
import { ThemeName } from '@apitable/components';
import { ConfigConstant, INode, IViewColumn, Strings, t, ViewType } from '@apitable/core';
import { useLoader } from 'pc/components/data_source_selector/hooks/use_loader';
import { ScrollBar } from 'pc/components/scroll_bar';
import { useAppSelector } from 'pc/store/react-redux';
import EmptyPngDark from 'static/icon/datasheet/empty_state_dark.png';
import EmptyPngLight from 'static/icon/datasheet/empty_state_light.png';
import { File, Folder, View } from './components';
import styles from './style.module.less';

export interface IViewNode {
  nodeId: string;
  nodeName: string;
  type: number;
  viewType: ViewType;
  columns: IViewColumn[];
}

export type ICommonNode = INode | IViewNode;

interface IFolderContentProps {
  nodes: ICommonNode[];
  currentAutomationId: string;
  currentViewId: string;
  currentMirrorId: string;
  currentDatasheetId: string;
  currentFormId: string;
  loading: boolean;
  onlyShowAvailable: boolean;

  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder' | 'Form' | 'Automation', id: string): void;

  hideViewNode?: boolean;
}

export const FolderContent: React.FC<React.PropsWithChildren<IFolderContentProps>> = (props) => {
  const {
    nodes,
    onlyShowAvailable,
    currentAutomationId,
    onNodeClick,
    currentViewId,
    currentMirrorId,
    loading,
    currentDatasheetId,
    hideViewNode,
    currentFormId,
  } = props;
  const themeName = useAppSelector((state) => state.theme);
  const EmptyFolderImg = themeName === ThemeName.Light ? EmptyPngLight : EmptyPngDark;
  const { nodeVisibleFilterLoader, nodeStatusLoader } = useLoader();

  const _nodes = onlyShowAvailable ? nodeVisibleFilterLoader(nodes as INode[]) : nodes;

  return (
    <div className={styles.folderContent}>
      <ScrollBar>
        {_nodes.map((node) => {
          if (node.type === ConfigConstant.NodeType.FOLDER) {
            return (
              <Folder key={node.nodeId} id={node.nodeId} onClick={(id) => onNodeClick('Folder', id)}>
                {node.nodeName}
              </Folder>
            );
          }

          if (node.type === ConfigConstant.NodeType.DATASHEET) {
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                active={currentDatasheetId === node.nodeId}
                onClick={(id) => onNodeClick('Datasheet', id)}
                disable={nodeStatusLoader(node as INode)}
                nodeType={node.type}
              >
                {node.nodeName}
              </File>
            );
          }

          if (node.type === ConfigConstant.NodeType.AUTOMATION) {
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                active={currentAutomationId === node.nodeId}
                onClick={(id) => onNodeClick('Automation', id)}
                disable={nodeStatusLoader(node as INode)}
                nodeType={node.type}
              >
                {node.nodeName}
              </File>
            );
          }

          if (node.type === ConfigConstant.NodeType.FORM) {
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                active={currentFormId === node.nodeId}
                onClick={(id) => onNodeClick('Form', id)}
                disable={nodeStatusLoader(node as INode)}
                nodeType={node.type}
              >
                {node.nodeName}
              </File>
            );
          }

          if (node.type === ConfigConstant.NodeType.MIRROR) {
            // TODO
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                active={currentMirrorId === node.nodeId}
                onClick={(id) => onNodeClick('Mirror', id)}
                disable={nodeStatusLoader(node as INode)}
                nodeType={node.type}
              >
                {node.nodeName}
              </File>
            );
          }

          if (node.type === ConfigConstant.NodeType.VIEW && !hideViewNode) {
            return (
              <View
                key={node.nodeId}
                id={node.nodeId}
                active={currentViewId === node.nodeId}
                viewType={(node as IViewNode).viewType}
                onClick={(id) => {
                  onNodeClick('View', id);
                }}
              >
                {node.nodeName}
              </View>
            );
          }
          return null;
        })}
        {!loading && !_nodes.length && (
          <div className={styles.emptyFolder}>
            <div className={styles.emptyImg}>
              <Image src={EmptyFolderImg} alt={t(Strings.folder_content_empty)} width={200} height={150} />
            </div>
            <p>{t(Strings.folder_content_empty)}</p>
          </div>
        )}
      </ScrollBar>
    </div>
  );
};
