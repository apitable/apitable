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
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CloseOutlined } from '@apitable/icons';
import { StatusIconFunc } from 'pc/components/common/icon';
import { FooterBtnInModal } from 'pc/components/common/modal/components/footer_btn';
import { store } from 'pc/store';
import { stopPropagation } from 'pc/utils/dom';
import { IModalFuncBaseProps } from './modal.interface';
import { ModalWithTheme } from './modal_with_theme';
import { destroyFns } from './utils';
import styles from './style.module.less';

export const FuncModalBase = (config: IModalFuncBaseProps) => {
  const {
    footer,
    content,
    icon,
    className,
    title,
    type,
    hiddenCancelBtn,
    hiddenIcon,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    okText,
    okType,
    cancelText,
    ...rest
  } = config;
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
    for (let index = 0; index < destroyFns.length; index++) {
      const fn = destroyFns[index];
      if (fn === destroy) {
        destroyFns.splice(index, 1);
        break;
      }
    }
  }

  destroyFns.push(destroy);

  // function close() {
  //   setTimeout(() => {
  //     destroy();
  //   }, 0);
  // }
  const finalIcon = icon || (type ? <div className={styles.statusIcon}>{StatusIconFunc({ type })}</div> : null);

  const finalOnOk = () => {
    onOk && onOk();
    destroy();
  };
  const finalOnCancel = () => {
    onCancel && onCancel();
    destroy();
  };
  const FooterBtnConfig = {
    onOk: finalOnOk,
    onCancel: finalOnCancel,
    okButtonProps: { color: type || 'primary', ...okButtonProps },
    hiddenCancelBtn,
    cancelButtonProps,
    okText,
    okType,
    cancelText,
  };

  function render() {
    setTimeout(() => {
      root.render(
        <Provider store={store}>
          <div onMouseDown={stopPropagation}>
            <ModalWithTheme
              visible
              onCancel={finalOnCancel}
              footer={footer === undefined ? <FooterBtnInModal {...FooterBtnConfig} /> : footer}
              width={416}
              closable={false}
              centered
              closeIcon={<CloseOutlined />}
              className={classNames(styles.funcModal, className)}
              onOk={finalOnOk}
              {...rest}
            >
              <div className={classNames(styles.body, { [styles.noTitle]: !title })}>
                <div className={styles.titleContent}>
                  {!hiddenIcon && finalIcon && <div className={styles.iconWrapper}>{finalIcon}</div>}
                  {title && <h6 className={styles.title}>{title}</h6>}
                </div>
                <div className={styles.text}>{content && <div className={styles.content}>{content}</div>}</div>
              </div>
            </ModalWithTheme>
          </div>
        </Provider>,
      );
    });
  }

  render();
  return {
    destroy: destroy,
  };
};
