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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useContextMenu } from '@apitable/components';
import { Events, IReduxState, Player, ScreenWidth, StoreActions, Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { ScrollBar } from 'pc/components/scroll_bar';
import { useDispatch, useResponsive, useSideBarVisible } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { DelConfirmModal, DelSpaceModal, DelSuccess, RecoverSpace } from './components';
import { ISpaceLevelType, LevelType } from './interface';
import { Lg, Md, Sm, Xs } from './layout';
import { DELETE_SPACE_CONTEXT_MENU_ID } from './utils';
// @ts-ignore
import { subscribeUsageCheck } from 'enterprise/billing/subscribe_usage_check';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';
// @ts-ignore
import { isSocialPlatformEnabled } from 'enterprise/home/social_platform/utils';

export const SpaceInfo = () => {
  const { spaceInfo, spaceFeatures, subscription, spaceId } = useAppSelector(
    (state: IReduxState) => ({
      spaceInfo: state.space.curSpaceInfo,
      spaceFeatures: state.space.spaceFeatures,
      subscription: state.billing?.subscription,
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
      if (!SubscribeUsageTipType || !triggerUsageAlert || !subscribeUsageCheck) return;
      if (subscribeUsageCheck.shouldAlertToUser('maxSheetNums', spaceInfo?.sheetNums, true)) {
        triggerUsageAlert('maxSheetNums', { usage: spaceInfo?.sheetNums }, SubscribeUsageTipType.Alert);
        return;
      }
      if (subscribeUsageCheck.shouldAlertToUser('maxRowsInSpace', spaceInfo?.recordNums, true)) {
        triggerUsageAlert('maxRowsInSpace', { usage: spaceInfo?.recordNums }, SubscribeUsageTipType.Alert);
        return;
      }
      if (subscribeUsageCheck.shouldAlertToUser('maxGanttViewsInSpace', spaceInfo?.ganttViewNums, true)) {
        triggerUsageAlert('maxGanttViewsInSpace', { usage: spaceInfo?.ganttViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      if (subscribeUsageCheck.shouldAlertToUser('maxGalleryViewsInSpace', spaceInfo?.galleryViewNums, true)) {
        triggerUsageAlert('maxGalleryViewsInSpace', { usage: spaceInfo?.galleryViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      if (subscribeUsageCheck.shouldAlertToUser('maxCalendarViewsInSpace', spaceInfo?.calendarViewNums, true)) {
        triggerUsageAlert('maxCalendarViewsInSpace', { usage: spaceInfo?.calendarViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      if (subscribeUsageCheck.shouldAlertToUser('maxKanbanViewsInSpace', spaceInfo?.kanbanViewNums, true)) {
        triggerUsageAlert('maxKanbanViewsInSpace', { usage: spaceInfo?.kanbanViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      if (subscribeUsageCheck.shouldAlertToUser('maxFormViewsInSpace', spaceInfo?.formViewNums, true)) {
        triggerUsageAlert('maxFormViewsInSpace', { usage: spaceInfo?.formViewNums }, SubscribeUsageTipType.Alert);
        return;
      }
      if (subscribeUsageCheck.shouldAlertToUser('maxCapacitySizeInBytes', spaceInfo?.capacityUsedSizes, true)) {
        triggerUsageAlert('maxCapacitySizeInBytes', { usage: spaceInfo?.capacityUsedSizes }, SubscribeUsageTipType.Alert);
        return;
      }
    }, 0);
  });

  const { clientWidth, screenIsAtMost } = useResponsive();
  // const [adData, setAd] = useState<IApi.IAdData | null>(null);
  const isMobile = screenIsAtMost(ScreenSize.md);

  // useEffect(() => {
  //   Api.getSpaceAdList().then((res: any) => {
  //     const data = res;
  //     const lang = getLanguage();
  //     const isZh = /^zh/i.test(lang);
  //     if (!isZh) {
  //       data.desc = data.descEn || data.desc;
  //       data.linkText = data.linkTextEn || data.linkText;
  //     }
  //     setAd(data);
  //   });
  // }, []);

  useEffect(() => {
    if (isMobile) {
      setSideBarVisible(false);
    }
  }, [isMobile, setSideBarVisible]);

  // const contextValue = useMemo(() => {
  //   return { adData };
  // }, [adData]);

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
    if (spaceInfo && isSocialPlatformEnabled?.(spaceInfo)) {
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
    // <SpaceContext.Provider value={contextValue}>
    <ScrollBar style={{ width: '100%', height: '100%' }}>
      <Layout {...layoutProps} />
      {isDelConfirmModal && (
        <DelConfirmModal setIsDelSpaceModal={setIsDelSpaceModal} setIsDelConfirmModal={setIsDelConfirmModal} isMobile={isMobile} />
      )}
      {isDelSpaceModal && <DelSpaceModal setIsDelSpaceModal={setIsDelSpaceModal} setIsDelSuccessModal={setIsDelSuccessModal} />}
      {isDelSuccessModal && <DelSuccess tip={t(Strings.tip_del_success)} />}
    </ScrollBar>
    // </SpaceContext.Provider>
  );
};
