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

import { useThemeColors, ThemeName } from '@apitable/components';
import { Api, INode, Navigation, Strings, t } from '@apitable/core';
import { useClickAway } from 'ahooks';
import type { InputRef } from 'antd';
import { Form, Input } from 'antd';
import classnames from 'classnames';
import throttle from 'lodash/throttle';
import Image from 'next/image';
import { ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive, useSelectIndex } from 'pc/hooks';
import { getElementDataset, KeyCode, nodeConfigData } from 'pc/utils';
import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import { Node } from './node';
import styles from './style.module.less';
import { CloseCircleFilled, SearchOutlined } from '@apitable/icons';

export type ISearchNode = INode & { superiorPath: string };

let reqToken: () => void;

const shouldOpenInNewTab = (e: React.MouseEvent) => {
  // Press and hold meta or click with the middle mouse button to open the table in a new tab.
  return e.metaKey || (e.button && e.button === 1);
};

export interface ISearchProps {
  className?: string;
  closeSearch: () => void;
}

export const Search: FC<React.PropsWithChildren<ISearchProps>> = ({ className, closeSearch }) => {
  const colors = useThemeColors();
  const [keyword, setKeyword] = useState('');
  const [groupData, setGroupData] = useState<{ name: string; data: ISearchNode[] }[]>([]);
  const inputRef = useRef<InputRef>(null);
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
  const themeName = useSelector(state => state.theme);
  const EmptyResultIcon = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;
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
    Api.findNode(val, (c: () => void) => (reqToken = c))
      .then(res => {
        const { data, success } = res.data;
        if (success) {
          groupingByNodeType(data);
        }
      })
      .catch(() => {
        console.log('Capture cancellation requests');
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
          prefix={<SearchOutlined />}
          suffix={
            keyword && (
              <div onClick={clearKeyword} className={styles.closeBtn}>
                <CloseCircleFilled size={15} color={colors.thirdLevelText} />
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
