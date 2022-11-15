import * as React from 'react';
import { ConfigConstant, hiddenMobile, t, Strings } from '@apitable/core';
import { PhonenumberFilled, EmailSigninFilled } from '@apitable/icons';
import { store } from 'pc/store';

export enum VerifyTypes {
  CHANGE_PASSWORD = 0,
  REFRESH_TOKEN = 1,
  CHANGE_MAIN_ADMIN = 2,
  DEL_SPACE = 3,
}
interface IConfigBase {
  codeMode: ConfigConstant.LoginMode;
  verifyAccount: string;
  smsType: ConfigConstant.SmsTypes | undefined;
  emailType: ConfigConstant.EmailCodeType | undefined;
  areaCode: string;
}
export interface IChangePasswordConfig extends IConfigBase {
  accountText: string;
  label: string;
  prefixIcon: React.ReactNode;
}

export interface IRefreshConfigConfig extends IConfigBase {
  title: string;
}
export interface IChangeMainAdminConfig extends IConfigBase {
  inputText: string;
}
export type IDelSpaceConfig = IRefreshConfigConfig;

type IGetVerifyDataFuncRes = IChangePasswordConfig | IRefreshConfigConfig | IChangeMainAdminConfig | IDelSpaceConfig | null;

export const getVerifyData: ({ key }: { key: VerifyTypes }) => IGetVerifyDataFuncRes = ({ key }) => {
  const state = store.getState();
  const user = state.user.info;
  const mainAdminInfo = state.spacePermissionManage.mainAdminInfo;
  const sourceInfo = key === VerifyTypes.CHANGE_MAIN_ADMIN ? mainAdminInfo : user;
  const hasMobile = sourceInfo?.mobile;
  const codeMode = hasMobile ? ConfigConstant.LoginMode.PHONE : ConfigConstant.LoginMode.MAIL;
  // The actual account used to verify: cell phone number or email
  const verifyAccount = hasMobile ? sourceInfo?.mobile : sourceInfo?.email;
  const emailType = hasMobile ? undefined : ConfigConstant.EmailCodeType.COMMON;
  const areaCode = hasMobile ? sourceInfo?.areaCode : undefined;

  switch (key) {
    case VerifyTypes.CHANGE_PASSWORD: {
      let accountText = '';
      // The account number shown in the input box: cell phone number or email with *
      let label = t(Strings.phone_number);
      let prefixIcon = <PhonenumberFilled size={16} />;
      let smsType: ConfigConstant.SmsTypes | undefined = ConfigConstant.SmsTypes.MODIFY_PASSWORD;
      if (user?.mobile) {
        accountText = `${user?.areaCode} ${hiddenMobile(user!.mobile)}`;
      } else if (user?.email) {
        label = t(Strings.email);
        accountText = user.email;
        smsType = undefined;
        prefixIcon = <EmailSigninFilled size={16} />;
      }
      return {
        codeMode,
        accountText,
        label,
        smsType,
        emailType,
        areaCode,
        verifyAccount,
        prefixIcon,
      } as IChangePasswordConfig;
    }
    case VerifyTypes.REFRESH_TOKEN: {
      // The account number shown in the input box: cell phone number or email with *
      let title = '';
      let smsType: ConfigConstant.SmsTypes | undefined = ConfigConstant.SmsTypes.CHANGE_DEVELOPER_CONFIG;
      if (user?.mobile) {
        title = t(Strings.send_verification_code_to, {
          mobile: `${user?.areaCode} ${hiddenMobile(user!.mobile)}`,
        });
      } else if (user?.email) {
        title = t(Strings.send_verification_code_to, {
          mobile: `${user?.areaCode} ${user.email}`,
        });
        smsType = undefined;
      }
      return {
        codeMode,
        title,
        smsType,
        emailType,
        areaCode,
        verifyAccount,
      } as IRefreshConfigConfig;
    }
    case VerifyTypes.CHANGE_MAIN_ADMIN: {
      // The account number shown in the input box: cell phone number or email with *
      let inputText = '';
      let smsType: ConfigConstant.SmsTypes | undefined = ConfigConstant.SmsTypes.CHANGE_MAIN_ADMIN;

      if (mainAdminInfo?.mobile) {
        inputText = `${mainAdminInfo!.areaCode}-${hiddenMobile(mainAdminInfo!.mobile)}`;
      } else if (mainAdminInfo?.email) {
        inputText = mainAdminInfo.email;
        smsType = undefined;
      }
      return {
        codeMode,
        inputText,
        verifyAccount,
        smsType,
        emailType,
        areaCode,
      } as IChangeMainAdminConfig;
    }
    case VerifyTypes.DEL_SPACE: {
      // The account number shown in the input box: cell phone number or email with *
      let title = '';
      let smsType: ConfigConstant.SmsTypes | undefined = ConfigConstant.SmsTypes.DEL_SPACE;
      if (user?.mobile) {
        title = t(Strings.send_verification_code_to, {
          mobile: `${user?.areaCode} ${hiddenMobile(user!.mobile)}`,
        });
      } else if (user?.email) {
        title = t(Strings.send_verification_code_to, {
          mobile: `${user?.areaCode} ${user.email}`,
        });
        smsType = undefined;
      }
      return {
        codeMode,
        title,
        smsType,
        emailType,
        areaCode,
        verifyAccount,
      } as IDelSpaceConfig;
    }
    default:
      return null;
  }
};

/**
 * uskbjQCFxC20n89xjK2H5uC => uskb***************H5uC
 * @param token
 */
export const getMaskToken = (token: string) => {
  if (!token || token.length <= 8) {
    return token;
  }
  const head = token.slice(0, 4);
  const end = token.slice(token.length - 4, token.length);
  const hidden = new Array(token.length - 8).fill('*').join('');
  return head + hidden + end;
};
