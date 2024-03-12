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
import { Drawer } from 'antd';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { useQuery, useSideBarVisible } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { CommonSide } from '../common_side';
import { Navigation } from '../navigation';
import styles from './style.module.less';

export const MobileSideBar: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const spaceId = useAppSelector((state) => state.space.activeId);
  const router = useRouter();
  const pathname = router.asPath;

  const matchedTemplateCentre = pathname.includes('/template');

  const query = useQuery();

  // FOLDER = 'fod',
  // DATASHEET = 'dst',
  // FORM = 'fom',
  // DASHBOARD = 'dsb',
  // MIRROR = 'mir',

  const matchedNode = RegExp('/[fod|dst|fom|dsb|mir]').test(pathname);

  /**
   * When cutting space to keep the sidebar normal pop-up,
   * but the switch operation currently needs to refresh the page,
   * can not get the state of the previous step, need to persist a flag,
   * to get the user's intention to switch space
   */
  const hasToggleSpaceIntent = localStorage.getItem('toggleSpaceId');

  // Compatible with third-party logins or jumps to nodes from other routes e.g. `/workbench` => `/workbench/:nodeId`
  const hasOtherRouteToSpaceIntent = !matchedNode && spaceId;

  useMount(() => {
    if (matchedNode || (hasOtherRouteToSpaceIntent && !hasToggleSpaceIntent)) {
      setSideBarVisible(false);
      localStorage.removeItem('toggleSpaceId');
    }
  });

  useEffect(() => {
    if (query.has('comment')) {
      setSideBarVisible(false);
    }
  }, [query, setSideBarVisible]);

  return (
    <Drawer
      width={'80%'}
      open={sideBarVisible}
      onClose={() => {
        setSideBarVisible(false);
      }}
      placement="left"
      closable={false}
      className={styles.mobileDrawer}
      push={{ distance: -800 }}
    >
      <div
        className={classNames(styles.mobileSideWrap, {
          [styles.matchedTemplateCentre]: matchedTemplateCentre,
        })}
      >
        {spaceId && <Navigation />}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <CommonSide />
        </div>
      </div>
    </Drawer>
  );
};
