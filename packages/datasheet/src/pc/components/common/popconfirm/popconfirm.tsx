import { Button, IButtonProps, IButtonType, ITextButtonProps, TextButton } from '@vikadata/components';
import { Strings, t } from '@apitable/core';
import { Popover, Space } from 'antd';
import { PopoverProps } from 'antd/lib/popover';
import classnames from 'classnames';
import { FC, ReactNode } from 'react';
import * as React from 'react';
import { StatusIconFunc } from '../icon';
import styles from './style.module.less';

interface IPopconfirmProps extends PopoverProps {
  icon?: ReactNode;
  type?: IButtonType;
  onOk?: (e?: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  cancelButtonProps?: ITextButtonProps;
  okButtonProps?: IButtonProps;
}

export const Popconfirm: FC<IPopconfirmProps> = ({
  icon,
  title,
  children,
  content,
  cancelButtonProps,
  okButtonProps,
  onOk,
  onCancel,
  overlayClassName,
  type,
  okText,
  cancelText,
  ...rest
}) => {

  const finalIcon = icon ? icon : (type ? <StatusIconFunc type={type} /> : null);
  const okHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    onOk && onOk();
  };

  const cancelHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    onCancel && onCancel();
  };
  const finalOkBtnProps = { color: type || undefined, ...okButtonProps };
  return (
    <Popover
      title={null}
      overlayClassName={classnames(styles.container, overlayClassName)}
      content={(
        <>
          {finalIcon && <div className={styles.left}>{finalIcon}</div>}
          <div className={styles.right}>
            {title && <div className={styles.title}>{title}</div>}
            <div className={classnames(styles.content, { [styles.indent]: icon, [styles.accent]: !title })}>
              {content}
            </div>
            <Space className={styles.btnGroup}>
              {onCancel &&
                <TextButton size="small" onClick={cancelHandler} {...cancelButtonProps}>
                  {cancelText || t(Strings.cancel)}
                </TextButton>
              }
              {onOk &&
                <Button size="small" onClick={okHandler} {...finalOkBtnProps}>
                  {okText || t(Strings.confirm)}
                </Button>
              }
            </Space>
          </div>

        </>
      )}
      {...rest}
    >
      {children}
    </Popover>
  );
};
