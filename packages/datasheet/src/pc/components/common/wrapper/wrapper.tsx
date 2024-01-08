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

import { configResponsive, useResponsive, useScroll } from 'ahooks';
import classNames from 'classnames';
import { FC, useRef } from 'react';
import { useThemeMode } from '@apitable/components';
import BgPng from 'static/icon/space/space_img_bj.png';
import { Logo } from '../logo';
import styles from './style.module.less';

interface IWrapper {
  hiddenLogo?: boolean;
  className?: string;
}

export const Wrapper: FC<React.PropsWithChildren<IWrapper>> = ({ children, className, hiddenLogo = false }) => {
  const childrenWrapperRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll(childrenWrapperRef);
  configResponsive({
    large: 1023.98,
  });
  const responsive = useResponsive();
  const theme = useThemeMode();
  return (
    <div className={classNames(styles.wrapper, className)} style={{ position: 'relative' }}>
      <img className={styles.bg} src={BgPng.src} alt=""/>
      <div className={classNames(styles.logoWrapper, { [styles.shadow]: scroll?.top })}>
        {!hiddenLogo && <Logo theme={theme} size={responsive.large ? 'large' : 'small'} />}
      </div>
      <div ref={childrenWrapperRef} className={styles.childrenWrapper}>
        {children}
      </div>
    </div>
  );
};

export const LoginCard: FC<React.PropsWithChildren<{ className?: string }>> = (props) => {
  const { children, className } = props;
  return <div className={classNames(styles.loginCard, className)}>{children}</div>;
};
