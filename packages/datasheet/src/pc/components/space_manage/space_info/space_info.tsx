import { useContextMenu } from '@vikadata/components';
import { Api, Events, getLanguage, IApi, IReduxState, Player, ScreenWidth, StoreActions, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { SubscribeUsageTipType, triggerUsageAlert } from 'pc/common/billing';
import { subscribeUsageCheck } from 'pc/common/billing/subscribe_usage_check';
import { ScrollBar } from 'pc/common/guide/scroll_bar';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { isSocialPlatformEnabled } from 'pc/components/home/social_platform';
import { useDispatch, useResponsive, useSideBarVisible } from 'pc/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { DelConfirmModal, DelSpaceModal, DelSuccess, RecoverSpace } from './components';
import { SpaceContext } from './context';
import { ISpaceLevelType, LevelType } from './interface';
import { Lg, Md, Sm, Xs } from './layout';
import { DELETE_SPACE_CONTEXT_MENU_ID } from './utils';

export const SpaceInfo = () => {
  const { spaceInfo, spaceFeatures, subscription, spaceId } = useSelector(
    (state: IReduxState) => ({
      spaceInfo: state.space.curSpaceInfo,
      spaceFeatures: state.space.spaceFeatures,
      subscription: state.billing.subscription,
      spaceId: state.space.activeId,
    }),
    shallowEqual,
  );
  const { setSideBarVisible } = useSideBarVisible();
  const [isDelConfirmModal, setIsDelConfirmModal] = useState(false);
  const [isDelSpaceModal, setIsDelSpaceModal] = useState(false);
  const [isDelSuccessModal, setIsDelSuccessModal] = useState(false);
  const level = (subscription ? subscription.product.toLowerCase() : LevelType.Bronze) as ISpaceLevelType;
  const dispatch = useDispatch();
  useMount(() => {
    spaceId && dispatch(StoreActions.getSpaceInfo(spaceId));
    Player.doTrigger(Events.space_setting_overview_shown);
  });

  useMount(() => {
    setTimeout(() => {
      // 文件数量
      if (subscribeUsageCheck.shouldAlertToUser('maxSheetNums', spaceInfo?.sheetNums, true)) {
        triggerUsageAlert('maxSheetNums', { usage: spaceInfo?.sheetNums }, SubscribeUsageTipType.Alert);
        return;
      }
      // 记录行数
      if (subscribeUsageCheck.shouldAlertToUser('maxRowsInSpace', spaceInfo?.recordNums, true)) {
        triggerUsageAlert('maxRowsInSpace', { usage: spaceInfo?.recordNums }, SubscribeUsageTipType.Alert);
        return;
      }
      // 高级视图
      // 甘特图
      if (subscribeUsageCheck.shouldAlertToUser('maxGanttViewsInSpace', spaceInfo?.ganttViewNums, true)) {
        triggerUsageAlert('maxGanttViewsInSpace', { usage: spaceInfo?.ganttViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      // 相册视图
      if (subscribeUsageCheck.shouldAlertToUser('maxGalleryViewsInSpace', spaceInfo?.galleryViewNums, true)) {
        triggerUsageAlert('maxGalleryViewsInSpace', { usage: spaceInfo?.galleryViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      // 日历视图
      if (subscribeUsageCheck.shouldAlertToUser('maxCalendarViewsInSpace', spaceInfo?.calendarViewNums, true)) {
        triggerUsageAlert('maxCalendarViewsInSpace', { usage: spaceInfo?.calendarViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      // 看板视图
      if (subscribeUsageCheck.shouldAlertToUser('maxKanbanViewsInSpace', spaceInfo?.kanbanViewNums, true)) {
        triggerUsageAlert('maxKanbanViewsInSpace', { usage: spaceInfo?.kanbanViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      // 表单
      if (subscribeUsageCheck.shouldAlertToUser('maxFormViewsInSpace', spaceInfo?.formViewNums, true)) {
        triggerUsageAlert('maxFormViewsInSpace', { usage: spaceInfo?.formViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      // 附件容量
      if (subscribeUsageCheck.shouldAlertToUser('maxCapacitySizeInBytes', spaceInfo?.capacityUsedSizes, true)) {
        triggerUsageAlert('maxCapacitySizeInBytes', { usage: spaceInfo?.capacityUsedSizes }, SubscribeUsageTipType.Alert);
        return;
      }
    }, 0);
  });

  const { clientWidth, screenIsAtMost } = useResponsive();
  const [adData, setAd] = useState<IApi.IAdData | null>(null);
  const isMobile = screenIsAtMost(ScreenSize.md);

  useEffect(() => {
    Api.getSpaceAdList().then(res => {
      const data = res.data;
      const lang = getLanguage();
      const isZh = /^zh/i.test(lang);
      if (!isZh) {
        data.desc = data.descEn || data.desc;
        data.linkText = data.linkTextEn || data.linkText;
      }
      console.log(setAd);
      setAd(data);
    });
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSideBarVisible(false);
    }
  }, [isMobile, setSideBarVisible]);

  const contextValue = useMemo(() => {
    return { adData };
  }, [adData]);

  const Layout = useMemo(() => {
    if (clientWidth < ScreenWidth.sm) {
      return Xs;
    } else if (clientWidth < ScreenWidth.xl) {
      return Sm;
    } else if (clientWidth < ScreenWidth.xxl) {
      return Md;
    }
    return Lg;
  }, [clientWidth]);
  const handleUpgrade = useCallback(() => {}, []);
  const { show: showContextMenu } = useContextMenu({ id: DELETE_SPACE_CONTEXT_MENU_ID });

  const handleDelSpace = useCallback(() => {
    if (spaceInfo && isSocialPlatformEnabled(spaceInfo)) {
      Modal.warning({
        title: t(Strings.kindly_reminder),
        content: t(Strings.third_party_integration_info),
      });
      return;
    }

    setIsDelConfirmModal(true);
  }, [spaceInfo]);

  if (spaceInfo && spaceInfo.delTime) {
    return <RecoverSpace />;
  }

  const layoutProps = {
    handleDelSpace,
    showContextMenu,
    level,
    subscription: subscription!,
    spaceId: spaceId!,
    spaceInfo: spaceInfo!,
    spaceFeatures: spaceFeatures!,
    onUpgrade: handleUpgrade,
    isMobile,
  };

  return (
    <SpaceContext.Provider value={contextValue}>
      <ScrollBar style={{ width: '100%', height: '100%' }}>
        <Layout {...layoutProps} />
        {isDelConfirmModal && (
          <DelConfirmModal setIsDelSpaceModal={setIsDelSpaceModal} setIsDelConfirmModal={setIsDelConfirmModal} isMobile={isMobile} />
        )}
        {isDelSpaceModal && <DelSpaceModal setIsDelSpaceModal={setIsDelSpaceModal} setIsDelSuccessModal={setIsDelSuccessModal} />}
        {isDelSuccessModal && <DelSuccess tip={t(Strings.tip_del_success)} />}
      </ScrollBar>
    </SpaceContext.Provider>
  );
};
