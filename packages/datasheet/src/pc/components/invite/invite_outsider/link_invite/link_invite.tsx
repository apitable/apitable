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

import { Input, TreeSelect } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Button, ButtonGroup, Skeleton, useThemeColors } from '@apitable/components';
import { Api, IReduxState, ITeamTreeNode, StoreActions, Strings, t } from '@apitable/core';
import { ChevronDownOutlined, DeleteOutlined, TimeOutlined, CopyOutlined, TriangleRightFilled } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Message, Popconfirm, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/mobile/modal';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils';
import { InviteAlert } from '../components/invite-alert';
import styles from './style.module.less';

const { TreeNode } = TreeSelect;

export const LinkInvite = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const { linkList, userInfo, teamList } = useAppSelector(
    (state: IReduxState) => ({
      linkList: state.invite.linkList,
      userInfo: state.user.info,
      teamList: state.addressList.teamList,
    }),
    shallowEqual,
  );
  const [value, setValue] = useState('');
  const [showPopconfirmKey, setShowPopconfirmKey] = useState('');

  const firstTeamId = teamList?.[0]?.teamId;
  useEffect(() => {
    dispatch(StoreActions.getLinkInviteList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(StoreActions.getTeamListData(userInfo!));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!firstTeamId) return;

    const linkAds = linkList.map((item) => item.teamId);
    if (linkAds.includes(firstTeamId)) {
      setValue('');
    } else {
      setValue(firstTeamId);
    }
  }, [linkList, firstTeamId]);

  const onChange = (value: string) => {
    setValue(value);
  };

  const popconfirmVisibleChange = (key: string, visible: boolean) => {
    setShowPopconfirmKey(visible ? key : '');
  };

  const renderTreeNodes = (data: ITeamTreeNode[]) => {
    const tempList = linkList.map((item) => item.teamId);
    if (!data || data.length === 0) {
      return <></>;
    }
    return data.map((item) => {
      const config = {
        title: item.teamName,
        value: item.teamId,
        disabled: tempList.includes(item.teamId),
      };

      return (
        <TreeNode {...config} key={item.teamId} isLeaf={!item.hasChildren}>
          {item.children && item.children.length > 0 && renderTreeNodes(item.children)}
        </TreeNode>
      );
    });
  };

  const createBtnClick = async (teamId: string) => {
    if (!teamId) {
      Message.warning({ content: t(Strings.placeholder_choose_group) });
      return;
    }
    const {
      data: { success, message },
    } = await Api.createLink(teamId);
    if (success) {
      Message.success({ content: t(Strings.create_link_succeed) });
      dispatch(StoreActions.getLinkInviteList());
      setValue('');
    } else {
      Message.error({ content: message });
    }
  };

  const deleteLink = async (teamId: string) => {
    const {
      data: { success, message },
    } = await Api.deleteLink(teamId);
    if (success) {
      Message.success({ content: t(Strings.link_delete_succeed) });
      dispatch(StoreActions.getLinkInviteList());
    } else {
      Message.error({ content: message });
    }
  };

  const inviteText = t(Strings.contacts_invite_link_template, {
    nickName: userInfo!.nickName || t(Strings.friend),
    spaceName: userInfo!.spaceName,
  });

  const getLinkUrl = (token: string) => {
    const url = new URL(window.location.origin);
    url.pathname = '/invite/link';

    const searchParams = new URLSearchParams('');

    searchParams.append('token', token);
    userInfo?.inviteCode && searchParams.append('inviteCode', userInfo.inviteCode);
    url.search = searchParams.toString();
    return url.href;
  };
  const renderLinkList = () => {
    if (linkList.length === 0) {
      return null;
    }
    const joinToken = linkList.map((item) => ({ ...item, token: getLinkUrl(item.token) }));
    return joinToken.map((item) => {
      const teamTitle = item.parentTeamName ? `${item.parentTeamName} - ${item.teamName}` : item.teamName;
      return (
        <div className={styles.linkItem} key={item.teamId}>
          <Tooltip title={teamTitle} placement="bottomLeft" textEllipsis>
            <div className={styles.linkTitle}>{teamTitle}</div>
          </Tooltip>
          <div className={styles.urlWrapper}>
            <Input type="text" className={styles.url} value={item.token} id={item.teamId} readOnly />
            <ButtonGroup withSeparate>
              <Tooltip title={t(Strings.copy_link)} placement="top">
                <Button onClick={() => copy2clipBoard(`${item.token} ${inviteText}`)}>
                  <CopyOutlined color={colors.secondLevelText} />
                </Button>
              </Tooltip>
              <ComponentDisplay minWidthCompatible={ScreenSize.md}>
                <Popconfirm
                  onCancel={() => setShowPopconfirmKey('')}
                  onOk={() => deleteLink(item.teamId)}
                  type="danger"
                  title={t(Strings.del_invitation_link)}
                  content={t(Strings.del_invitation_link_desc)}
                  trigger="click"
                  okText={t(Strings.delete)}
                  visible={showPopconfirmKey === item.token}
                  onVisibleChange={(v) => popconfirmVisibleChange(item.token, v)}
                >
                  <Button>
                    <DeleteOutlined color={colors.secondLevelText} />
                  </Button>
                </Popconfirm>
              </ComponentDisplay>
              <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
                <Button
                  onClick={() => {
                    Modal.warning({
                      title: t(Strings.del_invitation_link),
                      content: t(Strings.del_invitation_link_desc),
                      okText: t(Strings.delete),
                      onOk: () => deleteLink(item.teamId),
                    });
                  }}
                >
                  <DeleteOutlined color={colors.secondLevelText} />
                </Button>
              </ComponentDisplay>
            </ButtonGroup>
          </div>
        </div>
      );
    });
  };

  const onExpand = (expandedKeys: DataNode['key'][]) => {
    const teamId = expandedKeys[expandedKeys.length - 1];

    dispatch(StoreActions.getSubTeam(teamId));
  };

  return (
    <div className={styles.linkInvite}>
      <InviteAlert />
      <div className={styles.subTitle}>{t(Strings.create_public_invitation_link)}</div>
      <div className={styles.addNewLink}>
        {teamList.length === 0 ? (
          <Skeleton />
        ) : (
          <>
            <TreeSelect
              value={value === '' ? undefined : value}
              placeholder={t(Strings.placeholder_choose_group)}
              onChange={(value) => onChange(value)}
              suffixIcon={<ChevronDownOutlined />}
              treeIcon
              switcherIcon={<TriangleRightFilled size={12} />}
              showSearch={false}
              popupClassName="dropdownInvite"
              treeDefaultExpandedKeys={[firstTeamId]}
              listHeight={200}
              onTreeExpand={onExpand}
            >
              {renderTreeNodes(teamList || [])}
            </TreeSelect>
            <Button onClick={() => createBtnClick(value)} className={styles.createBtn}>
              {t(Strings.create)}
            </Button>
          </>
        )}
      </div>
      {linkList.length > 0 && (
        <>
          <div className={styles.historyTitle}>
            <TimeOutlined />
            {t(Strings.invitation_link_old)}
          </div>
          <div className={styles.linkWrapper}>{renderLinkList()}</div>
        </>
      )}
    </div>
  );
};
