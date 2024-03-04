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

import { Api } from '@apitable/core';
import { Message } from 'pc/components/common';

export const useCapacityRequest = () => {
  const getCapacityRewardListReq = (isExpire: boolean, pageNo: number) => {
    return Api.getCapacityRewardList(isExpire, pageNo).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };
  const getCapacityNodeListReq = (spaceId: string, pageNo: number) => {
    return Api.getCapacityNodeList(spaceId, pageNo).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };
  return { getCapacityRewardListReq, getCapacityNodeListReq };
};
