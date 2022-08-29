import { FC, useMemo } from 'react';
import styles from './style.module.less';
import { Progress } from 'antd';
import { byteMGArr, byteMG, normalByteMGArr, Strings, t } from '@vikadata/core';
import { CardTitle, InfoHighlightTitle } from '../../ui';
import { Typography, TextButton, useThemeColors, Skeleton } from '@vikadata/components';
import { getPercent } from '../../utils';
import classNames from 'classnames';
// import { showCapacityUpgrading } from 'pc/components/subscription';
interface ICapacity {
  maxValue?: number;
  curValue?: number;
  strokeColor?: string;
  dataColor?: string;
}

export const Capacity: FC<ICapacity> = ({ maxValue, curValue, dataColor, strokeColor }) => {
  const colors = useThemeColors();
  const loading = useMemo(() => {
    return typeof maxValue !== 'number' || typeof curValue !== 'number';
  }, [maxValue, curValue]);

  const validPercent = useMemo(() => {
    if (loading) return 0;
    return (
      (byteMGArr(curValue!)[2] as number) / (byteMGArr(maxValue!)[2] as number)
    );
  }, [curValue, loading, maxValue]);

  const usedCapacity = useMemo(() => {
    if (loading) return 0;
    return normalByteMGArr(byteMGArr(curValue!)[2] as number).join('');
  }, [curValue, loading]);

  const percent = useMemo(() => {
    return getPercent(validPercent) * 100;
  }, [validPercent]);

  const maxValueObj = useMemo(() => {
    return {
      value: byteMGArr(maxValue || 0)[0] as number,
      unit: String(byteMGArr(maxValue || 0)[1]),
    };
  }, [maxValue]);

  const restValue = useMemo(() => {
    if (loading) return 0;
    return byteMG((byteMGArr(maxValue!)[2] as number) - (byteMGArr(curValue!)[2] as number));
  }, [curValue, maxValue, loading]);
  return (
    <div className={styles.capacity}>
      {loading ? (
        <>
          <Skeleton width="38%" />
          <Skeleton count={2} />
          <Skeleton width="61%"/>
        </>
      ) : (
        <>
          <div>
            <CardTitle
              title={t(Strings.space_capacity)}
              tipTitle={t(Strings.member_data_desc_of_appendix)}
            />
            <InfoHighlightTitle
              value={maxValueObj.value}
              unit={maxValueObj.unit}
              desc={t(Strings.total_capacity)}
              style={{ marginTop: '4px' }}
              themeColor={dataColor}
            />
          </div>

          <div className={styles.progressWrap}>
            <Typography variant="body4" className={styles.remainder}>
              <span>{t(Strings.remain_capacity)}：</span>
              {restValue}
            </Typography>
            <Progress
              percent={10}
              strokeLinecap="square"
              strokeColor={strokeColor}
              trailColor={colors.lineColor}
              strokeWidth={8}
              className={classNames({
                [styles.isEdgeValue]: percent === 0 || percent === 100,
              })}
              format={() => usedCapacity}
            />
          </div>
          
          <div className={styles.capacityUpgrade}>
            <TextButton onClick={() => { }}>{t(Strings.purchase_capacity)}</TextButton>
          </div>
        </>
      )}
    </div>
  );
};
