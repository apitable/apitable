import { combineReducers } from 'redux';
import { datasheetMap, widgetMap, formMap, theme } from './resource';
import { dashboardMap } from './resource/dashboard';
import { pageParams } from './page_params';
import { catalogTree } from './catalog_tree';
import { user } from './user';
import { space } from './space';
import { share } from './share';
import { addressList } from './address_list';
import { spaceMemberManage } from './space_member_manage';
import { invite } from './invite';
import { spacePermissionManage } from './space_permission_manage';
import { notification } from './notification';
import { hooks } from './hooks';
import { billing } from './billing';
import { toolbar } from './toolbar';
import { rightPane } from './right_pane';
import { templateCentre } from './template_centre';
import { unitInfo } from './unit_info';
import { mirrorMap } from './resource/mirror';
import { labs } from './labs';
import { subscriptions } from './subscriptions';
import { recordVision } from './record_vision_mode';
import { previewFile } from './preview_file';

import { IReduxState } from '../interface';

export const onlyResourceReducers = combineReducers<Partial<IReduxState>>({
  isStateRoot: () => true,
  datasheetMap,
  widgetMap,
  dashboardMap,
  formMap,
  pageParams,
  space,
  unitInfo,
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
  hooks,
  toolbar,
  rightPane,
  billing,
  templateCentre,
  unitInfo,
  labs,
  subscriptions,
  previewFile,
});
