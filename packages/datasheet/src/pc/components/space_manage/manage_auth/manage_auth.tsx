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

import { useRouter } from 'next/router';
import { getSpaceNavList } from 'pc/components/space_manage/space_menu_tree';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';

export const ManageAuth = ({ children }: any) => {
  const spaceResource = useAppSelector((state) => state.spacePermissionManage.spaceResource);
  const { SPACE_INTEGRATION_PAGE_VISIBLE } = getEnvVariables();
  const router = useRouter();
  const { subPage } = router.query as { subPage: string };
  if (!spaceResource) {
    return null;
  }
  const { mainAdmin, permissions } = spaceResource;
  const spaceNavList = getSpaceNavList(mainAdmin, permissions, !SPACE_INTEGRATION_PAGE_VISIBLE);
  const checkAuth = (spaceNavList: any[], valid?: boolean): any => {
    let route;
    for (const nav of spaceNavList) {
      if (nav.key === subPage && typeof valid === 'boolean' && !valid) {
        route = <>{router.replace('/management')}</>;
      }

      if (nav.children) {
        route = checkAuth(nav.children, nav.valid);
      }

      if (nav.key === subPage && !nav.valid) {
        route = <>{router.replace('/management')}</>;
      }

      if (route) {
        return route;
      }
    }
  };

  const invalidRoute = checkAuth(spaceNavList);

  if (invalidRoute) {
    return invalidRoute;
  }
  return <>{children}</>;
};
