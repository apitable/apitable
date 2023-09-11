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

import dynamic from 'next/dynamic';
import { Skeleton } from '@apitable/components';
import { PrivateRoute } from 'pc/components/route_manager/private_route';
import { SideWrapper } from 'pc/components/route_manager/side_wrapper';

const SpaceManage = dynamic(() => import('pc/components/space_manage/space_manage'), {
  ssr: false,
  loading: () => (
    <div>
      <Skeleton count={1} width="38%" />
      <Skeleton count={2} />
      <Skeleton count={1} width="61%" />
    </div>
  ),
});

const ManagementRouter = ({ children }: any) => {
  return (
    <PrivateRoute>
      <SideWrapper>
        <SpaceManage>{children}</SpaceManage>
      </SideWrapper>
    </PrivateRoute>
  );
};

export default ManagementRouter;
