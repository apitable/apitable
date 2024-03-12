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

import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api, IAddIsActivedMemberInfo, ISpaceBasicInfo, ISpaceInfo, IUpdateMemberInfo, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useSelectTeamChange } from './use_address';

// Change of space logo
export const useChangeLogo = (spaceId: string, cancel?: () => void) => {
  const dispatch = useDispatch();
  const [logo, setLogo] = useState('');
  useEffect(() => {
    logo !== '' &&
      Api.updateSpace(undefined, logo).then((res) => {
        const { success } = res.data;
        if (success) {
          Message.success({ content: t(Strings.update_space_success) });
          Api.spaceInfo(spaceId).then((res) => {
            const { data, success } = res.data;
            if (success) {
              dispatch(StoreActions.setSpaceInfo(data));
              dispatch(StoreActions.updateUserInfo({ spaceLogo: data.spaceLogo }));
            }
          });
        } else {
          Message.error({ content: t(Strings.update_space_fail) });
        }
        cancel && cancel();
      });
    return () => {
      setLogo('');
    };
  }, [dispatch, spaceId, logo, cancel]);
  return { setLogo, logo };
};
// Adding sub-sectors
export const useCreateSubTeam = (name: string, superId: string): { createTeam: () => Promise<void> } => {
  const dispatch = useAppDispatch();
  const createTeam = () =>
    Api.createTeam(name, superId).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.getSubTeam(superId));
        Message.success({ content: t(Strings.create_team_success) });
      } else {
        Message.error({ content: t(Strings.create_team_fail) });
      }
    });
  return { createTeam };
};

// Edit member information
export const useEditMember = (data: IUpdateMemberInfo, _spaceId: string, teamId: string, pageNo: number, cancel: () => void) => {
  const dispatch = useAppDispatch();
  const [start, setStart] = useState<boolean>(false);
  useEffect(() => {
    start &&
      data &&
      Api.updateMember(data as IUpdateMemberInfo).then((res) => {
        const { success } = res.data;
        if (success) {
          dispatch(StoreActions.getMemberListDataInSpace(pageNo, teamId));
          Message.success({ content: t(Strings.edit_member_success) });
        } else {
          Message.error({ content: t(Strings.edit_member_fail) });
        }
        cancel();
      });

    return () => {
      setStart(false);
    };
  }, [start, dispatch, data, teamId, pageNo, cancel]);

  return [setStart];
};

// Editorial Sub-Administrator
export const useEditSubAdmin = (id: string, memberId: string, resourceCodes: string[], cancel: () => void) => {
  const dispatch = useAppDispatch();
  const [start, setEditStart] = useState(false);
  useEffect(() => {
    start &&
      Api.editSubMember(id, memberId, resourceCodes).then((res) => {
        const { success } = res.data;
        if (success) {
          dispatch(StoreActions.getSubAdminList(1));
          Message.success({ content: t(Strings.edit_sub_admin_success) });
        } else {
          Message.error({ content: t(Strings.edit_sub_admin_fail) });
        }
        cancel();
      });
    return () => {
      setEditStart(false);
    };
  }, [start, dispatch, id, memberId, resourceCodes, cancel]);
  return [setEditStart];
};

export const useSpaceInfo = (spaceId?: string | null) => {
  const [loading, setLoading] = useState(true);
  const [spaceInfo, setSpaceInfo] = useState<ISpaceInfo | ISpaceBasicInfo | null>(null);
  useEffect(() => {
    spaceId &&
      Api.spaceInfo(spaceId).then((res) => {
        const { data, success } = res.data;
        if (success) {
          setSpaceInfo(data);
        }
        setLoading(false);
      });
  }, [spaceId]);

  return {
    loading,
    spaceInfo,
  };
};

interface IRemoveMemberProps {
  teamId: string;
  memberIdArr: string[];
  isDeepDel: boolean;
  resFunc: () => void;
}
export const useMemberManage = () => {
  const dispatch = useAppDispatch();
  const { changeSelectTeam } = useSelectTeamChange();
  // Adding members
  const teamAddMember = (teamId: string, unitList: IAddIsActivedMemberInfo[]) => {
    Api.addIsActivedMembersInSpace(unitList, teamId).then((res) => {
      const { success } = res.data;
      if (success) {
        changeSelectTeam(teamId);
        Message.success({ content: t(Strings.add_member_success) });
      } else {
        Message.success({ content: t(Strings.add_member_fail) });
      }
      dispatch(StoreActions.updateSelectMemberListInSpace([]));
    });
  };
  // Assignment team
  const changeMemberTeam = (teamId: string, memberIds: string[], newTeamIds: string[]) => {
    return Api.updateMemberTeam(memberIds, newTeamIds).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.getMemberListDataInSpace(1, teamId));
        Message.success({ content: t(Strings.change_member_team_success) });
      } else {
        Message.error({ content: t(Strings.change_member_team_fail) });
      }
      dispatch(StoreActions.updateSelectMemberListInSpace([]));
      dispatch(StoreActions.selectedTeamKeysInModal([]));
      dispatch(StoreActions.selecteTeamRowsInModal([]));
    });
  };

  // Removal of members
  const removeMember = (props: IRemoveMemberProps) => {
    const { teamId, memberIdArr, isDeepDel, resFunc } = props;
    if (memberIdArr.length === 0) return;
    const deleteRes = (res: AxiosResponse<any>) => {
      const { success, code } = res.data;
      if (success) {
        dispatch(StoreActions.getMemberListDataInSpace(1, teamId));
        Message.success({ content: t(Strings.remove_member_success) });
      } else if (code === StatusCode.MEMBER_NOT_EXIST) {
        Message.error({ content: t(Strings.member_not_exist) });
      } else {
        Message.error({ content: t(Strings.remove_member_in_sub_team_err) });
      }
      resFunc();
    };

    if (memberIdArr.length === 1) {
      return Api.singleDeleteMember(teamId, memberIdArr[0], isDeepDel).then((res) => {
        deleteRes(res);
      });
    }

    return Api.BatchDeleteMember(teamId, memberIdArr, isDeepDel).then((res) => {
      deleteRes(res);
    });
  };

  return { teamAddMember, changeMemberTeam, removeMember };
};
