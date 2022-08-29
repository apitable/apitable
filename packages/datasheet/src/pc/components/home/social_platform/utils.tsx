import { ConfigConstant, ISocialAppType, ISocialPlatformType, ISpaceBasicInfo, ISpaceInfo, Strings, t } from '@vikadata/core';
import dd from 'dingtalk-jsapi';
import Image from 'next/image';
import { WecomOpenData, WecomOpenDataType } from 'pc/components/address_list';
import { store } from 'pc/store';
import * as React from 'react';
import { SocialPlatformMap } from './config';

export interface IFormatSelectOptionData extends ISpaceInfo {
  value: string;
  label: React.ReactNode;
}

export interface IGetUnitNameParams {
  name?: string;
  type?: WecomOpenDataType;
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
 * 企业微信第三方应用 —— 引入官方通讯录组件展示
 * @param name 用户名/成员名
 * @param type 展示类型 <用户｜部门>
 * @param isModified 是否修改过（若没修改过，则使用官方组件展示；若修改过，则直接展示）
 * @param spaceInfo 空间站信息（用于判断是否是企微第三方应用）
 */
export const getSocialWecomUnitName = ({
  name,
  type = WecomOpenDataType.UserName,
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

// 空间是否绑定了钉钉、飞书、企业微信
export const isSocialPlatformEnabled = (space: ISpaceInfo | ISpaceBasicInfo, type?: ISocialPlatformType, appType?: ISocialAppType) => {
  // 绑定了任意一个第三方应用或自建应用
  if (!type) {
    return Boolean(space.social && space.social.enabled &&
      typeof space.social.platform === 'number' && space.social.platform !== 0);
  }

  if (appType) {
    return Boolean(typeof space.social.platform === 'number' && space.social.platform === type && space.social.appType === appType);
  }
  return Boolean(typeof space.social.platform === 'number' && space.social.platform === type);
};

// 空间绑定了钉钉、飞书、企业微信，则弹出默认的阻止操作框
export const socialPlatPreOperate = (space: ISpaceInfo | ISpaceBasicInfo | null, manageFunc: () => void) => {
  if (space && isSocialPlatformEnabled(space) && !isSocialDingTalk(space) && !isSocialWecom(space)) {
    return SocialPlatformMap[space?.social.platform].org_manage_reject_default_modal();
  }
  manageFunc();
};

// 是否是在飞书、钉钉内部浏览器打开
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
  // 判断是否是在指定的内置浏览器中
  return socials.some(item => navigator.userAgent.toLowerCase().includes(item));
};

// 当前域名是否为企业专属域名
export const isSocialDomain = () => window.location.host.includes('.com.');

/**
 * 判断是否在钉钉容器内，
 * 同时可判断是否可以调用钉钉的接口
 */
export const isInDingtalkFunc = () => Boolean(dd.env.platform !== 'notInDingTalk');

/**
 * 判断是否在钉钉 sku 页面
 * 如果是，则禁止除滚动事件外的交互事件
 */
export const isDingtalkSkuPage = (purchaseToken: string) => {
  return isDingtalkFunc() && Boolean(purchaseToken);
};
