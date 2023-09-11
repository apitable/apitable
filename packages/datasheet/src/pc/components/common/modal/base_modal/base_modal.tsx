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
import { FC } from 'react';
import { t, Strings } from '@apitable/core';
import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { Modal } from '../modal/modal';
import styles from './style.module.less';
const config = {
  centered: true,
  maskClosable: false,
  visible: true,
};

export interface IBaseModalProps {
  showButton?: boolean;
}

export const BaseModal: FC<React.PropsWithChildren<IModalProps & IBaseModalProps>> = (props) => {
  const {
    className,
    cancelButtonProps,
    okButtonProps,
    cancelText = t(Strings.cancel),
    okText = t(Strings.submit),
    showButton = true,
    ...rest
  } = props;
  const buttonConfig: any = showButton
    ? {
      cancelButtonProps: { size: 'small', ...cancelButtonProps, className: 'subText' },
      okButtonProps: { size: 'small', ...okButtonProps },
    }
    : { footer: null };

  return (
    <Modal
      cancelText={cancelText}
      okText={okText}
      className={classNames(styles.baseModal, className)}
      {...config}
      {...buttonConfig}
      {...rest}
      maskClosable
    />
  );
};
