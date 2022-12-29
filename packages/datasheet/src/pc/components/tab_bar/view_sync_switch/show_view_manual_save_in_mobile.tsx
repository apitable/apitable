import { colorVars, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { CloseMiddleOutlined, DefaultFilled } from '@apitable/icons';
import { createRoot } from 'react-dom/client';
import styles from './style.module.less';

const VIEW_MANUAL_SAVE_TIP = 'VIEW_MANUAL_SAVE_TIP';

export const showViewManualSaveInMobile = () => {
  if (document.querySelector(`.${VIEW_MANUAL_SAVE_TIP}`)) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add(VIEW_MANUAL_SAVE_TIP);
  document.body.appendChild(container);
  const root= createRoot(container);
  const modalClose = () => {
    root.unmount();
    container.parentElement?.removeChild(container);
  };

  root.render((
    <div className={styles.mobileTip}>
      <span className={styles.infoIcon}>
        <DefaultFilled />
      </span>
      <Typography variant={'body2'}>
        {t(Strings.mbile_manual_setting_tip)}
      </Typography>
      <span onClick={modalClose}>
        <CloseMiddleOutlined color={colorVars.primaryColor} />
      </span>
    </div>
  ));
};
