import { ICatalogTree } from './catalog_tree';
import { IUser } from './user';
import { IAddressList } from './address_list';
import { ISpaceMemberManage } from './space_member_manage';
import { ISpace } from './space';
import { IInvite } from './invite';
import { ISpacePermissionManage } from './space_permission_manage';
import { INotification } from './notification';
import { IHooks } from './hooks';
import { IToolBar } from './tool_bar';
import { IBilling } from './billing';
import { IDashboardMap, IDatasheetMap, IPageParams, IWidgetMap, IFormMap, IMirrorMap, ThemeName } from './resource';
import { ITemplateCentre } from './template_centre';
import { IShareInfo } from './share';
import { IUnitInfo } from './unit_info';
import { ILabs } from './labs';
import { ISubscriptions } from './subscriptions';
import { RecordVision } from './record_vision_mode';
import { IRightPane } from './right_pane';
import { IPreviewFile } from './preview_file';

export * from './resource';
export * from './catalog_tree';
export * from './user';
export * from './address_list';
export * from './space_member_manage';
export * from './space';
export * from './invite';
export * from './space_permission_manage';
export * from './notification';
export * from './template_centre';
export * from './hooks';
export * from './tool_bar';
export * from './kanban';
export * from './billing';
export * from './common';
export * from './resource';
export * from './share';
export * from './unit_info';
export * from './params';
export * from './labs';
export * from './subscriptions';
export * from './record_vision_mode';
export * from './preview_file';

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
}
