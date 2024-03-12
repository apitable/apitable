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
import { File, Folder, FormSearchItem, View } from 'pc/components/datasheet_search_panel/components';
import styles from 'pc/components/datasheet_search_panel/style.module.less';
import { checkNodeDisable } from 'pc/components/datasheet_search_panel/utils/check_node_disabled';
import { ScrollBar } from 'pc/components/scroll_bar';
import { useAppSelector } from 'pc/store/react-redux';
import EmptyPngDark from 'static/icon/datasheet/empty_state_dark.png';
import EmptyPngLight from 'static/icon/datasheet/empty_state_light.png';
import { SecondConfirmType } from './interface';

export interface IViewNode {
  nodeId: string;
  nodeName: string;
  type: number;
  viewType: ViewType;
  columns: IViewColumn[];
}

export type ICommonNode = INode | IViewNode;

interface IFolderContentProps {
  options?: {
    showForm: boolean;
    showDatasheet: boolean;
    needPermission?: 'manageable' | 'editable';
    showMirror: boolean;
    showView: boolean;
  };
  nodes: ICommonNode[];
  currentViewId: string;
  currentMirrorId: string;
  currentDatasheetId: string;
  loading: boolean;
  onlyShowEditableNode: boolean;
  isSelectView: boolean;
  showMirrorNode?: boolean;
  noCheckPermission?: boolean;
  secondConfirmType?: SecondConfirmType;

  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder' | 'Form', id: string): void;

  hideViewNode?: boolean;
}

export const FolderContent: React.FC<React.PropsWithChildren<IFolderContentProps>> = (props) => {
  const {
    nodes,
    options,
    onNodeClick,
    currentViewId,
    currentMirrorId,
    loading,
    onlyShowEditableNode,
    noCheckPermission,
    currentDatasheetId,
    isSelectView,
    showMirrorNode,
    hideViewNode,
    secondConfirmType,
  } = props;
  const themeName = useAppSelector((state) => state.theme);
  const EmptyFolderImg = themeName === ThemeName.Light ? EmptyPngLight : EmptyPngDark;

  const showForm = options?.showForm ?? false;

  const showDatasheet = options?.showDatasheet ?? true;
  let showMirror = options?.showMirror ?? false;
  if (showMirrorNode != null && options?.showMirror != null) {
    showMirror = showMirrorNode;
  }

  let showView = options?.showView ?? false;
  if (hideViewNode != null && options?.showView != null) {
    showView = !hideViewNode;
  }

  const _checkNodeDisable = (node: INode, needPermission: 'manageable' | 'editable' | undefined) => {
    if (noCheckPermission) return;
    if (!needPermission) return;
    return checkNodeDisable(node, needPermission);
  };

  const checkVisible = (nodeType: ConfigConstant.NodeType, result: boolean) => {
    if (!options) return result;

    switch (nodeType) {
      case ConfigConstant.NodeType.FORM: {
        return result && showForm;
      }
      case ConfigConstant.NodeType.DATASHEET: {
        return result && showDatasheet;
      }
      case ConfigConstant.NodeType.MIRROR: {
        return result && showMirror;
      }
      case ConfigConstant.NodeType.VIEW: {
        return result && showView;
      }
      default: {
        return result;
      }
    }
  };

  return (
    <div className={styles.folderContent}>
      <ScrollBar>
        {nodes.map((node) => {
          showForm &&
            node.type === ConfigConstant.NodeType.FORM &&
            (!onlyShowEditableNode || !_checkNodeDisable(node as INode, options?.needPermission));

          if (node.type === ConfigConstant.NodeType.FOLDER) {
            return (
              <Folder key={node.nodeId} id={node.nodeId} onClick={(id) => onNodeClick('Folder', id)}>
                {node.nodeName}
              </Folder>
            );
          }
          if (secondConfirmType === SecondConfirmType.AIForm) {
            if (node.type === ConfigConstant.NodeType.FORM) {
              return (
                <File
                  key={node.nodeId}
                  id={node.nodeId}
                  active={!isSelectView && currentDatasheetId === node.nodeId}
                  onClick={(id) => onNodeClick('Form', id)}
                  disable={_checkNodeDisable(node as INode, options?.needPermission)}
                  nodeType={ConfigConstant.NodeType.FORM}
                >
                  {node.nodeName}
                </File>
              );
            }
          } else {
            if (
              node.type === ConfigConstant.NodeType.DATASHEET &&
              checkVisible(node.type, !onlyShowEditableNode || !_checkNodeDisable(node as INode, options?.needPermission))
            ) {
              return (
                <File
                  key={node.nodeId}
                  id={node.nodeId}
                  active={!isSelectView && currentDatasheetId === node.nodeId}
                  onClick={(id) => onNodeClick('Datasheet', id)}
                  disable={_checkNodeDisable(node as INode, options?.needPermission)}
                  nodeType={ConfigConstant.NodeType.DATASHEET}
                >
                  {node.nodeName}
                </File>
              );
            }

            if (
              showForm &&
              node.type === ConfigConstant.NodeType.FORM &&
              checkVisible(node.type, !onlyShowEditableNode || !_checkNodeDisable(node as INode, options?.needPermission))
            ) {
              return (
                <FormSearchItem
                  key={node.nodeId}
                  id={node.nodeId}
                  active={!isSelectView && currentDatasheetId === node.nodeId}
                  onClick={(id) => onNodeClick('Form', id)}
                  disable={_checkNodeDisable(node as INode, options?.needPermission)}
                >
                  {node.nodeName}
                </FormSearchItem>
              );
            }

            if (
              showDatasheet &&
              node.type === ConfigConstant.NodeType.DATASHEET &&
              checkVisible(node.type, !onlyShowEditableNode || !_checkNodeDisable(node as INode, options?.needPermission))
            ) {
              return (
                <File
                  nodeType={node.type}
                  key={node.nodeId}
                  id={node.nodeId}
                  active={!isSelectView && currentDatasheetId === node.nodeId}
                  onClick={(id) => onNodeClick('Datasheet', id)}
                  disable={_checkNodeDisable(node as INode, options?.needPermission)}
                >
                  {node.nodeName}
                </File>
              );
            }

            if (
              showMirror &&
              node.type === ConfigConstant.NodeType.MIRROR &&
              checkVisible(node.type, !onlyShowEditableNode || !_checkNodeDisable(node as INode, options?.needPermission))
            ) {
              return (
                <File
                  key={node.nodeId}
                  id={node.nodeId}
                  active={!isSelectView && currentMirrorId === node.nodeId}
                  onClick={(id) => onNodeClick('Mirror', id)}
                  disable={_checkNodeDisable(node as INode, options?.needPermission)}
                  nodeType={ConfigConstant.NodeType.MIRROR}
                >
                  {node.nodeName}
                </File>
              );
            }

            if (showView && node.type === ConfigConstant.NodeType.VIEW && !hideViewNode) {
              return (
                <View
                  key={node.nodeId}
                  id={node.nodeId}
                  active={currentViewId === node.nodeId}
                  viewType={(node as IViewNode).viewType}
                  onClick={(id) => onNodeClick('View', id)}
                >
                  {node.nodeName}
                </View>
              );
            }
            return null;
          }

          return null;
        })}
        {!loading && !nodes.length && (
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
