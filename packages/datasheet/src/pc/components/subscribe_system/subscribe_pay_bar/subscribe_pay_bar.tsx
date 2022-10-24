import { Button, Typography, useThemeColors } from '@vikadata/components';
import { Api, ApiInterface, ISubscription, str2Currency, Strings, t } from '@apitable/core';
import classnames from 'classnames';
import { Message, Modal } from 'pc/components/common';
import { TComponent } from 'pc/components/common/t_component';
import { ILevelInfo, SubscribePageType } from 'pc/components/subscribe_system/config';
import { showOrderInfo, watchOrderStatus } from 'pc/components/subscribe_system/order_info/order_info';
import { showOrderContactUs } from 'pc/components/subscribe_system/order_modal/pay_order_success';
import { SubscribeLevelTab } from 'pc/components/subscribe_system/subscribe_header/subscribe_header';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.less';

interface ISubscribePayBarProps {
  priceInfoCache: any;
  seat: number | undefined;
  subscribeLongs: number | undefined;
  levelInfo: ILevelInfo;
  levelTab: SubscribeLevelTab;
  spaceId: string;
  pay: number;
  pageType: SubscribePageType;
}

export function checkSubscriptionStatus(subscription: ISubscription | null) {
  if (subscription && subscription.product === 'Bronze') {
    Message.error({
      content: t(Strings.subscription_expire_error)
    });
    setTimeout(() => {
      window.location.href = '/workbench';
    }, 2 * 1000);
    return false;
  }
  return true;
}

