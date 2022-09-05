import { Button, TextButton } from '@vikadata/components';
import { Api, IReduxState, NOTIFICATION_ID, StoreActions, Strings, t } from '@vikadata/core';
import { useMount, useSize } from 'ahooks';
import { Tabs } from 'antd';
import { Loading } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useNotificationRequest, useRequest, useResponsive } from 'pc/hooks';
import QueueAnim from 'rc-queue-anim';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ToReadIcon from 'static/icon/workbench/notification/workbench_icon_notification_read.svg';
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

export const Notification: FC = () => {
  const { unReadCount, readCount, unReadNoticeList, readNoticeList, newNoticeListFromWs } = useSelector(
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
  //  未读消息列表是否渲染完成，第一次渲染已读消息列表时以及查看更多已读消息列表时将其置为false
  const [unReadedListRendered, setUnReadedListRendered] = useState(false);
  // 已读消息列表是否渲染完成，第一次渲染已读消息列表时以及查看更多已读消息列表时将其置为false
  const [readedListRendered, setReadedListRendered] = useState(false);
  const { getNotificationPage } = useNotificationRequest();
  // 首次进入此页面，请求消息数量请求消息列表， 只执行一次
  const { run: getAllData, loading: firstLoading } = useRequest(
    () =>
      Api.getNotificationStatistics().then(async res => {
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

  // 查看更多未读消息列表
  const { run: getMoreUnRead, loading: moreUnReadLoading } = useRequest(getNotificationPage, { manual: true });
  // 查看更多已读消息列表
  const { run: getMoreRead, loading: moreReadLoading } = useRequest(getNotificationPage, { manual: true });
  // 一键处理
  const { run: allToRead, loading: allToReadBtnLoading } = useRequest(
    () =>
      Api.transferNoticeToRead([], true).then(res => {
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
      // 清空消息列表
      dispatch(StoreActions.updateReadNoticeList([]));
      dispatch(StoreActions.updateUnReadNoticeList([]));
    };
  }, [dispatch]);

  const onTabActiveChange = active => {
    setTabActiveKey(active);
  };
  // 点击查看新推送过来的消息
  const toNewMsg = () => {
    if (tabActiveKey === TabKey.Processed) {
      setTabActiveKey(TabKey.Unprocessed);
    }
    dispatch(StoreActions.getNewMsgFromWsAndLook(true));
  };

  // 点击查看更多未处理消息
  const moreUnReadMsg = () => {
    const rowNo = unReadCount - unReadNoticeList.length + 1;
    setUnReadedListRendered(false);
    getMoreUnRead(false, rowNo);
  };
  // 点击查看更多已处理消息
  const moreReadMsg = () => {
    const rowNo = readCount - readNoticeList.length + 1;
    setReadedListRendered(false);
    getMoreRead(true, rowNo);
  };
  // 判断已读消息列表是否渲染完成
  const noticeListRended = (e, tabKey: string) => {
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
    // 消息列表处于moreLoading时，显示「加载中」，loaded并且处于列表渲染过程中不显示，列表渲染完成后显示「加载更多」
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
              <TextButton onClick={allToRead} prefixIcon={<ToReadIcon fill="currentColor" />}>
                {t(Strings.mark_all_as_processed)}
              </TextButton>
            )
          ) : (
            <Button
              color="primary"
              onClick={allToRead}
              loading={allToReadBtnLoading}
              prefixIcon={<ToReadIcon fill="currentColor" width={16} height={16} />}
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
        <Tabs onChange={onTabActiveChange} activeKey={tabActiveKey}>
          <TabPane tab={t(Strings.unprocessed) + `(${unReadCount})`} key={TabKey.Unprocessed}>
            {unReadCount !== 0 && !firstLoading && (
              <div className={styles.tabContent} id={tabActiveKey === TabKey.Unprocessed ? NOTIFICATION_ID.NOTICE_LIST_WRAPPER : ''}>
                {unReadNoticeList.length > 0 && (
                  <div className={styles.cardWrapper}>
                    <QueueAnim ease="easeInQuint" duration={500} onEnd={e => noticeListRended(e, TabKey.Unprocessed)}>
                      {unReadNoticeList.map(item => (
                        <Card key={item.id} data={item} />
                      ))}
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
                    <QueueAnim ease="easeInQuint" duration={500} onEnd={e => noticeListRended(e, TabKey.Processed)}>
                      {readNoticeList.map(item => (
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
