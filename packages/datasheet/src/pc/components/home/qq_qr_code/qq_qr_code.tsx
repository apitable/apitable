import { FC } from 'react';
import { useMount } from 'ahooks';

export const QqQrCode: FC = props => {

  useMount(() => {
    (window as any).QC.Login({
      btnId:'qq_login_btn',
      size:'B_M',
    });
  });

  return <></>;
};
