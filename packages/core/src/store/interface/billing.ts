import * as actions from '../action_constants';

export interface IBilling {
  catalog: { [key: string]: IBillingCatalog };
  pruducts: { [key: string]: IBillingProduct };
  plans: { [key: string]: IBillingPlan };
  features: { [key: string]: IBillingFeature };
  subscription: ISubscription | null;
}

export interface IUpdateSubscriptionAction {
  type: typeof actions.UPDATE_SUBSCRIPTION;
  payload: ISubscription;
}

// CONFIG表billing数据结构对应的

export interface ISubscription extends ISubscribeResponseData {
  maxCalendarViewsInSpace: number; //日历视图上限
  maxFormViewsInSpace: number; // 神奇表单上限
  maxGalleryViewsInSpace: number; //相册视图上限
  maxGanttViewsInSpace: number; // 甘特图视图上限
  maxKanbanViewsInSpace: number; // 看板视图上限
  maxRemainTimeMachineDays: number; // 时光机最大回退天数
  fieldPermissionNums: number; // 列权限上限
  nodePermissionNums: number; //文件权限上限
  maxRemainRecordActivityDays: number; //当前订阅等级能展示的动态的时间
  blackSpace: boolean; // 标记当前空间站是否被加入黑名单
  securitySettingInviteMember: boolean;
  securitySettingApplyJoinSpace: boolean;
  securitySettingShare: boolean;
  securitySettingExport: boolean;
  securitySettingCatalogManagement: boolean;
  securitySettingDownloadFile: boolean;
  securitySettingCopyCellData: boolean;
  securitySettingMobile: boolean;
  securitySettingAddressListIsolation: boolean; // 是否支持通讯录仅显示成员所在小组

  // 前端补充字段
  productName: string;
  billingPeriod: string; // 订阅周期
  productColor: string; // 订阅等级对应主题色
  subscriptionType: string; // 订阅类型
  maxAuditQueryDays: number;
}

export interface IBillingCatalog {
  catalogName: string;
  products: string[];
  plans: string[];
  effectiveDate: string;
}

export interface IBillingProduct {
  name: string[];
  plans: string[];
  category: string[];
  included?: string[];
  available?: string[];
  img?: string[];
}

export interface IBillingPlan {
  name: string;
  billingPeriod: string[];
  billingPrice: number;
  seats: number;
  capacity: number;
  plansAllowedInBundle: number;
  planName: string;
}

export interface IBillingFeature {
  description: string[];
  type: string;
  specification: string;
  function: string[];
  category: string[];
}

// 订阅接口返回的数据
export interface ISubscribeResponseData {
  /**
   * @description 增值计划
   */
  addonPlans: string[];

  /**
   * @description 每张表允许的最大记录数
   */
  maxRowsPerSheet: number;

  /**
   * @description 当前空间站允许的最大记录数
   */
  maxRowsInSpace: number;

  /**
   * @description 空间站支持的最大节点数
   */
  maxSheetNums: number;

  /**
   * @description 空间站的总容量（包括赠送容量，单位为 byte）
   */
  maxCapacitySizeInBytes: number;

  /**
   * @description 套餐容量（不含赠送）
   */
  subscriptionCapacity: number;

  /**
   * @description 赠送的未过期容量(单位：byte)
   */
  unExpireGiftCapacity: number;

  /**
   * @description 空间站支持的最大席位数
   */
  maxSeats: number;

  /**
   * @description 空间站内允许的相册视图的最大数量
   */
  maxGalleryViewsInSpace: number;

  /**
   * @description 空间站内允许的看板视图的最大数量
   */
  maxKanbanViewsInSpace: number;

  /**
   * @description 空间站内允许的表单的最大数量
   */
  maxFormViewsInSpace: number;

  /**
   * @description 订阅的过期时间
   */
  deadline: string;

  /**
   * @description 空间站内支持的管理员的人数
   */
  maxAdminNums: number;

  /**
   * @description 回收站保存的最长时间
   */
  maxRemainTrashDays: number;

  /**
   * @description 计划名称
   */
  plan: string;

  /**
   * @description 产品名称
   */
  product: string;

  /**
   * @description 产品的版本
   */
  version: string;

  /**
   * @description 空间站内允许的甘特视图的最大数量
   */
  maxGanttViewsInSpace: number;

  /**
   * @description 空间站内允许的日历视图的最大数量
   */
  maxCalendarViewsInSpace: number;

  /**
   * @description fusion api 的最大调用量
   * 原键值对："maxApiUsages": 10;
   */
  maxApiCall: number;

  /**
   * @description 允许设置的列权限的数量
   */
  fieldPermissionNums: number;

  /**
   * @description 时光机支持的最大时间范围
   */
  maxRemainTimeMachineDays: number;

  /**
   * @description 是否支持使用彩虹标签
   */
  rainbowLabel: boolean;

  /**
   * @description 是否支持钉钉集成
   */
  integrationDingtalk: boolean;

  /**
   * @description 是否支持飞书集成
   */
  integrationFeishu: boolean;

  /**
   * @description 是否支持企业微信集成
   */
  integrationWeCom: boolean;

  /**
   * @description 是否支持水印
   */
  watermark: boolean;

  /**
   * @description 是否支持 永中office 集成
   */
  integrationOfficePreview: boolean;

  /**
   * @description 当前订阅等级能展示的动态的时间
   */
  maxRemainRecordActivityDays: number;
}
