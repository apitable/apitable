import { configResponsive, useResponsive, useScroll } from 'ahooks';
import classNames from 'classnames';
import Image from 'next/image';
import { FC, useRef } from 'react';
import BgPng from 'static/icon/space/space_img_bj.png';
import { Logo } from '../logo';
import styles from './style.module.less';

interface IWrapper {
  hiddenLogo?: boolean;
  className?: string;
}

export const Wrapper: FC<IWrapper> = ({ children, className, hiddenLogo = false }) => {
  const childrenWrapperRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll(childrenWrapperRef);
  configResponsive({
    large: 1023.98
  });
  const responsive = useResponsive();
  return (
    <div className={classNames(styles.wrapper, className)} style={{ position: 'relative' }}>
      <Image src={BgPng} objectFit={'cover'} layout={'fill'} />
      <div className={classNames(styles.logoWrapper, { [styles.shadow]: scroll?.top })}>
        {!hiddenLogo && <Logo size={responsive.large ? 'large' : 'small'} />}
      </div>
      <div ref={childrenWrapperRef} className={styles.childrenWrapper}>
        {children}
      </div>
    </div>
  );
};

export const LoginCard: FC<{ className?: string }> = (props) => {
  const { children, className } = props;
  return (
    <div className={classNames(styles.loginCard, className)}>
      {children}
    </div>
  );
};
