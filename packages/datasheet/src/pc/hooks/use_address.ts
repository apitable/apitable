import { useState } from 'react';
import {
  StoreActions,
  Api,
  ConfigConstant,
  IMemberInfoInSpace,
  IUpdateMemberInfo,
  Strings,
  t,
  ISelectedTeamInfoInSpace,
} from '@apitable/core';
import { useDispatch } from './use_dispatch';
import { Message, Modal } from 'pc/components/common';

// Get Member List
export const useUpdateMemberListInSpace = () => {
  const pageObjectParams = {
    pageSize: ConfigConstant.MEMBER_LIST_PAGE_SIZE,
    order: ' vom.id',
    sort: ConfigConstant.SORT_ASC,
  };
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const updateMemberListInSpace = (teamId: string, pageNo: number, isActive?: string ,teamInfo?: ISelectedTeamInfoInSpace | null) => {
    setLoading(true);
    Api.getMemberListInSpace(JSON.stringify({ ...pageObjectParams, pageNo }), teamId, isActive).then(res => {
      const { success, data } = res.data;
      if (success) {
        const memberListInSpace: IMemberInfoInSpace[] = data.records;
        dispatch(StoreActions.updateMemberListInSpace(memberListInSpace));
        teamInfo && dispatch(StoreActions.updateSelectedTeamInfoInSpace({
          ...teamInfo,
          memberCount: data.total,
        }));
        setLoading(false);
      }
    });
  };
  return { loading, updateMemberListInSpace };
};

export const useSelectTeamChange = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { loading: getMemberListLoading, updateMemberListInSpace } = useUpdateMemberListInSpace();
  const changeSelectTeam = (teamId: string) => {
    setLoading(true);
    Api.readTeam(teamId).then(res => {
      const { success, data } = res.data;
      if(!success) return;
      const selectTeamInfo = {
        teamTitle: data.teamName,
        memberCount: data.memberCount,
        teamId: data.teamId,
      };
      updateMemberListInSpace(data.teamId, 1, undefined, selectTeamInfo);
      setLoading(false);
    });
    dispatch(StoreActions.updateRightClickTeamInfoInSpace({ teamTitle: '', teamId: '' }));
    dispatch(StoreActions.updateSelectMemberListInSpace([]));
  };
  return { loading: Boolean(loading || getMemberListLoading), changeSelectTeam };
};

export const useAddressRequest = () => {
  const dispatch = useDispatch();
  // Administrators edit members' station nicknames
  const editMemberName = (data: IUpdateMemberInfo) => {
    return Api.updateMember(data as IUpdateMemberInfo).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.updateMemberInfo({ memberName: data.memberName, isMemberNameModified: true }));
        dispatch(StoreActions.updateSingleMemberInMemberList({ memberId: data.memberId, memberName: data.memberName, isMemberNameModified: true }));
        Message.success({ content: t(Strings.edit_member_success) });
      } else {
        Message.error({ content: t(Strings.edit_member_fail) });
      }
    });
  };
  // Edit your station nickname in the address book page
  const editOwnMemberNameInAddress = (memberId: string, memberName: string) => {
    return Api.updateOwnerMemberInfo(memberName).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.message_member_name_modified_successfully) });
        dispatch(StoreActions.updateUserInfo({ memberName, isMemberNameModified: true }));
        dispatch(StoreActions.updateMemberInfo({ memberName, isMemberNameModified: true }));
        dispatch(StoreActions.updateSingleMemberInMemberList({ memberId, memberName, isMemberNameModified: true }));
      } else {
        Message.error({ content: t(Strings.message_member_name_modified_failed) });
      }
    });
  };
  
  const freshDingtalkOrg = () => {
    return Api.freshDingtalkOrg().then(res => {
      const { success, message } = res.data;
      if (!success) {
        Message.error({ content: message || t(Strings.error) });
        return;
      } 
      Message.success({ content: t(Strings.reload_page_later_msg) });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      return;
      
    });
  };
  const freshWecomOrg = () => {
    return Api.freshWecomOrg().then(res => {
      const { success, message, code } = res.data;
      if (!success) {
        switch(code) {
          case 1109: Modal.error({
            title: t(Strings.operate_fail),
            content: t(Strings.wecom_sync_address_error),
            okText: t(Strings.submit)
          }); break;
          default: Message.error({ content: message || t(Strings.error) });
        }
        return;
      } 
      Message.success({ content: t(Strings.reload_page_later_msg) });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      return;
      
    });
  };

  const freshIdaasOrg = () => {
    return Api.idaasContactSync().then(res => {
      const { success, message } = res.data;
      if (!success) { 
        Message.error({ content: message || t(Strings.error) });
        return;
      }
      Message.success({ content: t(Strings.reload_page_later_msg) });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      return;
    });
  };

  return { editMemberName, editOwnMemberNameInAddress, freshDingtalkOrg, freshWecomOrg, freshIdaasOrg };
};
