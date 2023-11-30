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

import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';
import { Strings, t } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { Tooltip } from 'pc/components/common/tooltip/tooltip';
import { Modal } from '../modal/modal';
import styles from './style.module.less';

export interface INormalModalProps extends Omit<IModalProps, 'title'> {
  title: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  className?: string;
}

const config = {
  centered: true,
  maskClosable: false,
  visible: true,
  width: 400,
  style: { minWidth: '400px' },
};

export const NormalModal: FC<PropsWithChildren<INormalModalProps>> = (props) => {
  const { title, className, subTitle, cancelText = t(Strings.cancel), okText = t(Strings.submit), ...rest } = props;
  return (
    <Modal
      {...config}
      cancelText={cancelText}
      okText={okText}
      title={title}
      className={classNames(styles.normalModal, className)}
      maskClosable
      destroyOnClose
      footerBtnCls={styles.footer}
      {...rest}
    >
      {subTitle && (
        <Tooltip title={subTitle} placement="bottomLeft" textEllipsis>
          <div className={styles.subTitle}>{subTitle}</div>
        </Tooltip>
      )}
      <div
        className="normal-modal-content"
        style={{
          marginTop: subTitle ? '20px' : '28px',
        }}
      >
        {props.children}
      </div>
    </Modal>
  );
};
