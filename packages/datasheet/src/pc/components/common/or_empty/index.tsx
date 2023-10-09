import { FC, PropsWithChildren } from 'react';

export const OrEmpty: FC<PropsWithChildren<{
    visible: boolean
}>> = ({ visible, children }) => {
  return (
    <>
      {

        visible ? children: null
      }
    </>
  );
};
