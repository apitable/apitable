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

import { InfoCircleFilled, WarnCircleFilled, QuestionCircleOutlined, CheckCircleFilled, WarnFilled } from '@apitable/icons';
import { Box } from 'components/box';
import { Button } from 'components/button';
import { TextButton } from 'components/text_button';
import React from 'react';
import { createRoot } from 'react-dom/client';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { ThemeProvider } from 'theme_provider';
import { destroyFns } from '..';
import { IModalFuncProps, IModalRef } from '../interface';
import { ModalBase, noop } from './modal_base';

export const confirm = (props: IModalFuncProps): IModalRef => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  const close = () => {
    root.unmount();

    if (div?.parentNode) {
      div.parentNode.removeChild(div);
    }

    for (let index = 0; index < destroyFns.length; index++) {
      const fn = destroyFns[index];
      if (fn === close) {
        destroyFns.splice(index, 1);
        break;
      }
    }
  };

  destroyFns.push(close);

  const render = (props: IModalFuncProps) => {
    const {
      content,
      title,
      onOk = noop,
      onCancel = noop,
      closable = false,
      okText,
      cancelText,
      icon,
      type,
      footer,
      ...rest
    } = props;
    const handleOk = () => {
      onOk();
      close();
    };

    const handleCancel = () => {
      onCancel();
      close();
    };

    const CustomFooter = (!footer && typeof footer === 'object') ? null : (
      <Box
        display='flex'
        justifyContent='flex-end'
        alignItems='center'
        padding={24}
      >
        {type === 'confirm' && (
          <>
            <TextButton
              {...props.cancelButtonProps}
              onClick={handleCancel}
              style={{
                height: 40,
                padding: '9px 16px',
              }}
            >
              {props.cancelText || 'Cancel'}
            </TextButton>
            <div style={{ marginRight: 8 }} />
          </>
        )}
        <Button
          color={type}
          {...props.okButtonProps}
          onClick={handleOk}
        >
          {props.okText || 'Confirm'}
        </Button>
      </Box>
    );

    root.render(
      <ThemeProvider>
        <ModalBase
          visible
          title={(
            <Box
              display='flex'
              alignItems='center'
            >
              {icon}
              <div style={{ marginLeft: icon ? 8 : 0 }}>{title}</div>
            </Box>
          )}
          onOk={handleOk}
          onCancel={handleCancel}
          getContainer={div}
          okText={okText}
          cancelText={cancelText}
          footer={CustomFooter}
          // closeIcon={null}
          closable={closable}
          zIndex={1100}
          centered
          {...rest}
        >
          {content}
        </ModalBase>
      </ThemeProvider>,
    );
  };

  const update = (updateProps: IModalFuncProps): IModalRef => {
    const newProps = {
      ...props,
      ...updateProps,
    };
    render(newProps);
    return {
      close,
      update,
    };
  };

  render(props);

  return {
    close,
    update,
  };
};

export const withConfirm = (props: IModalFuncProps): IModalFuncProps => {
  return {
    icon: <InfoCircleFilled />,
    type: 'confirm',
    ...props,
  };
};

export const withWarning = (props: IModalFuncProps): IModalFuncProps => {
  return {
    icon: <WarnFilled />,
    type: 'warning',
    ...props,
  };
};

const IconDanger = styled(QuestionCircleOutlined).attrs(applyDefaultTheme)`
  ${(props) => {
    const {
      red,
    } = props.theme.color;
    return css`
      fill: ${red[500]};
    `;
  }}
`;

export const withDanger = (props: IModalFuncProps): IModalFuncProps => {
  return {
    icon: <IconDanger />,
    type: 'danger',
    ...props,
  };
};

export const withError = (props: IModalFuncProps): IModalFuncProps => {
  return {
    icon: <WarnCircleFilled />,
    type: 'error',
    ...props,
  };
};

export const withSuccess = (props: IModalFuncProps): IModalFuncProps => {
  return {
    icon: <CheckCircleFilled />,
    type: 'success',
    ...props,
  };
};

export const withInfo = (props: IModalFuncProps): IModalFuncProps => {
  return {
    icon: <QuestionCircleOutlined />,
    type: 'info',
    ...props,
  };
};
