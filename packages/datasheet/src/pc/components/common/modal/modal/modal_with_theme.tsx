import { ThemeProvider } from '@vikadata/components';
import { Selectors } from '@vikadata/core';
import { Modal as AntdModal } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

export const ModalWithTheme = (props) => {
  const cacheTheme = useSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <AntdModal {...props} />
    </ThemeProvider>
  );
};
