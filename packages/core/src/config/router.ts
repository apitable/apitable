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

export enum Navigation {
  HOME,
  LOGIN,
  APPLY_LOGOUT,
  REGISTER,
  RESET_PWD,
  CREATE_SPACE,
  WORKBENCH,
  SPACE,
  SPACE_MANAGE,
  NOT_FOUND,
  INVITE,
  SET_PASSWORD,
  SHARE_FAIL,
  SETTING_NICKNAME,
  SHARE_SPACE,
  NO_SUPPORT,
  TEMPLATE,
  TRASH,
  IMPROVING_INFO,
  INVITATION_VALIDATION,
  MEMBER_DETAIL,
  FEISHU,
  DINGTALK,
  WECOM,
  WECOM_SHOP_CALLBACK,
  EMBED_SPACE,
  EMBED_AI_SPACE
}

export enum SpacePathType {
  SAPCE_OVERVIEW = 'overview',
  MANAGE_WORKBENCH = 'workbench',
  MANAGE_MEMBER = 'managemember',
  MAIN_ADMIN = 'mainadmin',
  SUB_ADMIN = 'subadmin',
  MEMBER = 'member',
  MARKETING = 'marketing'
}
