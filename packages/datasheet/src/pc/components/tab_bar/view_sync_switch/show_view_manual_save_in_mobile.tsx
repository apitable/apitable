import ReactDOM from 'react-dom';
import { CloseMiddleOutlined, DefaultFilled } from '@vikadata/icons';
import { Typography, colorVars } from '@vikadata/components';
import styles from './style.module.less';
import { Strings, t } from '@vikadata/core';

const VIEW_MANUAL_SAVE_TIP = 'VIEW_MANUAL_SAVE_TIP';

export const showViewManualSaveInMobile = () => {
  if (document.querySelector(`.${VIEW_MANUAL_SAVE_TIP}`)) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add(VIEW_MANUAL_SAVE_TIP);
  document.body.appendChild(container);

  const modalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement?.removeChild(container);
  };

  ReactDOM.render((
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
  ),
  container,
  );
};
