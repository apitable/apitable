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

import { Button, Loading } from '@apitable/components';
import {
  Api, ConfigConstant, IMemberInfoInSpace, IReduxState, ISelectedTeamInfoInSpace, isIdassPrivateDeployment, ITeamListInSpace, StoreActions, Strings, t
} from '@apitable/core';
import { AddressOutlined } from '@apitable/icons';
import { useMount } from 'ahooks';
import { Tree } from 'antd';
import { Message, Modal, SearchTeamAndMember, Tooltip } from 'pc/components/common';
// import AdjustLevel from 'static/icon/space/space_icon_adjustlevel.svg';
// @ts-ignore
import { isSocialDingTalk, isSocialPlatformEnabled, isSocialWecom } from 'enterprise';
import { expandInviteModal } from 'pc/components/invite';
import { useSelectTeamChange } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { Dispatch, FC, ReactText, SetStateAction, useCallback, useEffect, useState } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { shallowEqual, useSelector } from 'react-redux';
import AddContentIcon from 'static/icon/common/common_icon_add_content.svg';
import DeleteIcon from 'static/icon/common/common_icon_delete.svg';
import MoreIcon from 'static/icon/common/common_icon_more.svg';
import SearchIcon from 'static/icon/common/common_icon_search_normal.svg';
import RenameIcon from 'static/icon/datasheet/rightclick/datasheet_icon_rename.svg';
import PullDownIcon from 'static/icon/datasheet/rightclick/rightclick_icon_retract.svg';
import { CreateTeamModal, RenameTeamModal } from '../modal';
// @ts-ignore
import { freshDingtalkOrg, freshWecomOrg, freshIdaasOrg } from 'enterprise';
import styles from './style.module.less';
import { socialPlatPreOperateCheck } from '../utils';

interface IModalProps {
  setSearchMemberRes: Dispatch<SetStateAction<IMemberInfoInSpace[]>>;
  setRightLoading: Dispatch<SetStateAction<boolean>>;
}

