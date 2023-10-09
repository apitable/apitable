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

export interface UpdatedBy {
  uuid: string;
  nickName: string;
  avatar: string;
}

export interface IAutomationRobotDetailItem {
  robotId: string;
  name: string;
  description: string;
  isActive: boolean;
  recentlyRunCount?: number;
  updatedBy: UpdatedBy;
  updatedAt: string;
  props: Props;
  triggers: Trigger[];
  actions: Action[];
  relatedResources: RelatedResource[];
}

export interface Props {
  failureNotifyEnable: boolean;
}

export interface Trigger {
  triggerId: string;
  triggerTypeId: string;
  prevTriggerId: string;
  input: string;
}

export interface Action {
  actionId: string;
  actionTypeId: string;
  nextActionId: string;
  prevActionId: string;
  input: string;
}

export interface RelatedResource {
  nodeId: string;
  nodeName: string;
  icon: string;
}
