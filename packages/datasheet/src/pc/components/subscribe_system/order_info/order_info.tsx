import { ThemeProvider, Typography, useThemeColors } from '@apitable/components';
import { Api, ApiInterface, IApiWrapper, integrateCdnHost, Settings, str2Currency, Strings, t } from '@apitable/core';
import { AlipayFilled, BankFilled, WechatpayFilled } from '@apitable/icons';
import { Modal } from 'antd';
import { AxiosResponse } from 'axios';
import Image from 'next/image';
import { Message } from 'pc/components/common';
import { TComponent } from 'pc/components/common/t_component';
import { showOrderContactUs } from 'pc/components/subscribe_system/order_modal/pay_order_success';
import { store } from 'pc/store';
import pingpp from 'pingpp-js';
import qr from 'qr-image';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import QrCodePng from 'static/icon/datasheet/share/qrcode/datasheet_img_qr_bj.png';
import styles from './styles.module.less';

interface IOrderInfo {
  levelInfo: any;
  orderId: string;
  orderPrice: number;
  spaceId: string;
  pay: number;
  onCancel?(): void;
}

export const payMethodConfig = [
  {
    payName: t(Strings.wechat_payment),
    payId: 'wx_pub_qr',
    payIcon: <WechatpayFilled color={'#09BB07'} size={24} />,
  },
  {
    payName: t(Strings.alipay),
    payId: 'alipay_pc_direct',
    payIcon: <AlipayFilled color={'#1677FF'} size={24} />,
  },
  {
    payName: t(Strings.transfer_to_public),
    payId: 'bank',
    payIcon: <BankFilled size={24} />,
  },
];

const orderResponseHandle =
  (res: AxiosResponse<IApiWrapper & { data: ApiInterface.IQueryOrderStatusResponse }>, spaceId: string, onCancel?: () => void) => {
    const { success, data, message } = res.data;
    if (success) {
      if (data.status === 'finished') {
        location.href = location.origin + `/space/${spaceId}/workbench` + location.search;
        return;
      }
      if (data.status === 'canceled') {
        Message.error({
          content: 'order has been cancel.',
        });
        onCancel?.();
        return;
      }
    } else {
      onCancel?.();
      Message.error({
        content: message,
      });
    }
  };

export const watchOrderStatus = async(orderId: string, spaceId: string, onCancel?: () => void) => {
  const res = await Api.queryOrderStatus(orderId);
  orderResponseHandle(res, spaceId, onCancel);
};

export const OrderInfo: React.FC<IOrderInfo> = (props) => {
  const colors = useThemeColors();
  const { orderPrice, orderId, onCancel, spaceId, pay } = props;
  const [wechartPayUrl, setWechartPayUrl] = useState('');
  const [aliPayUrl, setAliPayUrl] = useState('');
  const [manualFresh, setManualFresh] = useState<boolean | undefined>();

  useEffect(() => {
    if (pay === 2) {
      return;
    }
    Api.payOrder(orderId, payMethodConfig[pay].payId as any).then(res => {
      const { success, data, message } = res.data;
      if (!success) {
        Message.error({
          content: message,
        });
        onCancel?.();
        return;
      }
      if (pay === 0) {
        setWechartPayUrl(data.wxQrCodeLink);
        return;
      }
      if (pay === 1) {
        pingpp.setUrlReturnCallback(function(err, url) {
          const _url = new URL(url);
          setAliPayUrl(`https://${_url.hostname}${_url.pathname}${_url.search}`);
        }, ['alipay_pc_direct', 'alipay_wap']);
        const charge = JSON.parse(data.alipayPcDirectCharge);
        pingpp.createPayment(charge, (result, err) => { });
      }
    });
  }, [pay, orderId, onCancel]);

  useEffect(() => {

    const interval = setInterval(() => {
      if (pay === 2) {
        return;
      }
      if (!wechartPayUrl && !aliPayUrl) {
        return;
      }
      watchOrderStatus(orderId, spaceId, onCancel);
    }, 2 * 1000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pay, orderId, wechartPayUrl, aliPayUrl]);

  const getQrCode = useMemo(() => {
    if (pay === 0) {
      const svg = qr.imageSync(wechartPayUrl, { type: 'svg' }) as string;
      return <div className={styles.wechartPay} dangerouslySetInnerHTML={{ __html: wechartPayUrl ? svg : '<svg />' }} />;
    }
    if (pay === 1) {
      return <div className={styles.wechartPay}>
        <iframe src={aliPayUrl} width={224} height={218} />
      </div>;
    }
    if (pay === 2) {
      return <div className={styles.bankPay}>
        <Image src={QrCodePng} alt='qrcode background' layout={'fill'} />
        <Image src={integrateCdnHost(Settings.enterprise_qr_code.value)} width={224} height={224} />
      </div>;
    }
    return <Image src={''} />;
  }, [pay, wechartPayUrl, aliPayUrl]);

  const paidCheck = async() => {
    setManualFresh(true);
    const res = await Api.paidCheck(orderId);
    orderResponseHandle(res, spaceId, onCancel);
    setManualFresh(false);
  };

  const getManualFreshDom = () => {
    if (manualFresh == null) {
      return <TComponent
        tkey={t(Strings.check_order_status)}
        params={{
          action: <span onClick={paidCheck}>{t(Strings.fresh_order_status_action)}</span>,
        }} />;
    }
    if (manualFresh) {
      return t(Strings.reconciled_data);
    }
    return <TComponent
      tkey={t(Strings.unpaid_order_status)}
      params={{
        action: <span onClick={paidCheck}>{t(Strings.fresh_order_status_action)}</span>,
      }} />;
  };

  return <div className={styles.container}>
    <Typography variant={'h5'}>
      {t(Strings.pay_model_title)}
    </Typography>
    <main>
      {
        pay === 2 ? <Typography variant={'h6'}>
          {t(Strings.pay_model_price_public_transfer_desc)}
        </Typography> : <p className={styles.price}>
          <Typography variant={'h7'} style={{ paddingTop: 16 }}>
            {t(Strings.pay_model_price_desc)}：
          </Typography>
          <span>
            {
              str2Currency(String(orderPrice), '￥')
            }
          </span>
        </p>
      }
      {
        getQrCode
      }
    </main>
    {
      pay !== 2 && <div className={styles.freshOrderStatus}>
        <Typography variant={'body2'}>
          {getManualFreshDom()}
        </Typography>
      </div>
    }

    {
      pay !== 2 && <footer style={{ top: 0, marginTop: 32 }}>
        <Typography variant={'body3'}>
          <TComponent
            tkey={t(Strings.pay_model_price_contact)}
            params={{
              contact_us: <span onClick={showOrderContactUs} style={{ color: colors.deepPurple[500] }}>{t(Strings.contact_us)}</span>,
            }} />
        </Typography>
      </footer>
    }

  </div>;
};

export interface IShowOrderInfoProps {
  levelInfo: any;
  orderId: string;
  orderPrice: number;
  spaceId: string;
  pay: number;
}

export const showOrderInfo = (info: IShowOrderInfoProps) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
  };

  root.render((
    <Provider store={store}>
      <ThemeProvider>
        <Modal
          visible
          wrapClassName={styles.modalWrapper}
          closeIcon={<CloseIcon />}
          onCancel={onModalClose}
          destroyOnClose
          width='min-content'
          footer={null}
          centered
        >
          <OrderInfo onCancel={() => onModalClose()} {...info} />
        </Modal>
      </ThemeProvider>
    </Provider>
  ));
};

