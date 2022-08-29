import { Api, getCustomConfig, Navigation, Selectors, StatusCode, StoreActions } from '@vikadata/core';
import { useRouter } from 'next/router';
import { NoAccess } from 'pc/components/invalid_page/no_access';
import { Method, navigatePath, useNavigation } from 'pc/components/route_manager/use_navigation';
import { usePageParams, useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { FC, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export const PrivateRoute: FC = ({ children, ...rest }) => {
  const user = useSelector(state => Selectors.userStateSelector(state), shallowEqual);
  const dispatch = useDispatch();
  const spaceId = useSelector(state => state.space.activeId);
  const navigationTo = useNavigation();
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
      navigatePath({ path: Navigation.APPLY_LOGOUT, method: Method.Push });
    }
    if (userInfo.needCreate) {
      navigationTo({ path: Navigation.CREATE_SPACE });
      return;
    }
    if (userInfo.isDelSpace && !router.asPath.includes('/management')) {
      navigationTo({
        path: Navigation.SPACE_MANAGE,
        params: { spaceId: user.info.spaceId },
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.info, user.userInfoErr]);

  if ((user.userInfoErr && user.userInfoErr.code === StatusCode.MOVE_FORM_SPACE)) {
    resourceService.instance!.destroy();
    return <NoAccess />;
  }

  const RedirectComponent = () => {
    const { redirectUrlOnUnAuthorization } = getCustomConfig();
    if (redirectUrlOnUnAuthorization) {
      location.href = redirectUrlOnUnAuthorization + encodeURIComponent(location.href);
      return null;
    }
    const { href } = process.env.SSR ? { href: '' } : location;
    
    if (!process.env.SSR && !router.asPath.includes('login')) {
      navigationTo({
        path: Navigation.LOGIN,
        query: {
          reference: href
        },
        method: Method.Redirect
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
