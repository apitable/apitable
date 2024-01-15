/**
 * APITable Ltd. <legal@apitable.com>
 * Copyright (C)  2022 APITable Ltd. <https://apitable.com>
 *
 * This code file is part of APITable Enterprise Edition.
 *
 * It is subject to the APITable Commercial License and conditional on having a fully paid-up license from APITable.
 *
 * Access to this code file or other code files in this `enterprise` directory and its subdirectories does not constitute permission to use this code or APITable Enterprise Edition features.
 *
 * Unless otherwise noted, all files Copyright © 2022 APITable Ltd.
 *
 * For purchase of APITable Enterprise Edition license, please contact <sales@apitable.com>.
 */

import * as actions from '../../../shared/store/action_constants';

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

/**
 * map to Config.Billing data structure
 */
export interface ISubscription extends ISubscribeResponseData {
  maxCalendarViewsInSpace: number; //upper limit of calendar views
  maxFormViewsInSpace: number; // upper limit of form views
  maxGalleryViewsInSpace: number; // upper limit of gallery views
  maxGanttViewsInSpace: number; // upper limit of gantt views
  maxKanbanViewsInSpace: number; // upper limit of kanban views
  maxRemainTimeMachineDays: number; // the maximum number of rolling back times of time machine
  maxMirrorNums: number;
  fieldPermissionNums: number; // the upper limit of column permission
  nodePermissionNums: number; //the upper limit of node permission
  maxRemainRecordActivityDays: number; // the max records activities of current subscription level
  blackSpace: boolean; // whether current space is in blacklist
  securitySettingInviteMember: boolean;
  securitySettingApplyJoinSpace: boolean;
  securitySettingShare: boolean;
  securitySettingExport: boolean;
  securitySettingCatalogManagement: boolean;
  securitySettingDownloadFile: boolean;
  securitySettingCopyCellData: boolean;
  securitySettingMobile: boolean;
  securitySettingAddressListIsolation: boolean; // whether or not the address list display teams of the member only.

  /**
   * for frontend addon field
   */
  productName: string;
  billingPeriod: string; // billing period
  productColor: string; // subscription level theme color
  subscriptionType: string; // subscription type
  maxAuditQueryDays: number;

  recurringInterval: 'monthly' | 'yearly';
  onTrial: boolean;

  // ai
  maxMessageCredits: number;
  // form
  controlFormBrandLogo?: boolean;
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

/**
 * the response data that subscription interface return
 */
export interface ISubscribeResponseData {
  /**
   * addon(value-added) plan
   */
  addonPlans: string[];

  /**
   * the max records number per datasheet
   */
  maxRowsPerSheet: number;

  /**
   * the max record rows number that space permitted
   */
  maxRowsInSpace: number;

  /**
   * the max nodes number of the space
   */
  maxSheetNums: number;

  /**
   * the max capacity(disk size, includes the gift, unit "byte") of the space
   */
  maxCapacitySizeInBytes: number;

  /**
   * the capacity of subscription plan(does not include the gift)
   */
  subscriptionCapacity: number;

  /**
   * the gift capacity of subscription plan that has not expired
   */
  unExpireGiftCapacity: number;

  /**
   * max seats of this space
   */
  maxSeats: number;

  /**
   * the max gallery views number of the space
   */
  maxGalleryViewsInSpace: number;

  /**
   * the max kanban views number of the space
   */
  maxKanbanViewsInSpace: number;

  /**
   * the max number of forms in the space
   */
  maxFormViewsInSpace: number;

  /**
   * billing expired datetime
   */
  deadline: string;

  /**
   * billing expired datetime
   */
  expireAt: number;

  /**
   * the max number of admins in the space
   */
  maxAdminNums: number;

  /**
   * the longest time of recycle bin retention
   */
  maxRemainTrashDays: number;

  /**
   * plan name
   */
  plan: string;

  /**
   * product name
   */
  product: string;

  /**
   * product version
   */
  version: string;

  /**
   * the max number of gantt views in the space
   */
  maxGanttViewsInSpace: number;

  /**
   * the max number of calendar views in the space
   */
  maxCalendarViewsInSpace: number;

  /**
   *
   * the max number of fusion api call
   * previously key-value pair: "maxApiUsages": 10;
   */
  maxApiCall: number;

  /**
   * the max number of column(field) permission
   */
  fieldPermissionNums: number;

  /**
   * the max time range of time machine
   */
  maxRemainTimeMachineDays: number;

  /**
   * whether or not support the rainbow label
   */
  rainbowLabel: boolean;

  /**
   * whether or not support the dingtalk integration
   */
  integrationDingtalk: boolean;

  /**
   * whether or not support the lark(feishu) integration
   */
  integrationFeishu: boolean;

  /**
   * whether or not support the wecom integration
   */
  integrationWeCom: boolean;

  /**
   * whether or not support the watermark
   */
  watermark: boolean;

  /**
   * whether or not support the office suite integration
   */
  integrationOfficePreview: boolean;

  /**
   * the time that current billing level show support
   */
  maxRemainRecordActivityDays: number;
}
