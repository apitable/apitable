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

import { lightColors } from '@apitable/components';
import { Api,
  // @ts-ignore
  BillingConfig, StoreActions, Strings, t } from '@apitable/core';
import { store } from 'pc/store';

const GradesColor = {
  Bronze: lightColors.rc07,
  Silver: lightColors.rc02,

  Dingtalk_Basic: lightColors.rc02,
  Dingtalk_Standard: lightColors.rc02,
  Dingtalk_Enterprise: lightColors.rc01,
};
export const getBillingInfo = async (spaceId: string) => {
  const { data: { success, data } } = await Api.subscribeInfo(spaceId); // Request subscription content.
  if (!success) {
    return;
  }
  const { product, deadline } = data;
  const billingProduct = BillingConfig.billing.products;

  const productI18nName = billingProduct[product]?.i18nName;

  return {
    ...data,
    deadline: deadline || -1,
    productName: t(Strings[productI18nName]),
    productColor: GradesColor[product], // Subscription levels correspond to theme colours

  };
};

export const updateSubscription = (spaceId: string) => {
  getBillingInfo(spaceId).then(data => {
    store.dispatch(StoreActions.updateSubscription(data));
  });
};
