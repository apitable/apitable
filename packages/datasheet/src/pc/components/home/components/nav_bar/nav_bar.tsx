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

import { compact } from 'lodash';
import { ActionType } from 'pc/components/home/pc_home';
import { getEnvVariables } from 'pc/utils/env';
import styles from './style.module.less';

interface INavBar {
  action?: ActionType;
  gap?: number
}

export const NavBar: React.FC<React.PropsWithChildren<INavBar>> = (props) => {
  const { gap = 32, action } = props;
  const linkList = compact([
    {
      href: 'https://help.apitable.com',
      target: '_blank',
      text: 'Help Center',
    },
    {
      href: 'https://apitable.com',
      target: '_blank',
      text: 'About',
    },
    action === ActionType.BindAppSumo && {
      href: 'https://aitable.ai/privacy-policy',
      target: '_blank',
      text: 'Privacy Policy',
    },
    action === ActionType.BindAppSumo && {
      href: 'https://aitable.ai/terms-and-conditions',
      target: '_blank',
      text: 'Terms and Conditions',
    },
  ]);

  if (getEnvVariables().LOGIN_SOCIAL_ICONS_DISABLE) {
    return null;
  }

  return (
    <div className={styles.navBarWrap}>
      {linkList.map((item, index) => {
        const A = (
          <a href={item.href} target={item.target}>
            {item.text}
          </a>
        );
        return (
          <>
            {A}
            {index + 1 < linkList.length && <div style={{ margin: `0 ${gap / 2}px` }}>|</div>}
          </>
        );
      })}
    </div>
  );
};
