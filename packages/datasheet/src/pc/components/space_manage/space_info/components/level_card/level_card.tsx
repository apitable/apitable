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

import { Button, ButtonGroup, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { InformationSmallOutlined } from '@apitable/icons';
import classnames from 'classnames';
import dayjs from 'dayjs';
// @ts-ignore
import { showUpgradeContactUs, SubscribePageType, isEnterprise } from 'enterprise';
import Image from 'next/image';
import { Tooltip } from 'pc/components/common';
import { isMobileApp } from 'pc/utils/env';
import * as React from 'react';
import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ISpaceLevelType, LevelType, Position } from '../../interface';
import { useLevelInfo } from '../../utils';
import styles from './style.module.less';

interface ILevelCard {
  type: ISpaceLevelType;
  onUpgrade: () => void;
  minHeight?: number | string;
  deadline?: string;
  className?: string;
  isMobile?: boolean;
}

export const LevelCard: FC<ILevelCard> = ({ type, minHeight, deadline, className, isMobile }) => {
  const {
    title,
    levelCard: {
      cardBg,
      tagText,
      tagStyle,
      titleColor,
      expiration,
      secondTextColor,
      cardSkin,
      skinStyle,
      cardTagPosition,
      titleTip,
      expirationColor,
      upgradeBtnColor,
    },
    strokeColor,
  } = useLevelInfo(type, deadline);
  const colors = useThemeColors();
  const space = useSelector(state => state.space);
  const appType = space.curSpaceInfo?.social.appType;
  const expirationText = useMemo(() => {
    if (expiration <= 0) {
      return t(Strings.without_day);
    }
    return dayjs(expiration).format('YYYY-MM-DD');
  }, [expiration]);

  const style: React.CSSProperties = useMemo(() => {
    if (!minHeight) {
      return {};
    }
    return { minHeight };
  }, [minHeight]);

  const unlimited = expirationText === t(Strings.without_day);
  const isLeftTag = cardTagPosition === Position.L;

  const operateButton = useMemo(() => {
    if (type === LevelType.PrivateCloud || type === LevelType.Atlas || appType === 2 || isMobileApp() || isMobile) {
      return null;
    }
    if (appType === 1) {
      // Self-built applications do not allow subscriptions, renewals and upgrades, unified contact customer service
      return (
        <Button
          onClick={() => {
            showUpgradeContactUs?.();
          }}
          color={colors.black[50]}
          size="small"
          style={{ color: upgradeBtnColor || titleColor || strokeColor, fontSize: 12, opacity: 0.8 }}
        >
          {t(Strings.contact_us)}
        </Button>
      );
    }
    if (type === LevelType.Bronze || type === LevelType.Enterprise) {
      return (
        <Button
          onClick={() => {
            type === LevelType.Bronze ? window.open(`/space/${space.activeId}/upgrade`, '_blank', 'noopener,noreferrer') : showUpgradeContactUs?.();
          }}
          color={colors.black[50]}
          size="small"
          style={{ color: upgradeBtnColor || titleColor || strokeColor, fontSize: 12, opacity: 0.8 }}
        >
          {type === LevelType.Bronze ? t(Strings.upgrade) : t(Strings.contact_us)}
        </Button>
      );
    }
    const commonStyle = {
      color: upgradeBtnColor || titleColor || strokeColor,
      fontSize: 12,
      opacity: 0.8,
    };
    return (
      <ButtonGroup withSeparate>
        <React.Fragment key=".0">
          <Button
            style={{ ...commonStyle, borderRadius: '16px 0px 0px 16px' }}
            size="small"
            color={colors.black[50]}
            onClick={() => {
              window.open(`/space/${space.activeId}/upgrade?pageType=${SubscribePageType?.Renewal}`, '_blank', 'noopener,noreferrer');
            }}
          >
            {t(Strings.renewal)}
          </Button>
          <Button
            style={{ ...commonStyle, borderRadius: '0px 16px 16px 0px', marginLeft: 0 }}
            size="small"
            className={styles.beforeBg}
            color={colors.black[50]}
            onClick={() => {
              window.open(`/space/${space.activeId}/upgrade?pageType=${SubscribePageType?.Upgrade}`, '_blank', 'noopener,noreferrer');
            }}
          >
            {t(Strings.upgrade)}
          </Button>
        </React.Fragment>
      </ButtonGroup>
    );
    // eslint-disable-next-line
  }, [appType, space.activeId, type]);

  return (
    <div className={classnames(styles.levelCard, className)} style={{ ...style }}>
      {cardBg && <Image className={styles.cardBg} src={cardBg} layout={'fill'} />}
      {cardSkin && (
        <span className={styles.skin} style={skinStyle}>
          <Image src={cardSkin} alt="skin" width={68} height={82} />
        </span>
      )}
      <div className={classnames(styles.tag, { [styles.tagLeft]: isLeftTag })} style={tagStyle}>
        {tagText}
      </div>
      <div className={classnames(styles.titleWrap, { [styles.mt24]: isLeftTag })}>
        <Typography variant="h6" color={titleColor}>
          {title}
        </Typography>
        {!isMobile && (
          <Tooltip title={titleTip || t(Strings.grade_desc)} placement="top">
            <span className={styles.infoIcon}>
              <InformationSmallOutlined color={secondTextColor || strokeColor} />
            </span>
          </Tooltip>
        )}
      </div>
      <div className={styles.buttonWrap}>
        <div className={styles.expiration} style={{ color: expirationColor || secondTextColor || strokeColor }}>
          {unlimited ? (
            <span>{t(Strings.expiration, { date: expirationText })}</span>
          ) : (
            <span>
              {/* Temporarily hide the payment record portal */}
              {/* <a
                 className={styles.payRecord}
                 style={{ color: secondTextColor || strokeColor }} >
                 {t(Strings.payment_record)} <ChevronRightOutlined color={secondTextColor ||strokeColor} />
                 </a>
                 <br /> */}
              <span>
                <span className={styles.expirationText}>{expirationText}</span>
                <span style={{ fontSize: 14 }}>{t(Strings.expire)}</span>
              </span>
            </span>
          )}
        </div>
        {isEnterprise && operateButton}
      </div>
    </div>
  );
};
