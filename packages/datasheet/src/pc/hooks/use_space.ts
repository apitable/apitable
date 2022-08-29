import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import {
  StoreActions,
  IUserInfo,
  Api,
  IUpdateMemberInfo,
  IAddIsActivedMemberInfo,
  t,
  Strings,
  StatusCode,
  ISpaceInfo,
  ISpaceBasicInfo,
} from '@vikadata/core';
import { useDispatch } from 'react-redux';
import { Message } from 'pc/components/common';
import { useSelectTeamChange } from './use_address';

// 更换空间logo
export const useChangeLogo = (spaceId: string, cancel?: () => void) => {
  const dispatch = useDispatch();
  const [logo, setLogo] = useState('');
  useEffect(() => {
    logo !== '' && Api.updateSpace(undefined, logo).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.update_space_success) });
        Api.spaceInfo(spaceId).then(res => {
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
// 增加子部门
export const useCreateSubTeam = (name: string, spaceId: string, superId: string, user: IUserInfo) => {
  const dispatch = useDispatch();
  const [start, setStart] = useState(false);
  useEffect(() => {
    start && Api.createTeam(name, superId).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.getTeamListDataInSpace(spaceId, user));
        Message.success({ content: t(Strings.create_team_success) });
      } else {
        Message.error({ content: t(Strings.create_team_fail) });
      }
    });

    return () => {
      setStart(false);
    };
  }, [start, dispatch, name, spaceId, superId, user]);
  return [setStart];
};

// 编辑成员信息
export const useEditMember = (
  data: IUpdateMemberInfo,
  spaceId: string,
  teamId: string,
  pageNo: number,
  cancel: () => void,
) => {
  const dispatch = useDispatch();
  const [start, setStart] = useState<boolean>(false);
  useEffect(() => {
    start && data && Api.updateMember(data as IUpdateMemberInfo).then(res => {
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

// 调整员工所在部门
export const useChangeMemberTeam = (
  userId: string,
  spaceId: string,
  teamId: string,
  memberIds: string[],
  newTeamIds: string[],
  cancel: () => void,
) => {
  const dispatch = useDispatch();
  const [start, setStart] = useState(false);

  useEffect(() => {
    start && Api.updateMemberTeam(memberIds, newTeamIds).then(res => {
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
      cancel();
    });

    return () => {
      setStart(false);
    };

  }, [start, dispatch, teamId, memberIds, newTeamIds, cancel, userId]);

  return [setStart];
};

// 增加子管理员
export const useAddSubAdmin = (memberIds: string[], resourceCodes: string[], cancel: () => void) => {
  const dispatch = useDispatch();
  const [start, setStart] = useState(false);

  useEffect(() => {
    start && Api.addSubMember(memberIds, resourceCodes).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.getSubAdminList(1));
        Message.success({ content: t(Strings.add_sub_admin_success) });
      } else {
        Message.error({ content: t(Strings.add_sub_admin_fail) });
      }
      cancel();
    });
    return () => {
      setStart(false);
    };
  }, [start, dispatch, memberIds, resourceCodes, cancel]);
  return [setStart];
};

// 编辑子管理员
export const useEditSubAdmin = (id: string, memberId: string, resourceCodes: string[], cancel: () => void) => {
  const dispatch = useDispatch();
  const [start, setEditStart] = useState(false);
  useEffect(() => {
    start && Api.editSubMember(id, memberId, resourceCodes).then(res => {
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

export const useEditSpaceNameAndSpace = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const editSpaceNameAndSpace = (spaceId: string, name?: string, logo?: string, resFun?: () => void) => {
    setLoading(true);
    return Api.updateSpace(name, logo).then(res => {
      const { success } = res.data;
      if (success) {
        Api.spaceInfo(spaceId).then(res => {
          const { data, success } = res.data;
          if (success) {
            dispatch(StoreActions.setSpaceInfo(data));
            dispatch(StoreActions.updateUserInfo({
              spaceName: data.spaceName,
              spaceLogo: data.spaceLogo,
            }));
          }
          setLoading(false);
          if (resFun) {
            resFun();
          }
        });
      } else {
        setLoading(false);
      }
    });
  };
  return { editSpaceNameAndSpace, loading };
};

export const useSpaceInfo = (spaceId?: string | null) => {
  const [loading, setLoading] = useState(true);
  const [spaceInfo, setSpaceInfo] = useState<ISpaceInfo | ISpaceBasicInfo | null>(null);
  useEffect(() => {
    spaceId && Api.spaceInfo(spaceId).then(res => {
      const { data, success } = res.data;
      if (success) {
        setSpaceInfo(data);
      }
      setLoading(false);
    });
  }, [spaceId]);

  return {
    loading,
    spaceInfo
  };
};

interface IRemoveMemberProps {
  teamId: string,
  memberIdArr: string[],
  isDeepDel: boolean,
  resFunc: () => void,
}
export const useMemberManage = () => {
  const dispatch = useDispatch();
  const { changeSelectTeam } = useSelectTeamChange();
  // 添加成员
  const teamAddMember = (teamId: string, unitList: IAddIsActivedMemberInfo[]) => {
    Api.addIsActivedMembersInSpace(unitList, teamId).then(res => {
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
  // 分配小组
  const changeMemberTeam = (
    teamId: string,
    memberIds: string[],
    newTeamIds: string[],
  ) => {
    return Api.updateMemberTeam(memberIds, newTeamIds).then(res => {
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
  
  // 移除成员
  const removeMember = (props: IRemoveMemberProps) => {
    const { teamId, memberIdArr, isDeepDel, resFunc } = props;
    if(memberIdArr.length === 0) return;
    const deleteRes = (res: AxiosResponse<any>) => {
      const { success, code } = res.data;
      if (success) {
        dispatch(StoreActions.getMemberListDataInSpace(1, teamId));
        Message.success({ content: t(Strings.remove_member_success) });
      } else if(code === StatusCode.MEMBER_NOT_EXIST) {
        Message.error({ content: t(Strings.member_not_exist) });
      } else {
        Message.error({ content: t(Strings.remove_member_in_sub_team_err) });
      }
      resFunc();
    };
    
    if(memberIdArr.length === 1) {
      return Api.singleDeleteMember(teamId, memberIdArr[0], isDeepDel).then(res => {
        deleteRes(res);
      });
    }

    return Api.BatchDeleteMember(teamId, memberIdArr, isDeepDel).then(res => {
      deleteRes(res);
    });
  };

  return { teamAddMember, changeMemberTeam, removeMember };
};
