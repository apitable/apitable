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

import { useMount, useSize } from 'ahooks';
import { Tabs } from 'antd';
import QueueAnim from 'rc-queue-anim';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { Button, TextButton } from '@apitable/components';
import { Api, IReduxState, NOTIFICATION_ID, StoreActions, Strings, t } from '@apitable/core';
import { NotificationCheckOutlined } from '@apitable/icons';
import { Loading } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useNotificationRequest, useRequest, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { Card } from './card';
import { NoData } from './no_data';
import styles from './style.module.less';

const { TabPane } = Tabs;

enum TabKey {
  Unprocessed = 'unProcessed',
  Processed = 'processed',
}

interface ITabKey {
  unProcessed: string;
  processed: string;
}

type ITabKeyType = keyof ITabKey;
const DOM_WRAP_CLS = styles.notification;

export const Notification: FC<React.PropsWithChildren<any>> = () => {
  const { unReadCount, readCount, unReadNoticeList, readNoticeList, newNoticeListFromWs } = useAppSelector(
    (state: IReduxState) => ({
      unReadCount: state.notification.unReadCount,
      readCount: state.notification.readCount,
      unReadNoticeList: state.notification.unReadNoticeList,
      readNoticeList: state.notification.readNoticeList,
      newNoticeListFromWs: state.notification.newNoticeListFromWs,
    }),
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [tabActiveKey, setTabActiveKey] = useState(TabKey.Unprocessed);
  const [unReadedListRendered, setUnReadedListRendered] = useState(false);
  const [readedListRendered, setReadedListRendered] = useState(false);
  const { getNotificationPage } = useNotificationRequest();
  const { run: getAllData, loading: firstLoading } = useRequest(
    () =>
      Api.getNotificationStatistics().then(async (res) => {
        const { success, data } = res.data;
        if (!success) {
          return;
        }
        const { readCount, unReadCount } = data;
        dispatch(StoreActions.updateUnReadMsgCount(unReadCount));
        dispatch(StoreActions.updateReadMsgCount(readCount));
        const unReadLoaded = unReadCount > 0 ? await getNotificationPage(false) : true;
        const readLoaded = readCount > 0 ? await getNotificationPage(true) : true;
        return unReadLoaded && readLoaded;
      }),
    { manual: true },
  );

  const { run: getMoreUnRead, loading: moreUnReadLoading } = useRequest(getNotificationPage, { manual: true });
  const { run: getMoreRead, loading: moreReadLoading } = useRequest(getNotificationPage, { manual: true });
  const { run: allToRead, loading: allToReadBtnLoading } = useRequest(
    () =>
      Api.transferNoticeToRead([], true).then((res) => {
        const { success } = res.data;
        if (!success) return;
        dispatch(StoreActions.delUnReadNoticeList([], true));
        getAllData();
      }),
    { manual: true },
  );
  useMount(() => {
    getAllData();
  });

  useEffect(() => {
    return () => {
      dispatch(StoreActions.updateReadNoticeList([]));
      dispatch(StoreActions.updateUnReadNoticeList([]));
    };
  }, [dispatch]);

  const onTabActiveChange = (active: string) => {
    setTabActiveKey(active as TabKey);
  };
  // Click to see the new tweeted messages
  const toNewMsg = () => {
    if (tabActiveKey === TabKey.Processed) {
      setTabActiveKey(TabKey.Unprocessed);
    }
    dispatch(StoreActions.getNewMsgFromWsAndLook(true));
  };

  const moreUnReadMsg = () => {
    const rowNo = unReadCount - unReadNoticeList.length + 1;
    setUnReadedListRendered(false);
    getMoreUnRead(false, rowNo);
  };
  const moreReadMsg = () => {
    const rowNo = readCount - readNoticeList.length + 1;
    setReadedListRendered(false);
    getMoreRead(true, rowNo);
  };
  // Determine if the list of read messages has been rendered
  const noticeListRended = (e: any, tabKey: string) => {
    const lastNotice = tabKey === TabKey.Unprocessed ? unReadNoticeList[unReadNoticeList.length - 1] : readNoticeList[readNoticeList.length - 1];
    if (e.key === lastNotice.id) {
      tabKey === TabKey.Unprocessed ? setUnReadedListRendered(true) : setReadedListRendered(true);
    }
  };

  const renderListBottom = (tabKey: ITabKeyType) => {
    const rendered = tabKey === TabKey.Unprocessed ? unReadedListRendered : readedListRendered;
    const moreLoading = tabKey === TabKey.Unprocessed ? moreUnReadLoading : moreReadLoading;
    const numEqual = tabKey === TabKey.Unprocessed ? unReadCount === unReadNoticeList.length : readCount === readNoticeList.length;
    const clickFun = tabKey === TabKey.Unprocessed ? moreUnReadMsg : moreReadMsg;
    // When the message list is moreLoading, it shows "Loading", loaded and in the process of rendering the list is not displayed,
    // and after the list is rendered, it shows "Loading more".
    const visible = moreLoading || rendered ? 'visible' : 'hidden';
    const dom = numEqual ? (
      t(Strings.end)
    ) : moreLoading ? (
      <Button loading variant="jelly">
        {t(Strings.loading)}
      </Button>
    ) : (
      <TextButton onClick={clickFun} color="primary">
        {t(Strings.click_load_more)}
      </TextButton>
    );
    return (
      <div className={styles.tabBottomText} style={{ margin: numEqual ? '24px 0 48px' : '14px 0 38px', visibility: visible }}>
        {dom}
      </div>
    );
  };

  const AllToReadButton = (): React.ReactElement => {
    if (tabActiveKey !== TabKey.Processed && unReadCount > 0) {
      return (
        <div className={styles.allToReadWrap}>
          {isMobile ? (
            allToReadBtnLoading ? (
              <Loading />
            ) : (
              <TextButton onClick={allToRead} prefixIcon={<NotificationCheckOutlined color="currentColor" />}>
                {t(Strings.mark_all_as_processed)}
              </TextButton>
            )
          ) : (
            <Button
              color="primary"
              onClick={allToRead}
              loading={allToReadBtnLoading}
              prefixIcon={<NotificationCheckOutlined color="currentColor" size={16} />}
              variant="jelly"
            >
              {t(Strings.mark_all_as_processed)}
            </Button>
          )}
        </div>
      );
    }
    return <></>;
  };

  const contentSize = useSize(document.body);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <div className={DOM_WRAP_CLS}>
      <div className={styles.content}>
        <div className={styles.top}>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div className={styles.title}>
              {t(Strings.notification_center)}
              <AllToReadButton />
            </div>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <AllToReadButton />
          </ComponentDisplay>
        </div>
        <Tabs className={styles.tabs} onChange={onTabActiveChange} activeKey={tabActiveKey}>
          <TabPane tab={t(Strings.unprocessed) + `(${unReadCount})`} key={TabKey.Unprocessed}>
            {unReadCount !== 0 && !firstLoading && (
              <div className={styles.tabContent} id={tabActiveKey === TabKey.Unprocessed ? NOTIFICATION_ID.NOTICE_LIST_WRAPPER : ''}>
                {unReadNoticeList.length > 0 && (
                  <div className={styles.cardWrapper}>
                    <QueueAnim ease="easeInQuint" duration={500} onEnd={(e) => noticeListRended(e, TabKey.Unprocessed)}>
                      {unReadNoticeList.map((item) => {
                        if (['subscribed_record_archived', 'subscribed_record_unarchived'].includes(item.templateId)) return null;
                        return <Card key={item.id} data={item} />;
                      })}
                    </QueueAnim>
                  </div>
                )}
                {renderListBottom(TabKey.Unprocessed)}
              </div>
            )}
            {firstLoading && <Loading className={styles.noticeListLoading} />}
            {unReadCount === 0 && !firstLoading && <NoData />}
          </TabPane>
          <TabPane tab={t(Strings.processed) + `(${readCount})`} key={TabKey.Processed}>
            {readCount !== 0 && !firstLoading && (
              <div
                className={styles.tabContent}
                id={tabActiveKey === TabKey.Processed ? NOTIFICATION_ID.NOTICE_LIST_WRAPPER : ''}
                style={{
                  height: isMobile && contentSize ? Math.floor(contentSize.height * 0.9) - 140 : '100%',
                }}
              >
                {readNoticeList.length > 0 && (
                  <div className={styles.cardWrapper}>
                    <QueueAnim ease="easeInQuint" duration={500} onEnd={(e) => noticeListRended(e, TabKey.Processed)}>
                      {readNoticeList.map((item) => (
                        <Card key={item.id} data={item} isProcessed />
                      ))}
                    </QueueAnim>
                  </div>
                )}
                {renderListBottom(TabKey.Processed)}
              </div>
            )}
            {firstLoading && <Loading className={styles.noticeListLoading} />}
            {readCount === 0 && !firstLoading && <NoData />}
          </TabPane>
        </Tabs>
      </div>
      <div className={styles.newMsgFromWs} onClick={toNewMsg} style={{ visibility: newNoticeListFromWs.length > 0 ? 'visible' : 'hidden' }}>
        {t(Strings.message_display_count, {
          count: newNoticeListFromWs.length,
        })}
      </div>
    </div>
  );
};
