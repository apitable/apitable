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

import { combineReducers } from 'redux';
import { datasheetMap, widgetMap, formMap, theme } from '../../modules/database/store/reducers/resource';
import { dashboardMap } from '../../modules/database/store/reducers/resource/dashboard';
import { pageParams } from '../../modules/database/store/reducers/page_params';
import { catalogTree } from '../../modules/space/store/reducers/catalog_tree';
import { user } from '../../modules/user/store/reducers/user';
import { space } from '../../modules/space/store/reducers/space';
import { share } from '../../modules/space/store/reducers/share';
import { addressList } from '../../modules/org/store/reducers/address_list';
import { spaceMemberManage } from '../../modules/org/store/reducers/space_member_manage';
import { invite } from '../../modules/org/store/reducers/invite';
import { spacePermissionManage } from '../../modules/org/store/reducers/space_permission_manage';
import { notification } from '../../modules/user/store/reducers/notification';
// @ts-ignore
import { guide } from '../../modules/enterprise';
import { toolbar } from '../../modules/database/store/reducers/toolbar';
import { rightPane } from '../../modules/database/store/reducers/right_pane';
import { templateCentre } from '../../modules/space/store/reducers/template_centre';
import { unitInfo } from '../../modules/org/store/reducers/unit_info';
import { mirrorMap } from '../../modules/database/store/reducers/resource/mirror';
import { labs } from '../../modules/space/store/reducers/labs';
import { subscriptions } from '../../modules/database/store/reducers/subscriptions';
import { recordVision } from '../../modules/database/store/reducers/record_vision_mode';
import { previewFile } from '../../modules/database/store/reducers/preview_file';
import { embedInfo } from '../../modules/embed/store/reducers/embed';
import { collaborators } from '../../modules/database/store/reducers/resource/datasheet/collaborators';
import { billing } from '../../modules/billing/store/reducers';

import { IReduxState } from './interfaces';

export {
  mirrorMap,
  pageParams,
  unitInfo,
  collaborators,
};

export const onlyResourceReducers = combineReducers<Partial<IReduxState>>({
  isStateRoot: () => true,
  datasheetMap,
  widgetMap,
  dashboardMap,
  formMap,
  pageParams,
  space,
  unitInfo,
  embedInfo
});

export const rootReducers = combineReducers<IReduxState>({
  isStateRoot: () => true,
  recordVision,
  theme,
  datasheetMap,
  mirrorMap,
  widgetMap,
  dashboardMap,
  formMap,
  pageParams,
  catalogTree,
  user,
  addressList,
  spaceMemberManage,
  space,
  share,
  invite,
  spacePermissionManage,
  notification,
  // @ts-ignore
  hooks: guide,
  toolbar,
  rightPane,
  billing,
  templateCentre,
  unitInfo,
  labs,
  subscriptions,
  previewFile,
  embedInfo
});
