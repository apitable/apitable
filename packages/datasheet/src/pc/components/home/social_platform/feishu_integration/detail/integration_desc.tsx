import { useEffect, useState } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { Button, Checkbox } from '@vikadata/components';
import { Strings, t } from '@apitable/core';

import styles from './styles.module.less';

interface IIntegrationDescProps {
  nextStep: () => void;
}
export const IntegrationDesc: React.FC<IIntegrationDescProps> = ({ nextStep }) => {
  const [countDown, setCountDown] = useState<number>(5);
  const [cdInterval, setCdInterval] = useState<NodeJS.Timeout | null>(null);
  const [checkbox, setCheckbox] = useState<boolean>();
  useEffect(() => {
    const interval = setInterval(() => {
      if (countDown <= 0) {
        cdInterval && clearInterval(cdInterval);
        return;
      }
      setCountDown(countDown - 1);
    }, 1000);
    setCdInterval(interval);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextStep, countDown]);
  return (
    <div className={styles.integrationDesc}>
      <div className={styles.integrationDescTitle}>
        {t(Strings.lark_integration_step1_instructions)}
      </div>
      <div className={styles.integrationDescSubTitle}>{t(Strings.lark_integration_ability_desc)}</div>
      <div
        className={classNames(styles.integrationDescContent, styles.mb24)}
        dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step1_content) }}
      />
      <div className={styles.integrationDescSubTitle}>{t(Strings.matters_needing_attention)}</div>
      <div
        className={classNames(styles.integrationDescContent, styles.mb24)}
        dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step1_warning) }}
      />
      <div className={styles.integrationDescSubTitle}>{t(Strings.lark_integration_step1_tips)}</div>
      <div
        className={styles.integrationDescContent}
        dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step1_tips_content) }}
      />
      <div className={classNames(styles.buttonWrap, styles.buttonCheckboxWrap)}>
        <div className={styles.checkboxWrap}>
          <Checkbox checked={checkbox} onChange={() => setCheckbox(!checkbox)} >
            <span className={styles.checkboxText}>{t(Strings.wecom_integration_desc_check)}</span>
          </Checkbox>
        </div>
        <Button color="primary" size="middle" onClick={nextStep} block disabled={countDown > 0 || !checkbox}>
          {countDown > 0 ? `（${countDown}s）${t(Strings.please_read_carefully)}` : t(Strings.start_onfiguration)}
        </Button>
      </div>
    </div>
  );
};
