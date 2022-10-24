import { FC, useMemo } from 'react';
import * as React from 'react';
import cx from 'classnames';
import styles from './style.module.less';
import { Progress } from 'antd';
import { CardTitle } from '../../ui';
import { useThemeColors, Skeleton } from '@vikadata/components';
import { ProgressProps } from 'antd/lib/progress';
import { IMultiLineItemProps } from '../../interface';
import { t, Strings } from '@apitable/core';
import { useAnimationNum } from '../../hooks/use_animation_num';

interface IMultiLineCardProps {
  trailColor: string;
  strokeColor: string;
  title: string;
  titleTip: string;
  lines?: IMultiLineItemProps[];
  contentMargin?: number | string;
  className?: string;
  hightLight?: string;
  isMobile?: boolean;
  minHeight?: number | string;
}

const AniProgress = (props: ProgressProps) => {

  const percent = useAnimationNum({ value: props.percent, duration: 1000, easing: 'linear', isFloat: false }) as number;

  return <Progress {...props} percent={percent} />;
};

export const MultiLineCard: FC<IMultiLineCardProps> = (props) => {
  const {
    title,
    titleTip,
    trailColor,
    strokeColor,
    hightLight,
    lines,
    contentMargin = 24,
    className,
    isMobile,
    minHeight,
  } = props;
  const colors = useThemeColors();
  const wrapStyle: React.CSSProperties = useMemo(() => {
    return { marginTop: contentMargin };
  }, [contentMargin]);
  const DefaultProgressConfig: ProgressProps = {
    type: 'line',
    strokeWidth: 4,
    strokeColor: 'red',
    trailColor: colors.lineColor,
    showInfo: false,
  };

  const loading = !lines;
  const limitLessColor = hightLight || strokeColor;
  const progressConfig = {
    ...DefaultProgressConfig,
    trailColor,
    strokeColor,
  };

  const style: React.CSSProperties = useMemo(() => {
    if (!minHeight) {
      return {};
    }
    return { minHeight };
  }, [minHeight]);

  return (
    <div className={cx(styles.card, className)} style={style}>
      {
        loading ? (
          <>
            <Skeleton width='38%' />
            <Skeleton count={2} />
            <Skeleton width='61%' />
          </>
        ) :
          <>
            <CardTitle isMobile={isMobile} title={title} tipTitle={titleTip} />
            <div className={styles.linesWrap} style={wrapStyle}>
              {
                lines!.map((item) => {
                  const limitLess = item.total === -1;
                  const showFakePercent = limitLess && item.used;
                  const innerProgressConfig = { ...progressConfig };
                  if (item.percent && item.percent >= 100) {
                    innerProgressConfig.strokeColor = colors.red[500];
                  }
                  return <div key={item.name} className={styles.lineItemWrap}>
                    <div className={styles.lineInfo}>
                      <span className={styles.lineLeft}>
                        {item.icon}
                        <span className={styles.lineName}>
                          {item.name}
                        </span>
                      </span>
                      {
                        item.customIntro ? item.customIntro : <span className={styles.lineNumInfo}>
                          <span className={cx(styles.used, styles.customFont)}>{item.used ?? '-'}</span>
                          <span
                            className={limitLess ? styles.unit : cx(styles.total, styles.customFont)}
                            style={limitLess ? { color: limitLessColor } : {}}>
                            / {limitLess ? t(Strings.unlimited) : `${item.total ?? '-'} `}
                          </span>
                          <span className={cx(styles.unit)} style={limitLess ? { color: limitLessColor } : {}}>{item.unit}</span>
                        </span>
                      }
                    </div>
                    {
                      item.showProgress && <div className={styles.lineProgress}>
                        <AniProgress {...innerProgressConfig} percent={showFakePercent ? 5 : item.percent} />
                      </div>
                    }
                  </div>;
                })
              }
            </div>
          </>
      }

    </div>
  );
};
