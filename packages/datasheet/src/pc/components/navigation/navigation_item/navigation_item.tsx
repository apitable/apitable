import { useHover, useMount } from 'ahooks';
import { FC, useRef, useState, useEffect } from 'react';
import * as React from 'react';
import { AnimationItem } from 'lottie-web/index';
import { isMobile } from 'react-device-detect';

export interface INavigationItemProps {
  animationData: any;
  style?: React.CSSProperties;
  id: string;
  loop?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NavigationItem: FC<INavigationItemProps> = ({
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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    (window as any).sensors.quick('trackHeatMap', event.target, {
      activity_entry: id,
    });
    onClick && onClick();
  };

  useEffect(() => {
    if (!animInstance || isMobile) { return; }
    isHovering ? animInstance.play() : animInstance.stop();
  }, [isHovering, animInstance]);

  return (
    <div id={id} onClick={handleClick} ref={ref} {...rest} />
  );
};
