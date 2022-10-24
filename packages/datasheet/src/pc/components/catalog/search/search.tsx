import { useThemeColors } from '@vikadata/components';
import { Api, INode, Navigation, Strings, t } from '@apitable/core';
import { useClickAway } from 'ahooks';
import { Form, Input } from 'antd';
import classnames from 'classnames';
import throttle from 'lodash/throttle';
import Image from 'next/image';
import { ShortcutActionName } from 'pc/common/shortcut_key';
import { getShortcutKeyString } from 'pc/common/shortcut_key/keybinding_config';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive, useSelectIndex } from 'pc/hooks';
import { getElementDataset, KeyCode, nodeConfigData } from 'pc/utils';
import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchIcon from 'static/icon/common/common_icon_search_normal.svg';
import EmptyResultIcon from 'static/icon/common/common_img_search_default.png';
import CloseIcon from 'static/icon/datasheet/datasheet_icon_attachment_cancel.svg';
import { Node } from './node';
import styles from './style.module.less';

export type ISearchNode = INode & { superiorPath: string };

let reqToken: () => void;

const shouldOpenInNewTab = (e: React.MouseEvent) => {
  // 按住 meta 或者使用鼠标中键点击，在新 tab 打开数表。
  return e.metaKey || (e.button && e.button === 1);
};

export interface ISearchProps {
  className?: string;
  closeSearch: () => void;
}

export const Search: FC<ISearchProps> = ({ className, closeSearch }) => {
  const colors = useThemeColors();
  const [keyword, setKeyword] = useState('');
  const [groupData, setGroupData] = useState<{ name: string; data: ISearchNode[] }[]>([]);
  const inputRef = useRef<Input>(null);
  const listContainerRef = useRef<any>(null);
  const totalSearchResultItemsCount = groupData.reduce((total, item) => total + item.data.length, 0);
  const spaceId = useSelector(state => state.space.activeId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(() => {
    closeSearch();
  }, ref);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const findNodeByIndex = (index: number) => {
    for (const group of groupData) {
      if (group.data.length > index) {
        return group.data[index];
      }
      index -= group.data.length;
    }
    return null;
  };

  const { index: currentIndex, setIndex: setCurrentIndex } = useSelectIndex({
    listLength: totalSearchResultItemsCount,
    inputRef,
    listContainerRef,
    activeItemClass: '.active',
    onEnter: index => {
      const node = findNodeByIndex(index);
      if (!node) {
        return;
      }
      closeSearch();
      setKeyword('');
      Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId: node.nodeId }});
    },
  });

  const groupingByNodeType = (nodes: ISearchNode[]) => {
    const data: { name: string; data: ISearchNode[] }[] = [];
    for (const nodeConfigItem of nodeConfigData) {
      const filterData = nodes.filter(node => node.type === nodeConfigItem.type);
      if (!filterData.length) {
        continue;
      }
      data.push({ name: nodeConfigItem.name, data: filterData });
    }
    setGroupData(data);
  };

  const handleSubmit = () => {
    getNodeList(keyword);
  };

  const getNodeList = throttle((val: string) => {
    if (reqToken) {
      reqToken();
    }
    Api.findNode(val, c => (reqToken = c))
      .then(res => {
        const { data, success } = res.data;
        if (success) {
          groupingByNodeType(data);
        }
      })
      .catch(() => {
        console.log('捕获取消请求');
      });
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (!val) {
      reqToken();
      setGroupData([]);
      setCurrentIndex(-1);
      return;
    }
    getNodeList(val);
  };

  const clearKeyword = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setKeyword('');

    setCurrentIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.Esc) {
      setKeyword('');
    }
  };

  const handleNodeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const nodeId = getElementDataset(e.currentTarget, 'nodeId');
    if (nodeId) {
      const params = { spaceId, nodeId };
      shouldOpenInNewTab(e) ? Router.newTab(Navigation.WORKBENCH, { params }) :
        Router.push(Navigation.WORKBENCH, { params });
    }
    setKeyword('');
    closeSearch();
  };

  return (
    <div className={classnames(styles.searchWrapper, className)} ref={ref}>
      <Form onFinish={handleSubmit} className={styles.search}>
        <Input
          ref={inputRef}
          className={styles.searchInput}
          size='small'
          placeholder={
            isMobile ? t(Strings.search) : t(Strings.search_node_pleaseholder, { shortcutKey: getShortcutKeyString(ShortcutActionName.SearchNode) })
          }
          autoFocus
          value={keyword}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          prefix={<SearchIcon />}
          suffix={
            keyword && (
              <div onClick={clearKeyword} className={styles.closeBtn}>
                <CloseIcon width={15} height={15} fill={colors.thirdLevelText} />
              </div>
            )
          }
        />
      </Form>
      {keyword && (
        <div
          className={styles.nodeList}
          onClick={handleNodeClick}
          style={{ background: keyword ? colors.defaultBg : 'transparent' }}
          ref={listContainerRef}
        >
          {!groupData.length && keyword && (
            <div className={styles.emptyResult}>
              <Image src={EmptyResultIcon} alt={t(Strings.no_search_result)} />
              <div className={styles.tip}>{t(Strings.no_search_result)}</div>
            </div>
          )}
          {groupData.map(group => (
            <div key={group.name}>
              <div className={styles.title}>{group.name}</div>
              <div>
                {group.data.map(node => {
                  const findNode = findNodeByIndex(currentIndex);
                  const nodeClasses = findNode?.nodeId === node.nodeId ? `${styles.hover} active` : '';
                  return <Node key={node.nodeId} node={node} onMouseDown={handleNodeClick} className={nodeClasses} />;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
