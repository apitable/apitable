import { ConfigConstant, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { FC } from 'react';
import styles from './style.module.less';
import { Modal, Typography, colorVars } from '@apitable/components';

export const SliderVerification: FC = props => {

  useMount(() => {
    window['nvc'].getNC({ renderTo: ConfigConstant.CaptchaIds.DEFAULT });
  });

  return (
    <div id="nc" />
  );
};

export const openSliderVerificationModal = () => {
  Modal.confirm({
    className: styles.sliderVerificationModal,
    icon: '',
    title: t(Strings.safety_verification),
    content: <div>
      <Typography variant="body2" color={colorVars.fc1} className={styles.tip}>{t(Strings.safety_verification_tip)}</Typography>
      <SliderVerification />
    </div>,
    width: 388,
    cancelButtonProps: { style: { display: 'none' }},
    okButtonProps: { style: { display: 'none' }},
    closable: true,
    footer: null,
  });
};