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

import { useCallback, useMemo, useState } from 'react';
import { Message } from '@apitable/components';
import { Api, ApiInterface } from '@apitable/core';

export type IRoleItem = ApiInterface.IGetRoleListResponseItem;

export const useRoleRequest = (): {
  data: {
    isOpen: boolean;
    roles: IRoleItem[];
  };
  run: () => Promise<ApiInterface.IGetRoleListResponse | undefined>;
} => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [roles, setRoles] = useState<IRoleItem[]>([]);

  const getRoleList = useCallback(async () => {
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
