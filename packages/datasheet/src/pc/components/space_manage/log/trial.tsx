import { Strings, t } from '@apitable/core';
import { Button } from '@vikadata/components';
import classnames from 'classnames';
import Image from 'next/image';
import { SubscribeUsageTipType, triggerUsageAlert } from 'modules/enterprise/billing';
import styles from 'pc/components/space_manage/log/styles.module.less';
import { labelMap, SubscribeGrade } from 'pc/components/subscribe_system/subscribe_label';
import { Dispatch, FC, SetStateAction } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import UnauthorizedPng from 'static/icon/audit/audit_unauthorized_img.png';

interface ITrialProps {
  setShowTrialModal: Dispatch<SetStateAction<boolean>>;
  title: string;
}

export const Trial: FC<ITrialProps> = ({ setShowTrialModal, title }) => {
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const subscription = useSelector(state => state.billing.subscription, shallowEqual);
  const social = spaceInfo?.social;

  const onTrial = () => {
    const result = triggerUsageAlert(
      'maxAuditQueryDays',
      { usage: subscription?.maxAuditQueryDays, grade: labelMap[SubscribeGrade.Enterprise](social?.appType), alwaysAlert: true },
      SubscribeUsageTipType.Alert,
    );

    if (result) return;

    setShowTrialModal(false);
  };

  return <div className={classnames([styles.logContainer, styles.logContainerUnauthorized])}>
    <div className={styles.unauthorizedBg}>
      <Image alt='' src={UnauthorizedPng} />
    </div>
    <h1 className={classnames([styles.unauthorizedTitle, styles.title])}>
      {title}
    </h1>
    <h2 className={styles.desc}>
      {t(Strings.space_log_trial_desc3)}
    </h2>
    <h2 className={styles.desc}>
      {t(Strings.space_log_trial_desc2)}
    </h2>
    <Button
      className={styles.trialButton}
      color='primary'
      onClick={onTrial}
    >
      {t(Strings.space_log_trial_button)}
    </Button>
  </div>;
};
