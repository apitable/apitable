import { IReduxState, StoreActions } from '@apitable/core';
import { values } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { MobileSideBar } from 'pc/components/mobile_side_bar';
import { Navigation } from 'pc/components/navigation';
import styles from 'pc/components/route_manager/style.module.less';
import { ShortcutsPanel } from 'pc/components/shortcuts_panel';
import { useQuery } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useWecomContact } from 'pc/hooks/use_wecom_contact';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isDingtalkSkuPage } from '../home/social_platform';
import { useWxTitleMap } from '../konva_grid';
// @ts-ignore
import { IntercomWrapper, WatermarkWrapper } from 'enterprise';

export const SideWrapper = props => {
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const dispatch = useAppDispatch();
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
  const unitTitle = values(unitTitleMap)[0];

  useWecomContact();

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
  const isWorkbench = window.location.pathname.startsWith('/workbench');

  const childComponent = (
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
  );

  return (
    <IntercomWrapper>
      {
        WatermarkWrapper ? 
          <WatermarkWrapper unitTitle={unitTitle}>
            {childComponent}
          </WatermarkWrapper> :
          childComponent
      }
    </IntercomWrapper>
  );
};
