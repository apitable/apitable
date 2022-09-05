import * as React from 'react';
import { PayingModalTitle, OrderDetails, BlockSelector, PrivilegeList, ParamsComparison, PriceTotal, PayingTotal } from '../../stateless_ui';
import { t, Strings } from '@vikadata/core';
import { PayingLayout } from '../../components/paying_layout';
import { CheckWrap } from '../../stateless_ui';
import styles from './style.module.less';
import { SpaceLevelInfo } from 'pc/components/space_manage/space_info/utils';
import { ICheckoutSessionMain } from '../interface';
const TimeOptionData = [
  { key: 1, value: '1个月' },
  { key: 3, value: '3个月' },
  { key: 6, value: '6个月' },
  { key: 12, value: '1年', discount: '优惠50%' },
  { key: 24, value: '2年' },
  { key: 36, value: '3年' },
];
export const Renewal: React.FC<ICheckoutSessionMain> = () => {
  const [loading, setLoading] = React.useState(false);
  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {}, 1000);
  };
  return (
    <PayingLayout
      contentLeft={
        <>
          <PayingModalTitle title="当前等级" tip="sdasdhakjh" />
          <CheckWrap checkedTagSize={24} checked style={{ marginBottom: '40px' }}>
            <div className={styles.culLevel}>{SpaceLevelInfo.silver.spaceLevelTag.logo}白银级 2人套餐</div>
          </CheckWrap>
          <PayingModalTitle title="选择购买时长" />
          <BlockSelector optionData={TimeOptionData} />
          <PayingModalTitle title="订单详情" />
          <OrderDetails
            title="白银级套餐"
            spaceName="维格"
            seats={<ParamsComparison prev="2人" cur="200人" />}
            expireTime={
              <span style={{ display: 'flex' }}>
                1年(
                <ParamsComparison prev="2010-09-20" cur="2013-09-20" />)
              </span>
            }
            subtotal={7890}
            total={<PriceTotal type="default" price={200} />}
            discount={<PriceTotal type="red" price={200} />}
          />
        </>
      }
      contentRight={<PrivilegeList {...JSON.parse(t(Strings.privilege_list_of_sliver))} />}
      footerLeft={<PayingTotal totalV={900} curV={90} discount={50} curPrice={90} />}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};
