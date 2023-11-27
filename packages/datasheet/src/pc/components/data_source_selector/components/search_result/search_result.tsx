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
import { ConfigConstant, INode, Strings, t, ThemeName } from '@apitable/core';
import { TComponent } from 'pc/components/common/t_component';
import { useLoader } from 'pc/components/data_source_selector/hooks/use_loader';
import { File, Folder } from 'pc/components/datasheet_search_panel/components';
import { useAppSelector } from 'pc/store/react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import styles from './style.module.less';

interface ISearchResultProps {
  searchResult:
    | {
        folders: INode[];
        files: INode[];
      }
    | string;
  onlyShowAvailable: boolean;

  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder' | 'Form' | 'Automation', id: string): void;
}

export const SearchResult: React.FC<React.PropsWithChildren<ISearchResultProps>> = (props) => {
  const { searchResult, onlyShowAvailable, onNodeClick } = props;
  const themeName = useAppSelector((state) => state.theme);
  const EmptyResultImage = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;
  const { nodeVisibleFilterLoader, nodeStatusLoader } = useLoader();

  if (typeof searchResult === 'string') {
    return (
      <div className={styles.searchEmpty}>
        <span className={styles.emptyImage}>
          <Image src={EmptyResultImage} alt={t(Strings.no_search_result)} width={200} height={150} />
        </span>
        <p className={styles.emptyText}>
          {
            <TComponent
              tkey={t(Strings.not_found_record_contains_value)}
              params={{
                searchValueSpan: <span>{searchResult}</span>,
              }}
            />
          }
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
        <div>
          {folders.map((node) => {
            return (
              <Folder key={node.nodeId} id={node.nodeId} richContent onClick={(id) => onNodeClick('Folder', id)}>
                {node.nodeName}
              </Folder>
            );
          })}
        </div>
      </>
    );
  };

  const FileList = (files: INode[]) => {
    if (!files.length) {
      return null;
    }

    return (
      <>
        <h4 className={styles.nodeTitle}>{t(Strings.datasource_selector_search_result_title)}</h4>
        <div>
          {files.map((node) => {
            return (
              <File
                nodeType={node.type}
                key={node.nodeId}
                id={node.nodeId}
                onClick={(id) => {
                  if (node.type === ConfigConstant.NodeType.AUTOMATION) {
                    onNodeClick('Automation', id);
                    return;
                  }
                  if (node.type === ConfigConstant.NodeType.FORM) {
                    onNodeClick('Form', id);
                  } else {
                    onNodeClick('Datasheet', id);
                  }
                }}
                richContent
                disable={nodeStatusLoader(node)}
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
  const files = onlyShowAvailable ? nodeVisibleFilterLoader(searchResult.files) : searchResult.files;

  return (
    <div className={styles.searchResult}>
      {FolderList(folders)}
      {FileList(files)}
    </div>
  );
};
