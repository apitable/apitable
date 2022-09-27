import { LinkButton, Message, TextInput } from '@vikadata/components';
import { Api, ApiInterface, ConfigConstant, INode, INodesMapItem, IParent, Strings, t } from '@vikadata/core';
import { ChevronRightOutlined, SearchOutlined } from '@vikadata/icons';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { ScrollBar } from 'pc/common/guide/scroll_bar';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FolderItem } from './folder_item';
import { SelectFolderTips } from './select_folder_tips';

import styles from './style.module.less';

export const SelectFolder: React.FC<{
  selectedFolderId?: string;
  selectedFolderParentList: IParent[];
  onChange: (folderId: string) => void
}> = (props) => {
  const { selectedFolderId, selectedFolderParentList, onChange } = props;
  const rootId = useSelector(state => state.catalogTree.rootId);
  const spaceName = useSelector(state => state.user.info?.spaceName);
  const spaceId = useSelector(state => state.space.activeId);

  const currentFolderId = selectedFolderId || rootId;
  const isWhole = Boolean(selectedFolderId);

  const [recentlyBrowsedList, setRecentlyBrowsedList] = useState<ApiInterface.IRecentlyBrowsedFolder[]>([]);
  const [wholeList, setWholeList] = useState<Omit<INodesMapItem, 'children'>[]>([]);
  const [keyword, setKeyword] = useState<string>();
  const [searchList, setSearchList] = useState<INode[]>([]);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useMount(() => {
    Api.getRecentlyBrowsedFolder().then(res => {
      const { data, success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      setRecentlyBrowsedList(data);
    });
  });

  useEffect(() => {
    if (!isWhole || !currentFolderId) {
      return;
    }
    getWholeList(currentFolderId);
  }, [currentFolderId, isWhole]);

  const getWholeList = (folderId: string) => {
    Api.getChildNodeList(folderId, ConfigConstant.NodeType.FOLDER).then(res => {
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
      Api.searchNode(spaceId, keyword).then(res => {
        const { data, success, message } = res.data;
        if (!success) {
          Message.error({ content: message });
          return;
        }
        const folders = data.filter(node => node.type === ConfigConstant.NodeType.FOLDER);
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

  const isShowSearchInput = !isMobile || isWhole;
  const isShowTips = !isMobile && !keyword;
  const showLevel = !isWhole || keyword;
  const isShowWholeButton = isMobile && !isWhole;
  const list = keyword ? searchList : isWhole ? wholeList : recentlyBrowsedList;

  return (
    <div className={styles.selectFolder}>
      {/** 如果在web端或者移动端完整数据的时候显示搜索 */}
      {isShowSearchInput && <TextInput
        value={keyword}
        prefix={<SearchOutlined />}
        placeholder={t(Strings.search)}
        lineStyle={!isMobile}
        block
        onChange={e => setKeyword(e.target.value)}
      />}
      {isShowTips && <SelectFolderTips isWhole={isWhole} setIsWhole={enterWhole} data={selectedFolderParentList} onClick={onClickItem}/>}
      <div className={classNames(styles.folderList, !isShowTips && styles.folderListNoTips)}>
        <ScrollBar>
          {
            list.map(item => {
              const { nodeId, nodeName, icon } = item;
              return <FolderItem
                key={nodeId}
                folderId={nodeId}
                folderName={nodeName}
                icon={icon}
                onClick={onClickItem}
                level={showLevel ? `${spaceName} ${item.superiorPath}` : ''}
              />;
            })
          }
        </ScrollBar>
      </div>
      {isShowWholeButton && <div>
        <LinkButton
          className={styles.switchWholeBtn}
          suffixIcon={<ChevronRightOutlined />}
          onClick={enterWhole}
          block
        >{t(Strings.view_full_catalog)}</LinkButton>
      </div>}
    </div>
  );
};
