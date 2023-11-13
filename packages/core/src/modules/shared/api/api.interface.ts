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

import { ConfigConstant } from 'config';
import { TestFunction } from 'config/system_config.interface';
import { IPageDataBase } from '../../database/store/interfaces/common';
import { MemberType } from 'types';

// the interface of Create Notification
export interface ICreateNotification {
  templateId: string; // Template ID
  spaceId?: string; // Space id
  nodeId?: string; // Node ID
  fromUserId?: string; // the user ID who send the notification. System Notification user id is 0.
  toUserId?: string[]; // the user that get notification.
  toMemberId?: string[];
  body?: {
    extras: {
      viewId?: string; // Datasheet View ID
      recordIds?: string; // the Records Rows ID
      nodeName?: string // when templateId = "datasheet_record_limit"
      specification?: number | string
      usage?: number | string
    };
  };
}

export enum MindType {
  Member = 1,
  Comment = 2,
}

export interface ICommitRemind {
  isNotify: boolean;
  nodeId?: string;
  viewId?: string;
  linkId?: string;
  unitRecs: {
    recordIds?: string[];
    unitIds: string[];
    recordTitle?: string;
    fieldName?: string;
  }[];
  // Default: MindType.Member
  type?: MindType;
  extra?: {
    recordTitle: string;
    content?: string;
    createdAt?: string;
  };
}

export interface ILoadOrSearchArg {
  filterIds?: string;
  keyword?: string;
  names?: string;
  unitIds?: string;
  searchEmail?: boolean;
  // `linkId` use to mark the operations that off-site. Now support templateId and shareId.
  linkId?: string | undefined;
  all?: boolean;
}

export interface ISignIn {
  username: string;
  credential: string;
  type: string;
  data?: string;
  areaCode?: string;
  token?: string;
  mode?: ConfigConstant.LoginMode;
  spaceId?: string;
}

export interface ILabsFeatureListResponse {
  data: {
    features: {
      space: ILabsFeature[];
      user: ILabsFeature[];
    };
  };
}

export interface ILabsFeature {
  key: keyof TestFunction;
  open: boolean;
  type: string;
  url: string;
}

export interface IUpdateSecuritySetting {
  // whether allow space member copy datasheet's data to outside,  example value(true)
  allowCopyDataToExternal?: boolean;
  // whether allow read-only member download attachment, example value(true)
  allowDownloadAttachment?: boolean;
  // whether allow share file, example value(true)
  fileSharable?: boolean;
  // whether allow all member invite other member, example value(true)
  invitable?: boolean;
  // whether allow other member apply to join space, example value(true)
  joinable?: boolean;
  // whether show member's phone number, example value(true)
  mobileShowable?: boolean;
  // what level of member can export datasheet, (0 - disable, 1 - readonly+ can export, 2 - editable+ can export, 3 - manageable+ can export)
  exportLevel?: number;
  // whether the feature watermark is enabled.
  watermarkEnable?: boolean;
}

export interface IAdData {
  linkText: string;
  linkTextEn: string;
  linkUrl: {
    text: string;
    title: string;
  };
  banners: { url: string; name: string }[];
  desc: string;
  descEn: string;
}

export interface INodeInfoWindowResponse {
  nodeId: string;
  nodeName: string;
  nodeType: ConfigConstant.NodeType;
  icon?: string;
  creator: {
    memberName?: string;
    avatar?: string;
    avatarColor?: number | null;
    nickName?: string;
    time?: string;
    isDeleted: boolean;
    isMemberNameModified?: boolean;
  };
}

export interface IQueryOrderPriceResponse {
  month: number;
  priceDiscount: number;
  priceOrigin: number;
  pricePaid: number;
  product: string;
  seat: number;
  upgradedCalculatedExpireAt: string;
}

export interface ICreateOrderResponse {
  orderNo: string;
}

export interface IPayOrderResponse {
  alipayPcDirectCharge: string;
  orderNo: string;
  wxQrCodeLink: string;
  payTransactionNo: string;
}

export interface IQueryOrderStatusResponse {
  status: string;
}

export interface IQueryOrderDiscountResponse {
  currency: string;
  orderType: string;
  priceDiscount: number;
  priceOrigin: number;
  pricePaid: number;
  priceUnusedCalculated: number;
  spaceId: string;
}

export interface INoPermissionMemberResponseData {
  isMemberNameModified: boolean;
  memberId: string;
  memberName: string;
  unitId: string;
}

export interface INoPermissionMemberResponse {
  data: INoPermissionMemberResponseData[];
}

export interface IGetSpaceAuditReq {
  spaceId: string;
  actions?: string[];
  beginTime?: string;
  endTime?: string;
  keyword?: string;
  memberIds?: string[];
  pageNo?: number;
  pageSize?: number;
}

export interface ITemplateRecommendResponse {
  top: {
    templateId: string;
    image: string;
    title: string;
    desc: string;
    color: string;
  }[];
  templateGroups: {
    name: string;
    templates: {
      templateId: string;
      templateName: string;
      nodeId: string;
      nodeType: number;
      cover: string;
      description: string;
      userId: string;
      uuid: string;
      avatar: string;
      nickName: string;
      isNickNameModified: null | boolean;
      tags: string[];
    }[];
  }[];
  albumGroups: {
    name: string;
    albums: {
      albumId: string;
      name: string;
      cover: string;
      description: string;
    }[];
  }[];
}

export interface IGetUploadCertificateResponse {
  token: string;
  uploadRequestMethod: string;
  uploadUrl: string;
}

export interface ISubscribeActiveEventResponse {
  endDate: string;
  startDate: string;
}

export type IGetRoleListResponse = IGetRoleListResponseItem[];

export interface IGetRoleListResponseItem {
  unitId: string;
  roleId: string;
  roleName: string;
  memberCount: number;
  position: number;
}

export interface IGetRoleMemberListResponseItem {
  unitId: string;
  unitName: string;
  unitRefId: string;
  unitType: MemberType;
  memberCount?: number;
  teams?: string;
  nickName?: string;
  avatar?: string;
  avatarColor?: number | null;
  isAdmin?: boolean;
  isMainAdmin?: boolean;
}

export type IGetRoleMemberListResponse = IPageDataBase & {
  records: IGetRoleMemberListResponseItem[];
};

export interface IRecentlyBrowsedFolder {
  nodeName: string;
  icon: string;
  nodeId: string;
  superiorPath: string;
}
