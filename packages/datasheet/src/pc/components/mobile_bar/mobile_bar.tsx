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
import { useThemeColors } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { ListOutlined } from '@apitable/icons';
import { useSideBarVisible } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

export const MobileBar: React.FC<React.PropsWithChildren<{ title?: string }>> = ({ title }) => {
  const { datasheetId } = useAppSelector((state) => state.pageParams);
  const colors = useThemeColors();
  const currentView = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const { setSideBarVisible } = useSideBarVisible();
  const router = useRouter();
  const pathname = router.asPath;

  const matchedOrganization = pathname.includes('/org');

  const matchedWorkSpace = datasheetId && currentView;

  const matchedTemplateCentre = pathname.includes('/template');

  return (
    <div className={styles.shareMobileBar}>
      <div
        onClick={() => {
          setSideBarVisible && setSideBarVisible(true);
        }}
        className={styles.side}
      >
        <ListOutlined size={24} color={colors.firstLevelText} />
      </div>

      <div className={styles.middle}>
        {(matchedOrganization || title) && (
          <div className={styles.matchedOrganization}>
            <span>{title || t(Strings.contacts)}</span>
          </div>
        )}

        {matchedTemplateCentre && !matchedWorkSpace && (
          <div className={styles.matchedOrganization}>
            <span>{t(Strings.nav_templates)}</span>
          </div>
        )}
      </div>
      <div className={styles.right} />
    </div>
  );
};
