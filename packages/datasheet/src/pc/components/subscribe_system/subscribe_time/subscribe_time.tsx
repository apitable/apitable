import { Skeleton, Typography, useThemeColors } from '@vikadata/components';
import { str2Currency, Strings, t } from '@apitable/core';
import { SelectMarkFilled } from '@vikadata/icons';
import classnames from 'classnames';
import { ILevelInfo, monthMap } from 'pc/components/subscribe_system/config';
import styles from 'pc/components/subscribe_system/styles.module.less';
import * as React from 'react';
import { useState } from 'react';

interface ISubscribeTimeProps {
  monthPrice: any[],
  levelInfo: ILevelInfo;
  subscribeLongs: number | undefined;
  setSubscribeLongs: React.Dispatch<React.SetStateAction<number | undefined>>;
  loading: boolean;
}

export const SubscribeTime: React.FC<ISubscribeTimeProps> = (props) => {
  const { monthPrice, levelInfo, subscribeLongs, setSubscribeLongs, loading } = props;
  const [hoverSubscribeLongs, setHoverSubscribeLongs] = useState<undefined | number>();
  const colors = useThemeColors();

  return <div className={styles.describeTime}>
    {loading ? (
      <div style={{ width: '100%' }}>
        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />
      </div>
    ) :
      monthPrice.map((item, index) => {
        const active = subscribeLongs === item.month;
        const showDiscountDeadline = Number(item.priceDiscount) !== 0;
        return <div
          key={index}
          className={classnames({ [styles.active]: active })}
          onClick={() => { setSubscribeLongs(item.month); }}
          onMouseOver={() => { setHoverSubscribeLongs(index); }}
          onMouseOut={() => { setHoverSubscribeLongs(undefined); }}
          style={{
            borderColor: (active || hoverSubscribeLongs === index) ? levelInfo.activeColor : '',
            backgroundColor: active ? levelInfo.cardSelectBg : '',
            // color: active ? levelInfo.activeColor : ''
          }}
        >
          <Typography
            className={styles.manualTime}
            variant={'body1'}
            color={active ? levelInfo.activeColor : ''}
            style={{
              fontWeight: active ? 'bolder' : 'normal'
            }}
          >
            {monthMap[item.month]}
          </Typography>
          <Typography
            className={styles.currentPrice}
            color={active ? levelInfo.activeColor : ''}
            style={{ marginBottom: showDiscountDeadline ? '' : '0px' }}
          >
            {
              showDiscountDeadline ? str2Currency(item.pricePaid, '￥') : str2Currency(item.priceOrigin, '￥')
            }
          </Typography>
          {
            showDiscountDeadline && <Typography className={styles.originPrice} variant={'h7'} color={active ? levelInfo.activeColor : colors.fc3}>
              {t(Strings.origin_price)}：
              <Typography className={styles.originPriceChildren} variant={'h7'} color={active ? levelInfo.activeColor : colors.fc3}>
                {
                  str2Currency(item.priceOrigin, '￥')
                }
              </Typography>
            </Typography>
          }
          {
            active &&
            <SelectMarkFilled size={24} className={styles.checked} color={levelInfo.activeColor} />
          }
        </div>;
      })
    }
  </div>;
};
