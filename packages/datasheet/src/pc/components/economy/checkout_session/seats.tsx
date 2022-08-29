import * as React from 'react';
import { PayingLayout, ModalContentLayout } from '../components/paying_layout';
import {
  PayingModalTitle, OrderDetails,
  BlockSelector, ParamsComparison, PriceTotal,
  PayingTotal, showPaymentFailed, PaySucceed
} from '../stateless_ui';
import { ICheckoutSessionMain } from './config';
const SeatsOptionData = [
  { key: 2, value: '2人' },
  { key: 5, value: '5人' },
  { key: 10, value: '10人' },
  { key: 15, value: '15人' },
  { key: 20, value: '20人' },
  { key: 25, value: '25人' },
  { key: 30, value: '30人' },
  { key: 40, value: '40人' },
  { key: 50, value: '50人' },
  { key: 100, value: '100人' },
  { key: 200, value: '200人' },
  { key: 'more', value: '更多人数', isMore: true },
];
const TimeOptionData = [
  { key: 1, value: '1个月' },
  { key: 3, value: '3个月' },
  { key: 6, value: '6个月' },
  { key: 12, value: '12个月' },
  { key: 24, value: '24个月' },
  { key: 36, value: '36个月' },
];

export const Seats: React.FC<ICheckoutSessionMain> = ({ onCancel, themeColor, contentRight }) => {
  const [loading, setLoading] = React.useState(false);
  const [succeed, setSucceed] = React.useState(true);
  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setSucceed(true);
      showPaymentFailed();
    }, 1000);
  };
  if (succeed) {
    return (
      <ModalContentLayout>
        <PaySucceed
          title="容量包"
          time="2020-10-03"
          originalPrice={9000000}
          count={90}
          finalPrice={0}
        />
      </ModalContentLayout>
    );
  }
  return (
    <PayingLayout
      contentLeft={
        <>
          <PayingModalTitle title="选择成员人数" tip="sdasdhakjh" />
          <BlockSelector optionData={SeatsOptionData} />
          <PayingModalTitle title="选择购买时长" />
          <BlockSelector optionData={TimeOptionData} />
          <PayingModalTitle title="订单详情"/>
          <OrderDetails
            title="白银级套餐"
            spaceName='维格'
            seats={<ParamsComparison prev="2人" cur="200人"/>}
            expireTime={<span style={{ display:'flex' }}>1年(<ParamsComparison prev="2010-09-20" cur="2013-09-20"/>)</span>}
            subtotal={7890}
            total={<PriceTotal type="default" price={200} />}
            discount={<PriceTotal type="red" price={200}/>}
          />
        </>
      }
      contentRight={contentRight}
      footerLeft={<PayingTotal totalV={900} curV={90} discount={ 50} curPrice={90} />}
      onSubmit={onSubmit}
      loading={loading}
      themeColor={themeColor}
    />
  );
};