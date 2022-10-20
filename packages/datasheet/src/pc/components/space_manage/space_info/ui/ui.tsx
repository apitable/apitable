import { Button, Skeleton, Typography, useThemeColors } from '@vikadata/components';
import { ChevronRightOutlined } from '@vikadata/icons';
import classnames from 'classnames';
import Image from 'next/image';
import { Tooltip } from 'pc/components/common';
import { isMobileApp } from 'pc/utils/env';
import * as React from 'react';
import { FC, useContext, useMemo } from 'react';
import InfoIcon from 'static/icon/common/common_icon_information.svg';
import { SpaceContext } from '../context';
import styles from './style.module.less';

interface IAvertProps {
  className?: string;
  desc?: string;
  linkText?: string;
  linkUrl?: string;
  minHeight?: string | number;
}

export const Advert: FC<IAvertProps> = props => {
  const { adData } = useContext(SpaceContext);

  const handleClick = () => {
    if (adData) {
      window.open(props.linkUrl || adData.linkUrl, '_blank');
    }
  };

  const style: React.CSSProperties = useMemo(() => {
    if (!props.minHeight) {
      return {};
    }
    return { minHeight: props.minHeight };
  }, [props.minHeight]);

  if (isMobileApp()) {
    return null;
  }

  if (!adData) {
    return (
      <div className={styles.advert} style={style}>
        <Skeleton width='38%' />
        <Skeleton count={2} />
        <Skeleton width='61%' />
      </div>
    );
  }
  return (
    <div className={classnames(styles.advert, props.className)} style={style}>
      <span className={styles.advertImg}>
        <Image src={adData.banners?.[0]?.url} width={160} height={110} />
      </span>
      <Typography variant='body3' className={styles.content}>
        {props.desc || adData.desc}
      </Typography>
      <Button color='primary' onClick={handleClick}>
        {props.linkText || adData.linkText}
      </Button>
    </div>
  );
};

type CardTitleType = {
  title: string;
  tipTitle?: string;
  link?: { text: string; href?: string; onClick?: () => void };
  button?: { text: string; onClick: () => void };
  isMobile?: boolean;
};

export const CardTitle = ({ title, tipTitle, link, button, isMobile }: CardTitleType) => {
  const colors = useThemeColors();
  return (
    <div className={styles.cardTitle}>
      <div className={styles.titleText}>
        <Typography variant='h7' className={styles.title}>
          {title}
        </Typography>
        {!isMobile && (
          <Tooltip title={tipTitle} trigger='hover' placement='top'>
            <span className={styles.infoIcon}>
              <InfoIcon className={styles.infoIconInDesc} />
            </span>
          </Tooltip>
        )}
      </div>
      {link && (
        <a
          className={styles.link}
          {...(link.href ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={link.href ? undefined : link.onClick}
        >
          {link.text} <ChevronRightOutlined color={colors.textCommonSecondary} />
        </a>
      )}
      {button && (
        <a className={styles.link} onClick={button.onClick}>
          {button.text} <ChevronRightOutlined color={colors.deepPurple[500]} />
        </a>
      )}
    </div>
  );
};

export const InfoHighlightTitle = (data: { value: number; unit: string; desc: string; style?: React.CSSProperties; themeColor?: string }) => {
  const { value, unit, desc, style, themeColor } = data;
  return (
    <div className={styles.infoHighlightTitle} style={style}>
      <Typography variant='h1' className={styles.value} color={themeColor}>
        {value.toLocaleString()}
      </Typography>
      <Typography variant='h6' className={styles.unit} color={themeColor}>
        {unit}
      </Typography>
      <Typography variant='body4' className={styles.desc}>
        {desc}
      </Typography>
    </div>
  );
};
