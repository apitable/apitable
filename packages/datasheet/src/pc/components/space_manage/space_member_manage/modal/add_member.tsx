import { FC, useState, useEffect } from 'react';
import { SelectUnitModal, SelectUnitSource }
  from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { IReduxState, Api, IAddIsActivedMemberInfo, UnitItem, ITeam, IMember } from '@apitable/core';
import { useSelector, shallowEqual } from 'react-redux';
import { useMemberManage } from 'pc/hooks';

interface IAddMember {
  onCancel: () => void;
}
export const AddMember: FC<IAddMember> = ({ onCancel }) => {
  const {
    selectedTeamInfoInSpace,
    spaceId,
  } = useSelector((state: IReduxState) => ({
    selectedTeamInfoInSpace: state.spaceMemberManage.selectedTeamInfoInSpace,
    spaceId: state.space.activeId || '',
  }), shallowEqual);

  const { teamAddMember } = useMemberManage();
  // 小组已有成员
  const [existMemberArr, setExistMemberArr] = useState<string[]>([]);
  // 查询本小组下已有成员
  useEffect(() => {
    if (!selectedTeamInfoInSpace) {
      return;
    }
    Api.getTeamAndMemberWithoutSub(selectedTeamInfoInSpace.teamId).then(res => {
      const { success, data } = res.data;
      const arr: string[] = [selectedTeamInfoInSpace.teamId];
      if (success && data.length) {
        data.forEach(item => {
          arr.push(item.memberId);
        });
      }
      setExistMemberArr(arr);
    });
  }, [selectedTeamInfoInSpace, spaceId]);
  const onSubmit = (checkedList: UnitItem[]) => {
    const list: IAddIsActivedMemberInfo[] = [];
    checkedList.forEach(item => {
      const isTeam = 'teamId' in item;
      const isMember = 'memberId' in item;

      if (isTeam || isMember) {
        list.push({
          id: isTeam ? (item as ITeam).teamId : (item as IMember).memberId,
          type: isTeam ? 1 : 2,
        });
      }
    });
    const teamId = selectedTeamInfoInSpace?.teamId;
    teamAddMember(teamId || '', list);
  };
  return (
    <SelectUnitModal
      source={SelectUnitSource.TeamAddMember}
      disableIdList={existMemberArr}
      onCancel={onCancel}
      onSubmit={onSubmit}
      maskClosable
    />
  );
};
