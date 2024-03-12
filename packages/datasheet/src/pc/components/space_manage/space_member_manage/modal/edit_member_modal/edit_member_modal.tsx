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

import { useEffect, useState, FC, ChangeEvent } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { TextInput, Button, TextButton, colorVars } from '@apitable/components';
import { ConfigConstant, IReduxState, ITeamsInSpace, IUpdateMemberInfo, Strings, t, StoreActions, isIdassPrivateDeployment } from '@apitable/core';
import { AddOutlined, CloseCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { Avatar } from 'pc/components/common/avatar';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useEditMember, useMemberManage } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { isPrimaryOrOwnFunc } from '../../utils';
import { ChangeMemberTeam } from '../change_member_team';
// @ts-ignore
import { isSocialDingTalk, isSocialFeiShu, isSocialWecom } from 'enterprise/home/social_platform/utils';
// @ts-ignore
import { WecomOpenData } from 'enterprise/wecom/wecom_open_data/wecom_open_data';
import styles from './style.module.less';

interface IModalProps {
  cancelModalVisible: () => void;
  onSubmit?: () => void;
  removeCallback?: () => void;
  pageNo: number;
}

export const EditMemberModal: FC<React.PropsWithChildren<IModalProps>> = ({ cancelModalVisible, pageNo, removeCallback }) => {
  const { spaceId, teamId, memberInfoInSpace, selectedTeamInfoInSpace, userInfo, selectMemberListInSpace, spaceInfo } = useAppSelector(
    (state: IReduxState) => ({
      spaceId: state.space.activeId || '',
      teamId: state.spaceMemberManage.selectedTeamInfoInSpace ? state.spaceMemberManage.selectedTeamInfoInSpace.teamId : ConfigConstant.ROOT_TEAM_ID,
      memberInfoInSpace: state.spaceMemberManage.memberInfoInSpace,
      selectMemberListInSpace: state.spaceMemberManage.selectMemberListInSpace,
      selectedTeamInfoInSpace: state.spaceMemberManage.selectedTeamInfoInSpace,
      userInfo: state.user.info,
      spaceInfo: state.space.curSpaceInfo,
    }),
    shallowEqual,
  );
  const { removeMember } = useMemberManage();
  const dispatch = useDispatch();
  const env = getEnvVariables();
  const [form, setForm] = useState({
    memberName: '',
    nickName: '',
    mobile: '',
    email: '',
  });
  const [formErr, setFormErr] = useState({
    memberName: '',
    nickName: '',
    mobile: '',
    email: '',
  });
  const { memberName, email, memberId, avatar, teamData, nickName, mobile, isMemberNameModified, isNickNameModified, avatarColor } =
    memberInfoInSpace!;
  const [formData, setFormData] = useState<IUpdateMemberInfo>();
  const [teamList, setTeamList] = useState<ITeamsInSpace[]>([]);
  const [changeMemberTeamModalVisible, setChangeMemberTeamModalVisible] = useState(false);
  const [setStart] = useEditMember(formData!, spaceId, teamId, pageNo, cancelModalVisible);
  useEffect(() => {
    setForm({
      memberName: memberName || '',
      nickName: nickName || '',
      mobile: mobile || '',
      email: email || '',
    });
  }, [memberName, nickName, mobile, email]);
  useEffect(() => {
    if (teamData && teamData.length) {
      const teams: ITeamsInSpace[] = teamData.map((item) => {
        return { teamId: item.teamId, teamName: item.fullHierarchyTeamName || '' };
      });
      setTeamList(teams);
    } else {
      setTeamList([]);
    }
  }, [teamData]);
  const toChangeTeamModal = () => {
    setChangeMemberTeamModalVisible(true);
  };
  const handleOk = () => {
    if (formErr.memberName || formErr.nickName || formErr.email) {
      return;
    }
    const formData = { spaceId, memberId, teamIds: teamList.map((item) => item.teamId), memberName: form.memberName };
    setFormData(formData as IUpdateMemberInfo);
    setStart(true);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>, property: 'memberName' | 'nickName' | 'email') => {
    if (formErr[property]) {
      setFormErr({ ...formErr, [property]: '' });
    }
    setForm({
      ...form,
      [property]: e.target.value.trim(),
    });
  };
  const verifyMemberName = () => {
    setMemberInputFocus(false);
    if (form.memberName.length > ConfigConstant.MEMBER_NAME_LENGTH) {
      setFormErr({
        ...formErr,
        memberName: t(Strings.member_err),
      });
    }
  };
  const handleCancel = () => {
    cancelModalVisible();
  };
  const removeTeam = (id: string) => {
    const newArr = teamList.filter((item) => item.teamId !== id);
    setTeamList(newArr);
  };
  const removeFromSpace = () => {
    if (userInfo && isPrimaryOrOwnFunc(memberInfoInSpace, userInfo.memberId)) {
      Message.error({ content: t(Strings.warning_can_not_remove_yourself_or_primary_admin) });
      return;
    }
    Modal.confirm({
      title: t(Strings.kindly_reminder),
      content: t(Strings.remove_from_space_confirm_tip),
      onOk: () => {
        removeMember({
          teamId: selectedTeamInfoInSpace!.teamId,
          memberIdArr: [memberId],
          isDeepDel: true,
          resFunc: () => {
            const newSelect = selectMemberListInSpace.filter((item) => item !== memberId);
            removeCallback && removeCallback();
            dispatch(StoreActions.updateSelectMemberListInSpace(newSelect));
            cancelModalVisible();
          },
        });
      },
      type: 'danger',
    });
  };
  const getTeamRemoveList = () => {
    if (!selectedTeamInfoInSpace) {
      return;
    }
    const tempList = teamList.length === 0 ? [{ teamId: ConfigConstant.ROOT_TEAM_ID, teamName: userInfo!.spaceName }] : teamList;
    return tempList.map((item) => {
      return (
        <span className={styles.teamWrapper} key={item.teamId}>
          <Tooltip title={item.teamName} textEllipsis showTipAnyway>
            <span className={styles.teamText}>{item.teamName}</span>
          </Tooltip>
          {teamList.length > 0 && !isSocialFeiShu?.(spaceInfo) && (
            <span className={styles.teamRemoveIcon} onClick={() => removeTeam(item.teamId)}>
              <CloseCircleOutlined />
            </span>
          )}
        </span>
      );
    });
  };

  const [isMemberInputFocus, setMemberInputFocus] = useState(false);
  const _isSocialWecom = isSocialWecom?.(spaceInfo);
  const wecomMemberNameVisible = _isSocialWecom && !isMemberInputFocus && !isMemberNameModified && form.memberName === memberName;
  const wecomNickNameVisible = _isSocialWecom && !isNickNameModified;

  return (
    <>
      <Modal
        title={<div>{t(Strings.edit_member)}</div>}
        visible
        className={styles.adjustMemberModal}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={t(Strings.cancel)}
        okText={t(Strings.save)}
        maskClosable
        cancelButtonProps={{ size: 'small', className: 'subText' }}
        okButtonProps={{ size: 'small' }}
        centered
        width={400}
      >
        <div className={styles.portrait}>
          <Avatar src={avatar} title={nickName || memberName || ''} avatarColor={avatarColor} size={80} id={memberId} />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>{t(Strings.nickname_in_space)}</label>
          <div className={styles.content}>
            {wecomMemberNameVisible && (
              <div className={styles.wecomLayer}>
                <WecomOpenData openId={form.memberName} />
              </div>
            )}
            <TextInput
              style={{
                color: wecomMemberNameVisible ? 'transparent' : colorVars.fc1,
              }}
              value={form.memberName}
              onChange={(e) => {
                handleChange(e, 'memberName');
              }}
              onBlur={verifyMemberName}
              onClick={() => setMemberInputFocus(true)}
              disabled={isIdassPrivateDeployment()}
              block
            />
          </div>
          <div className={styles.err}>{formErr.memberName}</div>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>{t(Strings.personal_nickname)}</label>
          <div className={styles.content}>
            {wecomNickNameVisible && (
              <div className={styles.wecomLayer} style={{ color: colorVars.black[500] }}>
                <WecomOpenData openId={form.nickName} />
              </div>
            )}
            <TextInput
              style={{
                color: wecomNickNameVisible ? 'transparent' : colorVars.black[500],
                WebkitTextFillColor: wecomNickNameVisible ? 'transparent' : colorVars.black[500],
              }}
              type="text"
              value={form.nickName}
              disabled
              block
            />
          </div>
          <div className={styles.err}>{formErr.nickName}</div>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>{t(Strings.team)}</label>
          <div className={styles.deptItem}>
            {getTeamRemoveList()}
            {!isSocialFeiShu?.(spaceInfo) && (
              <Button onClick={toChangeTeamModal} size="small" className={styles.addBtn} prefixIcon={<AddOutlined color="currentColor" />}>
                {t(Strings.add)}
              </Button>
            )}
          </div>
        </div>
        {env.USER_BIND_PHONE_VISIBLE && (
          <div className={styles.item}>
            <label className={styles.label}>{t(Strings.phone_number)}</label>
            <TextInput value={form.mobile} disabled block />
            <div className={styles.err}>{formErr.mobile}</div>
          </div>
        )}

        <div className={styles.item}>
          <label className={styles.label}>{t(Strings.mail)}</label>
          <TextInput value={form.email} disabled block />
          <div className={styles.err}>{formErr.email}</div>
        </div>
        {!isSocialDingTalk?.(spaceInfo) && !isSocialWecom?.(spaceInfo) && !isSocialFeiShu?.(spaceInfo) && (
          <TextButton color="danger" onClick={removeFromSpace} size="small" style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
            {t(Strings.remove_from_space)}
          </TextButton>
        )}
      </Modal>
      {/* {changeMemberTeamModalVisible && (
       <ChangeMemberTeamModal
       inEditMember
       setTeamList={setTeamList}
       teamList={teamList}
       setModalVisible={v => {
       setChangeMemberTeamModalVisible(v);
       }}
       />
       )} */}
      {changeMemberTeamModalVisible && (
        <ChangeMemberTeam onCancel={() => setChangeMemberTeamModalVisible(false)} inEditMember setTeamList={setTeamList} teamList={teamList} />
      )}
    </>
  );
};
