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

import classnames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { FC, useMemo } from 'react';
import { Button, ThemeName, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronRightOutlined, QuestionCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import { isMobileApp } from 'pc/utils/env';
import MarketingAdvertisementDark from 'static/icon/datasheet/overview_marketing_advertisement_dark.png';
import MarketingAdvertisementLight from 'static/icon/datasheet/overview_marketing_advertisement_light.png';
import styles from './style.module.less';

interface IAvertProps {
  className?: string;
  desc?: string;
  linkText?: string;
  linkUrl?: string;
  minHeight?: string | number;
}

export const Advert: FC<React.PropsWithChildren<IAvertProps>> = (props) => {
  const handleClick = () => {
    window.open('https://vika.cn/share/shrFVCtHXQwYm3DVgNn91/fomHVJEutJ9SdV1Bj4?fldpZx6obKDv2=02', '_blank');
  };

  const themeName = useAppSelector((state) => state.theme);
  const marketingAdvertisement = themeName === ThemeName.Light ? MarketingAdvertisementLight : MarketingAdvertisementDark;

  const style: React.CSSProperties = useMemo(() => {
    if (!props.minHeight) {
      return {};
    }
    return { minHeight: props.minHeight };
  }, [props.minHeight]);

  if (isMobileApp()) {
    return null;
  }

  return (
    <div className={classnames(styles.advert, props.className)} style={style}>
      <span className={styles.advertImg}>
        <Image src={marketingAdvertisement} width={160} height={110} alt="" />
      </span>
      <Typography variant="body3" className={styles.content}>
        {t(Strings.ad_card_desc)}
      </Typography>
      <Button color="primary" onClick={handleClick}>
        {t(Strings.contact_us)}
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
  rightSlot?: React.ReactElement;
};

export const CardTitle = ({ title, tipTitle, link, button, isMobile, rightSlot }: CardTitleType) => {
  const colors = useThemeColors();
  return (
    <div className={styles.cardTitle}>
      <div className={'vk-flex vk-flex-1 vk-justify-between'}>
        <div className={classnames(styles.titleText)}>
          <Typography variant="h7" className={styles.title}>
            {title}
          </Typography>
          {!isMobile && (
            <Tooltip title={tipTitle} trigger="hover" placement="top">
              <span className={styles.infoIcon}>
                <QuestionCircleOutlined color={colors.textCommonTertiary} className={styles.infoIconInDesc} />
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
      {rightSlot && <div>{rightSlot}</div>}
    </div>
  );
};

export const InfoHighlightTitle = (data: { value: number; unit: string; desc: string; style?: React.CSSProperties; themeColor?: string }) => {
  const { value, unit, desc, style, themeColor } = data;
  return (
    <div className={styles.infoHighlightTitle} style={style}>
      <Typography variant="h1" className={styles.value} color={themeColor}>
        {value.toLocaleString()}
      </Typography>
      <Typography variant="h6" className={styles.unit} color={themeColor}>
        {unit}
      </Typography>
      <Typography variant="body4" className={styles.desc}>
        {desc}
      </Typography>
    </div>
  );
};
