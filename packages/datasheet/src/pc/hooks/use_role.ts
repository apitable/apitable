import { Message } from '@vikadata/components';
import { Api, ApiInterface } from '@apitable/core';
import { useCallback, useMemo, useState } from 'react';

export type IRoleItem = ApiInterface.IGetRoleListResponseItem;

export const useRoleRequest = (): {
  data: {
    isOpen: boolean;
    roles: IRoleItem[]
  };
  run: () => Promise<ApiInterface.IGetRoleListResponse | undefined>;
} => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [roles, setRoles] = useState<IRoleItem[]>([]);

  const getRoleList = useCallback(async() => {
    const res = await Api.getRoleList();
    const { data } = res;
    if (!data.success) {
      Message.error({ content: data.message });
      return;
    }
    setIsOpen(Boolean(data.data?.length));
    setRoles(data.data);
    return data.data;
  }, []);

  const data = useMemo(
    () => ({
      isOpen,
      roles,
    }),
    [isOpen, roles],
  );

  return {
    data,
    run: getRoleList,
  };
};
