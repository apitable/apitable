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

import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch, shallowEqual } from 'react-redux';
import { Button, Alert } from '@apitable/components';
import { IReduxState, StoreActions, IMemberInfoInSpace, ConfigConstant, t, Strings, isIdassPrivateDeployment } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip, Modal } from 'pc/components/common';
import { useMemberManage } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { MemberTable } from '../member_table';
import { EditMemberModal, ChangeMemberTeam, AddMember } from '../modal';
import { isPrimaryOrOwnFunc, socialPlatPreOperateCheck } from '../utils';
// @ts-ignore
import { isSocialPlatformEnabled, isSocialDingTalk, isSocialWecom, isContactSyncing } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

interface ITeamInfo {
  searchMemberRes: IMemberInfoInSpace[];
  setSearchMemberRes: React.Dispatch<React.SetStateAction<IMemberInfoInSpace[]>>;
}
export const TeamInfo: FC<React.PropsWithChildren<ITeamInfo>> = (props) => {
  const [pageNo, setPageNo] = useState(1);
  const [adjustMemberModalVisible, setAdjustMemberModalVisible] = useState(false);
  const [changeMemberTeamModalVisible, setChangeMemberTeamModalVisible] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { teamListInSpace, selectedTeamInfoInSpace, selectMemberListInSpace, selectedRows, spaceResource, user, spaceInfo } = useAppSelector(
    (state: IReduxState) => ({
      selectedTeamInfoInSpace: state.spaceMemberManage.selectedTeamInfoInSpace,
      selectMemberListInSpace: state.spaceMemberManage.selectMemberListInSpace,
      selectedRows: state.spaceMemberManage.selectedRows,
      memberListInSpace: state.spaceMemberManage.memberListInSpace,
      user: state.user.info,
      spaceResource: state.spacePermissionManage.spaceResource,
      spaceInfo: state.space.curSpaceInfo,
      teamListInSpace: state.spaceMemberManage.teamListInSpace,
    }),
    shallowEqual,
  );
  const isBindSocial = spaceInfo && isSocialPlatformEnabled?.(spaceInfo) && !isSocialDingTalk?.(spaceInfo) && !isSocialWecom?.(spaceInfo);
  // const { teamId, teamTitle, memberCount } = selectedTeamInfoInSpace;
  const { removeMember } = useMemberManage();
  const firstTeamId = teamListInSpace?.[0]?.teamId || ConfigConstant.ROOT_TEAM_ID;
  const isRootTeam = selectedTeamInfoInSpace && selectedTeamInfoInSpace.teamId === firstTeamId;
  const isPrimaryOrOwn = React.useCallback((info: IMemberInfoInSpace) => user && isPrimaryOrOwnFunc(info, user.memberId), [user]);
  const isPrimaryOrOwnSelected = (memberArr: IMemberInfoInSpace[]) => memberArr.some((item) => isPrimaryOrOwn(item));
  const contactSyncing = (isSocialDingTalk?.(spaceInfo) || isSocialWecom?.(spaceInfo)) && isContactSyncing?.(spaceInfo);
  // Replace the selected group and initialize the form pages
  useEffect(() => {
    setPageNo(1);
  }, [selectedTeamInfoInSpace]);

  const removeBaseFunc = (memberArr: IMemberInfoInSpace[]) => {
    const memberIdArr = memberArr.map((item) => item.memberId);
    Modal.confirm({
      title: t(Strings.kindly_reminder),
      content: t(Strings.remove_from_team_confirm_tip),
      onOk: () => removeFromTeamSelected(memberIdArr),
      type: 'danger',
    });
  };
  const removeFromTeamSelected = (memberIdArr: string[]) => {
    removeMember({
      teamId: selectedTeamInfoInSpace!.teamId,
      memberIdArr,
      isDeepDel: false,
      resFunc: () => updateSelectArr(memberIdArr),
    });
  };
  const removeReject = () => {
    Modal.warning({
      title: t(Strings.warning),
      content: t(Strings.warning_can_not_remove_yourself_or_primary_admin),
      okText: t(Strings.got_it),
      type: 'warning',
    });
  };
  const batchDelMemberBtn = () => {
    socialPlatPreOperateCheck(() => {
      if (isRootTeam && isPrimaryOrOwnSelected(selectedRows)) {
        removeReject();
        return;
      }
      removeBaseFunc(selectedRows);
    }, spaceInfo);
  };

  const updateSelectArr = (arr: string[]) => {
    setPageNo(1);
    if (arr.length === 1) {
      const newSelect = selectMemberListInSpace.filter((item) => item !== arr[0]);
      dispatch(StoreActions.updateSelectMemberListInSpace(newSelect));
      return;
    }
    dispatch(StoreActions.updateSelectMemberListInSpace([]));
  };

  const addMemberClick = () => {
    socialPlatPreOperateCheck(() => {
      setAddMemberModalVisible(true);
    }, spaceInfo);
  };
  const changeMemberTeamClick = () => {
    socialPlatPreOperateCheck(() => {
      setChangeMemberTeamModalVisible(true);
    }, spaceInfo);
  };
  const isRootTeamSelected = selectedTeamInfoInSpace && selectedTeamInfoInSpace.teamId === firstTeamId;
  return (
    <>
      <div className={styles.teamInfo}>
        {selectedTeamInfoInSpace && (
          <div className={styles.selectTeamInfo}>
            <Tooltip title={selectedTeamInfoInSpace.teamTitle} placement="bottomLeft" textEllipsis>
              <div className={styles.selectTeam}>{selectedTeamInfoInSpace.teamTitle}</div>
            </Tooltip>
            {selectedTeamInfoInSpace && (
              <span>
                （{selectedTeamInfoInSpace.memberCount}
                {t(Strings.person)}）
              </span>
            )}
          </div>
        )}
        {contactSyncing && <Alert type="default" content={t(Strings.dingtalk_admin_contact_syncing_tips)} style={{ marginTop: 24 }} />}
        <div className={styles.tableWrap}>
          {spaceResource &&
            spaceResource.permissions.includes(ConfigConstant.PermissionCode.MEMBER) &&
            selectedTeamInfoInSpace &&
            !isIdassPrivateDeployment() && (
            <div className={styles.btnWTopTable}>
              {!isRootTeamSelected && !isBindSocial && <Button onClick={addMemberClick}>{t(Strings.add_member)}</Button>}

              {isRootTeamSelected && !isBindSocial && (
                <Button onClick={changeMemberTeamClick} disabled={!selectMemberListInSpace.length}>
                  {t(Strings.distribute_a_team)}
                </Button>
              )}
              {!isRootTeamSelected && !isBindSocial && (
                <Button onClick={batchDelMemberBtn} variant="jelly" color="danger" disabled={!selectMemberListInSpace.length}>
                  {t(Strings.batch_remove)}
                </Button>
              )}
            </div>
          )}
          <MemberTable searchMemberRes={props.searchMemberRes} setSearchMemberRes={props.setSearchMemberRes} />
        </div>
      </div>
      {adjustMemberModalVisible && (
        <EditMemberModal
          cancelModalVisible={() => {
            setAdjustMemberModalVisible(false);
          }}
          removeCallback={() => {
            setPageNo(1);
          }}
          pageNo={pageNo}
        />
      )}
      {!addMemberModalVisible && changeMemberTeamModalVisible && (
        <ChangeMemberTeam onCancel={() => setChangeMemberTeamModalVisible(false)} inEditMember={false} />
      )}
      {addMemberModalVisible && <AddMember onCancel={() => setAddMemberModalVisible(false)} />}
    </>
  );
};