export const SubscribePayBar: React.FC<ISubscribePayBarProps> = (props) => {
  const { priceInfoCache, seat, subscribeLongs, levelInfo, levelTab, spaceId, pay, pageType } = props;
  const colors = useThemeColors();
  const [submitOrderLoading, setSubmitOrderLoading] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<ApiInterface.IQueryOrderDiscountResponse | null>(null);
  const subscription = useSelector(state => state.billing.subscription);

  useEffect(() => {
    if (pageType !== SubscribePageType.Upgrade) {
      return;
    }
    if (levelTab === SubscribeLevelTab.ENTERPRISE) {
      return;
    }
    if (!checkSubscriptionStatus(subscription)) {
      return;
    }

    if (seat == null || subscribeLongs == null || !levelTab) {
      return;
    }
    const params = {
      spaceId,
      seat,
      product: levelTab,
      month: subscribeLongs,
      action: 'UPGRADE',
    };
    Api.queryOrderDiscount(params).then(res => {
      const { data, success } = res.data;
      if (success) {
        setDiscountInfo(data);
      }
    });
  }, [seat, subscribeLongs, levelTab, pageType, spaceId, subscription]);

  const beforeCreateOrderCheck = () => {
    if (pageType !== SubscribePageType.Subscribe && !checkSubscriptionStatus(subscription)) {
      return;
    }

    if (pageType !== SubscribePageType.Upgrade) {
      createOrder();
      return;
    }

    if (Number(discountInfo?.pricePaid) === 0) {
      Modal.warning({
        okText: t(Strings.continue_to_pay),
        cancelText: t(Strings.cancel),
        title: t(Strings.payment_reminder),
        hiddenCancelBtn: false,
        maskClosable: true,
        content: <TComponent
          tkey={t(Strings.payment_reminder_content)}
          params={{
            action: <span onClick={showOrderContactUs} className={styles.contactSpan}>{t(Strings.player_contact_us)}</span>
          }}
        />,
        onOk: async() => {
          await createOrder(false, (orderNo: string) => {
            watchOrderStatus(orderNo, spaceId);
          });
        }
      });
      return;
    }

    createOrder();
  };

  const createOrder = async(showInfo = true, successCb?: (orderNo: string) => void) => {
    setSubmitOrderLoading(true);

    const res = await Api.createOrder({
      month: subscribeLongs!,
      product: levelTab,
      seat: seat!,
      spaceId: spaceId!
    });
    const { data, success, message } = res.data;

    if (success) {
      const { orderNo } = data;
      showInfo && showOrderInfo({
        levelInfo,
        orderId: orderNo,
        orderPrice: pageType === SubscribePageType.Upgrade ? discountInfo?.pricePaid :
          priceInfoCache.current?.get(seat)?.get(subscribeLongs)?.pricePaid!,
        spaceId,
        pay
      });
      successCb && successCb(orderNo);
    } else {
      Message.error({
        content: message
      });
    }

    setSubmitOrderLoading(false);
  };

  const discountPriceDetail = [{
    desc: t(Strings.order_price),
    price: discountInfo?.priceOrigin,
    minus: false,
  }, {
    desc: t(Strings.orgin_plan_discount),
    price: discountInfo?.priceDiscount,
    minus: true,
    priceColor: colors.red[500]
  },
    //   {
    //   desc: t(Strings.discount_amount),
    //   price: discountInfo?.priceUnusedCalculated,
    //   minus: true,
    //   priceColor: colors.red[500]
    // }
  ];

  const showDiscountDeadline = Number(priceInfoCache.current?.get(seat)?.get(subscribeLongs)?.priceDiscount) !== 0;
  return <footer className={styles.payBar}>
    {
      pageType === SubscribePageType.Upgrade &&
      <div className={styles.priceDetail} style={{ top: showDiscountDeadline ? 0 : '-10px' }}>
        <Typography variant={'body1'} color={colors.tangerine[500]}>
          {t(Strings.view_detail)}
        </Typography>
        <div className={styles.detailDialog}>
          <div className={styles.arrow} />
          <Typography variant={'h6'} className={styles.line}>
            {t(Strings.view_detail)}
          </Typography>
          {
            discountPriceDetail.map(item => {
              return <div className={classnames(styles.line, styles.justifySpaceBetween)}>
                <Typography variant={'body2'} component={'span'} color={colors.secondLevelText}>
                  {item.desc}
                </Typography>
                <span style={{ color: item.priceColor || '' }} className={styles.detailPrice}>
                  {item.minus ? '-' : ''}{str2Currency(String(item.price), '￥')}
                </span>
              </div>;
            })
          }
          <div className={styles.splitBorder} />
          <div className={styles.justifySpaceBetween}>
            <Typography variant={'h7'} component={'span'}>
              {t(Strings.to_be_paid)}
            </Typography>
            <span style={{ color: colors.tangerine[500], fontSize: 28 }} className={styles.detailPrice}>
              {str2Currency(String(discountInfo?.pricePaid), '￥')}
            </span>
          </div>
        </div>
      </div>
    }
    <div className={styles.price}>
      {
        showDiscountDeadline && <p className={classnames(styles.totalSave, styles.priceLine)}>
          <Typography variant={'body2'} color={colors.fc2} className={styles.fontStyle}>
            {t(Strings.total_saving)}：
          </Typography>
          <span>
            {
              pageType === SubscribePageType.Upgrade ? str2Currency(String(discountInfo?.priceDiscount || 0), '￥') :
                str2Currency(priceInfoCache.current?.get(seat)?.get(subscribeLongs)?.priceDiscount, '￥')
            }
          </span>
        </p>
      }

      <p className={classnames(styles.totalPaid, styles.priceLine)}>
        <Typography variant={'h6'} color={colors.fc1} className={styles.fontStyle}>
          {t(Strings.pay_model_price_desc)}：
        </Typography>
        <span>{
          pageType === SubscribePageType.Upgrade ? str2Currency(String(discountInfo?.pricePaid), '￥') :
            str2Currency(priceInfoCache.current?.get(seat)?.get(subscribeLongs)?.pricePaid, '￥')
        }</span>
      </p>
    </div>
    <Button
      className={levelInfo.level === SubscribeLevelTab.SILVER ? styles.silverButton : styles.goldButton}
      style={{ color: 'white', width: 160, height: 48, fontSize: 16 }}
      onClick={() => { beforeCreateOrderCheck(); }}
      loading={submitOrderLoading}
    >
      {t(Strings.plan_model_button)}
    </Button>
  </footer>;
};
