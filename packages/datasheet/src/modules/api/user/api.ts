import path from 'path';
import { javaApi } from 'api/java_api';
import { BIND_APP_SUMO, GET_APP_SUMO_EMAIL } from 'api/user/const';

export const convertState2mail = (state: string) => {
  return javaApi.get<any, { email: string }>(path.join(GET_APP_SUMO_EMAIL, `/${state}`));
};

export const bindAppSumo = (state: string, password: string) => {
  return javaApi.post(BIND_APP_SUMO, {
    state,
    password,
  });
};
