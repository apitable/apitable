import { lightColors } from '@vikadata/components';
import { Api, SystemConfig, getComputeRefManager, IReduxState, Selectors, Strings, t } from '@apitable/core';

const GradesColor = {
  Bronze: lightColors.rc07,
  Silver: lightColors.rc02,

  Dingtalk_Basic: lightColors.rc02,
  Dingtalk_Standard: lightColors.rc02,
  Dingtalk_Enterprise: lightColors.rc01,

  Feishu_Basic: lightColors.rc02,
  Feishu_Standard: lightColors.rc02,
  Feishu_Enterprise: lightColors.rc01,
};
export const getBillingInfo = async(spaceId: string) => {
  const { data: { success, data }} = await Api.subscribeInfo(spaceId); // Request subscription content.
  if (!success) {
    return;
  }
  const { product, deadline } = data;
  const billingProduct = SystemConfig.billing;
  const productI18nName = billingProduct[product].i18nName;
  const subscriptionInfo = {
    ...data,
    deadline: deadline || -1,
    productName: t(Strings[productI18nName]),
    productColor: GradesColor[product], // Subscription levels correspond to theme colours

  };
  return subscriptionInfo;
};

/**
 * Get an array of dependent datasheetId's
 * @param state
 * @param datasheetId
 */
export const getDependenceDstIds = (state: IReduxState, datasheetId: string) => {
  const computeRefManager = getComputeRefManager(state);
  const fieldMap = Selectors.getFieldMap(state, datasheetId);
  if (!fieldMap) {
    return [];
  }
  return computeRefManager.getDependenceDstIds(datasheetId!, fieldMap);
};

/**
 * Check which tables a table depends on datasheetId set
 * @param state
 * @param datasheetId
 */
export const getDependenceByDstIds = (state: IReduxState, datasheetId: string) => {
  const computeRefManager = getComputeRefManager(state);
  const fieldMap = Selectors.getFieldMap(state, datasheetId);
  if (!fieldMap) {
    return [];
  }
  return computeRefManager.getDependenceByDstIds(datasheetId!, fieldMap);
};
