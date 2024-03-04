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

import { IReduxState, IFieldMap, ThemeName, RecordVision, IRecordCellValue } from 'exports/store/interfaces';
import { FieldType } from 'types/field_types';
import { IFormulaContext } from '../functions/basic';
import { evaluate as _evaluate } from '../evaluate';

const fieldMap: IFieldMap = {
  a: {
    id: 'a',
    name: 'a',
    type: FieldType.Number,
    property: {
      precision: 0,
    },
  },
  b: {
    id: 'b',
    name: 'b',
    type: FieldType.Text,
    property: null,
  },
  c: {
    id: 'c',
    name: 'c',
    type: FieldType.DateTime,
    property: {
      dateFormat: 0,
      timeFormat: 0,
      includeTime: false,
      autoFill: false,
    },
  },
  d: {
    id: 'd',
    name: 'd',
    type: FieldType.MultiSelect,
    property: {
      options: [
        { id: 'opt1', name: '科', color: 0 },
        { id: 'opt2', name: '维格', color: 1 },
        { id: 'opt3', name: 'APITable', color: 2 },
        { id: 'opt4', name: 'the first', color: 3 },
        { id: 'opt5', name: 'the second', color: 4 },
        { id: 'x', name: 'x', color: 0 },
        { id: 'y', name: 'y', color: 1 },
      ],
    },
  },
  e: {
    id: 'e',
    name: 'e',
    type: FieldType.DateTime,
    property: {
      dateFormat: 0,
      timeFormat: 0,
      includeTime: false,
      autoFill: false,
    },
  },
  f: {
    id: 'f',
    name: 'f',
    type: FieldType.Checkbox,
    property: {
      icon: '',
    },
  },
  x: {
    id: 'x',
    name: 'x',
    type: FieldType.Formula,
    property: {
      datasheetId: 'dst123',
      expression: '',
    },
  },
  fld11111: {
    id: 'fld11111',
    name: 'a',
    type: FieldType.Number,
    property: {
      precision: 0,
    },
  },
  fld22222: {
    id: 'fld22222',
    name: 'b',
    type: FieldType.Text,
    property: null,
  },
  fld33333: {
    id: 'fld33333',
    name: 'c',
    type: FieldType.Number,
    property: {
      precision: 1,
    },
  },
  fld44444: {
    id: 'fld44444',
    name: 'd{',
    type: FieldType.Number,
    property: {
      precision: 1,
    },
  },
  fld55555: {
    id: 'fld55555',
    name: '{e',
    type: FieldType.Number,
    property: {
      precision: 1,
    },
  },
  fld66666: {
    id: 'fld66666',
    name: 'f" {}',
    type: FieldType.Number,
    property: {
      precision: 1,
    },
  },
};

export const evaluate = (expression: string, ctx: Omit<IFormulaContext, 'field'>, isTransform = true) => {
  const fieldMap = ctx.state.datasheetMap['dst123']!.datasheet!.snapshot.meta.fieldMap;
  // Convert each field
  for (const id in fieldMap) {
    if (!fieldMap[id]) {
      fieldMap[id] = {
        id,
        name: id,
        type: FieldType.Number,
        property: {
          precision: 0,
        },
      };
    }
    if (fieldMap[id]!.type === FieldType.Text && isTransform) {
      ctx.record.data[id] = [{ type: 1, text: ctx.record.data[id] }] as any;
    }
  }
  return _evaluate(expression, { ...ctx, field: fieldMap.x! }, true, true);
};

export const mergeContext = (recordData: IRecordCellValue, _fieldMap?: IFieldMap) => {
  return {
    state: generateMockState({ ...fieldMap, ...(_fieldMap || {}) }),
    record: {
      id: 'xyz',
      commentCount: 0,
      data: recordData,
    },
  };
};