const { TreeNode, DirectoryTree } = Tree;
const TEAM_OPERATE = 'TEAM_OPERATE';
const TEAM_ROOT_OPERATE = 'TEAM_ROOT_OPERATE';
export const TeamTree: FC<IModalProps> = props => {
  const dispatch = useAppDispatch();
  const {
    teamListInSpace,
    spaceId,
    spaceResource,
    user,
    spaceInfo,
  } = useSelector((state: IReduxState) => ({
    teamListInSpace: state.spaceMemberManage.teamListInSpace,
    spaceId: state.space.activeId || '',
    spaceResource: state.spacePermissionManage.spaceResource,
    user: state.user.info,
    spaceInfo: state.space.curSpaceInfo,
  }), shallowEqual);
  const [renameDeptModalVisible, setRenameDeptModalVisible] = useState(false);
  const [createDeptModalVisible, setCreateDeptModalVisible] = useState(false);
  const isBindDingtalk = spaceInfo && isSocialPlatformEnabled?.(spaceInfo, ConfigConstant.SocialType.DINGTALK) && !isSocialDingTalk?.(spaceInfo);
  const isBindWecom = spaceInfo && isSocialPlatformEnabled?.(spaceInfo, ConfigConstant.SocialType.WECOM) && !isSocialWecom?.(spaceInfo);
  const [refreshBtnLoading, setRefreshBtnLoading] = useState(false);
  const [inSearch, setInSearch] = useState<boolean>(false);
  const [teamOperate, setTeamOperate] = useState(false);
  const [selectKey, setSelectKey] = useState(ConfigConstant.ROOT_TEAM_ID);
  const { loading, changeSelectTeam: changeSelectTeamHook } = useSelectTeamChange();

  useMount(() => {
    dispatch(StoreActions.getTeamListDataInSpace(spaceId, user!));
    dispatch(StoreActions.getTeamInfo(spaceId, ConfigConstant.ROOT_TEAM_ID));
    dispatch(StoreActions.getMemberListDataInSpace(1, ConfigConstant.ROOT_TEAM_ID));
  });

  const changeSelectTeam = useCallback((teamId: string) => {
    setSelectKey(teamId);
    changeSelectTeamHook(teamId);
  }, [changeSelectTeamHook]);
  useEffect(() => {
    if (!spaceResource || isIdassPrivateDeployment()) {
      return;
    }
    if (spaceResource.mainAdmin || spaceResource.permissions.includes(ConfigConstant.PermissionCode.TEAM)) {
      setTeamOperate(true);
    }
  }, [spaceResource]);
  useEffect(() => {
    props.setRightLoading(loading);
  }, [loading, props]);

  const renderTreeNode = (data: ITeamListInSpace[]) => {
    return data.map((item) => {
      const nodeRef = React.createRef<any>();
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            title={
              <ContextMenuTrigger
                id={item.teamId === ConfigConstant.ROOT_TEAM_ID ? TEAM_ROOT_OPERATE : TEAM_OPERATE}
                holdToDisplay={-1}
                ref={nodeRef}
                collect={fileCollect}
                {...{
                  teamId: item.teamId,
                  teamTitle: item.teamName,
                  memberCount: item.memberCount,
                  parentId: item.parentId,
                }}
              >
                <Tooltip title={item.teamName} placement="bottomLeft" textEllipsis>
                  <div>{item.teamName}</div>
                </Tooltip>
                {
                  teamOperate && item.teamId === ConfigConstant.ROOT_TEAM_ID &&
                  <span
                    onClick={e => moreClick(e, nodeRef)}
                    style={{ visibility: 'visible' }}
                  >
                    <AddContentIcon />
                  </span>
                }
                {teamOperate && item.teamId !== ConfigConstant.ROOT_TEAM_ID &&
                <span onClick={e => moreClick(e, nodeRef)}><MoreIcon /></span>}
              </ContextMenuTrigger>
            }
            key={item.teamId}
          >
            {
              renderTreeNode(item.children)
            }
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <ContextMenuTrigger
              id={item.teamId === ConfigConstant.ROOT_TEAM_ID ? TEAM_ROOT_OPERATE : TEAM_OPERATE}
              holdToDisplay={-1}
              ref={nodeRef}
              collect={fileCollect}
              {...{
                teamId: item.teamId,
                teamTitle: item.teamName,
                memberCount: item.memberCount,
                parentId: item.parentId,
              }}
            >
              <Tooltip title={item.teamName} placement="bottomLeft" textEllipsis>
                <div>{item.teamName}</div>
              </Tooltip>

              {
                teamOperate && item.teamId === ConfigConstant.ROOT_TEAM_ID &&
                <span
                  onClick={e => moreClick(e, nodeRef)}
                  style={{ visibility: 'visible' }}
                >
                  <AddContentIcon />
                </span>
              }
              {teamOperate && item.teamId !== ConfigConstant.ROOT_TEAM_ID &&
              <span onClick={e => moreClick(e, nodeRef)}><MoreIcon /></span>}
            </ContextMenuTrigger>
          }
          key={item.teamId}
          isLeaf
        />
      );
    });
  };
  const getRightClickDeptInfo = (data: ISelectedTeamInfoInSpace) => {
    if (!teamOperate) {
      return;
    }
    if (data) {
      const info = {
        teamId: data.teamId,
        parentId: data.parentId,
        teamTitle: data.teamTitle,
        memberCount: data.memberCount,
      };
      dispatch(StoreActions.updateRightClickTeamInfoInSpace(info));
    }
  };

  const handleAddDeptClick = (e: React.MouseEvent, data: ISelectedTeamInfoInSpace) => {
    socialPlatPreOperateCheck(() => {
      getRightClickDeptInfo(data);
      setCreateDeptModalVisible(true);
    }, spaceInfo);
  };

  const handleRenameClick = (e: React.MouseEvent, data: ISelectedTeamInfoInSpace) => {
    socialPlatPreOperateCheck(() => {
      getRightClickDeptInfo(data);
      setRenameDeptModalVisible(true);
    }, spaceInfo);
  };
  const handleDeleteClick = (e: React.MouseEvent, data: ISelectedTeamInfoInSpace) => {
    socialPlatPreOperateCheck(() => {
      getRightClickDeptInfo(data);
      if (data) {
        Api.readTeam(data.teamId).then(res => {
          const { success, data } = res.data;
          if (success) {
            if (data.hasChildren || data.memberCount > 0) {
              rejectDeleteTeam();
            } else {
              confrimDeleteTeam(data.teamId);
            }
          }
        });
      }
    }, spaceInfo);
  };
  const rejectDeleteTeam = () => {
    Modal.warning({
      title: t(Strings.watch_out),
      content: t(Strings.warning_exists_sub_team_or_member),
    });
  };
  const confrimDeleteTeam = (teamId: string) => {
    const confirmDelTeamOk = () => {
      if (user) {
        Api.deleteTeam(teamId).then(res => {
          const { success } = res.data;
          if (success) {
            dispatch(StoreActions.getTeamListDataInSpace(spaceId, user));
            Message.success({ content: t(Strings.del_team_success) });
          } else {
            Message.error({ content: t(Strings.delete_team_fail) });
          }
        });
      }
    };
    Modal.confirm({
      title: t(Strings.hint),
      content: t(Strings.confirm_del_current_team),
      onOk: confirmDelTeamOk,
      type: 'warning',
      maskClosable: true,
    });
  };
  const onSelect = (keys: ReactText[], { node }) => {
    props.setSearchMemberRes([]);
    if (node.props.title) {
      const { teamId } = (node.props.title as React.ReactElement).props;
      changeSelectTeam(teamId);
    }
  };

  // Left click on the selected group in search status to view the list of members
  const teamClick = (teamId: string) => {
    changeSelectTeam(teamId);
  };
  // Click on the "more" icon on the group directory
  const moreClick = (
    e: React.MouseEvent,
    ref: React.RefObject<{ handleContextClick: (e: React.MouseEvent) => void; }>) => {
    if (ref.current) {
      ref.current.handleContextClick(e);
    }
  };
  const fileCollect = (props: ISelectedTeamInfoInSpace) => ({
    teamId: props.teamId,
    teamTitle: props.teamTitle,
    parentId: props.parentId,
    memberCount: props.memberCount,
  });

  // Search state click staff
  const memberClick = (memberId: string) => {
    changeSelectTeam(ConfigConstant.ROOT_TEAM_ID);
    Api.getMemberInfo({ memberId }).then(res => {
      const { success, data } = res.data;
      if (success) {
        const tempData: any = { ...data };
        delete tempData.tags;
        tempData.teams = data.teams!.map(item => item.teamName).join(',');
        props.setSearchMemberRes([tempData]);
      }
    });
  };

  const operateButtonCom = React.useMemo(() => {
    const getButton = (props) => {
      const { onClick } = props;
      return (
        <Button
          color="primary"
          prefixIcon={refreshBtnLoading ? <Loading /> :<AddressOutlined />}
          onClick={onClick}
          className={styles.inviteOutsiderBtn}
          disabled={refreshBtnLoading}
        >
          {t(Strings.fresh_dingtalk_org)}
        </Button>
      );
    };
    if(isIdassPrivateDeployment()) {
      return getButton({
        onClick: () => {
          setRefreshBtnLoading(true);
          spaceInfo && freshIdaasOrg?.().then(() => {
            setRefreshBtnLoading(false);
          });
        }
      });
    }
    if (isBindDingtalk || isBindWecom) {
      const refreshMethods = {
        [ConfigConstant.SocialType.DINGTALK]: freshDingtalkOrg,
        [ConfigConstant.SocialType.WECOM]: freshWecomOrg
      };
      return getButton({
        onClick: () => {
          setRefreshBtnLoading(true);
          spaceInfo && refreshMethods[spaceInfo.social.platform]?.().then(() => {
            setRefreshBtnLoading(false);
          });
        }
      });
    }
    if (spaceResource && spaceResource.permissions.includes(ConfigConstant.PermissionCode.MEMBER)) {
      return (
        <Button
          color="primary"
          prefixIcon={<AddressOutlined />}
          className={styles.inviteOutsiderBtn}
          onClick={() => expandInviteModal({ resUpdate: () => {changeSelectTeam(ConfigConstant.ROOT_TEAM_ID);} })}
        >
          {t(Strings.invite_member)}
        </Button>
      );
    }
    return null;

  }, [isBindDingtalk, refreshBtnLoading, changeSelectTeam, spaceResource, isBindWecom, spaceInfo]);

  return (
    <div className={styles.addressTreeMenuWrapper}>
      <div className={styles.searchTitle}>
        {t(Strings.members_setting)}
        <div onClick={(e) => {
          stopPropagation(e);
          setInSearch(true);
        }}><SearchIcon /></div>
      </div>
      <div className={styles.originContent} style={{ filter: inSearch ? ConfigConstant.GLASS_FILTER : 'none' }}>
        {operateButtonCom}
        <div className={styles.treeWrapper}>
          {
            teamListInSpace.length > 0 &&
            <DirectoryTree
              onSelect={onSelect}
              switcherIcon={<div><PullDownIcon /></div>}
              selectedKeys={[selectKey]}
              showIcon={false}
              expandAction={false}
              defaultExpandedKeys={[ConfigConstant.ROOT_TEAM_ID]}
            >
              {renderTreeNode(teamListInSpace)}
            </DirectoryTree>
          }
        </div>
      </div>
      {
        inSearch &&
        <SearchTeamAndMember
          setInSearch={search => setInSearch(search)}
          teamClick={teamClick}
          memberClick={memberClick}
          top={'24px'}
        />
      }
      {
        renameDeptModalVisible &&
        <RenameTeamModal
          setModalVisible={visible => setRenameDeptModalVisible(visible)}
        />
      }
      {
        createDeptModalVisible &&
        <CreateTeamModal
          setModalVisible={visible => setCreateDeptModalVisible(visible)}
        />
      }
      {
        teamOperate && <>
          <ContextMenu id={TEAM_OPERATE}>
            <MenuItem onClick={handleAddDeptClick}><AddContentIcon />{t(Strings.add_team)}</MenuItem>
            <MenuItem onClick={handleRenameClick}><RenameIcon />{t(Strings.rename_team)}</MenuItem>
            <MenuItem onClick={handleDeleteClick}><DeleteIcon />{t(Strings.delete_team)}</MenuItem>
          </ContextMenu>
          <ContextMenu id={TEAM_ROOT_OPERATE}>
            <MenuItem onClick={handleAddDeptClick}><AddContentIcon />{t(Strings.add_team)}</MenuItem>
          </ContextMenu></>
      }
    </div>
  );
};
