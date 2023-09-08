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

import { Progress } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import classNames from 'classnames';
import { FC, useMemo } from 'react';
import * as React from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { PercentOutlined } from '@apitable/icons';
import { expandInviteModal } from 'pc/components/invite';
import { useAnimationNum } from '../../hooks/use_animation_num';
import { ISpaceLevelType, needHideUnLimitedSpaceLevel } from '../../interface';
import { CardTitle } from '../../ui';
import styles from './style.module.less';

interface ICardProps {
  trailColor: string;
  strokeColor: string;
  unit?: string;
  title: string;
  titleTip: string;

  allUsed: number;
  allUsedText: string;
  allTotal: number;
  allTotalText: string;
  allRemain: number;
  allUsedPercent: number;
  allRemainPercent: number;
  allRemainText: string;

  totalText: string;
  remainText: string;
  usedText: string;
  usedPercent: number;
  remainPercent: number;

  titleLink?: { text: string; href?: string; onClick?: () => void };
  titleButton?: { text: string; onClick: () => void };
  valueIntro?: string;
  showPercent?: boolean;
  usedTextIsFloat?: boolean;
  minHeight?: number | string;
  className?: string;
  level?: ISpaceLevelType;
  isMobile?: boolean;

  giftUsedText: string;
  giftTotalText: string;
  giftUsedPercent: number;
  giftRemainPercent: number;
  giftRemainText: string;
}

export const CapacityWithRewardCard: FC<React.PropsWithChildren<ICardProps>> = (props) => {
  const {
    title,
    allTotalText,
    usedPercent,
    usedText,
    remainText,
    totalText,
    remainPercent,
    trailColor,
    strokeColor,
    unit,
    titleTip,
    titleLink,
    titleButton,
    valueIntro,
    showPercent,
    usedTextIsFloat,
    minHeight = 302,
    className,
    level,
    isMobile,
    giftUsedText,
    giftUsedPercent,
    giftRemainPercent,
    giftRemainText,
  } = props;
  const colors = useThemeColors();
  const overflow = usedPercent === 100;
  const _strokeColor = overflow ? colors.red[500] : strokeColor;

  const giftStrokeColor = giftUsedPercent === 100 ? colors.red[500] : colors.rainbowPurple5;

  const unLimited = +totalText === -1;
  // UI feedback when the total number of infinite, give a default rate progress bar will be more beautiful
  const showFakePercent = unLimited && +usedText; // Show false percentages in infinite cases 5%
  const percent = useAnimationNum({ value: showFakePercent ? 5 : usedPercent, duration: 1000, easing: 'linear', isFloat: true }) as number;

  const giftPercent = useAnimationNum({
    value: giftUsedPercent || 0.5,
    duration: 1000,
    easing: 'linear',
    isFloat: true,
  }) as number;

  const usedTitleText = useAnimationNum({ value: usedText, duration: 1000, easing: 'linear', format: true, isFloat: usedTextIsFloat });
  const hiddenUnLimitedText = needHideUnLimitedSpaceLevel[level!];

  const style: React.CSSProperties = useMemo(() => {
    if (!minHeight) return {};
    return { minHeight };
  }, [minHeight]);

  /**
   * Capacity information with complimentary information
   */
  const CapacityInfoWithReward = () => {
    return (
      <div className={styles.detail}>
        <div>
          <div style={{ fontSize: 13 }}>{t(Strings.attachment_capacity_subscription_capacity)}</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '8px 0',
            }}
          >
            <Desc color={_strokeColor} label={t(Strings.used)} text={usedText} unit={unit} showPercent={showPercent} usedPercent={usedPercent} />
            {!unLimited && (
              <Desc
                color={trailColor}
                label={t(Strings.remain)}
                text={remainText}
                unit={unit}
                showPercent={showPercent}
                usedPercent={remainPercent}
              />
            )}
          </div>
          <div className={styles.progressWrap} data-is-line>
            <ProgressInCard
              type={'line'}
              trailColor={trailColor}
              strokeColor={_strokeColor}
              percent={percent}
              showInfo={false}
              style={{ lineHeight: '12px', color: _strokeColor }}
            />
          </div>

          <div style={{ marginTop: 24, fontSize: 13 }}>
            {t(Strings.attachment_capacity_gift_capacity)}
            <span style={{ marginLeft: 8, cursor: 'pointer', color: colors.rainbowPurple5 }} onClick={() => expandInviteModal()}>
              {t(Strings.attachment_capacity_gift_capacity_access_portal)}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '8px 0',
            }}
          >
            <Desc
              color={giftStrokeColor}
              label={t(Strings.used)}
              text={giftUsedText}
              unit={unit}
              showPercent={showPercent}
              usedPercent={giftUsedPercent}
            />
            {!unLimited && (
              <Desc
                color={colors.rainbowPurple1}
                label={t(Strings.remain)}
                text={giftRemainText}
                unit={unit}
                showPercent={showPercent}
                usedPercent={giftRemainPercent}
              />
            )}
          </div>
          <div className={styles.progressWrap} data-is-line>
            <ProgressInCard
              type={'line'}
              trailColor={colors.rainbowPurple1}
              strokeColor={giftStrokeColor}
              percent={giftPercent}
              showInfo={false}
              style={{ lineHeight: '12px', color: giftStrokeColor }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classNames(styles.card, className)} style={style}>
      <CardTitle isMobile={isMobile} title={title} tipTitle={titleTip} link={titleLink} button={titleButton} />
      <div className={styles.cardNumber}>
        <span className={styles.usedNum}>{usedTitleText}</span>
        {!hiddenUnLimitedText && (
          <>
            <span className={classNames(!unLimited && styles.totalNum, { [styles.unlimited]: unLimited })}>
              /{unLimited ? t(Strings.unlimited) : allTotalText}
            </span>
            <span className={styles.totalUnit}>{unit}</span>
            {valueIntro && <span className={styles.numIntro}>({valueIntro})</span>}
          </>
        )}
      </div>
      <CapacityInfoWithReward />
    </div>
  );
};