export const generateMockState = (fieldMap: IFieldMap): IReduxState => ({
  share: {
    spaceId: null
  },
  unitInfo: {
    unitMap: null,
    userMap: null
  },
  recordVision: RecordVision.Center,
  theme: ThemeName.Light,
  widgetMap: {},
  dashboardMap: {},
  isStateRoot: true,
  pageParams: {},
  datasheetMap: {
    dst123: {
      loading: false,
      connected: false,
      syncing: false,
      datasheet: {
        id: '',
        name: '',
        description: '',
        parentId: '',
        icon: '',
        nodeShared: false,
        nodePermitSet: false,
        spaceId: '',
        role: null as any,
        permissions: {
          allowEditConfigurable: false,
          allowSaveConfigurable: false,
          childCreatable: false,
          copyable: false,
          descriptionEditable: false,
          editable: false,
          exportable: false,
          iconEditable: false,
          importable: false,
          manageable: false,
          movable: false,
          nodeAssignable: false,
          readable: false,
          removable: false,
          renamable: false,
          sharable: false,
          templateCreatable: false,
          viewCreatable: false,
          viewRenamable: false,
          viewRemovable: false,
          viewMovable: false,
          viewExportable: false,
          viewFilterable: false,
          columnSortable: false,
          columnHideable: false,
          fieldSortable: false,
          fieldGroupable: false,
          rowHighEditable: false,
          columnWidthEditable: false,
          columnCountEditable: false,
          rowSortable: false,
          fieldCreatable: false,
          fieldRenamable: false,
          fieldPropertyEditable: false,
          fieldRemovable: false,
          rowCreatable: false,
          rowRemovable: false,
          rowArchivable: false,
          rowUnarchivable: false,
          cellEditable: false,
          fieldPermissionManageable: false,
          viewLayoutEditable: false,
          viewStyleEditable: false,
          viewKeyFieldEditable: false,
          viewColorOptionEditable: false,
          viewManualSaveManageable: false,
          viewOptionSaveEditable: false,
        },
        revision: 0,
        activeView: '',
        snapshot: {
          meta: {
            fieldMap,
            views: [],
          },
          recordMap: {},
          datasheetId: 'datasheetId'
        },
      },
    },
  },
  mirrorMap: {},
  formMap: {},
  catalogTree: {
    rootId: '',
    loading: false,
    node: null,
    delNodeId: '',
    editNodeId: '',
    favoriteEditNodeId: '',
    copyNodeId: '',
    favoriteDelNodeId: '',
    isCopyAll: false,
    err: '',
    optNode: null,
    treeNodesMap: {},
    expandedKeys: [],
    unit: null,
    allVisible: false,
    isPermission: false,
    socketData: null,
    privateLoading: false,
    privateRootId: '',
    privateEditNodeId: '',
    privateDelNodeId: '',
    privateTreeNodesMap: {},
    privateExpandedKeys: [],
    favoriteTreeNodeIds: [],
    favoriteLoading: false,
    favoriteExpandedKeys: [],
    activeNodeError: false,
    permissionModalNodeId: '',
    shareModalNodeId: '',
    saveAsTemplateModalNodeId: '',
    importModalNodeId: '',
    loadedKeys: [],
    /** Whether the permission setting pop-up window comes from notification call **/
    permissionCommitRemindStatus: false,
    /** Parameters required for member message sending **/
    permissionCommitRemindParameter: null,
    /** Unauthorized member unitIds **/
    noPermissionMembers: []
  },
  user: {
    info: null,
    isLogin: false,
    isRegister: false,
    isCreateSpace: false,
    loading: false,
    reqStatus: false,
    err: null,
    httpErrInfo: null,
    userInfoErr: null,
  },
  addressList: {
    teamList: [],
    memberList: [],
    selectedTeamInfo: {
      teamTitle: '',
      teamId: '',
    },
    memberInfo: {
      memberId: '',
      email: '',
    },
    memberListPageNo: 0,
    memberListTotal: 0,
    memberListLoading: false,
  },
  spaceMemberManage: {
    memberListInSpace: [],
    selectedTeamInfoInSpace: null,
    memberInfoInSpace: {
      memberId: '',
      email: '',
    },
    selectedRows: [],
    selectMemberListInSpace: [],
    subTeamListInSpace: [],
    rightClickTeamInfoInSpace: {
      teamTitle: '',
      teamId: '',
    },
    teamListInSpace: [],
    isInvited: false,
    selectedTeamKeys: [],
    selectedTeamRows: [],
  },
  space: {
    spaceList: [],
    curSpaceInfo: null,
    reconnecting: false,
    connected: false,
    quitSpaceId: '',
    loading: false,
    err: null,
    screenWidth: null,
    sideBarVisible: false,
    shortcutKeyPanelVisible: false,
    isApiPanelOpen: false,
    isSideRecordOpen: false,
    isRecordFullScreen: false,
    marketplaceApps: [],
    previewModalVisible: false,
    activeId: '',
    spaceFeatures: null,
    envs: {}
  },
  invite: {
    inviteEmailInfo: null,
    teamTreeInvite: [],
    linkList: [],
    inviteLinkInfo: null,
    linkToken: '',
    mailToken: '',
    errCode: null,
  },
  spacePermissionManage: {
    subAdminListData: null,
    mainAdminInfo: null,
    spaceResource: null,
  },
  notification: {
    unReadCount: 0,
    readCount: 0,
    unReadNoticeList: [],
    readNoticeList: [],
    newNoticeListFromWs: [],
  },
  hooks: {
    pendingGuideWizardIds: [],
    curGuideWizardId: 0,
    curGuideStepIds: [],
    triggeredGuideInfo: {},
    config: null,
  },
  toolbar: {
    menuCardState: null as any,
  },
  rightPane: {
    width: 0
  },
  billing: {
    catalog: {},
    pruducts: {},
    plans: {},
    features: {},
    subscription: null,
  },
  templateCentre: {
    category: [],
    directory: null,
  },
  labs: [],
  subscriptions: [],
  previewFile: {
    activeIndex: -1,
    cellValue: [],
    editable: true,
    onChange: () => {},
    disabledDownload: false,
  },
  embedInfo: {}
});

