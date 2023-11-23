import { ResponseDataAutomationVO } from '@apitable/api-client';
import { automationApiClient } from 'pc/common/api-client';

export const getRobotDetail = async (automationId: string, shareId?: string): Promise<ResponseDataAutomationVO | undefined> => {

  const res = await automationApiClient.getResourceRobots({
    resourceId: automationId ?? '',
    shareId: shareId ?? ''
  });

  const data = res.data?.[0];
  if (!Boolean(data)) {
    return undefined;
  }

  const automationDetail = await automationApiClient.getNodeRobot({
    resourceId: data?.resourceId ?? '',
    robotId: data?.robotId ?? '',
    shareId: shareId ?? ''
  });

  return automationDetail;
};
