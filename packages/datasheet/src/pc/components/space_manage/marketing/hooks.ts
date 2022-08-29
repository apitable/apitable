import { Api } from '@vikadata/core';
import { useRequest } from 'pc/hooks';
import { useState } from 'react';
import { isSocialPlatformEnabled } from 'pc/components/home/social_platform';
import { AppType, IStoreApp, IStoreAppInstance } from './interface';

export const useMarketing = (spaceId: string, refresh: boolean) => {
  const [appInstances, setAppInstances] = useState<IStoreApp[]>([]);
  const [apps, setApps] = useState<IStoreApp[]>([]);
  const socialApps = [AppType.DingTalk, AppType.Lark, AppType.Wecom, AppType.LarkStore, AppType.WecomStore, AppType.DingtalkStore];
  // const isSocial = spaceInfo && isSocialPlatformEnabled(spaceInfo);

  const { loading } = useRequest(() => Promise.all([
    Api.getAppstoreApps(),
    Api.getAppInstances(spaceId),
    Api.spaceInfo(spaceId),
  ]).then((res) => {
    const [appsResult, instancesResult, spaceResult] = res;
    const { data: appsData, success: appsSuccess } = appsResult.data;
    const { data: instancesData, success: instanceSuccess } = instancesResult.data;
    const { data: spaceData, success: spaceSuccess } = spaceResult.data;

    let isSocial = false;
    if (spaceSuccess) {
      isSocial = isSocialPlatformEnabled(spaceData);
    }

    let appRecords: IStoreApp[] = [];
    if (appsSuccess) {
      appRecords = appsData.records;
    }
    const finalInstanceRecords: IStoreApp[] = [];
    let type;
    if (instanceSuccess) {
      const instanceRecords: IStoreAppInstance[] = instancesData.records;
      const finalAppRecords: IStoreApp[] = [];
      appRecords.forEach((v) => {
        // 查找实例项
        const instanceItem = instanceRecords.filter((ele) => ele.appId === v.appId)[0];
        if (instanceItem) {
          if (!type && socialApps.includes(instanceItem.type)) {
            type = instanceItem.type; // 记录已经开启的实例
          }
          finalInstanceRecords.push({ ...v, instance: instanceItem });
        } else {
          finalAppRecords.push(v);
        }
      });
      // 企微，飞书，钉钉做互斥操作
      appRecords = finalAppRecords.filter((v) => (
        !type || (type && !socialApps.includes(v.type))
      ));
      // 未开启商店应用的情况下，过滤
      if (!isSocial) {
        appRecords = appRecords.filter((v) => v.type === 'OFFICE_PREVIEW' || !v.type.includes('STORE'));
      }
    }
    setApps(appRecords);
    setAppInstances(finalInstanceRecords);
  }), {
    refreshDeps: [refresh]
  });

  return { loading, appInstances, apps };
};