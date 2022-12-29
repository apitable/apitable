import { ConfigConstant, ISocialAppType, ISocialPlatformType, ISpaceBasicInfo, ISpaceInfo, Strings, t } from '@apitable/core';
import dd from 'dingtalk-jsapi';
import Image from 'next/image';
import { store } from 'pc/store';
import * as React from 'react';
import { SocialPlatformMap } from './config';
// @ts-ignore
import { WecomOpenData, WecomOpenDataType } from 'enterprise';

export interface IFormatSelectOptionData extends ISpaceInfo {
  value: string;
  label: React.ReactNode;
}

export interface IGetUnitNameParams {
  name?: string;
  type?: WecomOpenDataType | any;
  isModified?: boolean;
  spaceInfo: ISpaceInfo | ISpaceBasicInfo | null;
}

// eslint-disable-next-line max-len
export const isWechatFunc = () => !process.env.SSR && navigator.userAgent.toLowerCase()
  .indexOf('micromessenger') !== -1 && navigator.userAgent.toLowerCase().indexOf('wxwork') === -1;
export const isDingtalkFunc = () => !process.env.SSR && navigator.userAgent.indexOf('DingTalk') > -1;
export const isQQFunc = () => !process.env.SSR && navigator.userAgent.toLowerCase().indexOf('qq') > -1 && navigator.userAgent.toLowerCase()
  .indexOf('qqbrowser') === -1;
export const isLarkFunc = () => !process.env.SSR && navigator.userAgent.toLowerCase().indexOf('lark') > -1;
export const isWecomFunc = () => !process.env.SSR && navigator.userAgent.toLowerCase().indexOf('wxwork') > -1;

export const formatSelectOptionData = (arr: ISpaceInfo[]) => {
  const option: IFormatSelectOptionData[] = [];
  arr.forEach((item) => {
    if (item.preDeleted) return;
    option.push({
      ...item,
      value: item.spaceId,
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
          {/* <span>{t(Strings.social_plat_space_list_item_seats_msg, { max: item.maxSeat })}</span> */}
          {
            item.social && item.social.enabled && item.social.platform !== 0 &&
            <Image src={SocialPlatformMap[item.social.platform].logo} width={24} height={24} />
          }
        </div>
      ),
    });
  });
  return option;
};

export const isContactSyncing = (space: ISpaceBasicInfo | null) => {
  if (!space) return false;
  return space.social.contactSyncing;
};

export const getSpaceInfo = (space?: ISpaceInfo | ISpaceBasicInfo | null) => {
  let info = space;
  if (!info) {
    const state = store.getState();
    info = state.space.curSpaceInfo;
  }
  return info;
};

export const isSocial = (social: { platform: number, appType: number }, platformParams: number) => {
  const { platform, appType } = social;
  return platform === platformParams && appType === 2;
};

export const isSocialDingTalk = (space?: ISpaceInfo | ISpaceBasicInfo | null) => {
  const info = getSpaceInfo(space);
  if (!info) return false;
  return isSocial(info.social, ConfigConstant.SocialType.DINGTALK);
};

export const isSocialWecom = (space?: ISpaceInfo | ISpaceBasicInfo | null) => {
  const info = getSpaceInfo(space);
  if (!info) return false;
  return isSocial(info.social, ConfigConstant.SocialType.WECOM);
};

/**
 * Enterprise WeChat third party application - introduction of official address book component display
 * @param name Username/Member Name
 * @param type Display type <user｜department
 * @param isModified whether it has been modified (if it has not been modified, it is displayed using the official component; 
 * if it has been modified, it is displayed directly)
 * @param spaceInfo Space Station information (used to determine if it is an Enterprise Micro third party application)
 */
export const getSocialWecomUnitName = ({
  name,
  type = (WecomOpenDataType?.UserName || 'userName'),
  isModified,
  spaceInfo,
}: IGetUnitNameParams) => {
  return (
    isSocialWecom(spaceInfo) ?
      (isModified ? name : <WecomOpenData type={type} openId={name} />) :
      name
  ) || t(Strings.unnamed);
};

export const isSocialFeiShu = (space?: ISpaceInfo | ISpaceBasicInfo | null) => {
  let info = space;
  if (!info) {
    const state = store.getState();
    info = state.space.curSpaceInfo;
  }
  if (!info) return false;
  const { platform, appType } = info.social;
  return platform === ConfigConstant.SocialType.FEISHU && appType === 2;
};

// Is the space tied to Dingtalk, Fishu, Enterprise Weixin
export const isSocialPlatformEnabled = (space: ISpaceInfo | ISpaceBasicInfo, type?: ISocialPlatformType, appType?: ISocialAppType) => {
  // Bundled with any third party app or self-built app
  if (!type) {
    return Boolean(space.social && space.social.enabled &&
      typeof space.social.platform === 'number' && space.social.platform !== 0);
  }

  if (appType) {
    return Boolean(typeof space.social.platform === 'number' && space.social.platform === type && space.social.appType === appType);
  }
  return Boolean(typeof space.social.platform === 'number' && space.social.platform === type);
};

// The default blocking action box pops up if the space is bound to Pinning, FeiShu or Enterprise WeChat
export const socialPlatPreOperate = (space: ISpaceInfo | ISpaceBasicInfo | null, manageFunc: () => void) => {
  if (space && isSocialPlatformEnabled(space) && !isSocialDingTalk(space) && !isSocialWecom(space)) {
    return SocialPlatformMap[space?.social.platform].org_manage_reject_default_modal();
  }
  manageFunc();
};

export const inSocialApp = (type?: ISocialPlatformType) => {
  if(process.env.SSR){
    return;
  }
  let socials = ['dingtalk', /* 'feishu', 'lark',  */'wxwork'];
  switch (type) {
    case ConfigConstant.SocialType.DINGTALK:
      socials = ['dingtalk'];
      break;
    // case ConfigConstant.SocialType.FEISHU:
    //   socials = ['feishu', 'lark'];
    //   break;
    case ConfigConstant.SocialType.WECOM:
      socials = ['wxwork'];
      break;
    default:
      break;
  }
  // Determine if it is in the specified built-in browser
  return socials.some(item => navigator.userAgent.toLowerCase().includes(item));
};

// Is the current domain name a corporate exclusive domain name
export const isSocialDomain = () => window.location.host.includes('.com.');

/**
 * Determining whether a Dingtalk container is in the
 * You can also determine if you can call the Dingtalk interface
 */
export const isInDingtalkFunc = () => Boolean(dd.env.platform !== 'notInDingTalk');

/**
 * Determine if you are on the Dingtalk sku page
 * If yes, interaction events other than scroll events are disabled
 */
export const isDingtalkSkuPage = (purchaseToken: string) => {
  return isDingtalkFunc() && Boolean(purchaseToken);
};
