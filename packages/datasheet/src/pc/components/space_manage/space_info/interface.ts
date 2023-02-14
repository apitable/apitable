/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ISpaceBasicInfo, ISpaceFeatures } from '@apitable/core';
import { CSSProperties } from 'react';
import { StaticImageData } from 'next/image';

export enum LevelType {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Free = 'free',
  Plus = 'plus',
  Pro = 'pro',
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
  | 'feishu_base' | 'feishu_enterprise' | 'feishu_standard' | 'atlas' | 'dingtalk_profession' | 'feishu_profession' | 'wecom_profession' | 'free'
  | 'plus' | 'pro';

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
  cardBg: StaticImageData,
  cardSkin: StaticImageData,
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
  subscription: any;
  isMobile?: boolean;
}

export interface IHooksParams {
  spaceInfo?: ISpaceBasicInfo;
  subscription?: any;
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