/**
 * Usage Description
 */
interface IDescProps {
  color: string;
  label: string;
  text: string;
  unit?: string;
  showPercent?: boolean;
  usedPercent: number;
}

const Desc: FC<React.PropsWithChildren<IDescProps>> = ({ color, label, text, unit, showPercent, usedPercent }) => {
  return (
    <Typography variant="body4" className={styles.descItem}>
      <span className={styles.before} style={{ backgroundColor: color }} />
      <span>{label}</span>
      <span className={styles.customFont} style={{ fontSize: 14 }}>
        {text}
      </span>
      {unit}{' '}
      {showPercent && (
        <span className={styles.customFont}>
          ({t(Strings.proportion)}
          {usedPercent}%)
        </span>
      )}
    </Typography>
  );
};

/**
 * A layer of wrapping around Progress
 */
interface IProgressInCardProps extends ProgressProps {
  /**
   * When showInfo is true, the color of the text
   */
  color?: string;
}

const ProgressInCard: FC<React.PropsWithChildren<IProgressInCardProps>> = (props) => {
  const color = props.color;

  const colors = useThemeColors();
  const getDefaultProgressConfig = (color = colors.firstLevelText): ProgressProps => ({
    type: 'circle',
    width: 96,
    strokeWidth: 6,
    strokeColor: 'red',
    trailColor: colors.lineColor,
    format: (percent) => (
      <Typography variant="h3" color={color} className={styles.progressFormat}>
        {percent}
        <PercentOutlined color={color} />
      </Typography>
    ),
  });
  const progressConfig = {
    ...getDefaultProgressConfig(color),
    ...props,
  };
  return <Progress {...progressConfig} />;
};
