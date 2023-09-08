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
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, LinkButton, Loading, Message, TextInput, useThemeColors } from '@apitable/components';
import { Api, ApiInterface, ConfigConstant, INode, INodesMapItem, IParent, Strings, t } from '@apitable/core';
import { ChevronRightOutlined, SearchOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { FolderItem } from './folder_item';
import { SelectFolderTips } from './select_folder_tips';

import styles from './style.module.less';

export const SelectFolder: React.FC<
  React.PropsWithChildren<{
    selectedFolderId?: string;
    selectedFolderParentList: IParent[];
    onChange: (folderId: string) => void;
  }>
> = (props) => {
  const { selectedFolderId, selectedFolderParentList, onChange } = props;
  const rootId = useSelector((state) => state.catalogTree.rootId);
  const spaceName = useSelector((state) => state.user.info?.spaceName);
  const spaceId = useSelector((state) => state.space.activeId);

  const currentFolderId = selectedFolderId || rootId;
  const isWhole = Boolean(selectedFolderId);

  const [recentlyBrowsedList, setRecentlyBrowsedList] = useState<ApiInterface.IRecentlyBrowsedFolder[]>([]);
  const [wholeList, setWholeList] = useState<Omit<INodesMapItem, 'children'>[]>([]);
  const [keyword, setKeyword] = useState<string>();
  const [searchList, setSearchList] = useState<INode[]>([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const scrollShadowRef = useRef<HTMLDivElement>(null);
  const folderListRef = useRef<HTMLDivElement>(null);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const colors = useThemeColors();

  useMount(async() => {
    await Api.getRecentlyBrowsedFolder().then((res) => {
      const { data, success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      setRecentlyBrowsedList(data);
    });
    setFirstLoading(false);
    if (folderListRef.current) {
      const { clientHeight, scrollHeight, scrollTop } = folderListRef.current;
      onScroll({ height: clientHeight, scrollHeight, scrollTop });
    }
  });

  useEffect(() => {
    if (!isWhole || !currentFolderId) {
      return;
    }
    getWholeList(currentFolderId);
  }, [currentFolderId, isWhole]);

  const getWholeList = (folderId: string) => {
    Api.getChildNodeList(folderId, ConfigConstant.NodeType.FOLDER).then((res) => {
      const { data, success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      setWholeList(data);
    });
  };

  const getSearchList = useMemo(() => {
    return throttle((spaceId: string, keyword: string) => {
      Api.searchNode(spaceId, keyword).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          Message.error({ content: message });
          return;
        }
        const folders = data.filter((node) => node.type === ConfigConstant.NodeType.FOLDER);
        setSearchList(folders);
      });
    }, 500);
  }, []);

  useEffect(() => {
    if (!keyword || !spaceId) {
      return;
    }
    getSearchList(spaceId, keyword);
  }, [spaceId, keyword, getSearchList]);

  const onClickItem = (folderId: string) => {
    setKeyword('');
    onChange(folderId);
  };

  const enterWhole = () => {
    onClickItem(rootId);
  };

  const onScroll = ({ scrollTop, height, scrollHeight }: { scrollTop: number; height: number; scrollHeight: number }) => {
    const shadowEle = scrollShadowRef.current;
    if (!shadowEle) return;
    if (scrollTop + height > scrollHeight - 10) {
      shadowEle.style.display = 'none';
      return;
    }

    if (shadowEle.style.display === 'block') {
      return;
    }
    shadowEle.style.display = 'block';
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const ele = e.target as HTMLDivElement;
    const { clientHeight, scrollHeight, scrollTop } = ele;
    onScroll({ height: clientHeight, scrollHeight, scrollTop });
  };

  const isShowSearchInput = !isMobile || isWhole;
  const isShowTips = !isMobile && !keyword;
  const showLevel = !isWhole || keyword;
  const isShowWholeButton = isMobile && !isWhole;
  const list = keyword ? searchList : isWhole ? wholeList : recentlyBrowsedList;

  return (
    <div className={styles.selectFolder}>
      {/** the search is displayed when the data is complete on the web or mobile */}
      {isShowSearchInput && (
        <TextInput
          className={styles.searchInput}
          value={keyword}
          prefix={<SearchOutlined />}
          placeholder={t(Strings.search)}
          lineStyle={!isMobile}
          block
          size="small"
          onChange={(e) => setKeyword(e.target.value)}
        />
      )}
      {isShowTips && <SelectFolderTips isWhole={isWhole} setIsWhole={enterWhole} data={selectedFolderParentList} onClick={onClickItem} />}
      <div ref={folderListRef} className={classNames(styles.folderList, !isShowTips && styles.folderListNoTips)} onScroll={handleScroll}>
        {firstLoading ? (
          <Box height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Loading />
          </Box>
        ) : (
          list.map((item) => {
            const { nodeId, nodeName, icon } = item;
            return (
              <FolderItem
                key={nodeId}
                folderId={nodeId}
                folderName={nodeName}
                icon={icon}
                onClick={onClickItem}
                level={showLevel ? `${spaceName} ${(item as ApiInterface.IRecentlyBrowsedFolder).superiorPath}` : ''}
              />
            );
          })
        )}
        <div ref={scrollShadowRef} className={styles.scrollShadow} />
      </div>
      {isShowWholeButton && (
        <div>
          <LinkButton
            className={styles.switchWholeBtn}
            color={colors.textCommonPrimary}
            suffixIcon={<ChevronRightOutlined color={colors.textCommonPrimary} />}
            onClick={enterWhole}
            block
          >
            {t(Strings.view_full_catalog)}
          </LinkButton>
        </div>
      )}
    </div>
  );
};
