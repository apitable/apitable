import { Skeleton } from '@vikadata/components';
import { showUpgradeContactUs } from 'pc/components/subscribe_system/order_modal/pay_order_success';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';

const UpgradeSpace = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const spaceId = useSelector(state => state.space.activeId);
  const product = useSelector(state => state.billing.subscription?.product);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!iframeRef) {
      return;
    }

    const initIframe = () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          msg: 'fromVikaUpgrade',
          product
        }, '*');

    };
    const receiveMes = (event) => {
      if (!event) {
        return;
      }
      const { data: { msg, pageType }} = event;
      if (msg === 'pageLoaded') {
        setLoading(false);
      }
      if (msg === 'toUpgrade') {
        window.open(`/space/${spaceId}/upgrade`, '_blank', 'noopener,noreferrer');
      }
      if (msg === 'contactUs') {
        showUpgradeContactUs();
      }
      if (pageType) {
        window.open(`/space/${spaceId}/upgrade?pageType=${pageType}`, '_blank', 'noopener,noreferrer');
      }

    };
    const dom = iframeRef.current;
    dom?.addEventListener('load', initIframe);
    window.addEventListener('message', receiveMes);

    return () => {
      dom?.removeEventListener('load', initIframe);
      window.removeEventListener('message', receiveMes);
    };
  }, [spaceId, product]);

  const iframeSrc = location.origin + '/pricing/';
  // const iframeSrc = 'http://localhost:3002' + '/pricing/';

  return <div className={styles.container}>
    {
      loading && <div className={styles.loading}>
        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />

        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />

        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />
      </div>
    }
    <iframe src={iframeSrc} ref={iframeRef} />
  </div>;
};

export default UpgradeSpace;
