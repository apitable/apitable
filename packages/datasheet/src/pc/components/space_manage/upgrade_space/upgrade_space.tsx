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

import { Strings, t, Api } from '@apitable/core';
// @ts-ignore
import { showUpgradeContactUs, Trial } from 'enterprise';
import { Modal } from 'pc/components/common';
import { getEnvVariables } from 'pc/utils/env';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';
import { Skeleton } from '@apitable/components';

const upperCaseFirstWord = (str: string) => {
  if (str.length < 2) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function getClientReferenceId() {
  return window['Rewardful'] && window['Rewardful'].referral || ('checkout_' + (new Date).getTime());
}

function getStripeCoupon() {
  return window['Rewardful'] && window['Rewardful'].coupon || '';
}

const UpgradeSpace = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const spaceId = useSelector(state => state.space.activeId);
  const { product, recurringInterval, onTrial } = useSelector(state => state.billing?.subscription) || {};
  const [loading, setLoading] = useState(true);
  const vars = getEnvVariables();

  const [showTrialModal, setShowTrialModal] = useState<boolean>(vars.CLOUD_DISABLE_BILLING_UPGRADE);

  useEffect(() => {
    if (!iframeRef) {
      return;
    }

    const receiveMes = (event: any) => {
      if (!event) {
        return;
      }
      const {
        data: { msg, pageType, grade, priceId },
      } = event;

      if (msg === 'pageLoaded') {
        iframeRef.current?.contentWindow?.postMessage(
          {
            msg: 'fromVikaUpgrade',
            product,
            recurringInterval,
            trial: onTrial
          },
          '*',
        );
        setLoading(false);
      }
      console.log('msg', msg, grade);
      if (msg === 'toDowngrade' && grade) {
        if(grade === 'free') {
          Modal.warning({
            title: onTrial ? t(Strings.billing_cancel_trial_title) : t(Strings.billing_cancel_title),
            content: onTrial ? t(Strings.billing_cancel_trial_content) : t(Strings.billing_cancel_content),
            hiddenCancelBtn: false,
            okText: t(Strings.confirm),
            cancelText: t(Strings.cancel),
            zIndex: 1100,
            onOk: async() => {
              if(!vars.IS_ENTERPRISE && !vars.IS_APITABLE) return;
              //@ts-ignore
              const planInfoRes = await Api.getSubscript(spaceId);
              const { subscriptionId } = planInfoRes.data.data;
              //@ts-ignore
              const res = await Api?.cancelSubscription(spaceId!, subscriptionId);
              const { success, data } = res.data;
              if(success) {
                location.href = data.url;
              }
            },
          });
          return;
        }
        Modal.warning({
          title: t(Strings.downgrade),
          content: t(Strings.downgrade_content),
          hiddenCancelBtn: false,
          okText: t(Strings.modal_downgrade_btn_txt, {
            grade: upperCaseFirstWord(grade),
          }),
          cancelText: t(Strings.cancel),
          zIndex: 1100,
          onOk: async() => {
            const res = await Api.checkoutOrder(spaceId!, priceId, getClientReferenceId(), getStripeCoupon()?.id);
            const { url } = res.data;
            location.href = url;
          },
        });
        return;
      }

      if (msg === 'toUpgrade') {
        if (grade) {
          Modal.info({
            title: t(Strings.upgrade),
            content: t(Strings.upgrade_content),
            hiddenCancelBtn: false,
            okText: t(Strings.modal_upgrade_btn_txt, {
              grade: upperCaseFirstWord(grade),
            }),
            cancelText: t(Strings.cancel),
            zIndex: 1100,
            onOk: async() => {
              const res = await Api.checkoutOrder(spaceId!, priceId, getClientReferenceId(), getStripeCoupon()?.id);
              const { url } = res.data;
              location.href = url;
              // window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
            },
          });
          return;
        }
        window.open(`/space/${spaceId}/upgrade`, '_blank', 'noopener,noreferrer');
        return;
      }

      if (msg === 'changePeriod') {
       
        Modal.warning({
          title: t(Strings.billing_interval),
          content: t(Strings.change_period_content),
          hiddenCancelBtn: false,
          cancelText: t(Strings.cancel),
          zIndex: 1100,
          onOk: async() => {
            if(!vars.IS_ENTERPRISE && !vars.IS_APITABLE) return;
            //@ts-ignore
            const planInfoRes = await Api.getSubscript(spaceId);
            const { subscriptionId } = planInfoRes.data.data;
            //@ts-ignore
            const res = await Api?.updateBillingSubscription(spaceId, subscriptionId);
            const { success, data } = res.data;
            if(success) {
              location.href = data.url;
            }
          },
        });
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
    return Trial && <Trial setShowTrialModal={setShowTrialModal} title={t(Strings.upgrade_space)}/>;
  }

  const iframeSrc = location.origin + '/pricing/';
  // const iframeSrc = 'http://localhost:3002' + '/pricing/';

  return <div className={styles.container}>
    {
      loading && <div className={styles.loading}>
        <Skeleton width='38%'/>
        <Skeleton count={2}/>
        <Skeleton width='61%'/>

        <Skeleton width='38%'/>
        <Skeleton count={2}/>
        <Skeleton width='61%'/>

        <Skeleton width='38%'/>
        <Skeleton count={2}/>
        <Skeleton width='61%'/>
      </div>
    }
    <iframe src={iframeSrc} ref={iframeRef}/>
  </div>;
};

export default UpgradeSpace;
