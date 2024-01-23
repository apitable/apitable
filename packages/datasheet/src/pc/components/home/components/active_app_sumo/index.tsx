import path from 'path';
import { useEffect } from 'react';
import useSWR from 'swr';
import { Navigation, Strings, t } from '@apitable/core';
import { bindAppSumo, convertState2mail } from 'api/user/api';
import { GET_APP_SUMO_EMAIL } from 'api/user/const';
import { Message } from 'pc/components/common/message/message';
import { SignUpBase } from 'pc/components/home/components/sign_up/sign_up_base';
import { Router } from 'pc/components/route_manager/router';
import { useRequest } from 'pc/hooks/use_request';
import { getSearchParams } from 'pc/utils/dom';

export const ActiveAppSumo = () => {
  const { run: signUpReq, loading } = useRequest(bindAppSumo, { manual: true });
  const state = getSearchParams().get('state');
  const { data, error } = useSWR(path.join(GET_APP_SUMO_EMAIL, `/${state}`), () => convertState2mail(state), { revalidateOnFocus: false });

  useEffect(() => {
    if (!error) return;
    Message.error({ content: 'The current email has been activated, please log in.' });
    setTimeout(() => {
      Router.push(Navigation.WORKBENCH);
    }, 2000);
  }, [error]);

  const signUp = async (username: string, password: string) => {
    try {
      await signUpReq(state, password!);
      Message.success({ content: 'Activation successful' });
      setTimeout(() => {
        Router.redirect(Navigation.SPACE_MANAGE, { params: { pathInSpace: 'billing' } });
      }, 2000);
    } catch (e) {
      Message.error({ content: e.message });
    }
  };

  return <SignUpBase signUp={signUp} email={data?.email} loading={loading} buttonStr={t(Strings.bind_app_sumo_btn_str)} />;
};
