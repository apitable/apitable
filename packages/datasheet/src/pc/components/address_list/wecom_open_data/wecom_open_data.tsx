import { FC } from 'react';

export enum WecomOpenDataType {
  UserName = 'userName',
  DepartmentName = 'departmentName'
}

interface IWecomOpenDataProps {
  type?: WecomOpenDataType;
  openId: string | undefined;
}

export const WecomOpenData: FC<IWecomOpenDataProps> = (props) => {
  const { 
    type = WecomOpenDataType.UserName,
    openId = '',
  } = props;

  return (
    <ww-open-data
      type={type} 
      openid={openId}
    />
  );
};