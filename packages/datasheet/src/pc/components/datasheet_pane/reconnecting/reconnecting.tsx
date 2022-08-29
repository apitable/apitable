import * as React from 'react';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import WarningIcon from 'static/icon/common/common_icon_warning.svg';
import { useThemeColors } from '@vikadata/components';
import styles from './styles.module.less';
import { t, Strings } from '@vikadata/core';

export const Reconnecting: React.FC = () => {
  const colors = useThemeColors();
  const reconnecting = useSelector(state => {
    return state.space.reconnecting;
  });
  return (
    <Modal
      wrapClassName={styles.modalWrapper}
      destroyOnClose
      visible={reconnecting}
      width={300}
      mask={false}
      closable={false}
      maskClosable={false}
      style={{
        pointerEvents: 'none',
      }}
      footer={null}
      title={<><WarningIcon fill={colors.warningColor} /> {t(Strings.disconnect_from_the_server)}</>}
    >
      {t(Strings.try_my_best_effort_to_reconnect)}
    </Modal>
  );
};
