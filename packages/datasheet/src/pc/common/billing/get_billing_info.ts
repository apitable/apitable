import { lightColors } from '@vikadata/components';
import { Api, BillingProducts, getComputeRefManager, IReduxState, Selectors, Strings, t } from '@apitable/core';

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
  const { data: { success, data }} = await Api.subscribeInfo(spaceId); // 请求订阅内容。
  if (!success) {
    return;
  }
  const { product, deadline } = data;
  const productI18nName = BillingProducts[product].i18nName;
  const subscriptionInfo = {
    ...data,
    deadline: deadline || -1,
    productName: t(Strings[productI18nName]),
    productColor: GradesColor[product], // 订阅等级对应主题色

  };
  return subscriptionInfo;
};

/**
 * 获取依赖的 datasheetId 数组
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
 * 检查某张表依赖的哪些表 datasheetId 集合
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
