/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Skeleton } from '@apitable/components';
import { Strings, t } from '@apitable/core';
// @ts-ignore
import { showUpgradeContactUs, Trial } from 'enterprise';
import { getEnvVariables } from 'pc/utils/env';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';

const UpgradeSpace = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const spaceId = useSelector(state => state.space.activeId);
  const product = useSelector(state => state.billing?.subscription?.product);
  const [loading, setLoading] = useState(true);

  const vars = getEnvVariables();

  const [showTrialModal, setShowTrialModal] = useState<boolean>(vars.CLOUD_DISABLE_BILLING_UPGRADE);

  useEffect(() => {
    if (!iframeRef) {
      return;
    }

    const initIframe = () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          msg: 'fromVikaUpgrade',
          product,
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

  if (showTrialModal) {
    return Trial && <Trial setShowTrialModal={setShowTrialModal} title={t(Strings.upgrade_space)} />;
  }

  const iframeSrc = location.origin + '/pricing/';
  // const iframeSrc = 'http://localhost:3002' + '/pricing/';

  return <div className={styles.container}>
    {
      loading && <div className={styles.loading}>
        <Skeleton width='38%' />
        <Skeleton count={2} />
        <Skeleton width='61%' />

        <Skeleton width='38%' />
        <Skeleton count={2} />
        <Skeleton width='61%' />

        <Skeleton width='38%' />
        <Skeleton count={2} />
        <Skeleton width='61%' />
      </div>
    }
    <iframe src={iframeSrc} ref={iframeRef} />
  </div>;
};

export default UpgradeSpace;
