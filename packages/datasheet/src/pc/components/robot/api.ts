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

import axios from 'axios';
import { mutate } from 'swr';
import { IAutomationDatum, IRobotBaseInfo, IRobotRunHistoryList, IRobotTrigger } from './interface';
import { IAutomationRobotDetailItem } from './robot_context';

export const nestReq = axios.create({
  baseURL: '/nest/v1/',
});

export const getRobotRunHistoryList = async(url: string): Promise<IRobotRunHistoryList> => {
  const res = await nestReq.get(url);
  if (res.data.success) {
    return res.data.data;
  }
  return [];
};

export const deleteRobotAction = async(actionId: string) => {
  const res = await nestReq.delete(`/automation/actions/${actionId}`);
  return res.data.success;
};

export const updateRobotName = async(robotId: string, name: string) => {
  const res = await nestReq.patch(`/automation/robots/${robotId}`, {
    name,
  });
  return res.data.success;
};

export const updateRobotDescription = async(robotId: string, description: string) => {
  const res = await nestReq.patch(`/automation/robots/${robotId}`, {
    description,
  });
  return res.data.success;
};

export const updateRobotItem = async(resourceId: string, robotId: string, robot: Partial<IAutomationDatum>) => {
  const res = await axios.patch(`/automation/${resourceId}/modify/${robotId}`, robot);
  return res.data.success;
};

export const getResourceAutomations = (resourceId: string): Promise<IAutomationDatum[]> => {
  return axios.get(`/automation/robots?resourceId=${resourceId}`).then(res => {
    if (res.data.success) {
      return res.data.data;
    }
    return [];
  });
};

export const createAutomationRobot = (robot: {
  resourceId: string;
  name: string;
}): Promise<IAutomationDatum> => {
  return nestReq.post('/automation/robots', robot).then(res => {
    if (res.data.success) {
      return res.data.data;
    }
    return [];
  });
};
export const getResourceAutomationDetail = (resourceId: string, robotId: string): Promise<IAutomationRobotDetailItem> => {
  return axios.get(`/automation/${resourceId}/robots/${robotId}`).then(res => {
    if (res.data.success) {
      return res.data.data;
    }
    return [];
  });
};

export const activeRobot = (robotId: string): Promise<boolean> => {
  const url = `/automation/robots/${robotId}/active`;
  return nestReq.post(url).then((res) => {
    if (res.data.success) {
      if (res.data.data.ok) {
        return true;
      }
      return false;
    }
    return false;
  });
};

export const deActiveRobot = (robotId: string): Promise<any> => {
  const url = `/automation/robots/${robotId}/deactive`;
  return nestReq.post(url).then((res) => {
    if (res.data.success) {
      return true;
    }
    return false;
  });
};
export const deleteRobot = (robotId: string) => {
  return nestReq.delete(`/automation/robots/${robotId}`).then((res) => {
    if (res.data.success) {
      return true;
    }
    return false;
  });
};

export const refreshRobotList = (resourceId: string) => {
  const thisResourceRobotUrl = `/automation/robots?resourceId=${resourceId}`;
  return mutate(thisResourceRobotUrl);
};

export const createTrigger = (robotId: string, triggerTypeId: string, input?: any) => {
  return nestReq.post('/automation/triggers', {
    robotId: robotId,
    triggerTypeId,
    input,
  });
};

export const changeTriggerTypeId = (triggerId: string, triggerTypeId: string) => {
  return nestReq.patch(`/automation/triggers/${triggerId}`, {
    triggerTypeId,
  });
};

export const updateTriggerInput = (triggerId: string, input: any) => {
  return nestReq.patch(`/automation/triggers/${triggerId}`, {
    input,
  });
};

export const createAction = (data: { robotId: string; actionTypeId: string; prevActionId?: string; input?: any }) => {
  return nestReq.post('/automation/actions', data);
};

export const changeActionTypeId = (actionId: string, actionTypeId: string) => {
  return nestReq.patch(`/automation/actions/${actionId}`, {
    actionTypeId,
  });
};

export const updateActionInput = (actionId: string, input: any) => {
  return nestReq.patch(`/automation/actions/${actionId}`, {
    input,
  });
};

export const getRobotTrigger = (url: string): Promise<IRobotTrigger | undefined> => {
  return nestReq.get(url).then((res) => {
    return res?.data.data;
  });
};

export const getRobotBaseInfo = (robotId: string): Promise<IRobotBaseInfo | undefined> => {
  return nestReq.get(`/automation/robots/${robotId}/base-info`).then((res) => {
    return res?.data.data[0];
  });
};
