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
import { useDispatch } from 'react-redux';
import { StoreActions } from '@apitable/core';
import { PrivateRoute } from 'pc/components/route_manager/private_route';
// @ts-ignore
import { SubScribeSystem } from 'enterprise/subscribe_system/subscribe_system';

const RedirectUpgradeSpaceId = ({ children }: { children: JSX.Element }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { spaceId } = router.query as { spaceId?: string };
  if (spaceId) {
    dispatch(StoreActions.setActiveSpaceId(spaceId));
  }
  return children;
};

const UpgradeRouter = () => {
  return (
    <RedirectUpgradeSpaceId>
      <PrivateRoute>
        <SubScribeSystem />
      </PrivateRoute>
    </RedirectUpgradeSpaceId>
  );
};
export default UpgradeRouter;
