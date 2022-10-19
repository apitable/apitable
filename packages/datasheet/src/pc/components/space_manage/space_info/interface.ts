import { ISpaceBasicInfo, ISpaceFeatures, ISubscription } from '@vikadata/core';
import { CSSProperties } from 'styled-components';

export enum LevelType {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Enterprise = 'enterprise',
  DingtalkBase = 'dingtalk_base',
  DingtalkStandard = 'dingtalk_standard',
  DingtalkEnterprise = 'dingtalk_enterprise',
  PrivateCloud = 'private_cloud',
  Atlas = 'atlas',
  WecomeBase = 'wecom_base',
  FeishuBase = 'feishu_base'
}

export const needHideUnLimitedSpaceLevel = {
  [LevelType.Bronze]: true,
  [LevelType.DingtalkBase]: true,
  [LevelType.WecomeBase]: true,
  [LevelType.FeishuBase]: true,
};

export type ISpaceLevelType = 'bronze' | 'silver' | 'gold' | 'enterprise' | 'dingtalk_base' | 'dingtalk_enterprise' | 'dingtalk_standard'
  | 'wecom_base' | 'wecom_standard' | 'wecom_enterprise' | 'private_cloud'
  | 'feishu_base' | 'feishu_enterprise' | 'feishu_standard' | 'atlas' | 'dingtalk_profession' | 'feishu_profession' | 'wecom_profession';

export interface ISpaceLevelTagInfo {
  label: React.ReactNode,
  logo: React.ReactNode,
}

export enum Position {
  L = 'L',
  R = 'R'
}

export interface ILevelCard {
  titleTip?: string,
  titleColor: string,
  buttonText: string,
  onClick: () => void,
  cardBg: React.ReactNode,
  cardSkin: React.ReactNode,
  skinStyle: CSSProperties,
  cardTagPosition: Position,
  buttonStyle?: CSSProperties,
  tagText: string,
  tagStyle: CSSProperties,
  expiration: number;
  secondTextColor?: string;
  expirationColor?: string;
  upgradeBtnColor?: string;
}

export interface ISpaceLevelInfoValue {
  title: string,
  strokeColor: string,
  trailColor: string,
  hightLightColor: string,
  spaceLevelTag: ISpaceLevelTagInfo,
  levelCard: ILevelCard,
}

export type ISpaceLevelInfo = {
  [key in ISpaceLevelType]: ISpaceLevelInfoValue
};

export interface ILayoutProps {
  showContextMenu: (e: React.MouseEvent<HTMLElement>) => void,
  handleDelSpace: () => void,
  onUpgrade: () => void,
  level: ISpaceLevelType,
  spaceId: string,
  spaceInfo: ISpaceBasicInfo,
  spaceFeatures: ISpaceFeatures,
  subscription: ISubscription;
  isMobile?: boolean;
}

export interface IHooksParams {
  spaceInfo?: ISpaceBasicInfo;
  subscription?: ISubscription;
}

export interface IHooksResult {
  used: number,
  usedText: string,
  total: number,
  totalText: string,
  remain: number,
  usedPercent: number,
  remainPercent: number,
  remainText: string,
}

export interface IMultiLineItemProps {
  unit: string;
  total?: number;
  used?: number;
  name: string;
  icon: React.ReactNode;
  percent?: number;
  showProgress?: boolean;
  customIntro?: React.ReactNode;
}
