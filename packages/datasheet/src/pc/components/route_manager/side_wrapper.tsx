import { IReduxState, StoreActions } from '@vikadata/core';
import { useUnmount } from 'ahooks';
import { values } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileSideBar } from 'pc/components/mobile_side_bar';
import { Navigation } from 'pc/components/navigation';
import styles from 'pc/components/route_manager/style.module.less';
import { ShortcutsPanel } from 'pc/components/shortcuts_panel';
import { useQuery, useSpaceWatermark } from 'pc/hooks';
import { useWecomContact } from 'pc/hooks/use_wecom_contact';
import { useEffect } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isDingtalkSkuPage, isSocialWecom } from '../home/social_platform';
import { useWxTitleMap } from '../konva_grid';
import { IntercomWrapper } from 'pc/common/intercom';

export const SideWrapper = props => {
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const watermarkEnable = useSelector((state: IReduxState) => state.space.spaceFeatures?.watermarkEnable);
  const dispatch = useDispatch();
  const shortcutKeyPanelVisible = useSelector((state: IReduxState) => state.space.shortcutKeyPanelVisible);
  const query = useQuery();
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage(purchaseToken);
  const user = useSelector((state: IReduxState) => state.user.info);
  const { unitTitleMap } = useWxTitleMap({
    userNames: user
      ? [
        {
          name: user.memberName,
          unitId: user.unitId,
        },
      ]
      : undefined,
  });
  const curUnitTitle = values(unitTitleMap)[0];
  const { initSpaceWM, removeSpaceWM } = useSpaceWatermark({ manual: true, watermark_txt: curUnitTitle });
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const checkWx = isSocialWecom(spaceInfo) ? Boolean(curUnitTitle) : true;

  useWecomContact();

  useEffect(() => {
    if (watermarkEnable && checkWx) {
      initSpaceWM();
    } else if (!watermarkEnable) {
      removeSpaceWM();
    }
  }, [watermarkEnable, initSpaceWM, removeSpaceWM, spaceInfo, checkWx]);
  useUnmount(() => {
    removeSpaceWM();
  });
  useEffect(() => {
    dispatch(StoreActions.spaceResource());
    if (!spaceId) return;
    dispatch(StoreActions.fetchMarketplaceApps(spaceId));
    dispatch(StoreActions.getSpaceInfo(spaceId));
    dispatch(StoreActions.getSpaceFeatures());
  }, [dispatch, spaceId]);

  useEffect(() => {
    const eventBundle = new Map([
      [
        ShortcutActionName.Help,
        () => {
          dispatch(StoreActions.setShortcutKeyPanelVisible(!shortcutKeyPanelVisible));
        },
      ],
    ]);
    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key as any, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });

  const scrollFix = (e: React.UIEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  // 是否在工作台页面
  const isWorkbench = window.location.pathname.startsWith('/workbench');

  return (
    <IntercomWrapper>
      <div className={'layout-row f-g-1 ' + styles.spaceContainer} onScroll={scrollFix}>
        {!isSkuPage && (
          <>
            <ComponentDisplay minWidthCompatible={ScreenSize.md}>
           
              {!isWorkbench && <Navigation />}
            
            </ComponentDisplay>

            <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
              <MobileSideBar />
            </ComponentDisplay>
          </>
        )}

        {props.children}

        {!isSkuPage && shortcutKeyPanelVisible && <ShortcutsPanel />}
      </div>
    </IntercomWrapper>
  );
};
