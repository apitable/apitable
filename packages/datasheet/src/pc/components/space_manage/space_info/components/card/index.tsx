import { FC, useMemo } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import classNames from 'classnames';
import { t, Strings } from '@apitable/core';
import { Progress } from 'antd';
import { PercentOutlined } from '@vikadata/icons';
import { CardTitle } from '../../ui';
import { Typography, useThemeColors } from '@vikadata/components';
import { ProgressProps } from 'antd/lib/progress';
import { useAnimationNum } from '../../hooks/use_animation_num';
import { ISpaceLevelType, needHideUnLimitedSpaceLevel } from '../../interface';

interface ICardProps {
  trailColor: string;
  strokeColor: string;
  shape: 'line' | 'circle'
  unit?: string;
  title: string;
  titleTip: string;

  totalText: string;
  remainText: string;
  usedText: string;
  usedPercent: number;
  remainPercent: number;

  titleLink?: { text: string, href?: string, onClick?: () => void };
  titleButton?: { text: string, onClick: () => void };
  valueIntro?: string;
  showPercent?: boolean;
  usedTextIsFloat?: boolean;
  minHeight?: number | string;
  className?: string;
  level?: ISpaceLevelType;
  isMobile?: boolean;
}

export const Card: FC<ICardProps> = (props) => {
  const {
    title,
    usedPercent,
    usedText,
    remainText,
    totalText,
    remainPercent,
    trailColor,
    strokeColor,
    shape,
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
  } = props;

  const colors = useThemeColors();
  const isLine = shape === 'line';
  const overflow = usedPercent === 100;
  const _strokeColor = overflow ? colors.red[500] : strokeColor;
  const unLimited = +totalText === -1;
  // UI反馈当总数无限时，给一个默认的比率进度条会美观些
  const showFakePercent = unLimited && +usedText;
  const percent = useAnimationNum({ value: showFakePercent ? 5 : usedPercent, duration: 1000, easing: 'linear', isFloat: true }) as number;
  const usedTitleText = useAnimationNum({ value: usedText, duration: 1000, easing: 'linear', format: true, isFloat: usedTextIsFloat });
  const hiddenUnLimitedText = needHideUnLimitedSpaceLevel[level!];

  const style: React.CSSProperties = useMemo(() => {
    if (!minHeight) return {};
    return { minHeight };
  }, [minHeight]);

  const detail = (
    <>
      {/* 已用 */}
      <Desc 
        color={_strokeColor}
        label={t(Strings.used)}
        text={usedText}
        unit={unit}
        showPercent={showPercent}
        usedPercent={usedPercent}
      />
      {/* 剩余 */}
      {
        !unLimited &&
        <Desc 
          color={trailColor}
          label={t(Strings.remain)}
          text={remainText}
          unit={unit}
          showPercent={showPercent}
          usedPercent={remainPercent}
        />
      }
    </>
  );

  return (
    <div className={classNames(styles.card, className)} style={style}>
      <CardTitle isMobile={isMobile} title={title} tipTitle={titleTip} link={titleLink} button={titleButton} />
      <div className={styles.cardNumber} >
        <span className={styles.usedNum}>
          {usedTitleText}
        </span>
        {
          !hiddenUnLimitedText && <>
            <span className={classNames(!unLimited && styles.totalNum, { [styles.unlimited]: unLimited })}>
              /{unLimited ? t(Strings.unlimited) : totalText}
            </span>
            <span className={styles.totalUnit}>{unit}</span>
            {valueIntro && <span className={styles.numIntro}>({valueIntro})</span>}
          </>
        }
      </div>
      <div className={styles.progressWrap} data-is-line={isLine}>
        {
          isLine && <div className={styles.lineDesc}> {detail} </div>
        }
        <ProgressInCard
          type={shape}
          trailColor={trailColor}
          strokeColor={_strokeColor}
          percent={percent}
          showInfo={!isLine}
          style={isLine ? { lineHeight: '12px', color: _strokeColor }: undefined}
        />
      </div>
      {/* 显示 已用xx，剩余 xx */}
      {
        !isLine && <div className={styles.descWrap}>
          <div> {detail} </div>
        </div>
      }
    </div>
  );
};

/**
 * 用量描述
 */
interface IDescProps {
  color: string,
  label: string,
  text: string,
  unit?: string,
  showPercent?: boolean
  usedPercent: number,
}

const Desc: FC<IDescProps> = ({ color, label, text, unit, showPercent, usedPercent }) => {
  return (
    <Typography variant="body4" className={styles.descItem}>
      <span className={styles.before} style={{ backgroundColor: color }} />
      <span>{label}</span>
      <span className={styles.customFont} style={{ fontSize: 14 }}>
        {text}
      </span>{unit}{' '}
      {showPercent && <span className={styles.customFont}>({t(Strings.proportion)}{usedPercent}%)</span>}
    </Typography>
  );
};

/**
 * 对 Progress 进行了一层封装
 */
interface IProgressInCardProps extends ProgressProps {
  /**
   * 指定 showInfo 为 true 时，文字的颜色
   */
  color?: string;
}

const ProgressInCard: FC<IProgressInCardProps> = (props) => {
  const color = props.color;

  const colors = useThemeColors();
  const getDefaultProgressConfig = (color = colors.firstLevelText): ProgressProps => ({
    type: 'circle',
    width: 96,
    strokeWidth: 6,
    strokeColor: 'red',
    trailColor: colors.lineColor,
    format: percent => <Typography
      variant="h3"
      color={color}
      className={styles.progressFormat}
    >
      {percent}<PercentOutlined color={color} />
    </Typography>,
  });
  const progressConfig = {
    ...getDefaultProgressConfig(color),
    ...props
  };
  return <Progress {...progressConfig} />;
};