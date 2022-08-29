import { Modal, Tooltip } from 'antd';
import * as React from 'react';
import IconNarrow from 'static/icon/datasheet/datasheet_icon_narrow_record16.svg';
import styles from './style.module.less';
import classNames from 'classnames';
import { Strings, t } from '@vikadata/core';

interface IModalOutsideOperateProps {
  onModalClose (): void;
  showOutsideOperate?: boolean;
  pageTurn?: JSX.Element;
  modalWidth?: string | number;
  modalClassName?: string;
  style?: React.CSSProperties;
  getContainer?: HTMLElement | false
}

export const ModalOutsideOperate: React.FC<IModalOutsideOperateProps> = (props) => {

  const { pageTurn, onModalClose, children, modalClassName, modalWidth, showOutsideOperate = true, getContainer } = props;
  return <Modal
    visible
    closeIcon={null}
    wrapClassName={classNames(styles.modalWrapper, modalClassName)}
    onCancel={() => onModalClose()}
    destroyOnClose
    getContainer={getContainer}
    footer={null}
    width={modalWidth}
    centered
  >
    <div className={styles.modalBody}>
      {
        showOutsideOperate && <div className={styles.operateArea}>
          {
            pageTurn
          }
          <Tooltip title={t(Strings.close)}>
            <span className={styles.closeButton} onClick={() => { onModalClose(); }}>
              <IconNarrow width={16} height={16} />
            </span>
          </Tooltip>
        </div>
      }
      {children}
    </div>
  </Modal>;
};