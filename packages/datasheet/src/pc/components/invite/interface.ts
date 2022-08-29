export interface IInviteInfoBase {
  inviter: string;
  inviteEmail: string;
  inviteToSpace: string;
  spaceId: string;
}
export interface IPhoneData {
  phoneNumber: string;
  phoneCode: string;
}
export enum PageType {
  SELECT_BIND = 'SELECT_BIND',
  PHONE_CODE = 'PHONE_CODE',
  SET_PASSWORD = 'SET_PASSWORD',
  EMPTY = 'EMPTY',
}
