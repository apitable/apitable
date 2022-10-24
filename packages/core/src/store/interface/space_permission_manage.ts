import * as actions from '../action_constants';

export interface ISpacePermissionManage {
  subAdminListData: ISubAdminListData | null;
  mainAdminInfo: IMainAdminInfo | null;
  spaceResource: ISpaceResource | null;
}

// action
export interface IUpdateSubAdminListDataAction {
  type: typeof actions.UPDATE_SUB_ADMIN_LIST_DATA;
  payload: ISubAdminListData;
}

export interface IUpdateMainAdminInfoAction {
  type: typeof actions.UPDATE_MAIN_ADMIN_INFO;
  payload: IMainAdminInfo;
}

export interface IUpdateSpaceResourceAction {
  type: typeof actions.UPDATE_SPACE_RESOURCE;
  payload: ISpaceResource;
}

export interface ISubAdminListData {
  firstPage: boolean;
  lastPage: boolean;
  records: ISubAdminList[];
  hasNextPage: boolean;
  pageNum: number;
  pageSize: number;
  size: number;
  total: number;
  pages: number;
  startRow: number;
  enRow: number;
  prePage: number;
  nextPage: number;
  hasPreviousPage: boolean;
}

export interface ISubAdminList {
  id: string;
  memberId: string;
  avatar: string;
  memberName: string;
  position: string;
  jobNumber: string;
  mobile: string;
  email: string;
  resourceScope: IResourceScope[];
  resourceGroupCodes: string[];
  createdAt: string;
  team: string;
  isActive: boolean;
  isMemberNameModified?: boolean;
}

export interface IResourceScope {
  groupName: string;
  resourceNames: string[];
}

export interface ISearchMemberData {
  memberId: string;
  memberName: string;
  avatar: string;
  team: string;
  isActive: boolean;
  mobile: string;
  isManager: boolean;
  originName: string;
  isMemberNameModified?: boolean;
}

export interface IPermissionGroup {
  groupName: string;
  resources: IPermissionResource[];
}

export interface IPermissionResource {
  code: string;
  name: string;
  desc: string;
}

export interface IMainAdminInfo {
  name: string;
  avatar: string;
  position: string;
  areaCode: string;
  mobile: string;
  email: string;
  isMemberNameModified?: boolean;
}

export interface ISpaceResource {
  spaceName: string;
  mainAdmin: boolean;
  menuTree: IMenuTree[];
  permissions: string[];
}

export interface IMenuTree {
  menuCode: string;
  menuName: string;
  sequence?: number;
  parentCode?: string;
  operators: string[];
  children?: IMenuTree[];
}

