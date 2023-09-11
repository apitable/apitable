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

import { Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { Strings, t } from '@apitable/core';
import { NarrowOutlined } from '@apitable/icons';
import styles from './style.module.less';

interface IModalOutsideOperateProps {
  onModalClose(): void;
  showOutsideOperate?: boolean;
  pageTurn?: JSX.Element;
  modalWidth?: string | number;
  modalClassName?: string;
  style?: React.CSSProperties;
  getContainer?: HTMLElement | false;
}

export const ModalOutsideOperate: React.FC<React.PropsWithChildren<IModalOutsideOperateProps>> = (props) => {
  const { pageTurn, onModalClose, children, modalClassName, modalWidth, showOutsideOperate = true, getContainer } = props;
  return (
    <Modal
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
        {showOutsideOperate && (
          <div className={styles.operateArea}>
            {pageTurn}
            <Tooltip title={t(Strings.close)}>
              <span
                className={styles.closeButton}
                onClick={() => {
                  onModalClose();
                }}
              >
                <NarrowOutlined size={16} />
              </span>
            </Tooltip>
          </div>
        )}
        {children}
      </div>
    </Modal>
  );
};
