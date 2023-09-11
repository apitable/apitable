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
import React, { FC } from 'react';
import { Button, IButtonProps, IButtonType, ITextButtonProps, TextButton } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { MODAL_FOOTER_BTN_CONFIRM } from 'pc/utils/test_id_constant';
import styles from './style.module.less';

interface IFooterBtnInModalProps {
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  okButtonProps?: IButtonProps;
  cancelButtonProps?: ITextButtonProps;
  okText?: React.ReactNode;
  okType?: IButtonType;
  cancelText?: React.ReactNode;
  className?: string;
  hiddenCancelBtn?: boolean;
}

export const FooterBtnInModal: FC<React.PropsWithChildren<IFooterBtnInModalProps>> = (props) => {
  const {
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    okText = t(Strings.confirm),
    okType = 'primary',
    cancelText = t(Strings.cancel),
    className,
    hiddenCancelBtn,
  } = props;

  return (
    <div className={classNames(styles.modalFooterBtnWrapper, className)}>
      {!hiddenCancelBtn && (
        <TextButton className="cancelBtn" size="small" onClick={onCancel} {...cancelButtonProps}>
          {cancelText}
        </TextButton>
      )}
      <Button data-test-id={MODAL_FOOTER_BTN_CONFIRM} color={okType} size="small" onClick={onOk} {...okButtonProps}>
        {okText}
      </Button>
    </div>
  );
};
