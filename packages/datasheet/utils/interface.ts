import { IUserInfoError } from './get_initial_props';

export interface IClientInfo {
  locale: string,
  wizards: string
  metaContent: string
  userInfo: string,
  userInfoError: IUserInfoError | undefined,
  env: string
  version: string
  envVars: string
  headers: Record<string, string | string[] | undefined>
}
