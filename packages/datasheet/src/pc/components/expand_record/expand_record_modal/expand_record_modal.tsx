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

import { useEventListener } from 'ahooks';
import { Modal } from 'antd';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { DATASHEET_ID, RecordVision, Selectors } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { endEditCell } from 'pc/components/editors/end_edit_cell';
import { useResponsive } from 'pc/hooks/use_responsive';
import { useAppSelector } from 'pc/store/react-redux';
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

const ExpandRecordModalBase: FC<React.PropsWithChildren<IExpandRecordModal>> = (props) => {
  const recordVision = useAppSelector((state) => state.recordVision);
  useAppSelector((state) => state.space.isSideRecordOpen);
  const isRecordFullScreen = useAppSelector((state) => state.space.isRecordFullScreen);
  const isEditingCell = useAppSelector((state) => Boolean(Selectors.getEditingCell(state)));

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
        open
        wrapClassName={classNames(props.wrapClassName, 'centerExpandRecord', EXPAND_RECORD_CLS)}
        onCancel={props.onCancel}
        closeIcon={null}
        destroyOnClose
        width="70%"
        style={{
          minWidth: isMobile ? undefined : 760, // Pop-ups that are wider than the screen width will be styled incorrectly
          maxWidth: 2000,
        }}
        footer={null}
        transitionName="" // https://ant.design/components/modal/#How-to-disable-motion Note on antd updates
        maskTransitionName="" // https://ant.design/components/modal/#How-to-disable-motion Note on antd updates
        centered
        zIndex={Z_INDEX}
      >
        {props.children}
      </Modal>
    );
  };

  // forced centering (forceCenter set and not in full screen mode)
  if (props.forceCenter && !isRecordFullScreen) {
    return renderCenterModal();
  }

  // Full screen
  if (!isMobile && isRecordFullScreen) {
    return <div className={styles.fullScreenModal}>{props.children}</div>;
  }

  // Side
  if (!isMobile && recordVision === RecordVision.Side) {
    const children = (
      <div className={styles.sideModal} ref={ref}>
        {props.children}
      </div>
    );
    // @ts-ignore
    return <Portal getContainer={() => document.querySelector(`#${DATASHEET_ID.SIDE_RECORD_PANEL}`) as HTMLElement}>{() => children}</Portal>;
  }

  // Centering
  return renderCenterModal();
};

export const ExpandRecordModal = React.memo(ExpandRecordModalBase);
