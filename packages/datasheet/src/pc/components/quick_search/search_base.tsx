import type { InputRef } from 'antd';
import { Form } from 'antd';
import classnames from 'classnames';
import throttle from 'lodash/throttle';
import Image from 'next/image';
import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { useThemeColors, ThemeName, TextInput, Typography } from '@apitable/components';
import { Api, getArrayLoopIndex, Navigation, StoreActions, Strings, t, ConfigConstant } from '@apitable/core';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { getElementDataset, KeyCode } from 'pc/utils';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import { Loading } from '../common/loading';
import { DefaultContent } from './default_content';
import { FooterTips } from './footer_tips';
import { ISearchNode, Node } from './node';
import { nodeTypeList, TabNodeType, TypeTab } from './type_tab';
import styles from './style.module.less';

let reqToken: () => void;

const shouldOpenInNewTab = (e: React.MouseEvent) => {
  // Press and hold meta or click with the middle mouse button to open the table in a new tab.
  return Boolean(e.metaKey || (e.button && e.button === 1));
};

export interface ISearchProps {
  className?: string;
  closeSearch: () => void;
}

export const SearchBase: FC<React.PropsWithChildren<ISearchProps>> = ({ className, closeSearch }) => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState('');
  const [dataNodeList, setDataNodeList] = useState<ISearchNode[]>([]);
  const [tabType, setTabType] = useState<TabNodeType>(TabNodeType.ALL_TYPE);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>();

  const inputRef = useRef<InputRef>(null);
  const listContainerRef = useRef<any>(null);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const ref = useRef<HTMLDivElement>(null);

  const nodeList = tabType === TabNodeType.ALL_TYPE ? dataNodeList : dataNodeList.filter((v) => v.type === tabType);
  const totalSearchResultItemsCount = nodeList.length;

  useEffect(() => {
    const eventBundle = new Map([
      [
        ShortcutActionName.QuickSearchEnter,
        () => {
          jumpNode(nodeList[currentIndex + 1].nodeId);
        },
      ],
      [
        ShortcutActionName.QuickSearchUp,
        () => {
          setCurrentIndex(getArrayLoopIndex(totalSearchResultItemsCount, currentIndex, -1));
          focusIntoView('up');
        },
      ],
      [
        ShortcutActionName.QuickSearchDown,
        () => {
          setCurrentIndex(getArrayLoopIndex(totalSearchResultItemsCount, currentIndex, +1));
          focusIntoView('down');
        },
      ],
      [
        ShortcutActionName.QuickSearchTab,
        () => {
          const tabTypeIndex = nodeTypeList.findIndex((v) => v.type === tabType);
          const nextTabType = tabTypeIndex < nodeTypeList.length - 1 ? nodeTypeList[tabTypeIndex + 1].type : TabNodeType.ALL_TYPE;
          setTabType(nextTabType as TabNodeType);
        },
      ],
    ]);

    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  }, []);

  const themeName = useAppSelector((state) => state.theme);
  const EmptyResultIcon = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;

  const focusIntoView = throttle((direction: 'up' | 'down') => {
    setTimeout(() => {
      // Follow the active item scrolled to the list
      if (listContainerRef?.current) {
        const viewPortHeight = listContainerRef.current.clientHeight;
        const activeElem = listContainerRef.current.querySelector('.active');
        const activeElemHeight = activeElem.clientHeight;
        const top = activeElem.offsetTop - listContainerRef.current.scrollTop;
        const inViewPort = top > activeElemHeight && top + activeElemHeight < viewPortHeight;
        !inViewPort && activeElem && activeElem.scrollIntoView(direction === 'up');
      }
    }, 16);
  }, 16);

  const handleSubmit = () => {
    getNodeList(keyword);
  };

  const getNodeList = throttle((val: string) => {
    setLoading(true);
    if (reqToken) {
      reqToken();
    }
    Api.findNode(val, (c: () => void) => (reqToken = c))
      .then((res) => {
        const { data, success } = res.data;
        if (success) {
          setDataNodeList(data);
        }
        setLoading(false);
      })
      .catch(() => {
        console.log('Capture cancellation requests');
        setLoading(false);
      });
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (!val) {
      reqToken();
      setDataNodeList([]);
      setCurrentIndex(-1);
      return;
    }
    getNodeList(val);
    setTabType(TabNodeType.ALL_TYPE);
  };

  const clearKeyword = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setKeyword('');

    sessionStorage.removeItem('searchKeyword');
    sessionStorage.removeItem('searchData');

    setCurrentIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.Esc) {
      setKeyword('');
    }
  };

  const handleNodeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, nodePrivate?: boolean) => {
    const nodeId = getElementDataset(e.currentTarget, 'nodeId');
    jumpNode(nodeId, shouldOpenInNewTab(e), nodePrivate);
  };

  const jumpNode = (nodeId?: string | null, openInNewTab?: boolean, nodePrivate?: boolean) => {
    if (!nodeId) {
      return;
    }
    const params = { spaceId, nodeId };
    openInNewTab ? Router.newTab(Navigation.WORKBENCH, { params }) : Router.push(Navigation.WORKBENCH, { params });
    setKeyword('');
    closeSearch();
    dispatch(StoreActions.setActiveTreeType(nodePrivate ? ConfigConstant.Modules.PRIVATE : ConfigConstant.Modules.CATALOG));
  };

  const Empty = () => (
    <div className={styles.emptyResult}>
      <Image src={EmptyResultIcon} alt={t(Strings.quick_search_not_found)} />
      <div className={styles.tip}>{t(Strings.quick_search_not_found)}</div>
    </div>
  );

  useEffect(() => {
    const savedKeyword = sessionStorage.getItem('searchKeyword');
    const savedData = sessionStorage.getItem('searchData');
    if (savedKeyword) {
      setKeyword(savedKeyword);
      getNodeList(savedKeyword);
    }
    if (savedData) {
      setDataNodeList(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('searchKeyword', keyword);
    if (dataNodeList.length > 0) {
      sessionStorage.setItem('searchData', JSON.stringify(dataNodeList));
    }
  }, [keyword, dataNodeList]);

  return (
    <div className={classnames(styles.searchWrapper, className)} ref={ref}>
      <div className={styles.searchContent}>
        <Form onFinish={handleSubmit} className={styles.search}>
          <TextInput
            ref={inputRef as any}
            className={styles.searchInput}
            size="small"
            placeholder={
              isMobile
                ? t(Strings.quick_search_placeholder)
                : t(Strings.search_node_pleaseholder, { shortcutKey: getShortcutKeyString(ShortcutActionName.SearchNode) })
            }
            autoFocus
            lineStyle
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            suffix={
              keyword && (
                <div onClick={clearKeyword} className={styles.closeBtn}>
                  <Typography variant="body4" color={colors.textBrandDefault}>
                    {t(Strings.clear)}
                  </Typography>
                </div>
              )
            }
          />
        </Form>
        {!keyword ? (
          <DefaultContent />
        ) : (
          <>
            <TypeTab nodeType={tabType} onChange={setTabType} />
            {!loading ? (
              <>
                {!totalSearchResultItemsCount ? (
                  <Empty />
                ) : (
                  <div className={styles.nodeList} onClick={handleNodeClick} style={{ background: 'transparent' }} ref={listContainerRef}>
                    {nodeList.map((node) => {
                      const nodeClasses = nodeList[currentIndex]?.nodeId === node.nodeId ? `${styles.hover} active` : '';
                      return <Node key={node.nodeId} node={node} onMouseDown={(e) => handleNodeClick(e, node.nodePrivate)} className={nodeClasses} />;
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.loadingWrap}>
                <Loading className={styles.loading} showText={false} />
                <Typography color={colors.textCommonTertiary} variant={'body2'}>
                  {t(Strings.quick_search_loading)}
                </Typography>
              </div>
            )}
          </>
        )}
      </div>
      {!isMobile && keyword && <FooterTips shortcutEsc={!keyword} />}
    </div>
  );
};
