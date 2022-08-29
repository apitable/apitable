import { ConfigConstant, INode, IViewColumn, Strings, t, ViewType } from '@vikadata/core';
import Image from 'next/image';
import { ScrollBar } from 'pc/common/guide/scroll_bar';
import { File, Folder, View } from 'pc/components/datasheet_search_panel/components';
import styles from 'pc/components/datasheet_search_panel/style.module.less';
import * as React from 'react';
import EmptyFolderImg from 'static/icon/datasheet/datasheet_img_folder_default.png';

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

export const FolderContent: React.FC<IFolderContentProps> = (props) => {
  const {
    nodes, onNodeClick, currentViewId, currentMirrorId, loading, onlyShowEditableNode,
    checkNodeDisable, currentDatasheetId, isSelectView, showMirrorNode
  } = props;
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
              <Image src={EmptyFolderImg} alt={t(Strings.folder_content_empty)} />
              <p>{t(Strings.folder_content_empty)}</p>
            </div>
          )
        }
      </ScrollBar>
    </div>
  );
};