export const mockState = {
  share: {
    spaceId: null
  },
  unitInfo: {
    unitMap: null,
    userMap: null
  },
  widgetMap: {},
  dashboardMap: {},
  isStateRoot: true,
  pageParams: {},
  datasheetMap: {
    dst123: {
      loading: false,
      connected: false,
      syncing: false,
      datasheet: {
        id: '',
        name: '',
        description: '',
        parentId: '',
        icon: '',
        nodeShared: false,
        nodePermitSet: false,
        spaceId: '',
        role: null as any,
        permissions: {
          allowEditConfigurable: false,
          allowSaveConfigurable: false,
          childCreatable: false,
          copyable: false,
          descriptionEditable: false,
          editable: false,
          exportable: false,
          iconEditable: false,
          importable: false,
          manageable: false,
          movable: false,
          nodeAssignable: false,
          readable: false,
          removable: false,
          renamable: false,
          sharable: false,
          templateCreatable: false,
          viewCreatable: false,
          viewRenamable: false,
          viewRemovable: false,
          viewMovable: false,
          viewExportable: false,
          viewFilterable: false,
          columnSortable: false,
          columnHideable: false,
          fieldSortable: false,
          fieldGroupable: false,
          rowHighEditable: false,
          columnWidthEditable: false,
          columnCountEditable: false,
          rowSortable: false,
          fieldCreatable: false,
          fieldRenamable: false,
          fieldPropertyEditable: false,
          fieldRemovable: false,
          rowCreatable: false,
          rowRemovable: false,
          cellEditable: false,
          fieldPermissionManageable: false,
          viewLayoutEditable: false,
          viewStyleEditable: false,
          viewKeyFieldEditable: false,
          viewColorOptionEditable: false,
        },
        revision: 0,
        activeView: '',
        snapshot: {
          meta: {
            fieldMap,
            views: [],
          },
          recordMap: {},
          datasheetId: 'datasheetId'
        },
      },
    },
  },
  mirrorMap: {},
  formMap: {},
  catalogTree: {
    rootId: '',
    loading: false,
    node: null,
    delNodeId: '',
    editNodeId: '',
    favoriteEditNodeId: '',
    copyNodeId: '',
    favoriteDelNodeId: '',
    isCopyAll: false,
    err: '',
    optNode: null,
    treeNodesMap: {},
    expandedKeys: [],
    unit: null,
    allVisible: false,
    isPermission: false,
    socketData: null,
    favoriteTreeNodeIds: [],
    favoriteLoading: false,
    favoriteExpandedKeys: [],
    activeNodeError: false,
    permissionModalNodeId: '',
    shareModalNodeId: '',
    saveAsTemplateModalNodeId: '',
    importModalNodeId: '',
    loadedKeys: [],
    /** Whether the permission setting pop-up window comes from notification call **/
    permissionCommitRemindStatus: false,
    /** Parameters required for member message sending **/
    permissionCommitRemindParameter: null,
    /** Unauthorized member unitIds **/
    noPermissionMembers: []
  },
  user: {
    info: null,
    isLogin: false,
    isRegister: false,
    isCreateSpace: false,
    loading: false,
    reqStatus: false,
    err: null,
    httpErrInfo: null,
    userInfoErr: null,
  },
  addressList: {
    teamList: [],
    memberList: [],
    selectedTeamInfo: {
      teamTitle: '',
      teamId: '',
    },
    memberInfo: {
      memberId: '',
      email: '',
    },
    memberListPageNo: 0,
    memberListTotal: 0,
  },
  spaceMemberManage: {
    memberListInSpace: [],
    selectedTeamInfoInSpace: null,
    memberInfoInSpace: {
      memberId: '',
      email: '',
    },
    selectedRows: [],
    selectMemberListInSpace: [],
    subTeamListInSpace: [],
    rightClickTeamInfoInSpace: {
      teamTitle: '',
      teamId: '',
    },
    teamListInSpace: [],
    isInvited: false,
    selectedTeamKeys: [],
    selectedTeamRows: [],
  },
  space: {
    spaceList: [],
    curSpaceInfo: null,
    reconnecting: false,
    connected: false,
    quitSpaceId: '',
    loading: false,
    err: null,
    screenWidth: null,
    sideBarVisible: false,
    shortcutKeyPanelVisible: false,
    isApiPanelOpen: false,
    isSideRecordOpen: false,
    marketplaceApps: [],
    previewModalVisible: false,
    activeId: '',
    spaceFeatures: null
  },
  invite: {
    inviteEmailInfo: null,
    teamTreeInvite: [],
    linkList: [],
    inviteLinkInfo: null,
    linkToken: '',
    mailToken: '',
    errCode: null,
  },
  spacePermissionManage: {
    subAdminListData: null,
    mainAdminInfo: null,
    spaceResource: null,
  },
  notification: {
    unReadCount: 0,
    readCount: 0,
    unReadNoticeList: [],
    readNoticeList: [],
    newNoticeListFromWs: [],
  },
  hooks: {
    pendingGuideWizardIds: [],
    curGuideWizardId: 0,
    curGuideStepIds: [],
    triggeredGuideInfo: {},
    config: null,
  },
  toolbar: {
    menuCardState: null as any,
  },
  billing: {
    catalog: {},
    pruducts: {},
    plans: {},
    features: {},
    subscription: null,
  },
  templateCentre: {
    category: [],
    directory: null,
  },
  subscriptions: [],
};
