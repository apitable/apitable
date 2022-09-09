import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { FC } from 'react';
import * as React from 'react';
import { Modal } from '../modal/modal';
import classNames from 'classnames';
import { t, Strings } from '@vikadata/core';
import styles from './style.module.less';
// import { NativeButtonProps } from 'antd/lib/button/button';
import { Tooltip } from 'pc/components/common';
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

export const NormalModal: FC<INormalModalProps> = props => {
  const { title, className, subTitle, cancelText = t(Strings.cancel),
    okText = t(Strings.submit), ...rest } = props;
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
      {
        subTitle &&
        <Tooltip
          title={subTitle}
          placement="bottomLeft"
          textEllipsis
        >
          <div className={styles.subTitle}>{subTitle}</div>
        </Tooltip>
      }
      <div
        className='normal-modal-content'
        style={{
          marginTop: subTitle ? '20px' : '28px'
        }}
      >
        {props.children}
      </div>
    </Modal>
  );
};
