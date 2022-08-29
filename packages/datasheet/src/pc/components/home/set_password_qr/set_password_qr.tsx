import { Navigation, StoreActions, IReduxState } from '@vikadata/core';
import { SetPassword } from 'pc/components/home/set_password';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { FC, useEffect } from 'react';
import * as React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
export const SetPasswordQr: FC = () => {
  const navigationTo = useNavigation();
  const { user } =
    useSelector((state: IReduxState) => ({
      user: state.user.info,
    }), shallowEqual);
  const dispatch = useDispatch();
  const handleSubmit = (
    password: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPwdErr: React.Dispatch<React.SetStateAction<string>>,
  ) => {

    dispatch(StoreActions.updatePwd(password));
    setLoading(false);
  };
  useEffect(() => {
    if (!user) return;
    if (!user.needPwd && user.needCreate) {
      navigationTo({ path: Navigation.CREATE_SPACE });
    }
  }, [user, navigationTo]);

  return (
    <SetPassword apiCb={handleSubmit} />
  );
};
