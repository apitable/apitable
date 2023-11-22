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

import { Api, ITagsInSpace, ISubTeamListInSpaceBase, IMemberInfoInSpace, ISpaceInfo, ISpaceBasicInfo } from '@apitable/core';
// @ts-ignore
import { socialPlatPreOperate } from 'enterprise/home/social_platform/utils';

export const verifyTeamName = async (_spaceId: string, teamId: string, inputContent: string) => {
  let questRes = false;
  const {
    data: { success, data },
  } = await Api.getSubTeams(teamId);
  if (success && data.length) {
    if (data.find((item: { teamName: string }) => item.teamName === inputContent)) {
      questRes = true;
    }
  }
  return questRes;
};

// Conversion group name
export const getContent = (arr: ITagsInSpace[] | ISubTeamListInSpaceBase[], name: string) => {
  let content = '';
  if (arr) {
    arr.forEach((item: ITagsInSpace | ISubTeamListInSpaceBase, index) => {
      if (index === arr.length - 1) {
        content = content.concat(item[name]);
      } else {
        content = content.concat(item[name], ';');
      }
    });
  }
  return content;
};
export const isPrimaryOrOwnFunc = (info: IMemberInfoInSpace, userMemberId: string) => {
  return info.isPrimary || info.memberId === userMemberId;
};

export const socialPlatPreOperateCheck = (fn: () => void, spaceInfo: ISpaceInfo | ISpaceBasicInfo | null) => {
  if (!socialPlatPreOperate) {
    fn();
    return;
  }
  socialPlatPreOperate(spaceInfo, fn);
};
