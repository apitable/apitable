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
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useWxTitleMap } from '../konva_grid';
import { IntercomProvider } from 'react-use-intercom';
// @ts-ignore
import { IntercomWrapper, WatermarkWrapper, WecomContactWrapper, isDingtalkSkuPage, isEnterprise } from 'enterprise';

export const SideWrapper = (props: { children: any }) => {
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const dispatch = useAppDispatch();
  const shortcutKeyPanelVisible = useSelector((state: IReduxState) => state.space.shortcutKeyPanelVisible);
  const query = useQuery();
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage?.(purchaseToken);
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

  useEffect(() => {
    dispatch(StoreActions.spaceResource());
    if (!spaceId) return;
    isEnterprise && dispatch(StoreActions.fetchMarketplaceApps(spaceId));
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

  const Wrapper = IntercomWrapper || IntercomProvider;
  const wrapperChildComponent = (
    <Wrapper>
      {
        WatermarkWrapper ? 
          <WatermarkWrapper unitTitle={unitTitle}>
            {childComponent}
          </WatermarkWrapper> :
          childComponent
      }
    </Wrapper>
  );

  return (
    <>
      {
        WecomContactWrapper ? 
          <WecomContactWrapper>
            {wrapperChildComponent}
          </WecomContactWrapper> :
          wrapperChildComponent
      }
    </>
  );
};
