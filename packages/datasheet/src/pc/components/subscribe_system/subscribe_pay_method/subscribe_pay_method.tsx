import { Typography } from '@apitable/components';
import { SelectMarkFilled } from '@apitable/icons';
import classnames from 'classnames';
import { ILevelInfo } from 'pc/components/subscribe_system/config';
import { payMethodConfig } from 'pc/components/subscribe_system/order_info/order_info';
import styles from 'pc/components/subscribe_system/styles.module.less';
import { useState } from 'react';
import * as React from 'react';

interface ISubscribePayMethodProps {
  setPay: React.Dispatch<React.SetStateAction<number>>;
  levelInfo: ILevelInfo;
  pay: number;
}

export const SubscribePayMethod: React.FC<ISubscribePayMethodProps> = (props) => {
  const { pay, setPay, levelInfo } = props;
  const [hoverPay, setHoverPay] = useState<undefined | number>();

  return <nav className={styles.tabs}>
    {
      payMethodConfig.map((item, index) => {
        // if (item.disabled) {
        //   return;
        // }
        const active = pay === index;
        return <div
          key={item.payId}
          className={styles.tab} onClick={() => { setPay(index); }}
          onMouseOver={() => { setHoverPay(index); }}
          onMouseOut={() => { setHoverPay(undefined); }}
          style={{
            borderColor: (active || hoverPay === index) ? levelInfo.activeColor : '',
            backgroundColor: active ? levelInfo.cardSelectBg : '',
          }}
        >
          {item.payIcon}
          <Typography
            variant={'body1'}
            className={classnames({ [styles.active]: active })}
            style={{
              marginLeft: 8,
              fontWeight: active ? 'bolder' : 'normal',
              color: active ? levelInfo.activeColor : ''
            }}
          >
            {item.payName}
          </Typography>
          {
            active && <SelectMarkFilled className={styles.checked} color={levelInfo.activeColor} />
          }
        </div>;
      })
    }
  </nav>;
};
