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

import { Api, Navigation, Selectors, StatusCode, StoreActions } from '@apitable/core';
import { useRouter } from 'next/router';
import { NoAccess } from 'pc/components/invalid_page/no_access';
import { Router } from 'pc/components/route_manager/router';
import { usePageParams, useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { getEnvVariables } from 'pc/utils/env';
import { FC, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export const PrivateRoute: FC = ({ children, ...rest }) => {
  const user = useSelector(state => Selectors.userStateSelector(state), shallowEqual);
  const dispatch = useDispatch();
  const spaceId = useSelector(state => state.space.activeId);
  const { run: getLabsFeature } = useRequest(Api.getLabsFeature, { manual: true });
  const router = useRouter();
  usePageParams();

  useEffect(() => {
    spaceId && getLabsFeature(spaceId).then(res => {
      dispatch(StoreActions.setLabs(res?.data?.data?.keys ?? []));
    });
  }, [dispatch, getLabsFeature, spaceId]);

  useEffect(() => {
    if (!user.info) {
      return;
    }
    const userInfo = user.info;
    if (userInfo.isPaused) {
      Router.push(Navigation.APPLY_LOGOUT);
    }
    if (userInfo.needCreate) {
      Router.push(Navigation.CREATE_SPACE);
      return;
    }
    if (userInfo.isDelSpace && !router.asPath.includes('/management')) {
      Router.push(Navigation.SPACE_MANAGE, {
        params: { spaceId: user.info.spaceId },
      });
      return;
    }
    // eslint-disable-next-line
  }, [user.info, user.userInfoErr]);

  if ((user.userInfoErr && user.userInfoErr.code === StatusCode.MOVE_FORM_SPACE)) {
    resourceService.instance!.destroy();
    return <NoAccess />;
  }

  const RedirectComponent = () => {
    const { LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL } = getEnvVariables();
    if (LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL) {
      location.href = LOGIN_ON_AUTHORIZATION_REDIRECT_TO_URL + encodeURIComponent(location.href);
      return null;
    }
    const { href } = process.env.SSR ? { href: '' } : location;

    if (!process.env.SSR && !router.asPath.includes('login')) {
      Router.redirect( Navigation.LOGIN,{
        query: {
          reference: href
        },
      });
    }

    return null;
  };

  if (user && user.isLogin) {
    return user.info && spaceId ? <>{children}</> : null;
  }
  return (
    <>
      {RedirectComponent()}
    </>
  );
};
