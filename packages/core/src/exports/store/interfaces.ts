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

import { ICatalogTree } from '../../modules/space/store/interfaces/catalog_tree';
import { IUser } from '../../modules/user/store/interfaces/user';
import { IAddressList } from '../../modules/org/store/interface/address_list';
import { ISpaceMemberManage } from '../../modules/org/store/interface/space_member_manage';
import { ISpace } from '../../modules/space/store/interfaces/space';
import { IInvite } from '../../modules/org/store/interface/invite';
import { ISpacePermissionManage } from '../../modules/org/store/interface/space_permission_manage';
import { INotification } from '../../modules/user/store/interfaces/notification';
// @ts-ignore
import { IHooks, IBilling } from '../../modules/enterprise';
import { IToolBar } from '../../modules/org/store/interface/tool_bar';
import {
  IDashboardMap, IDatasheetMap, IPageParams, IWidgetMap, IFormMap, IMirrorMap, ThemeName
} from '../../modules/database/store/interfaces/resource';
import { ITemplateCentre } from '../../modules/space/store/interfaces/template_centre';
import { IShareInfo } from '../../modules/space/store/interfaces/share';
import { IUnitInfo } from '../../modules/org/store/interface/unit_info';
import { ILabs } from '../../modules/space/store/interfaces/labs';
import { ISubscriptions } from '../../modules/database/store/interfaces/subscriptions';
import { RecordVision } from '../../modules/database/store/interfaces/record_vision_mode';
import { IRightPane } from '../../modules/database/store/interfaces/right_pane';
import { IPreviewFile } from '../../modules/database/store/interfaces/preview_file';
import { IEmbedInfo } from '../../modules/embed/store/interfaces/embed';

export * from '../../modules/space/store/interfaces/catalog_tree';
export * from '../../modules/user/store/interfaces/user';
export * from '../../modules/org/store/interface/address_list';
export * from '../../modules/org/store/interface/space_member_manage';
export * from '../../modules/space/store/interfaces/space';
export * from '../../modules/org/store/interface/invite';
export * from '../../modules/org/store/interface/space_permission_manage';
export * from '../../modules/user/store/interfaces/notification';
export * from '../../modules/space/store/interfaces/template_centre';
export * from '../../modules/enterprise';
export * from '../../modules/org/store/interface/tool_bar';
export * from '../../modules/database/store/interfaces/kanban';
export * from '../../modules/database/store/interfaces/common';
export * from '../../modules/database/store/interfaces/resource';
export * from '../../modules/database/store/interfaces/apphook';
export * from '../../modules/space/store/interfaces/share';
export * from '../../modules/org/store/interface/unit_info';
export * from '../../modules/database/store/interfaces/params';
export * from '../../modules/space/store/interfaces/labs';
export * from '../../modules/database/store/interfaces/subscriptions';
export * from '../../modules/database/store/interfaces/record_vision_mode';
export * from '../../modules/database/store/interfaces/preview_file';
export * from '../../modules/embed/store/interfaces/embed';
export * from '../../modules/billing/store/interfaces';

export interface IReduxState {

  // a mark that indicates `state` is root
  isStateRoot: true;

  theme: ThemeName;

  pageParams: IPageParams;
  datasheetMap: IDatasheetMap;
  mirrorMap: IMirrorMap;

  widgetMap: IWidgetMap;
  formMap: IFormMap;
  dashboardMap: IDashboardMap;
  catalogTree: ICatalogTree;
  user: IUser;
  addressList: IAddressList;
  spaceMemberManage: ISpaceMemberManage;
  space: ISpace;
  share: IShareInfo;
  invite: IInvite;
  spacePermissionManage: ISpacePermissionManage;
  notification: INotification;
  hooks: IHooks;
  toolbar: IToolBar;
  rightPane: IRightPane;
  billing: IBilling;
  templateCentre: ITemplateCentre;
  unitInfo: IUnitInfo;
  labs: ILabs;
  subscriptions: ISubscriptions;

  recordVision: RecordVision;
  previewFile: IPreviewFile;
  embedInfo: IEmbedInfo;
}
