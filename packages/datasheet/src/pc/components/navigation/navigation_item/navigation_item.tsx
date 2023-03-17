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

import { useHover, useMount } from 'ahooks';
import { AnimationItem } from 'lottie-web/index';
import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

export interface INavigationItemProps {
  animationData: any;
  style?: React.CSSProperties;
  id: string;
  loop?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NavigationItem: FC<React.PropsWithChildren<INavigationItemProps>> = ({
  animationData,
  loop,
  id,
  onClick,
  ...rest
}) => {
  const ref = useRef<any>();
  const isHovering = useHover(ref);
  const [animInstance, setAnimInstance] = useState<AnimationItem>();

  useMount(() => {
    import('lottie-web/build/player/lottie_svg').then(module => {
      const lottie = module.default;
      setAnimInstance(lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        autoplay: false,
        loop,
        animationData,
      }));
    });
  });

  const handleClick = () => {
    onClick && onClick();
  };

  useEffect(() => {
    if (!animInstance || isMobile) {
      return;
    }
    isHovering ? animInstance.play() : animInstance.stop();
  }, [isHovering, animInstance]);

  return (
    <div id={id} onClick={handleClick} ref={ref} {...rest} />
  );
};
