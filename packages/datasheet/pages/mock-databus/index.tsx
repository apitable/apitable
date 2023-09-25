import { useEffect } from 'react';
import { WasmApi } from '@apitable/core';

const Error = () => {
  useEffect(() => {
    WasmApi.getDatasheetPack('dstknLjTKangk7ZtpY').then((data: any) => {
      console.log(data);
    });
  }, []);

  return <div />;
};

export default Error;
