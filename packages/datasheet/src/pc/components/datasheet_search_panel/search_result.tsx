import { INode, Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { TComponent } from 'pc/components/common/t_component';
import { File, Folder } from 'pc/components/datasheet_search_panel/components';
import styles from 'pc/components/datasheet_search_panel/style.module.less';
import * as React from 'react';
import EmptyResultImage from 'static/icon/common/common_img_search_default.png';

interface ISearchResultProps {
  searchResult: { folders: INode[], files: INode[] } | string
  onlyShowAvailable: boolean,
  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder', id: string): void,
  checkNodeDisable(node: INode): undefined | { budget: string, message: string },
}

export const SearchResult: React.FC<ISearchResultProps> = (props) => {
  const { searchResult, checkNodeDisable, onlyShowAvailable, onNodeClick } = props;
  if (typeof searchResult === 'string') {
    return (
      <div className={styles.searchEmpty}>
        <span className={styles.emptyImage}>
          <Image src={EmptyResultImage} alt={t(Strings.no_search_result)} />
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

  const FileList = (files: INode[]) => {
    if (!files.length) {
      return null;
    }
    return (
      <>
        <h4 className={styles.nodeTitle}>{t(Strings.vikadata)}</h4>
        <div className={styles.nodeListContent}>
          {files.map(node => {
            return (
              <File
                key={node.nodeId}
                id={node.nodeId}
                onClick={id => onNodeClick('Datasheet', id)}
                richContent
                disable={checkNodeDisable(node)}
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
    searchResult.files.filter(node => !checkNodeDisable(node)) : searchResult.files;
  return (
    <div className={styles.searchResult}>
      {FolderList(folders)}
      {FileList(files)}
    </div>
  );
};
