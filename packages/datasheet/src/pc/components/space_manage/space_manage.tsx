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

import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import SplitPane from 'react-split-pane';
import { Strings, t } from '@apitable/core';
import { useResponsive } from 'pc/hooks';
import { CommonSide } from '../common_side';
import { MobileBar } from '../mobile_bar';
import styles from './style.module.less';

const _SplitPane: any = SplitPane;

const SpaceManage: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  const router = useRouter();
  const { clientWidth } = useResponsive();
  const isMobile = clientWidth <= 800;

  useEffect(() => {
    if (router.pathname === '/management') {
      router.replace('/management/overview');
    }
  }, [router]);

  return (
    <div className={styles.spaceManage}>
      {!isMobile ? (
        <_SplitPane defaultSize={280} minSize={180} maxSize={800} className={styles.navSplit}>
          <CommonSide />
          {children}
        </_SplitPane>
      ) : (
        <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <MobileBar title={t(Strings.space_setting)} />
          {children}
        </div>
      )}
    </div>
  );
};

export default SpaceManage;
