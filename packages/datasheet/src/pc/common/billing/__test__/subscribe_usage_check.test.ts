import { ISubscription, StoreActions } from '@vikadata/core';
import { store } from 'pc/store';
import { subscribeUsageCheck } from '../subscribe_usage_check';

const defaultSubscribe: ISubscription = {
  addonPlans: [],
  maxRowsPerSheet: 1000,
  maxRowsInSpace: 11,
  maxSheetNums: 2,
  maxCapacitySizeInBytes: 1000000000,
  maxSeats: 10,
  maxGalleryViewsInSpace: 2,
  maxKanbanViewsInSpace: 100,
  maxFormViewsInSpace: 100,
  maxMirrorNums: 10,
  deadline: '2019-01-01T00:00:00.000+00:00',
  maxAdminNums: 10,
  maxRemainTrashDays: 10,
  plan: 'bronze_no_billing_period',
  product: 'Bronze',
  version: 'V1',
  maxGanttViewsInSpace: 100,
  maxCalendarViewsInSpace: 100,
  maxApiCall: 120000, // 原键值对："maxApiUsages": 10,
  fieldPermissionNums: 1,
  maxRemainTimeMachineDays: 90,
  rainbowLabel: false,
  integrationDingtalk: false,
  integrationFeishu: false,
  integrationWeCom: false,
  watermark: false,
  integrationOfficePreview: false,
  nodePermissionNums: 100,
  productName: '-',
  billingPeriod: '-',
  productColor: '-',
  subscriptionType: '-',
  maxRemainRecordActivityDays: 14,
  blackSpace: true,
  securitySettingInviteMember: true,
  securitySettingApplyJoinSpace: true,
  securitySettingShare: true,
  securitySettingExport: true,
  securitySettingCatalogManagement: true,
  securitySettingDownloadFile: true,
  securitySettingCopyCellData: true,
  securitySettingMobile: true,
  securitySettingAddressListIsolation: true,
  subscriptionCapacity: 0,
  unExpireGiftCapacity: 0,
  maxAuditQueryDays: 0,
};

describe('test subscribeUsageChecker', () => {
  beforeEach(() => {
    // 注入默认的订阅等级对应的权益
    store.dispatch(StoreActions.updateSubscription(defaultSubscribe));

    // 注入用户的全局配置
    store.dispatch(StoreActions.updateUserInfo({ sendSubscriptionNotify: true } as any));
  });

  it('maxRowsInSpace usage over limit', () => {
    const result = subscribeUsageCheck.triggerVikabyAlert('maxRowsInSpace', { usage: 200 });
    expect(result).not.toBe(undefined);
  });

  it('maxGanttViewsInSpace count  under limit', () => {
    const result = subscribeUsageCheck.triggerVikabyAlert('maxGanttViewsInSpace', { usage: 1 });
    expect(result).toBe(undefined);
  });

  it('maxGanttViewsInSpace count over limit', () => {
    const result = subscribeUsageCheck.triggerVikabyAlert('maxGanttViewsInSpace', { usage: 3000 });
    expect(result).not.toBe(undefined);
  });

  it('maxRowsPerSheet count over limit', () => {
    const result = subscribeUsageCheck.triggerVikabyAlert('maxRowsPerSheet', { usage: 3000 });
    expect(result).not.toBe(undefined);
  });

  it('sendSubscriptionNotify set false', () => {
    const result = subscribeUsageCheck.triggerVikabyAlert('maxRowsPerSheet', { usage: 3000 });
    expect(result).toBe(undefined);
  });

  it('allow click rainbowLabel', () => {
    const result = subscribeUsageCheck.triggerVikabyAlert('rainbowLabel');
    expect(result).not.toBe(undefined);
  });

  it('not allow click rainbowLabel', () => {
    store.dispatch(StoreActions.updateSubscription({ ...defaultSubscribe, rainbowLabel: true }));
    const result = subscribeUsageCheck.triggerVikabyAlert('rainbowLabel');
    expect(result).toBe(undefined);
  });
});
