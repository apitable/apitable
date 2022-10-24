import { Button, IButtonProps, IButtonType, ITextButtonProps, TextButton } from '@vikadata/components';
import { Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { MODAL_FOOTER_BTN_CONFIRM } from 'pc/utils/test_id_constant';
import React, { FC } from 'react';
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

export const FooterBtnInModal: FC<IFooterBtnInModalProps> = (props) => {
  const {
    onOk, onCancel, okButtonProps, cancelButtonProps, okText = t(Strings.confirm),
    okType = 'primary', cancelText = t(Strings.cancel), className, hiddenCancelBtn
  } = props;

  return (
    <div className={classNames(styles['modal-footer-btn-wrapper'], className)}>
      {
        !hiddenCancelBtn &&
        <TextButton className="cancelBtn" size="small" onClick={onCancel} {...cancelButtonProps}>{cancelText}</TextButton>
      }
      <Button data-test-id={MODAL_FOOTER_BTN_CONFIRM} color={okType} size="small" onClick={onOk} {...okButtonProps}>{okText}</Button>
    </div>
  );
};

