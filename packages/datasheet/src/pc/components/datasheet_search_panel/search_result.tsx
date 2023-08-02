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

import { INode, Strings, t, ThemeName } from '@apitable/core';
import Image from 'next/image';
import { TComponent } from 'pc/components/common/t_component';
import { File, Folder } from 'pc/components/datasheet_search_panel/components';
import styles from 'pc/components/datasheet_search_panel/style.module.less';
import * as React from 'react';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import { useSelector } from 'react-redux';
import { checkNodeDisable } from 'pc/components/datasheet_search_panel/utils/check_node_disabled';

interface ISearchResultProps {
  searchResult: { folders: INode[], files: INode[] } | string
  onlyShowAvailable: boolean,

  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder', id: string): void,

  noCheckPermission?: boolean,
}

export const SearchResult: React.FC<React.PropsWithChildren<ISearchResultProps>> = (props) => {
  const { searchResult, noCheckPermission, onlyShowAvailable, onNodeClick } = props;
  const themeName = useSelector(state => state.theme);
  const EmptyResultImage = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;
  if (typeof searchResult === 'string') {
    return (
      <div className={styles.searchEmpty}>
        <span className={styles.emptyImage}>
          <Image src={EmptyResultImage} alt={t(Strings.no_search_result)} width={200} height={150} />
        </span>
        <p className={styles.emptyText}>
          {<TComponent
            tkey={t(Strings.not_found_record_contains_value)}
            params={{
              searchValueSpan: <span>{searchResult}</span>,
            }}
          />}
        </p>
      </div>
    );
  }

  const FolderList = (folders: INode[]) => {
    if (!folders.length) {
      return null;
    }
    return (
      <>
        <h4 className={styles.nodeTitle}>{t(Strings.folder)}</h4>
        <div className={styles.nodeListContent}>
          {folders.map(node => {
            return (
              <Folder
                key={node.nodeId}
                id={node.nodeId}
                richContent
                onClick={id => onNodeClick('Folder', id)}
              >
                {node.nodeName}
              </Folder>
            );
          })}
        </div>
      </>
    );
  };

  const _checkNodeDisable = (node: INode) => {
    if (noCheckPermission) return;
    return checkNodeDisable(node);
  };

  const FileList = (files: INode[]) => {
    if (!files.length) {
      return null;
    }
    return (
      <>
        <h4 className={styles.nodeTitle}>{t(Strings.system_configuration_product_name)}</h4>
        <div className={styles.nodeListContent}>
          {files.map(node => {
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                onClick={id => onNodeClick('Datasheet', id)}
                richContent
                disable={_checkNodeDisable(node)}
              >
                {node.nodeName}
              </File>
            );
          })}
        </div>
      </>
    );
  };

  const folders = searchResult.folders;
  const files = onlyShowAvailable ?
    searchResult.files.filter(node => !_checkNodeDisable(node)) : searchResult.files;
  return (
    <div className={styles.searchResult}>
      {FolderList(folders)}
      {FileList(files)}
    </div>
  );
};
