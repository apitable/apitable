import { ConfigConstant } from 'config';
import { TestFunction } from 'config/system_config.interface';

// 创建通知
export interface ICreateNotification {
  templateId: string; // 模版ID
  spaceId?: string; // 空间id
  nodeId?: string; // 节点ID
  fromUserId?: string; // 发送通知用户ID,系统通知用户为0
  toUserId?: string[]; // 被通知用户ID
  toMemberId?: string[];
  body?: {
    extras: {
      viewId?: string; // 视图ID
      recordIds?: string; // 涉及到的表格的记录行ID
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
  // 默认为 MindType.Member
  type?: MindType;
  extra?: {
    content?: string;
    createdAt?: string;
  };
}

export interface ILoadOrSearchArg {
  filterIds?: string;
  keyword?: string;
  names?: string;
  unitIds?: string,
  // linkId 用来标注站外的操作，目前支持 templateId 和 shareId，
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

export interface ISocialWecomGetConfigResponse {
  data: {
    agentId: number;
    agentSecret: string;
    agentStatu: 0 | 1;
    corpId: string;
    domainName: string;
  };
}

export interface IWecomAgentBindSpaceResponse {
  data: {
    bindSpaceId: string;
  };
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
  // 允许成员复制数据至站外,示例值(true)
  allowCopyDataToExternal?: boolean;
  // 允许只读成员下载附件,示例值(true)
  allowDownloadAttachment?: boolean;
  // 允许分享文件,示例值(true)
  fileSharable?: boolean;
  // 全员可邀请状态
  invitable?: boolean;
  // 允许他人申请加入空间状态,示例值(true)
  joinable?: boolean;
  // 显示成员手机号
  mobileShowable?: boolean;
  // 节点全员可导出状态,示例值(true)「已废弃」
  nodeExportable?: boolean;
  // 节点导出根据权限细粒度划分（0 - 禁止导出，1 - 只读以上可导出，2 - 可编辑以上可导出，3 - 可管理以上可导出）
  exportLevel?: number;
  // 全局水印开启状态
  watermarkEnable?: boolean;
}

export interface IAdData {
  linkText: string;
  linkTextEn: string;
  linkUrl: string;
  banners: { url: string; name: string }[];
  desc: string;
  descEn: string;
}

export interface ISyncMemberRequest {
  linkId: string;
  members: { teamId: string; memberId: string; memberName: string }[];
  teamIds: string[];
}

export interface INodeInfoWindowResponse {
  nodeId: string;
  nodeName: string;
  nodeType: ConfigConstant.NodeType;
  icon?: string;
  creator: {
    memberName?: string;
    avatar?: string;
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
  categories: {
    categoryName: string;
    templateVos: {
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
