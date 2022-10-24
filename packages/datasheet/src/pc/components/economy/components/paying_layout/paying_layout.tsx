import { Button, Typography } from '@vikadata/components';
import { WarnFilled } from '@vikadata/icons';
import { useEventListener, useMount } from 'ahooks';
import { Col, Row, Spin } from 'antd';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC, useRef } from 'react';
import styles from './style.module.less';

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });

interface IPayingLayout {
  contentLeft: React.ReactNode,
  contentRight: React.ReactNode,
  footerLeft?: React.ReactNode,
  footerRight?: React.ReactNode,
  onSubmit?: () => void;
  loading?: boolean;
  // loading的icon颜色以及button的颜色
  themeColor?: string;
}

export const PayingLayout: FC<IPayingLayout> = (
  { contentLeft, contentRight, footerLeft, footerRight, onSubmit, loading, themeColor }
) => {

  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const updateStyle = () => {
    updatePaddingStyle([leftRef, rightRef]);
  };
  useMount(updateStyle);
  useEventListener('resize', updateStyle);

  const updatePaddingStyle = (domRefs: React.MutableRefObject<HTMLDivElement | null>[]) => {
    domRefs.forEach(ref => {
      if (!ref.current) return;
      const isScroll = ref.current!.scrollHeight > ref.current!.clientHeight;
      ref.current.style.paddingRight = isScroll ? '20px' : '32px';
    });
  };

  return (
    <div className={styles.payingLayout}>
      <div className={styles.content}>
        <Row>
          <Col span={17}>
            <div className={styles.contentLeft} ref={leftRef}>
              {contentLeft}
              <div className={styles.morePayingTypeTip}>
                <WarnFilled size={24} />
                <Typography variant='body3'>
                  当前仅支持使用 V 币支付，了解更多请<a href='#'>联系客服</a>
                </Typography>
              </div>
            </div>
          </Col>
          <Col span={7}>
            <div className={styles.contentRight} ref={rightRef}>{contentRight}</div>
          </Col>
        </Row>
      </div>
      <div className={styles.footer}>
        <Row>
          <Col span={17}>
            <div className={styles.footerLeft}>
              {footerLeft}
            </div>
          </Col>
          <Col span={7}>
            {
              footerRight ||
              <div className={styles.footerRight}>
                <Button
                  color='primary'
                  className={styles.button}
                  onClick={onSubmit}
                  loading={loading}
                >支付订单</Button>
              </div>
            }
          </Col>
        </Row>
      </div>
      {
        loading &&
        <div className={styles.loading}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: themeColor }} spin />} />
          <Typography variant='body2' className={styles.tip}>支付中</Typography>
        </div>
      }
    </div>
  );
};

export const ModalContentLayout: FC = (props) => {
  return (
    <div className={styles.modalContentLayout}>{props.children}</div>
  );
};
