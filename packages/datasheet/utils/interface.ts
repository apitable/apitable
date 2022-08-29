import { IUserInfoError } from './getInitialProps';

export interface IClientInfo {
  locale: string,
  wizards: string
  metaContent: string
  userInfo: string,
  userInfoError: IUserInfoError | undefined,
  env: string
  version: string
  envVars: string
}