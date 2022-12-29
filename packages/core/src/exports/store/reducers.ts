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
import { guide, billing } from '../../modules/enterprise';
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

import { IReduxState } from './interfaces';

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
