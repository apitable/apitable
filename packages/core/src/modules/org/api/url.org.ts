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

// ================ Contacts related =======================
// address book - get member details
export const MEMBER_INFO = '/org/member/read';
// Space Station-Address Book Management-Member Management-Pagination to query the member list of the specified department
export const MEMBER_LIST_IN_SPACE = '/org/member/page';
// Space station - address book management - member management - modify department information
export const UPDATE_TEAM = '/org/team/update';
// Space station - address book management - member management - add sub-departments
export const CREATE_TEAM = '/org/team/create';
// Space station - address book management - member management - query department information
export const READ_TEAM = '/org/team/read';
// address book - query the members under the department
export const TEAM_MEMBERS = '/org/team/members';
// Space station - address book management - member management - query the list of subordinate departments
export const READ_SUB_TEAMS = '/org/team/subTeams';
// Space station - address book management - member management - delete department
export const DELETE_TEAM = '/org/team/delete/';
// Space station - address book management - member management - edit member information
export const UPDATE_MEMBER = '/org/member/updateInfo';
// Space station - address book management - member management - single delete member
export const SINGLE_DELETE_MEMBER = '/org/member/delete';
// Space station - address book management - member management - batch delete members
export const BATCH_DELETE_MEMBER = '/org/member/deleteBatch';
// Space station - address book management - member management - search department or member
export const SEARCH_TEAM_MEMBER = '/org/search';
// Space station - address book management - member management - adjust the department to which members belong
export const UPDATE_MEMBER_TEAM = '/org/member/updateMemberTeam';
// Space station - address book management - member management - department adding members
export const TEAM_ADD_MEMBER = '/org/member/addMember';
// Space station - address book management -
// member management - search for organizational resources / search in the modal of adding department members
export const GET_ADD_MEMBERS = '/org/search/unit';
// Space station - determine whether member mailboxes exist in the space
export const EXIST_EMAIL = '/org/member/checkEmail';
// Space station - download employee information form template
export const DOWNLOAD_MEMBER_FILE = '/org/member/downloadTemplate';
// space station - upload employee information form
export const UPLOAD_MEMBER_FILE = '/org/member/uploadExcel';
// space station-sub-admin-fuzzy search member
export const MEMBER_SEARCH = '/org/member/search';
// search for org resources
export const SEARCH_UNIT = '/org/searchUnit';
// Query the sub-departments and members under the department
export const GET_SUB_UNIT_LIST = '/org/getSubUnitList';
// Query the list of organizational units that belong to the space
export const MEMBER_UNITS = '/org/member/units';

export const COLLABORATOR_INFO = 'node/collaborator/info';

/**
 * Edit Member Info
 */
export const MEMBER_UPDATE = '/org/member/update';
// load or search for members
export const LOAD_OR_SEARCH = '/org/loadOrSearch';
// Accurately find user information based on the provided name
export const SEARCH_UNIT_INFO_VO = 'org/searchUnitInfoVo';
// handle the "someone joined the space station" message
export const PROCESS_SPACE_JOIN = '/space/apply/process';
// ================ Contacts related =======================

// ============ Character related start =====================//
export const GET_ROLE_LIST = '/org/roles';
export const CREATE_NEW_ROLE = '/org/roles';
export const DELETE_ORG_ROLE = '/org/roles/:roleId';
export const UPDATE_ORG_ROLE = '/org/roles/:roleId';
export const GET_MEMBER_LIST_BY_ROLE = '/org/roles/:roleId/members';
export const ADD_ROLE_MEMBER = '/org/roles/:roleId/members';
export const DELETE_ROLE_MEMBER = '/org/roles/:roleId/members';
export const INIT_ROLE = '/org/roles/init';
export const TEAM_LIST_LAYERED = 'org/team/tree';
export const COLLABORATOR_LIST_PAGE = '/node/collaborator/page';