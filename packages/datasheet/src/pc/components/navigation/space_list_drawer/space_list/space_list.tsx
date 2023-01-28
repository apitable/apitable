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

import { Button, Skeleton } from '@apitable/components';
import { getMaxManageableSpaceCount, ISpaceInfo, Strings, t } from '@apitable/core';
import { useRequest } from 'ahooks';
import { Space, Tabs } from 'antd';
import classnames from 'classnames';
import Image from 'next/image';
import { Tooltip } from 'pc/components/common';
// @ts-ignore
import { isSocialWecom } from 'enterprise';
import { useSpaceRequest } from 'pc/hooks';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EmptyManagableListPng from 'static/icon/account/account_img_createspace@2x.png';
import EmptyIntrantListPng from 'static/icon/datasheet/datasheet_img_modal_nospace.png';
import AddIcon from 'static/icon/space/space_icon_add@2x.png';
import { NavigationContext } from '../../navigation_context';
import { SpaceListItem } from './space_list_item';
import styles from './style.module.less';

enum TabPaneKeys {
  MANAGABLE = 'MANAGABLE',
  INTRANT = 'INTRANT',
}

const { TabPane } = Tabs;

export const SpaceList: FC = () => {
  /* Collection of space stations I manage */
  const [managableList, setManagableList] = useState<ISpaceInfo[]>([]);
  /* Collection of space stations I have joined (not including the collection of space stations I manage) */
  const [intrantList, setIntrantList] = useState<ISpaceInfo[]>([]);
  /* The currently active tab key */
  const [activeKey, setActiveKey] = useState<string>('');
  const { openCreateSpaceModal, closeSpaceListDrawer } = useContext(NavigationContext);
  const spaceId = useSelector(state => state.space.activeId);
  const { getSpaceListReq } = useSpaceRequest();
  const { data: spaceList, loading, run: runGetSpaceListReq } = useRequest(getSpaceListReq);
  // const { screenIsAtMost } = useResponsive();
  // const isMobile = screenIsAtMost(ScreenSize.md);

  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const isWecom = isSocialWecom?.(spaceInfo);

  useEffect(() => {
    if (spaceList && spaceList.length) {
      setManagableList(spaceList.filter(space => space.admin));
      setIntrantList(spaceList.filter(space => !space.admin));
    }
  }, [spaceList]);

  useEffect(() => {
    if (!intrantList.length && !managableList.length) {
      return;
    }
    if (intrantList.findIndex(space => space.spaceId === spaceId) !== -1) {
      setActiveKey(TabPaneKeys.INTRANT);
    } else {
      setActiveKey(TabPaneKeys.MANAGABLE);
    }
    // eslint-disable-next-line
  }, [intrantList, managableList]);

  const refreshList = useCallback(() => {
    runGetSpaceListReq();
  }, [runGetSpaceListReq]);

  const disable = managableList.length >= getMaxManageableSpaceCount();

  const openCreateSpaceModalHandler = () => {
    if (disable) {
      return;
    }
    closeSpaceListDrawer();
    openCreateSpaceModal();
  };

  const tabClickHandler = (key: string) => {
    setActiveKey(key as TabPaneKeys);
  };

  const CreateSpaceBtn = () => {
    return (
      <div
        className={classnames(styles.addSpace, disable && styles.disabled)}
        onClick={openCreateSpaceModalHandler}
      >
        <span className={styles.addIcon}>
          <Image src={AddIcon} alt={t(Strings.new_space)} />
        </span>
        <div
          className={styles.name}
        >
          {t(Strings.new_space)}
        </div>
      </div>
    );
  };

  const skeleton = () => {
    return (
      <div className={styles.skeleton}>
        <div className={styles.tab}>
          <Space size={30}>
            <Skeleton width="64px" height="32px" />
            <Skeleton width="64px" height="32px" />
          </Space>
        </div>
        <div style={{ display: 'flex' }}>
          <Skeleton circle style={{ width: '40px', height: '40px' }} />
          <div style={{ flexGrow: 1, marginLeft: 8 }}>
            <Skeleton width="38%" />
            <Skeleton />
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <Skeleton circle style={{ width: '40px', height: '40px' }} />
          <div style={{ flexGrow: 1, marginLeft: 8 }}>
            <Skeleton width="38%" />
            <Skeleton />
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <Skeleton circle style={{ width: '40px', height: '40px' }} />
          <div style={{ flexGrow: 1, marginLeft: 8 }}>
            <Skeleton width="38%" />
            <Skeleton />
          </div>
        </div>
      </div>
    );
  };

  const EmptyIntrantList = () => {
    return (
      <div className={styles.emptyList}>
        <Image src={EmptyIntrantListPng} alt="empty" width={240} height={180}/>
        <div className={styles.tip}>{t(Strings.intrant_space_empty_tip)}</div>
      </div>
    );
  };

  const EmptyManagableList = () => {
    return (
      <div className={styles.emptyList}>
        <Image src={EmptyManagableListPng} alt="empty" width={240} height={180} />
        {!isWecom && <div className={styles.tip}>{t(Strings.managable_space_empty_tip)}</div>}
        {!isWecom && <Button
          className={styles.newSpace}
          onClick={openCreateSpaceModalHandler}
          color="primary"
          block
        >
          {t(Strings.new_space)}
        </Button>}
      </div>
    );
  };

  if (loading || !activeKey) {
    return skeleton();
  }

  return (
    <div className={styles.spaceList}>
      <Tabs className={styles.tab} defaultActiveKey={activeKey} onTabClick={tabClickHandler} centered>
        <TabPane tab={t(Strings.managable_space_list)} key={TabPaneKeys.MANAGABLE}>
          {
            managableList.length ? (
              <div className={styles.scrollContainer}>
                {managableList.map(space => (
                  <SpaceListItem
                    key={space.spaceId}
                    spaceInfo={space}
                    actived={space.spaceId === spaceId}
                    managable
                  />
                ))}
                {!isWecom && (
                  disable ? <Tooltip
                    title={t(Strings.tooltip_workspace_up_to_bound_no_new, {
                      count: getMaxManageableSpaceCount(),
                    })}
                    trigger="click"
                    placement="top"
                  >
                    <span><CreateSpaceBtn /></span>
                  </Tooltip> : <CreateSpaceBtn />
                )
                }
              </div>
            ) : <EmptyManagableList />
          }
        </TabPane>
        <TabPane tab={t(Strings.intrant_space_list)} key={TabPaneKeys.INTRANT}>
          {
            intrantList.length ? (
              <div className={styles.scrollContainer}>
                {intrantList.map(space => (
                  <SpaceListItem
                    key={space.spaceId}
                    spaceInfo={space}
                    actived={space.spaceId === spaceId}
                    refreshList={refreshList}
                  />
                ))}
              </div>
            ) : <EmptyIntrantList />
          }
        </TabPane>
      </Tabs>
    </div>
  );
};
