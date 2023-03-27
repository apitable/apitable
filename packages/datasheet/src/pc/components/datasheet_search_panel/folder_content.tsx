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

import { ConfigConstant, INode, IViewColumn, Strings, t, ViewType } from '@apitable/core';
import Image from 'next/image';
import { File, Folder, View } from 'pc/components/datasheet_search_panel/components';
import styles from 'pc/components/datasheet_search_panel/style.module.less';
import * as React from 'react';
import EmptyPngDark from 'static/icon/datasheet/empty_state_dark.png';
import EmptyPngLight from 'static/icon/datasheet/empty_state_light.png';
import { ScrollBar } from 'pc/components/scroll_bar';
import { useSelector } from 'react-redux';
import { ThemeName } from '@apitable/components';

export interface IViewNode {
  nodeId: string;
  nodeName: string;
  type: number;
  viewType: ViewType;
  columns: IViewColumn[];
}

export type ICommonNode = INode | IViewNode;

interface IFolderContentProps {
  nodes: ICommonNode[],
  currentViewId: string,
  currentMirrorId: string,
  currentDatasheetId: string,
  loading: boolean,
  onlyShowEditableNode: boolean,
  isSelectView: boolean
  showMirrorNode?: boolean
  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder', id: string): void,
  checkNodeDisable(node: INode): undefined | { budget: string, message: string },
}

export const FolderContent: React.FC<React.PropsWithChildren<IFolderContentProps>> = (props) => {
  const {
    nodes, onNodeClick, currentViewId, currentMirrorId, loading, onlyShowEditableNode,
    checkNodeDisable, currentDatasheetId, isSelectView, showMirrorNode
  } = props;
  const themeName = useSelector(state => state.theme);
  const EmptyFolderImg = themeName === ThemeName.Light ? EmptyPngLight : EmptyPngDark;
  return (
    <div className={styles.folderContent}>
      <ScrollBar>
        {nodes.map(node => {
          if (node.type === ConfigConstant.NodeType.FOLDER) {
            return (
              <Folder
                key={node.nodeId}
                id={node.nodeId}
                onClick={id => onNodeClick('Folder', id)}
              >
                {node.nodeName}
              </Folder>
            );
          }

          if (
            node.type === ConfigConstant.NodeType.DATASHEET &&
            (!onlyShowEditableNode || !checkNodeDisable(node as INode))
          ) {
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                active={
                  !isSelectView && currentDatasheetId === node.nodeId
                }
                onClick={id => onNodeClick('Datasheet', id)}
                disable={checkNodeDisable(node as INode)}
              >
                {node.nodeName}
              </File>
            );
          }

          if (
            node.type === ConfigConstant.NodeType.MIRROR && showMirrorNode &&
            (!onlyShowEditableNode || !checkNodeDisable(node as INode))
          ) {
            // TODO
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                active={
                  !isSelectView && currentMirrorId === node.nodeId
                }
                onClick={id => onNodeClick('Mirror', id)}
                disable={checkNodeDisable(node as INode)}
                isMirror
              >
                {node.nodeName}
              </File>
            );
          }

          if (node.type === ConfigConstant.NodeType.VIEW) {
            return (
              <View
                key={node.nodeId}
                id={node.nodeId}
                active={currentViewId === node.nodeId}
                viewType={(node as IViewNode).viewType}
                onClick={id => onNodeClick('View', id)}
              >
                {node.nodeName}
              </View>
            );
          }
          return null;
        })}
        {
          !loading && !nodes.length && (
            <div className={styles.emptyFolder}>
              <div className={styles.emptyImg}>
                <Image src={EmptyFolderImg} alt={t(Strings.folder_content_empty)} width={200} height={150} />
              </div>
              <p>{t(Strings.folder_content_empty)}</p>
            </div>
          )
        }
      </ScrollBar>
    </div>
  );
};
