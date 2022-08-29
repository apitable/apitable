import * as React from 'react';
import { t, Strings } from '@vikadata/core';
import { lightColors } from '@vikadata/components';
import { PayingLayout, ModalContentLayout } from '../components/paying_layout';
import {
  PayingModalTitle, OrderDetails,
  CapacityOptions, PrivilegeList, ParamsComparison, PriceTotal,
  ICapacityCheckbox, PayingTotal, showPaymentFailed, PaySucceed
} from '../stateless_ui';
import { ICheckoutSessionMain } from './config';
const CapacityThemeColor = lightColors.teal[500];

const OptionData: ICapacityCheckbox[] = [
  { key:'200',value: '200G', price: '200元/月', originalPrice:'原价：230元/月' },
  { key:'300',value: '300G', price: '300元/月', originalPrice:'原价：3300元/月' },
  { key:'400',value: '400G', price: '400元/月', originalPrice:'原价：430元/月' },
];

export const Capacity: React.FC<ICheckoutSessionMain> = ({ onCancel }) => {
  const [loading, setLoading] = React.useState(false);
  const [succeed, setSucceed] = React.useState(false);
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
          <PayingModalTitle title="选择购买时长" themeColor={CapacityThemeColor} />
          <CapacityOptions optionData={ OptionData } checkedKey="200" themeColor={CapacityThemeColor}/>
          <PayingModalTitle title="订单详情" themeColor={ CapacityThemeColor }/>
          <OrderDetails
            title="白银级套餐"
            spaceName='维格'
            seats={<ParamsComparison prev="2人" cur="200人"/>}
            expireTime={
              <span style={{ display: 'flex' }}>
                1年(<ParamsComparison prev="2010-09-20" cur="2013-09-20" themeColor={CapacityThemeColor} />)
              </span>
            }
            subtotal={7890}
            total={<PriceTotal type="default" price={200} />}
            discount={<PriceTotal type="red" price={200} />}
          />
        </>
      }
      contentRight={<PrivilegeList{...JSON.parse(t(Strings.privilege_list_of_sliver))} themeColor={CapacityThemeColor}/>}
      footerLeft={<PayingTotal totalV={900} curV={90} discount={ 50} curPrice={90} />}
      onSubmit={onSubmit}
      loading={loading}
      themeColor={CapacityThemeColor}
    />
  );
};