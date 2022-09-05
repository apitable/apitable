import { DATASHEET_ID, RecordVision, Selectors } from '@vikadata/core';
import { useEventListener } from 'ahooks';
import { Modal } from 'antd';
import classNames from 'classnames';
import { ScreenSize } from 'pc/components/common/component_display';
import { endEditCell } from 'pc/components/editors/end_edit_cell';
import { useResponsive } from 'pc/hooks';
import React, { FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Portal } from './portal';
import styles from './style.module.less';

const Z_INDEX = 999;

export const EXPAND_RECORD_CLS = 'expandRecordModal';

interface IExpandRecordModal {
  onCancel: () => void;
  wrapClassName?: string;
  forceCenter?: boolean;
  children: JSX.Element[];
}

const ExpandRecordModalBase: FC<IExpandRecordModal> = props => {
  const recordVision = useSelector(state => state.recordVision);
  const hasRecordId = useSelector(state => Boolean(state.pageParams.recordId));
  useSelector(state => state.space.isSideRecordOpen);
  const isRecordFullScreen = useSelector(state => state.space.isRecordFullScreen);
  const isEditingCell = useSelector(state => Boolean(Selectors.getEditingCell(state)));

  const ref = useRef<HTMLDivElement>(null);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useEventListener(
    'mousedown',
    () => {
      if (isEditingCell) {
        endEditCell();
      }
    },
    { target: ref, capture: true },
  );

  const renderCenterModal = () => {
    return (
      <Modal
        visible
        wrapClassName={classNames(props.wrapClassName, 'centerExpandRecord', EXPAND_RECORD_CLS)}
        onCancel={props.onCancel}
        closeIcon={null}
        destroyOnClose
        width="70%"
        style={{
          minWidth: isMobile ? undefined : 760, // 弹窗宽度如果超过屏幕宽度，会出现样式错误
          maxWidth: 2000,
        }}
        footer={null}
        transitionName="" // https://ant.design/components/modal/#How-to-disable-motion antd更新时需留意
        maskTransitionName="" // https://ant.design/components/modal/#How-to-disable-motion antd更新时需留意
        centered
        zIndex={Z_INDEX}
      >
        {props.children}
      </Modal>
    );
  };

  // 强制居中（路由中不存在 recordId 或设置了 forceCenter，且不为全屏模式）
  if (!hasRecordId || (props.forceCenter && !isRecordFullScreen)) {
    return renderCenterModal();
  }

  // 全屏
  if (!isMobile && isRecordFullScreen) {
    return <div className={styles.fullScreenModal}>{props.children}</div>;
  }

  // 侧边
  if (!isMobile && recordVision === RecordVision.Side) {
    const children = (
      <div className={styles.sideModal} ref={ref}>
        {props.children}
      </div>
    );
    return <Portal getContainer={() => document.querySelector(`#${DATASHEET_ID.SIDE_RECORD_PANEL}`) as HTMLElement}>{() => children}</Portal>;
  }

  // 居中
  return renderCenterModal();
};

export const ExpandRecordModal = React.memo(ExpandRecordModalBase);
