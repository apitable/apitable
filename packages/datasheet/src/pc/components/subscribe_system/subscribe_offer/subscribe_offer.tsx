import { Typography } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { ClockFilled } from '@vikadata/icons';
import dayjs from 'dayjs';
import styles from 'pc/components/subscribe_system/styles.module.less';
import { SubscribeLevelTab } from 'pc/components/subscribe_system/subscribe_header/subscribe_header';
import { useMemo } from 'react';
import * as React from 'react';

interface ISubscribeOfferProps {
  levelTab: SubscribeLevelTab;
}

const DISCOUNT_DEADLINE = '2022-06-30';

export const SubscribeOffer: React.FC<ISubscribeOfferProps> = (props) => {
  const { levelTab } = props;

  const showDiscountDeadline = useMemo(() => {
    return dayjs().valueOf() <= dayjs(DISCOUNT_DEADLINE).valueOf();
  }, []);

  if (!showDiscountDeadline) {
    return null;
  }

  return <div className={styles.limitedTimeOffer} style={{ opacity: levelTab !== 'ENTERPRISE' ? 1 : 0 }}>
    <ClockFilled color={'#fff'} />
    <Typography variant="h9" color={'#fff'}>
      {t(Strings.limited_time_offer)}
    </Typography>
    <span>
            |
    </span>
    <Typography variant="body4" color={'#fff'}>
      {t(Strings.discount_price_deadline)}
    </Typography>
    &nbsp;
    <Typography variant="h9" color={'#fff'}>
      {DISCOUNT_DEADLINE}
    </Typography>
  </div>;
};
