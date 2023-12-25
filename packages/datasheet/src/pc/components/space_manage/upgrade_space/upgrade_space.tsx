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

import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@apitable/components';
import { Api, Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { Trial } from 'enterprise/log/trial';
// @ts-ignore
import { showUpgradeContactUs } from 'enterprise/subscribe_system/order_modal/pay_order_success';
import styles from './style.module.less';

// const upperCaseFirstWord = (str: string) => {
//   if (str.length < 2) {
//     return str;
//   }
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

function getClientReferenceId() {
  return (window['Rewardful'] && window['Rewardful'].referral) || '';
}

function getStripeCoupon() {
  return (window['Rewardful'] && window['Rewardful'].coupon) || '';
}

interface IUpgradeSpaceProps {
  hideDetail?: boolean;
}

const UpgradeSpace: React.FC<IUpgradeSpaceProps> = ({ hideDetail }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const { product, recurringInterval, onTrial } = useAppSelector((state) => state.billing?.subscription) || {};
  const vars = getEnvVariables();
  const [loading, setLoading] = useState(!vars.IS_AITABLE);
  const [showTrialModal, setShowTrialModal] = useState<boolean>(vars.CLOUD_DISABLE_BILLING_UPGRADE);

  useEffect(() => {
    if (!iframeRef) {
      return;
    }

    const receiveMes = async (event: any) => {
      if (!event) {
        return;
      }
      const {
        data: { msg, pageType, grade, priceId, productInterval, isTrail = true },
      } = event;

      if (msg === 'pageLoaded') {
        iframeRef.current?.contentWindow?.postMessage(
          {
            msg: 'fromVikaUpgrade',
            product,
            recurringInterval,
            trial: onTrial,
          },
          '*',
        );
        setLoading(false);
      }

      if (msg === 'choosePlan') {
        const currentRecurringIntervalIsMonth = recurringInterval?.toLowerCase().includes('month');
        const newRecurringIntervalIsMonth = productInterval?.toLowerCase().includes('month');

        const _product = product.toLowerCase();
        const _grade = grade.toLowerCase();

        if ((_product === _grade && currentRecurringIntervalIsMonth !== newRecurringIntervalIsMonth) || (_product !== _grade && !priceId)) {
          // 修改订阅周期
          if (!vars.IS_ENTERPRISE && !vars.IS_APITABLE) return;
          //@ts-ignore
          const planInfoRes = await Api.getSubscript(spaceId);
          const { subscriptionId } = planInfoRes.data.data;
          //@ts-ignore
          const res = await Api?.updateBillingSubscription(spaceId, subscriptionId);
          const { success, data } = res.data;
          if (success) {
            window.open(data.url, '_blank', 'noopener,noreferrer');
          }
        }

        if (_product !== _grade) {
          // 修改订阅产品呢
          const res = await Api.checkoutOrder(spaceId!, priceId, getClientReferenceId(), getStripeCoupon()?.id, isTrail);
          const { url } = res.data;
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }

      if (msg === 'toUpgrade') {
        window.open(`/space/${spaceId}/upgrade`, '_blank', 'noopener,noreferrer');
        return;
      }

      if (msg === 'contactUs') {
        showUpgradeContactUs();
      }

      if (pageType) {
        window.open(`/space/${spaceId}/upgrade?pageType=${pageType}`, '_blank', 'noopener,noreferrer');
      }
    };

    window.addEventListener('message', receiveMes);

    return () => {
      window.removeEventListener('message', receiveMes);
    };
    // eslint-disable-next-line
  }, [spaceId, product]);

  if (showTrialModal) {
    return Trial && <Trial setShowTrialModal={setShowTrialModal} title={t(Strings.upgrade_space)} />;
  }

  const iframeSrc = location.origin + `/pricing/?upgradeSpace=true&currentProduct=${product}&hideDetail=${hideDetail}`;
  // const iframeSrc = 'http://localhost:3002' + `/pricing/?upgradeSpace=true&currentProduct=${product}&hideDetail=${hideDetail}`;

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loading}>
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
      )}
      <iframe src={iframeSrc} ref={iframeRef} />
    </div>
  );
};

export default UpgradeSpace;
