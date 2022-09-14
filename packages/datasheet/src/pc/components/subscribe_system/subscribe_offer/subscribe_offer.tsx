import { Typography } from '@vikadata/components';
import { Api, Strings, t } from '@vikadata/core';
import { ClockFilled } from '@vikadata/icons';
import { useRequest } from 'ahooks';
import styles from 'pc/components/subscribe_system/styles.module.less';
import { SubscribeLevelTab } from 'pc/components/subscribe_system/subscribe_header/subscribe_header';
import * as React from 'react';
import { useMemo } from 'react';

interface ISubscribeOfferProps {
  levelTab: SubscribeLevelTab;
}

export const SubscribeOffer: React.FC<ISubscribeOfferProps> = props => {
  const { levelTab } = props;
  const { data: eventData } = useRequest(Api.getSubscribeActiveEvents);

  const endDate = useMemo(() => {
    if (!eventData) return null;
    const { data, success } = eventData?.data;
    if (!success) {
      return null;
    }
    return data.endDate;
  }, [eventData?.data]);

  if (!endDate) {
    return null;
  }

  return (
    <div className={styles.limitedTimeOffer} style={{ opacity: levelTab !== 'ENTERPRISE' ? 1 : 0 }}>
      <ClockFilled color={'#fff'} />
      <Typography variant="h9" color={'#fff'}>
        {t(Strings.limited_time_offer)}
      </Typography>
      <span>|</span>
      <Typography variant="body4" color={'#fff'}>
        {t(Strings.discount_price_deadline)}
      </Typography>
      &nbsp;
      <Typography variant="h9" color={'#fff'}>
        {endDate}
      </Typography>
    </div>
  );
};
