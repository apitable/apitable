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
import dayjs from 'dayjs';
import Image from 'next/image';
import * as React from 'react';
import { FC, useMemo } from 'react';
import { Button, ButtonGroup, Typography, useThemeColors } from '@apitable/components';
import { IReduxState, Navigation, Strings, t } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import { ISpaceLevelType, LevelType, Position } from '../../interface';
import { isExclusiveLimitedProduct, useLevelInfo } from '../../utils';
// @ts-ignore
import { SubscribePageType } from 'enterprise/subscribe_system/config';
// @ts-ignore
import { showUpgradeContactUs } from 'enterprise/subscribe_system/order_modal/pay_order_success';
import styles from './style.module.less';

interface ILevelCard {
  type: ISpaceLevelType;
  onUpgrade: () => void;
  minHeight?: number | string;
  deadline?: string;
  className?: string;
  isMobile?: boolean;
}

export const LevelCard: FC<React.PropsWithChildren<ILevelCard>> = ({ type, minHeight, deadline, className, isMobile }) => {
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
  const { IS_ENTERPRISE } = getEnvVariables();
  const colors = useThemeColors();
  const space = useAppSelector((state) => state.space);
  const { onTrial, product } = useAppSelector((state: IReduxState) => state.billing?.subscription) || {};
  const appType = space.curSpaceInfo?.social.appType;
  const expirationText = useMemo(() => {
    if (expiration <= 0) {
      return t(Strings.without_day);
    }
    return dayjs.tz(typeof expiration === 'number' ? expiration * 1000 : expiration).format('YYYY-MM-DD');
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
            if (type === LevelType.Enterprise && getEnvVariables().IS_APITABLE) {
              Router.push(Navigation.SPACE_MANAGE, { params: { pathInSpace: 'upgrade' } });
              return;
            }
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
    if (type === LevelType.Free || type === LevelType.Plus || type === LevelType.Pro || type === LevelType.Starter || type === LevelType.Business) {
      return (
        <Button
          onClick={() => {
            Router.push(Navigation.SPACE_MANAGE, { params: { pathInSpace: 'upgrade' } });
          }}
          color={colors.black[50]}
          size="small"
          style={{ color: upgradeBtnColor || titleColor || strokeColor, fontSize: 12, opacity: 0.8 }}
        >
          {t(Strings.upgrade)}
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
      {cardBg && <Image className={styles.cardBg} src={cardBg} layout={'fill'} alt="" />}
      {cardSkin && <img src={cardSkin.src} alt="skin" className={styles.skin} style={skinStyle} />}
      <div className={classnames(styles.tag, { [styles.tagLeft]: isLeftTag })} style={tagStyle}>
        {onTrial ? t(Strings.trial_subscription) : tagText}
      </div>
      <div className={classnames(styles.titleWrap, { [styles.mt24]: isLeftTag })}>
        <Typography variant="h6" color={titleColor}>
          {title}
        </Typography>
        {!isMobile && (
          <Tooltip title={titleTip || t(Strings.grade_desc)} placement="top">
            <span className={styles.infoIcon}>
              <QuestionCircleOutlined color={secondTextColor || strokeColor} />
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
        {IS_ENTERPRISE && !product?.includes('appsumo') && !isExclusiveLimitedProduct(product) && operateButton}
      </div>
    </div>
  );
};
