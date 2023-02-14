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

import { Events, IReduxState, Player } from '@apitable/core';
import { useMount } from 'ahooks';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';
import { usePageParams, useQuery, useRequest, useUserRequest } from 'pc/hooks';
// @ts-ignore
import { WecomContactWrapper, isDingtalkSkuPage } from 'enterprise';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { MobileSideBar } from '../mobile_side_bar';
import styles from './style.module.less';
import cls from 'classnames';

const TemplateCentre: FC<React.PropsWithChildren<unknown>> = props => {
  const { getLoginStatusReq } = useUserRequest();
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const { run: getLoginStatus, loading } = useRequest(getLoginStatusReq, { manual: true });
  const query = useQuery();
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage?.(purchaseToken);
  usePageParams();

  useMount(() => {
    if (!spaceId) {
      getLoginStatus();
    }
    Player.doTrigger(Events.template_center_shown);
  });

  if (loading) {
    return null;
  }

  const childComponent = spaceId ? (
    <SideWrapper>
      <div className={styles.bg} data-height="20px" />
      <div className={cls(styles.templateCentre, styles.wrapper)}>{props.children}</div>
    </SideWrapper>
  ) : (
    <>
      {!isSkuPage && (
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileSideBar />
        </ComponentDisplay>
      )}
      <div className={styles.templateCentre}>{props.children}</div>
    </>
  );

  return (
    <>
      {
        WecomContactWrapper ? 
          <WecomContactWrapper>
            {childComponent}
          </WecomContactWrapper> :
          childComponent
      }
    </>
  );
};

export default TemplateCentre;
